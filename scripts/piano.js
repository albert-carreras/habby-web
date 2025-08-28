// Main piano app coordinator - IIFE pattern for GitHub Pages compatibility
(function () {
    // Daily motivational quotes - piano/learning/grinding related
    const motivationalQuotes = [
        "Every master was once a disaster. Your struggle today builds tomorrow's strength.",
        "The piano doesn't care if you're tired. Show up anyway.",
        "Scales aren't punishment—they're the foundation of everything beautiful you'll play.",
        "Progress isn't always loud. Sometimes it's the quiet patience between mistakes.",
        "Your fingers remember what your mind forgets. Trust the process.",
        "Bad practice days make good practice days possible. Keep grinding.",
        "The metronome is your friend, even when it feels like your enemy.",
        "Every professional was once an amateur who refused to give up.",
        "Muscle memory is built one repetition at a time. No shortcuts.",
        "The difference between good and great is practicing when you don't feel like it.",
        "Your worst practice session is still better than no practice session.",
        "Technique today, artistry tomorrow. Put in the work.",
        "The piano teaches patience. Let it be your teacher.",
        "Every wrong note is just a right note waiting to happen.",
        "Consistency beats intensity. Show up daily.",
        "Your hands are learning even when your brain is frustrated.",
        "Slow and steady wins the race. Speed comes with time.",
        "The hardest part is sitting down. Everything else follows.",
        "Great pianists aren't born, they're forged through daily practice.",
        "Embrace the suck. Growth lives in discomfort.",
        "Your future self will thank you for today's practice.",
        "The piano reveals character. What will yours show?",
        "Perfect practice makes perfect. Mindful repetition is key.",
        "Every stumble is a step toward mastery.",
        "The grind is silent, but the results speak volumes.",
        "Dedication is practicing scales when you'd rather play songs.",
        "Your breakthrough is often just one practice session away.",
        "The piano doesn't lie. It reflects exactly what you put in.",
        "Small daily improvements create extraordinary results.",
        "The journey of a thousand pieces begins with a single scale.",
        "Excellence isn't an act, but a habit. Make practice yours.",
        "Champions practice when others make excuses.",
        "Your comfort zone is where dreams go to die.",
        "The only failure is not trying. Keep your hands moving.",
        "Boredom is the enemy of progress. Find joy in repetition.",
        "Every Bach started with basic exercises.",
        "Talent without discipline is just potential.",
        "The keyboard doesn't judge. Only you do.",
        "Mastery is not a destination, it's a daily choice.",
        "Your practice today determines your performance tomorrow.",
        "Struggle is the currency of growth.",
        "The metronome never lies about your timing.",
        "Every professional has bad days. They practice anyway.",
        "Speed without accuracy is just noise.",
        "Your hands will do what your mind commands.",
        "Repetition builds reflexes. Reflexes build confidence.",
        "The difference between amateur and pro is showing up when it's hard.",
        "Your practice room is your temple. Respect it.",
        "Every mistake is feedback. Listen and adjust.",
        "The piano forgives everything except inconsistency.",
        "Discipline is choosing what you want most over what you want now.",
        "Your breakthrough is hiding behind one more attempt.",
        "Great technique comes from thousands of small corrections.",
        "The path to mastery is paved with daily decisions.",
        "Your hands are your instruments. Train them well.",
        "Progress compounds. Trust the process.",
        "The best practice session is the one you didn't want to do.",
        "Consistency is the mother of mastery.",
        "Your dedication speaks louder than your talent.",
        "Every scale practiced is a step toward freedom.",
        "The piano rewards patience above all else.",
        "Your commitment today shapes your ability tomorrow.",
        "Excellence is a habit disguised as talent.",
        "The metronome teaches honesty. Listen to its lessons.",
        "Your fingers learn faster when your mind is present.",
        "Every expert was once a beginner who refused to quit.",
        "The piano bench is where character is built.",
        "Your practice quality determines your performance ceiling.",
        "Embrace the grind. It's where legends are forged.",
        "The only bad practice is the one you skip.",
        "Your musical voice emerges through disciplined practice.",
        "Every professional knows the weight of daily commitment.",
        "The piano responds to intention, not just motion.",
        "Your breakthrough lives on the other side of frustration.",
        "Mastery is a marathon, not a sprint.",
        "The keys don't care about your mood. Show up anyway.",
        "Your future performance is built in today's practice room.",
        "Discipline today, freedom tomorrow.",
        "Every great performance started with unglamorous practice.",
        "The piano teaches you to listen to yourself.",
        "Your hands remember what your mind forgets.",
        "Progress isn't always perfect. It's always persistent.",
        "The difference between good and great is one more repetition.",
        "Your practice is an investment in your musical future.",
        "The metronome is the guardian of your timing.",
        "Every stumble teaches your fingers something new.",
        "Champions are made in the practice room, not on stage.",
        "Your dedication today determines your ability tomorrow.",
        "The piano rewards those who show up consistently.",
        "Excellence requires sacrifice. What will you give up?",
        "Your hands are learning even when you don't feel progress.",
        "The grind is real. The rewards are worth it.",
        "Every master piece started with basic practice.",
        "Your commitment level determines your achievement level.",
        "The piano doesn't accept half-hearted effort.",
        "Progress happens in the spaces between comfort zones.",
        "Your breakthrough is one practice session away.",
        "Discipline is the foundation of all musical achievement.",
        "The keys respond to persistence, not perfection.",
        "Your practice quality today shapes tomorrow's performance.",
        "Every repetition is a building block of mastery.",
        "The piano teaches patience to those who listen.",
        "Your musical journey is measured in practice hours.",
        "Excellence is consistency in small daily actions.",
        "The difference between dreaming and achieving is daily practice.",
        "Your hands will thank you for today's discipline.",
        "The metronome never lies about your preparation.",
        "Every professional knows the cost of greatness.",
        "Your practice room is where transformation happens.",
        "The piano rewards those who embrace the process.",
        "Your dedication speaks through your fingertips.",
        "Progress is built one note at a time.",
        "The keys don't care about yesterday's practice. Show up today.",
        "Your musical voice emerges through relentless practice.",
        "Every master was forged in the fire of daily discipline.",
        "The piano teaches humility to those who truly listen.",
        "Your breakthrough is hiding in plain sight. Keep practicing.",
        "Excellence is not a skill, it's an attitude."
    ];

    // Get daily quote based on current date
    function getDailyQuote() {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        return motivationalQuotes[dayOfYear % motivationalQuotes.length];
    }

    // Display daily motivation
    function displayDailyMotivation() {
        const motivationElement = document.getElementById('daily-motivation');
        if (motivationElement) {
            motivationElement.textContent = getDailyQuote();
        }
    }

    // Motivational phrases for total minutes display
    const totalMinutesMessages = [
        "minutes forging your musical destiny",
        "minutes building legendary technique",
        "minutes of pure dedication invested",
        "minutes sculpting greatness",
        "minutes closer to mastery",
        "minutes of disciplined growth",
        "minutes that separate you from ordinary",
        "minutes of character-building practice",
        "minutes invested in your musical future",
        "minutes of unwavering commitment",
        "minutes transforming struggle into strength",
        "minutes building unstoppable momentum",
        "minutes creating your musical legacy",
        "minutes of relentless pursuit",
        "minutes that define true dedication",
        "minutes grinding toward excellence",
        "minutes forging unbreakable discipline",
        "minutes of purposeful repetition",
        "minutes building muscle memory that lasts",
        "minutes separating dreamers from achievers",
        "minutes of focused intensity",
        "minutes crafting your artistic voice",
        "minutes that professionals respect",
        "minutes building technical foundations",
        "minutes of consistent daily progress",
        "minutes transforming potential into skill",
        "minutes proving your commitment to greatness",
        "minutes of methodical improvement",
        "minutes that compound into mastery",
        "minutes showing your dedication to the craft",
        "minutes building the habits of champions",
        "minutes of intentional practice",
        "minutes creating lasting musical memories",
        "minutes that separate good from great",
        "minutes of authentic artistic development",
        "minutes building confidence through repetition",
        "minutes of disciplined musical training",
        "minutes proving your love for the instrument",
        "minutes that make the difference",
        "minutes of persistent forward motion",
        "minutes building your musical character",
        "minutes of professional-level commitment",
        "minutes creating unstoppable progress",
        "minutes of focused musical meditation",
        "minutes building strength through struggle",
        "minutes that define your musical journey",
        "minutes of dedicated skill development",
        "minutes proving practice makes permanent",
        "minutes building technical mastery",
        "minutes of passionate pursuit",
        "minutes creating your performance foundation",
        "minutes that show true musical devotion",
        "minutes building unshakeable confidence",
        "minutes of authentic artistic growth",
        "minutes proving consistency beats intensity",
        "minutes building your musical vocabulary",
        "minutes of purposeful finger training",
        "minutes creating lasting musical habits",
        "minutes that demonstrate real commitment",
        "minutes building professional-level skills",
        "minutes of focused musical concentration",
        "minutes proving dedication over talent",
        "minutes building your performance stamina",
        "minutes of methodical technical work",
        "minutes creating musical muscle memory",
        "minutes that separate serious from casual",
        "minutes building artistic expression",
        "minutes of disciplined daily ritual",
        "minutes proving your musical ambition",
        "minutes building technical fluency",
        "minutes of consistent forward progress",
        "minutes creating your unique musical voice",
        "minutes that define musical excellence",
        "minutes building performance confidence",
        "minutes of dedicated artistic practice",
        "minutes proving practice is your priority",
        "minutes building lasting musical skills",
        "minutes of focused technical development",
        "minutes creating your musical identity",
        "minutes that show unwavering determination",
        "minutes building professional work ethic",
        "minutes of purposeful musical study",
        "minutes proving your commitment to craft",
        "minutes building technical precision",
        "minutes of authentic musical expression",
        "minutes creating unbreakable practice habits",
        "minutes that demonstrate musical maturity",
        "minutes building performance readiness",
        "minutes of disciplined artistic pursuit",
        "minutes proving consistency is key",
        "minutes building musical understanding",
        "minutes of focused skill refinement",
        "minutes creating your performance foundation",
        "minutes that separate amateurs from pros",
        "minutes building artistic confidence",
        "minutes of dedicated musical growth",
        "minutes proving practice transforms potential",
        "minutes building technical mastery foundation",
        "minutes of purposeful musical development",
        "minutes creating lasting performance skills",
        "minutes that show true artistic dedication",
        "minutes building professional discipline",
        "minutes of focused musical training",
        "minutes proving your commitment to excellence",
        "minutes building unshakeable technique",
        "minutes of consistent artistic progress",
        "minutes creating your musical legacy",
        "minutes that define serious musicianship",
        "minutes building performance confidence",
        "minutes of dedicated practice discipline",
        "minutes proving daily effort compounds",
        "minutes building technical fluency",
        "minutes of authentic musical pursuit",
        "minutes creating professional-level habits",
        "minutes that demonstrate real passion",
        "minutes building artistic expression",
        "minutes of focused musical meditation",
        "minutes proving practice makes progress",
        "minutes building lasting musical memories",
        "minutes of disciplined skill development",
        "minutes creating your unique artistic voice",
        "minutes that separate good from exceptional",
        "minutes building performance stamina",
        "minutes of dedicated musical study",
        "minutes proving commitment over convenience",
        "minutes building technical precision",
        "minutes of purposeful artistic growth",
        "minutes creating unbreakable momentum",
        "minutes that show true musical devotion",
        "minutes building professional mindset",
        "minutes of focused practice discipline",
        "minutes proving consistency conquers all",
        "minutes building musical mastery",
        "minutes of authentic artistic development",
        "minutes creating your performance identity",
        "minutes that define musical excellence",
        "minutes building unshakeable confidence",
        "minutes of dedicated technical work",
        "minutes proving practice is your pathway",
        "minutes building lasting artistic skills",
        "minutes of disciplined musical pursuit",
        "minutes creating professional-level abilities",
        "minutes that demonstrate unwavering focus",
        "minutes building musical character",
        "minutes of purposeful skill refinement",
        "minutes proving dedication beats talent",
        "minutes building technical mastery",
        "minutes of consistent artistic progress",
        "minutes creating your musical destiny",
        "minutes that separate dreamers from doers",
        "minutes building performance excellence",
        "minutes of focused musical training",
        "minutes proving your artistic commitment",
        "minutes building unbreakable technique",
        "minutes of dedicated practice ritual",
        "minutes creating lasting musical growth",
        "minutes that show true professional spirit",
        "minutes building artistic confidence",
        "minutes of disciplined musical development"
    ];

    // Calculate and display total minutes practiced
    function displayTotalMinutes(animate = false) {
        const totalMinutesElement = document.getElementById('total-minutes');
        if (totalMinutesElement && progressData.dailyPractice) {
            let totalMinutes = 0;
            
            // Sum up all practice minutes from all days
            Object.values(progressData.dailyPractice).forEach(dayData => {
                Object.values(dayData).forEach(minutes => {
                    totalMinutes += minutes;
                });
            });

            // Get rotating message based on date
            const today = new Date();
            const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
            const message = totalMinutesMessages[dayOfYear % totalMinutesMessages.length];

            totalMinutesElement.innerHTML = `<span class="total-number">${totalMinutes}</span> <span class="total-text">${message}</span>`;

            // Add animation when updated
            if (animate) {
                totalMinutesElement.classList.add('updated');
                setTimeout(() => {
                    totalMinutesElement.classList.remove('updated');
                }, 800);
            }
        }
    }

    // Global progress data
    let progressData = {
        dailyPractice: {},
        goals: {
            weekly: [],
            monthly: [],
            longTerm: []
        },
        lastUpdated: new Date().toISOString()
    }

    // Load data from Supabase
    async function loadData() {
        try {
            // Load weekly targets
            progressData.goals.weekly = await window.SupabaseClient.loadWeeklyTargets()

            // Load goals
            const { monthly, longTerm } = await window.SupabaseClient.loadGoals()
            progressData.goals.monthly = monthly
            progressData.goals.longTerm = longTerm

            // Load daily practice data
            progressData.dailyPractice = await window.SupabaseClient.loadDailyPractice()

        } catch (error) {
            console.error('Error loading data from Supabase:', error)
        }
    }

    // Confetti animation function
    function createConfetti(x, y) {
        const container = document.getElementById('confetti-container')
        const colors = ['#3c5671', '#FFC107', '#FF9800', '#2196F3', '#9C27B0']

        for (let i = 0; i < 20; i++) {
            const confetti = document.createElement('div')
            confetti.className = 'confetti'
            confetti.style.left = x + 'px'
            confetti.style.top = y + 'px'
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)]
            confetti.style.animationDelay = Math.random() * 0.5 + 's'
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's'

            // Random direction
            const angle = Math.random() * Math.PI * 2
            const velocity = Math.random() * 100 + 50
            confetti.style.setProperty('--x-vel', Math.cos(angle) * velocity + 'px')
            confetti.style.setProperty('--y-vel', Math.sin(angle) * velocity + 'px')

            container.appendChild(confetti)

            // Remove after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti)
                }
            }, 4000)
        }
    }

    // Initialize the app
    async function initApp() {
        displayDailyMotivation()
        await loadData()
        displayTotalMinutes()
        window.PracticeTracker.updatePracticeList(progressData)
        window.GoalsManager.updateGoalsDisplay(progressData)
        window.GoalsManager.initGoalMenuHandlers()
    }

    // Refresh data from Supabase
    async function refreshData() {
        try {
            await loadData()
            displayTotalMinutes()
            window.PracticeTracker.updatePracticeList(progressData)
            window.GoalsManager.updateGoalsDisplay(progressData)
        } catch (error) {
            console.error('Error refreshing data:', error)
        }
    }

    // Make functions globally available for onclick handlers
    window.trackPractice = (practiceType) => window.PracticeTracker.trackPractice(practiceType, progressData)
    window.updateGoalProgress = (goalType, goalId) => window.GoalsManager.updateGoalProgress(goalType, goalId, progressData)
    window.undoGoalProgress = (goalType, goalId) => window.GoalsManager.undoGoalProgress(goalType, goalId, progressData)
    window.undoTodayProgress = () => window.PracticeTracker.undoTodayProgress(progressData)
    window.editGoal = window.GoalsManager.editGoal
    window.saveGoalEdit = (goalType, goalId) => window.GoalsManager.saveGoalEdit(goalType, goalId, progressData)
    window.handleEditKeypress = (event, goalType, goalId) => window.GoalsManager.handleEditKeypress(event, goalType, goalId, progressData)
    window.toggleGoalMenu = window.GoalsManager.toggleGoalMenu
    window.hideGoalMenu = window.GoalsManager.hideGoalMenu
    window.createConfetti = createConfetti
    window.displayTotalMinutes = displayTotalMinutes
    window.refreshData = refreshData

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        initApp()
        window.SupabaseClient.testConnection()
    })
})()