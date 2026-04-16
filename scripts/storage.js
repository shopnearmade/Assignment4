/**
 * @module storage
 * @description Manages all localStorage reads and writes for the Habit Tracker app.
 */

const habitKey = 'habit';

/**
 * returns the parsed habits array from localStorage
 * */

export function getHabits(){
    return JSON.parse(localStorage.getItem(habitKey)) || [];
}
 

/**
 * saves the habits array to localStorage
 * array of habit objects to save.
 */

export function saveHabits(habits)
{
    return localStorage.setItem(habitKey,JSON.stringify(habits))
}

/**
 * Retrieves value from localStorage by key
 * @param {string} key the localStorage key
 * @returns {string|null} the stored stringg value or null
 */

export function getItem(key) {
    return localStorage.getItem(key);
}

/**
 * stores a value in localStorage by key
 * @param {string} key the localStorage key
 * @param {string} value the value to store
 */

export function setItem(key, value) {
    localStorage.setItem(key, value);
}
