// Supabase client module - IIFE pattern for GitHub Pages compatibility
window.SupabaseClient = (function () {
    // Supabase configuration and client setup
    const SUPABASE_URL = 'https://mpxearzyvrwixoqpyfei.supabase.co'
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1weGVhcnp5dnJ3aXhvcXB5ZmVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNzE1NTUsImV4cCI6MjA3MTk0NzU1NX0.wTD-xH02jEpeqPGS-3g2VdH6V-qhms42KJAsK3vmqFg'

    // Initialize Supabase client
    const { createClient } = supabase
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)



    // Test connection (silent)
    async function testConnection() {
        try {
            // Simple test query - this will work even without tables
            const { data, error } = await supabaseClient.from('_test').select('*').limit(1)

            // If we get here without throwing, connection works
            console.log('Supabase connection successful')
        } catch (error) {
            // Even connection errors tell us we can reach Supabase
            if (error.message.includes('relation') || error.message.includes('does not exist')) {
                console.log('Connected to Supabase!')
            } else {
                console.log('Connection error:', error.message)
            }
        }
    }

    // Database operations
    async function loadWeeklyTargets() {
        const { data: weeklyTargets, error: weeklyError } = await supabaseClient
            .from('weekly_targets')
            .select('*')

        if (weeklyError) throw weeklyError

        return weeklyTargets.map(target => ({
            text: target.practice_type.charAt(0).toUpperCase() + target.practice_type.slice(1) + ' Practice',
            target: target.target_minutes,
            type: 'minutes',
            practiceType: target.practice_type
        }))
    }

    async function loadGoals() {
        const { data: goals, error: goalsError } = await supabaseClient
            .from('goals')
            .select('*')

        if (goalsError) throw goalsError

        const monthly = goals
            .filter(goal => goal.goal_type === 'monthly')
            .map(goal => ({
                text: goal.title,
                progress: goal.progress,
                target: goal.target,
                type: goal.data_type,
                id: goal.goal_id
            }))

        const longTerm = goals
            .filter(goal => goal.goal_type === 'longTerm')
            .map(goal => ({
                text: goal.title,
                progress: goal.progress,
                target: goal.target,
                type: goal.data_type,
                id: goal.goal_id
            }))

        return { monthly, longTerm }
    }

    async function loadDailyPractice() {
        // Load daily practice data (last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const { data: practiceData, error: practiceError } = await supabaseClient
            .from('daily_practice')
            .select('*')
            .gte('practice_date', thirtyDaysAgo.toISOString().split('T')[0])

        if (practiceError) throw practiceError

        // Convert to our format
        const dailyPractice = {}
        practiceData.forEach(record => {
            const dateStr = new Date(record.practice_date).toDateString()
            if (!dailyPractice[dateStr]) {
                dailyPractice[dateStr] = {}
            }
            dailyPractice[dateStr][record.practice_type] = record.minutes
        })

        return dailyPractice
    }

    // Save practice data to Supabase
    async function savePracticeData(practiceType, minutes, date) {
        try {
            // First try to update existing record
            const { data: existingData, error: selectError } = await supabaseClient
                .from('daily_practice')
                .select('*')
                .eq('practice_date', date)
                .eq('practice_type', practiceType)
                .limit(1)

            if (selectError) throw selectError

            if (existingData && existingData.length > 0) {
                // Update existing record
                const { data, error } = await supabaseClient
                    .from('daily_practice')
                    .update({ minutes: minutes })
                    .eq('practice_date', date)
                    .eq('practice_type', practiceType)

                if (error) throw error
            } else {
                // Insert new record
                const { data, error } = await supabaseClient
                    .from('daily_practice')
                    .insert({
                        practice_date: date,
                        practice_type: practiceType,
                        minutes: minutes
                    })

                if (error) throw error
            }
        } catch (error) {
            console.error('Error saving practice data:', error)
        }
    }

    // Save goal progress to Supabase
    async function saveGoalProgress(goalId, progress) {
        try {
            const { data, error } = await supabaseClient
                .from('goals')
                .update({ progress: progress })
                .eq('goal_id', goalId)

            if (error) throw error
        } catch (error) {
            console.error('Error saving goal progress:', error)
        }
    }

    // Save goal title to Supabase
    async function saveGoalTitle(goalId, title) {
        try {
            const { data, error } = await supabaseClient
                .from('goals')
                .update({ title: title })
                .eq('goal_id', goalId)

            if (error) throw error
        } catch (error) {
            console.error('Error saving goal title:', error)
        }
    }

    // Delete today's practice data
    async function deleteTodaysPractice(todayDate) {
        try {
            const { error } = await supabaseClient
                .from('daily_practice')
                .delete()
                .eq('practice_date', todayDate)

            if (error) throw error
        } catch (error) {
            console.error('Error deleting today\'s progress:', error)
        }
    }

    // Return public API
    return {
        testConnection,
        loadWeeklyTargets,
        loadGoals,
        loadDailyPractice,
        savePracticeData,
        saveGoalProgress,
        saveGoalTitle,
        deleteTodaysPractice
    }
})();