// Goals manager module - IIFE pattern for GitHub Pages compatibility
window.GoalsManager = (function () {

    // Get start of current week (Monday)
    function getWeekStart(date = new Date()) {
        const d = new Date(date)
        const day = d.getDay()
        const diff = d.getDate() - day + (day === 0 ? -6 : 1)
        return new Date(d.setDate(diff))
    }

    // Calculate weekly totals for practice
    function getWeeklyTotals(progressData) {
        const weekStart = getWeekStart()
        const weekTotals = {}

        // Check each day of the week
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart)
            date.setDate(weekStart.getDate() + i)
            const dateStr = date.toDateString()

            const dayPractice = progressData.dailyPractice[dateStr] || {}
            Object.keys(dayPractice).forEach(type => {
                if (!weekTotals[type]) weekTotals[type] = 0
                weekTotals[type] += dayPractice[type]
            })
        }

        return weekTotals
    }

    // Update goals display 
    function updateGoalsDisplay(progressData, animateWeekly = false) {
        updateWeeklyGoals(progressData, animateWeekly)
        updateMonthlyGoals(progressData)
        updateLongTermGoals(progressData)
    }

    // Update weekly goals display
    function updateWeeklyGoals(progressData, animate = false) {
        const weeklyTotals = getWeeklyTotals(progressData)
        const weeklyGoalsDiv = document.getElementById('weeklyGoals')

        const goalsHtml = progressData.goals.weekly.map(goal => {
            const current = weeklyTotals[goal.practiceType] || 0
            const percentage = Math.round((current / goal.target) * 100)
            const isComplete = current >= goal.target

            const displayPercentage = Math.min(percentage, 100) // Cap visual progress at 100% but show full percentage in text

            return `
            <div class="goal-item">
                <span class="goal-text">${goal.text}</span>
                <span class="goal-progress ${animate ? 'updated' : ''} ${isComplete ? 'completed' : ''} ${percentage > 0 && !isComplete ? 'has-progress' : ''}" style="background: ${isComplete ? (percentage > 100 ? 'linear-gradient(45deg, #3c5671, #24304c)' : '#3c5671') : percentage > 0 ? `conic-gradient(#3c5671 0deg ${displayPercentage * 3.6}deg, rgba(255, 248, 235, 0.8) ${displayPercentage * 3.6}deg 360deg)` : 'rgba(255, 251, 240, 0.8)'}; color: ${isComplete ? '#fffbf0' : 'var(--color-accent)'}; border: ${percentage > 0 && !isComplete ? 'none' : '2px solid rgba(255, 248, 235, 0.6)'};">
                    ${isComplete ? '<ion-icon name="trophy" style="font-size: 2rem; vertical-align: middle; margin-top: -2px;"></ion-icon>' : percentage + '%'}
                </span>
            </div>
        `
        }).join('')

        weeklyGoalsDiv.innerHTML = goalsHtml

        // Remove animation class after animation completes
        if (animate) {
            setTimeout(() => {
                const progressElements = weeklyGoalsDiv.querySelectorAll('.goal-progress.updated')
                progressElements.forEach(el => el.classList.remove('updated'))
            }, 300)
        }
    }

    // Update monthly goals display
    function updateMonthlyGoals(progressData) {
        const monthlyGoalsDiv = document.getElementById('monthlyGoals')

        const goalsHtml = progressData.goals.monthly.map(goal => {
            const isComplete = goal.progress >= goal.target
            let progressText = ''
            let percentage = 0

            if (goal.type === 'percentage') {
                percentage = goal.progress
                progressText = `${goal.progress}%`
            } else if (goal.type === 'counter') {
                percentage = Math.round((goal.progress / goal.target) * 100)
                progressText = `${percentage}%`
            }

            return `
            <div class="goal-item clickable" onclick="updateGoalProgress('monthly', '${goal.id}')">
                <span class="goal-text" id="goal-text-${goal.id}">${goal.text}</span>
                <input class="goal-edit-input" id="goal-edit-${goal.id}" style="display: none;" value="${goal.text}" onblur="saveGoalEdit('monthly', '${goal.id}')" onkeypress="handleEditKeypress(event, 'monthly', '${goal.id}')" onclick="event.stopPropagation()">
                <div class="goal-actions">
                    <button class="menu-toggle" onclick="event.stopPropagation(); toggleGoalMenu('${goal.id}')">
                        ⋯
                    </button>
                    <div class="goal-menu" id="menu-${goal.id}">
                        <button class="menu-item" onclick="event.stopPropagation(); editGoal('monthly', '${goal.id}'); hideGoalMenu('${goal.id}')">
                            Edit
                        </button>
                        <button class="menu-item" onclick="event.stopPropagation(); undoGoalProgress('monthly', '${goal.id}'); hideGoalMenu('${goal.id}')">
                            Reset
                        </button>
                    </div>
                    <span class="goal-progress ${isComplete ? 'completed' : ''} ${percentage > 0 && !isComplete ? 'has-progress' : ''}" style="background: ${isComplete ? '#3c5671' : percentage > 0 ? `conic-gradient(#3c5671 0deg ${percentage * 3.6}deg, rgba(255, 248, 235, 0.8) ${percentage * 3.6}deg 360deg)` : 'rgba(255, 251, 240, 0.8)'}; color: ${isComplete ? '#fffbf0' : 'var(--color-accent)'}; border: ${percentage > 0 && !isComplete ? 'none' : '3px solid ' + (isComplete ? '#3c5671' : 'rgba(255, 248, 235, 0.8)')};">
                        ${isComplete ? '<ion-icon name="trophy" style="font-size: 2rem; vertical-align: middle; margin-top: -2px;"></ion-icon>' : progressText}
                    </span>
                </div>
            </div>
        `
        }).join('')

        monthlyGoalsDiv.innerHTML = goalsHtml
    }

    // Update long-term goals display
    function updateLongTermGoals(progressData) {
        const longTermGoalsDiv = document.getElementById('longTermGoals')

        const goalsHtml = progressData.goals.longTerm.map(goal => {
            const isComplete = goal.progress >= goal.target
            let progressText = ''
            let percentage = 0

            if (goal.type === 'percentage') {
                percentage = goal.progress
                progressText = `${goal.progress}%`
            } else if (goal.type === 'counter') {
                percentage = Math.round((goal.progress / goal.target) * 100)
                progressText = `${percentage}%`
            }

            return `
            <div class="goal-item clickable" onclick="updateGoalProgress('longTerm', '${goal.id}')">
                <span class="goal-text" id="goal-text-${goal.id}">${goal.text}</span>
                <input class="goal-edit-input" id="goal-edit-${goal.id}" style="display: none;" value="${goal.text}" onblur="saveGoalEdit('longTerm', '${goal.id}')" onkeypress="handleEditKeypress(event, 'longTerm', '${goal.id}')" onclick="event.stopPropagation()">
                <div class="goal-actions">
                    <button class="menu-toggle" onclick="event.stopPropagation(); toggleGoalMenu('${goal.id}')">
                        ⋯
                    </button>
                    <div class="goal-menu" id="menu-${goal.id}">
                        <button class="menu-item" onclick="event.stopPropagation(); editGoal('longTerm', '${goal.id}'); hideGoalMenu('${goal.id}')">
                            Edit
                        </button>
                        <button class="menu-item" onclick="event.stopPropagation(); undoGoalProgress('longTerm', '${goal.id}'); hideGoalMenu('${goal.id}')">
                            Reset
                        </button>
                    </div>
                    <span class="goal-progress ${isComplete ? 'completed' : ''} ${percentage > 0 && !isComplete ? 'has-progress' : ''}" style="background: ${isComplete ? '#3c5671' : percentage > 0 ? `conic-gradient(#3c5671 0deg ${percentage * 3.6}deg, rgba(255, 248, 235, 0.8) ${percentage * 3.6}deg 360deg)` : 'rgba(255, 251, 240, 0.8)'}; color: ${isComplete ? '#fffbf0' : 'var(--color-accent)'}; border: ${percentage > 0 && !isComplete ? 'none' : '3px solid ' + (isComplete ? '#3c5671' : 'rgba(255, 248, 235, 0.8)')};">
                        ${isComplete ? '<ion-icon name="trophy" style="font-size: 2rem; vertical-align: middle; margin-top: -2px;"></ion-icon>' : progressText}
                    </span>
                </div>
            </div>
        `
        }).join('')

        longTermGoalsDiv.innerHTML = goalsHtml
    }

    // Update goal progress (for monthly and long-term goals)
    async function updateGoalProgress(goalType, goalId, progressData, clickEvent = null) {
        const goals = progressData.goals[goalType]
        const goal = goals.find(g => g.id === goalId)

        if (!goal) return

        const wasCompleted = goal.progress >= goal.target

        if (goal.type === 'percentage') {
            // Increment by 5%
            goal.progress = Math.min(goal.target, goal.progress + 5)
        } else if (goal.type === 'counter') {
            // Increment by 1
            goal.progress = Math.min(goal.target, goal.progress + 1)
        }

        // Save to Supabase 
        await window.SupabaseClient.saveGoalProgress(goalId, goal.progress)
        updateGoalsDisplay(progressData)

        // Show feedback - find the progress circle and animate it
        const goalElement = document.querySelector(`[onclick*="'${goalId}'"]`)
        if (goalElement) {
            const progressCircle = goalElement.querySelector('.goal-progress')
            if (progressCircle) {
                progressCircle.classList.add('updated')

                // Trigger confetti if goal just became completed (not if it was already completed)
                if (!wasCompleted && goal.progress >= goal.target) {
                    const rect = progressCircle.getBoundingClientRect()
                    const x = rect.left + rect.width / 2
                    const y = rect.top + rect.height / 2
                    window.createConfetti(x, y)
                }

                setTimeout(() => {
                    progressCircle.classList.remove('updated')
                }, 100)
            }
        }
    }

    // Undo goal progress (reset to 0)
    async function undoGoalProgress(goalType, goalId, progressData) {
        const goals = progressData.goals[goalType]
        const goal = goals.find(g => g.id === goalId)

        if (!goal) return

        goal.progress = 0

        // Save to Supabase
        await window.SupabaseClient.saveGoalProgress(goalId, 0)
        updateGoalsDisplay(progressData)

        // Show feedback - find the progress circle and animate it
        const goalElement = document.querySelector(`[onclick*="'${goalId}'"]`)
        if (goalElement) {
            const progressCircle = goalElement.querySelector('.goal-progress')
            if (progressCircle) {
                progressCircle.style.background = '#ff6b6b'
                progressCircle.style.color = '#fffbf0'

                setTimeout(() => {
                    progressCircle.style.background = ''
                    progressCircle.style.color = ''
                }, 500)
            }
        }
    }

    // Edit goal functionality
    function editGoal(goalType, goalId) {
        const textSpan = document.getElementById(`goal-text-${goalId}`)
        const editInput = document.getElementById(`goal-edit-${goalId}`)

        textSpan.style.display = 'none'
        editInput.style.display = 'block'
        editInput.focus()
        editInput.select()
    }

    // Save goal edit
    async function saveGoalEdit(goalType, goalId, progressData) {
        const textSpan = document.getElementById(`goal-text-${goalId}`)
        const editInput = document.getElementById(`goal-edit-${goalId}`)
        const newTitle = editInput.value.trim()

        if (newTitle && newTitle !== textSpan.textContent) {
            // Update local data
            const goals = progressData.goals[goalType]
            const goal = goals.find(g => g.id === goalId)
            if (goal) {
                goal.text = newTitle
                textSpan.textContent = newTitle

                // Save to Supabase
                await window.SupabaseClient.saveGoalTitle(goalId, newTitle)
            }
        } else if (!newTitle) {
            // If empty, restore original value
            editInput.value = textSpan.textContent
        }

        // Switch back to text display
        textSpan.style.display = 'block'
        editInput.style.display = 'none'
    }

    // Handle keypress in edit input
    function handleEditKeypress(event, goalType, goalId, progressData) {
        if (event.key === 'Enter') {
            event.preventDefault()
            saveGoalEdit(goalType, goalId, progressData)
        } else if (event.key === 'Escape') {
            // Cancel edit - restore original value
            const textSpan = document.getElementById(`goal-text-${goalId}`)
            const editInput = document.getElementById(`goal-edit-${goalId}`)
            editInput.value = textSpan.textContent

            textSpan.style.display = 'block'
            editInput.style.display = 'none'
        }
    }

    // Toggle goal menu
    function toggleGoalMenu(goalId) {
        const menu = document.getElementById(`menu-${goalId}`)
        const isVisible = menu.classList.contains('show')

        // Hide all other menus first
        document.querySelectorAll('.goal-menu.show').forEach(m => {
            if (m !== menu) m.classList.remove('show')
        })

        // Toggle current menu
        if (isVisible) {
            menu.classList.remove('show')
        } else {
            menu.classList.add('show')
        }
    }

    // Hide goal menu
    function hideGoalMenu(goalId) {
        const menu = document.getElementById(`menu-${goalId}`)
        menu.classList.remove('show')
    }

    // Initialize menu click handler
    function initGoalMenuHandlers() {
        // Hide all menus when clicking outside
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.goal-actions')) {
                document.querySelectorAll('.goal-menu.show').forEach(menu => {
                    menu.classList.remove('show')
                })
            }
        })
    }

    // Return public API
    return {
        updateGoalsDisplay,
        updateGoalProgress,
        undoGoalProgress,
        editGoal,
        saveGoalEdit,
        handleEditKeypress,
        toggleGoalMenu,
        hideGoalMenu,
        initGoalMenuHandlers
    }
})();