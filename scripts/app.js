/**
 * @module app
 * @description entry point 
 */

import { getHabits, saveHabits, getItem, setItem } from './storage.js';
import { resetDailyCompletions, resetWeeklyTotal } from './habitLogic.js';
import { renderHabitGrid, renderDailyDashboard, updateWeeklyProgress, initModal, initRemoveHabit, initImport, initUsername } from './ui.js';
import { initTheme } from './theme.js';

/**
 * checks if the day or week has changed and resets 
 */
function checkAndResetDailyTasks() {
    const today= new Date();
    const todayString= today.toDateString();
    const dayIndex= today.getDay();
    const lastDate= getItem('lastDate');
    const lastWeekStart= getItem('lastWeekStart');
    if (lastDate !== todayString) {
        const habits = getHabits();
        const updated = resetDailyCompletions(habits, lastDate, todayString);
        saveHabits(updated);
        setItem('lastDate', todayString);
    }

    if (dayIndex === 0 && lastWeekStart !== todayString) {
        const currentWeekTotal = getItem('weeklyCompletedTotal') || '0';
        const weeklyHistory = JSON.parse(getItem('weeklyHistory')) || [];
        const updatedHistory = resetWeeklyTotal(lastWeekStart, currentWeekTotal, weeklyHistory);
        setItem('weeklyHistory', JSON.stringify(updatedHistory));
        setItem('weeklyCompletedTotal', '0');
        setItem('lastWeekStart', todayString);
    }
}
// set today's date in the 

document.getElementById('today-date').textContent = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
} );

checkAndResetDailyTasks();
initUsername();
initTheme();
initModal();
initRemoveHabit();
initImport();
renderHabitGrid();
renderDailyDashboard();
updateWeeklyProgress();
