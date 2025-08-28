// Practice tracker module - IIFE pattern for GitHub Pages compatibility
window.PracticeTracker = (function () {

    // Practice type names mapping
    const practiceNames = {
        'chords': 'Chord Practice',
        'scales': 'Scales Practice',
        'piece': 'New Piece Work',
        'sight-reading': 'Sight Reading'
    }

    // Practice type icons mapping
    const practiceIcons = {
        'chords': 'musical-notes-outline',
        'scales': 'grid-outline',
        'piece': 'document-text-outline',
        'sight-reading': 'eye-outline'
    }

    const practiceTypes = ['chords', 'scales', 'piece', 'sight-reading']

    // Update practice list display
    function updatePracticeList(progressData) {
        const today = new Date().toDateString()
        const todayPractice = progressData.dailyPractice[today] || {}

        const practiceListDiv = document.getElementById('practiceList')

        const practiceHtml = practiceTypes.map(type => {
            const minutes = todayPractice[type] || 0
            return `
            <div class="goal-item clickable" onclick="trackPractice('${type}')">
                <span class="goal-text"><ion-icon name="${practiceIcons[type]}"></ion-icon> ${practiceNames[type]}</span>
                <div class="goal-actions">
                    <span class="goal-progress">
                        ${minutes}m
                    </span>
                </div>
            </div>
        `
        }).join('')

        practiceListDiv.innerHTML = practiceHtml
    }

    // Track practice time (5 minutes per click)
    async function trackPractice(practiceType, progressData) {
        const today = new Date().toDateString()
        const todayDate = new Date().toISOString().split('T')[0]

        // Initialize today's data if it doesn't exist
        if (!progressData.dailyPractice[today]) {
            progressData.dailyPractice[today] = {}
        }

        // Add 5 minutes to the practice type
        if (!progressData.dailyPractice[today][practiceType]) {
            progressData.dailyPractice[today][practiceType] = 0
        }
        progressData.dailyPractice[today][practiceType] += 5

        // Save to Supabase
        await window.SupabaseClient.savePracticeData(practiceType, progressData.dailyPractice[today][practiceType], todayDate)

        updatePracticeList(progressData)
        window.GoalsManager.updateGoalsDisplay(progressData, true)
        
        // Update total minutes display with animation
        if (window.displayTotalMinutes) {
            window.displayTotalMinutes(true)
        }

        // Button feedback - find the clicked element and animate just the progress circle
        const btn = document.querySelector(`[onclick*="'${practiceType}'"]`)
        if (btn) {
            const progressSpan = btn.querySelector('.goal-progress')

            // Add subtle animation to progress circle only
            if (progressSpan) {
                progressSpan.classList.add('updated')

                setTimeout(() => {
                    progressSpan.classList.remove('updated')
                }, 100)
            }
        }
    }

    // Undo all today's progress
    async function undoTodayProgress(progressData) {
        const today = new Date().toDateString()
        const todayDate = new Date().toISOString().split('T')[0]

        if (progressData.dailyPractice[today]) {
            // Delete from Supabase
            await window.SupabaseClient.deleteTodaysPractice(todayDate)

            delete progressData.dailyPractice[today]
            updatePracticeList(progressData)
            window.GoalsManager.updateGoalsDisplay(progressData, true) // Animate weekly goals update
            
            // Update total minutes display with animation
            if (window.displayTotalMinutes) {
                window.displayTotalMinutes(true)
            }

            // Show feedback
            const undoBtn = document.querySelector('.undo-all-btn')
            if (undoBtn) {
                const originalText = undoBtn.textContent
                undoBtn.textContent = '✓ Undone'
                undoBtn.style.background = '#3c5671'

                setTimeout(() => {
                    undoBtn.textContent = originalText
                    undoBtn.style.background = ''
                }, 500)
            }
        }
    }

    // Return public API
    return {
        updatePracticeList,
        trackPractice,
        undoTodayProgress
    }
})();