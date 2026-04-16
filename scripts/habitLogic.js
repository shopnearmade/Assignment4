/**
 * @module habitLogic
 * @description data functions for habit operations. 
 */

/**
 * creates a new habit object with default values.
 * @param {string} name habit name
 * @param {string} description habit description
 * @param {string} category habit category
 * @returns {Object}  new habit object
 */
export function createHabit(name, description, category) {
    return {
        name,
        description,
        category,
        completed: false,
        scheduledDays: [],
        completionHistory: [],
        streak: 0
    };
}

/**
 * validates an imported habits array
 * @param {*} data te parsed JSON data to validate
 *  @returns {true} returns true if valid
 * @throws {Error} if data is not a non-empty array of valid habit objects
 */
export function validateHabits(data) {
    if (!Array.isArray(data)) throw new Error('Invalid Format: JSON must be an array of habits');
    if (data.length === 0) throw new Error('JSON file is empty');
    data.forEach((habit, index) => {
        if (!habit.hasOwnProperty('name ')) throw new Error(`Habit at index ${index} is missing 'name' property `);
        if (!habit.hasOwnProperty('completed')) throw new Error(`Habit at index ${index} is  missing 'completed' property`);
    }); return true;
}

/**
 * calculates the current streak for a habit.
 * @param {Object} habit a habit object with a completion history array.
 * @returns {number} current streak count.
 */
export function calculateStreak(habit) {
    if (!Array.isArray(habit.completionHistory) || habit.completionHistory.length===0) return 0;

    const ONE_DAY_MS= 1000*60*60*24;
    const completedDates= habit.completionHistory
        .map(entry => {
            const date =new Date(entry.date);
            date.setHours(0,0,0,0);
            return date.getTime();
        })
        .sort((a,b)=> b - a);

    const today=new Date();
    today.setHours(0,0,0,0);
    const todayTime = today.getTime();
    if (!completedDates.includes( todayTime)) return 0;
    let streak=1;
    for (let i=1;i<completedDates.length;i++) {
        if (completedDates.includes(todayTime - i * ONE_DAY_MS)) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
}

/**
 * toggles a habit's completion status for today and updating history and strea
 * @param {Object} habit the habit object to update.
 * @param {boolean} isChecked check if habit is complete.
 * @param {string} todayString today's date    
 */
export function toggleCompletion(habit, isChecked, todayString) {
    if (!Array.isArray(habit.completionHistory)) habit.completionHistory = [];
    const todayEntry=habit.completionHistory.find(e => e.date === todayString);

    if (isChecked && !todayEntry) {
        habit.completionHistory.push({ date: todayString, completed: true });
    } else if (!isChecked && todayEntry){
        habit.completionHistory= habit.completionHistory.filter(e => e.date !== todayString);
    }
    habit.completed = isChecked;
    habit.streak = calculateStreak(habit);
}

/**
 * reset daily completion flags 
 * @param {Array} habits the current habits array
 * @param {string} lastDate stored date string
 * @param {string} todayString today's date  
 * @returns {Array} the updated habits array
 */
export function resetDailyCompletions(habits, lastDate, todayString) {
    habits.forEach(habit=>{
        if (lastDate && habit.completed) {
            if (!Array.isArray(habit.completionHistory)) habit.completionHistory = [];
            habit.completionHistory.push({ date:lastDate,completed:true});
        }
        habit.completed=false;
    });
    return habits;
}

/**
 * reset the weekly completed total
 * @param { string } lastWeekStart the start date string of the previous week
 * @param { string } currentWeekTotal 
 * @param { Array } weeklyHistory the existing weekly history array
 * @returns { Array } update weekly history array
 */
export function resetWeeklyTotal(lastWeekStart, currentWeekTotal, weeklyHistory) {
    if (currentWeekTotal !== '0') {
        weeklyHistory.push({
            weekStart: lastWeekStart || 'unknown',
            completed: parseInt(currentWeekTotal)
        });
    }
    return weeklyHistory;
}
