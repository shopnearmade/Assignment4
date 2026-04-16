/**
 * @module ui
 * @description all DOM rendering and event. Imports data from storage.js and habitLogic.js.
 */

import { getHabits, saveHabits, getItem, setItem } from './storage.js';
import { createHabit, validateHabits, toggleCompletion,calculateStreak } from './habitLogic.js';

/**
 * render the weekly habit grid in the Habit Library section.
 */
export function renderHabitGrid() {
    const grid = document.getElementById('days-grid');
    if (!grid) return;

    grid.querySelectorAll('.habit-name, .habit-box').forEach(el => el.remove());

    const habits = getHabits();
    habits.forEach(habit => {
        const nameDiv = document.createElement('div');
        nameDiv.className = 'habit-name';
        nameDiv.textContent = habit.name;
        grid.appendChild(nameDiv);

        for (let i = 0; i < 7; i++) {
            const box = document.createElement('div');
            box.className = 'habit-box';
            if (Array.isArray(habit.scheduledDays) && habit.scheduledDays.includes(i)) {
                box.classList.add('selected');
            }
            box.addEventListener('click', () => {
                box.classList.toggle('selected');
                if (!Array.isArray(habit.scheduledDays)) habit.scheduledDays = [];
                const idx = habit.scheduledDays.indexOf(i);
                if (box.classList.contains('selected') && idx === -1) {
                    habit.scheduledDays.push(i);
                } else if (!box.classList.contains('selected') && idx > -1) {
                    habit.scheduledDays.splice(idx, 1);
                }
                saveHabits(habits);
                renderDailyDashboard();
            });
            grid.appendChild(box);
        }
    });
}

/**
 * rendering today's habit checklist in the Daily Dashboard section.
 */
export function renderDailyDashboard() {
    const today = new Date();
    const dayIndex = today.getDay();
    const todayString = today.toDateString();
    const dailyTracker=document.querySelector('.daily-tracker');
    if (!dailyTracker) return;

    dailyTracker.querySelectorAll('.today-habit, .daily-desc, .daily-check, .daily-streak').forEach(el => el.remove());

    const habits = getHabits();
    habits.forEach(habit => {
        if (!habit.scheduledDays||!habit.scheduledDays.includes(dayIndex)) return;

        const nameDiv = document.createElement('div');
        nameDiv.className = 'today-habit';
        nameDiv.textContent = habit.name;

        const descDiv = document.createElement('div');
        descDiv.className = 'daily-desc';
        descDiv.textContent = habit.description || 'No description';

        const checkWrapper = document.createElement('div');
        checkWrapper.className = 'daily-check';
        const checkBox = document.createElement('input');
        checkBox.type = 'checkbox';

        checkBox.checked = habit.completed || false;
        checkBox.addEventListener('change', () => {
            const allHabits = getHabits();

            const target = allHabits.find(h => h.name === habit.name);
            if (target) 
            {
                const wasCompleted = target.completed;
                toggleCompletion(target, checkBox.checked, todayString);
                saveHabits(allHabits);

                const weeklyTotal = parseInt(getItem('weeklyCompletedTotal')) || 0;
                if (checkBox.checked && !wasCompleted) {
                    setItem('weeklyCompletedTotal', (weeklyTotal + 1).toString());
                } else if (!checkBox.checked && wasCompleted) {
                    setItem('weeklyCompletedTotal', Math.max(0, weeklyTotal - 1).toString());
                }
            }
            renderDailyDashboard();
            updateWeeklyProgress();
        } );
        checkWrapper.appendChild(checkBox);

        const streakDiv = document.createElement('div');
        streakDiv.className= 'daily-streak';
        
        streakDiv.textContent = calculateStreak(habit);
        dailyTracker.appendChild(nameDiv);
        dailyTracker.appendChild(descDiv);
        dailyTracker.appendChild(checkWrapper);
        dailyTracker.appendChild(streakDiv);
    });

    updateWeeklyProgress();
}

/**
 * Updates the weekly completed count and best streak display in the DOM.
 */
export function updateWeeklyProgress() {
    const habits=getHabits();
    const weeklyTotal=parseInt(getItem('weeklyCompletedTotal')) || 0;
    const maxStreak=habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);
    const completedEl=document.getElementById('completed-count');
    const streakEl=document.getElementById('streak-count');
    if (completedEl) completedEl.textContent = weeklyTotal;
    if (streakEl) streakEl.textContent = maxStreak;
}

/**
 *  open, close, and submit events for the add-habit modal.
 */
export function initModal() {
    const modal= document.getElementById('modal');
    const submitBtn = document.getElementById('add-habits');
    const form = document.getElementById('habit-form');

    document.getElementById('open-btn').addEventListener('click', () => modal.removeAttribute('hidden'));
    document.getElementById('close-btn').addEventListener('click', () => {
        modal.setAttribute('hidden', '');
        form.reset();
    });

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const habit = createHabit(
            document.getElementById('habit-name').value,
            document.getElementById('habit-description').value,
            document.getElementById('habit-category').value
        );
        const habits = getHabits();
        habits.push(habit);
        saveHabits(habits);
        modal.setAttribute('hidden', '');
        form.reset();
        renderHabitGrid();

        renderDailyDashboard();
    }) ;
}

/**
 * the remove-habit button to prompt and delete a habit by name.
 */
export function initRemoveHabit() {
    document.getElementById('remove-btn').addEventListener('click', () => {
        
        const habitName= prompt('Enter the habit name to remove:');
        if (!habitName) return;
        const habits = getHabits();
        const lastIndex = habits.findLastIndex(h => h.name === habitName);
        if (lastIndex > -1)
        {

        habits.splice(lastIndex, 1);
        saveHabits(habits);
        renderHabitGrid();
        } else 
        {
            alert('Habit not found.');
        }
    });
}

/**
 * the file import input to parse,validate, and store imported habits.
 */
export function initImport() {
    document.getElementById('import-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.addEventListener('load', (e) => 
            {
            try {const imported = JSON.parse(e.target.result);
                validateHabits(imported);
                const habits = getHabits();
                habits.push(...imported);
             saveHabits(habits);
                renderHabitGrid();
            } catch (error) 
            {
            console.error('Error importing habits:', error.message);
            }
        });
        reader.readAsText(file);
    });
}

/**
 * initialize the username prompt/showing it if no username is stored.
 */
export function initUsername() {
    const header=document.getElementById('main-title');
    const usernameContainer = document.getElementById('username-container');
    const usernameInput = document.getElementById('username');
    const savedUser = getItem('username');

    if (savedUser) {
        header.textContent = `Welcome, ${savedUser}`;
    } else {
        usernameContainer.removeAttribute('hidden');
    }

    document.getElementById('submit-btn').addEventListener('click', () => {
        const value=usernameInput.value.trim();
        if (value) {
            setItem('username', value);
            header.textContent = `Welcome, ${value}`;
            usernameContainer.setAttribute('hidden', '');
        }
    });
}
