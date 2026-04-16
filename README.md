Task 1: Modular Architecture Proposal
Description of Current Organization:
1. Number of JavaScript files: Currently, there are two JavaScript files
2. File Responsibilities: habit.js handles everything from fetching and parsing JSON files, listening to button clicks, calculating streaks, toggling CSS themes, generating HTML grid elements, JSON file import and validation, and directly reading/writing to localStorage.
 tableTracking.js handles weekly grid UI in the Habit Library, update completed count and streak display, toggling individual day as done/not done
3. Mixed Responsibilities: In the table tableTracking.js, the grid rendering and the streak/count calculation are mixed in the same file and it duplicates some streak counting logic that also exists in habit.js


 
B. Proposed Modular Design
To resolve these the application will be refactored into modules using import and export 
1.	storage.j: manage data, retrieve data from local storage and write data into local storage.
•	Exposed Elements: getHabits() return parsed habits array from localStorage, saveHabits(habits) save habit array, 	getItem(key) and setItem(key,value)
2.	habitLogin.js handles for all data operation on habit without involving with DOM and localStorage 
•	Exposed Elements: createHabit( name,description, category) returns a new habit object
  validateHabits(data)
  calculateStreak(habit)  computes streak from completionHistory
 toggleCompletion(habit, todayString)  updates completed, completionHistory, and streak on a habit
o	resetDailyCompletions(habits, lastDate, todayString) resets completed flags and archives history
o	resetWeeklyTotal(habits)  resets weekly counter and archives previous week
2. ui.js
Handles all DOM manipulation rendering and event binding. Imports from storage.js and habitLogic.js 
•	Exposed Elements:
o	renderHabitGrid(habitsData) builds the weekly grid from habits in storage
o	renderDailyDashboard(habitsData) builds today’s checklist 
o	updateWeeklyProgress(habitsData)updates complete-count and streak count
o	initModal() open/close/submit events on the add-habit model
3. theme.js
•	Responsibility: Manages the application's theme state n 
•	Exposed Elements:
o	initTheme()
o	themeChange(selectedTheme)
4. app.js 
•	import and calls heckAndResetDailyTasks(), initUsername(), initTheme(), initModal(), renderHabitGrid(), renderDailyDashboard()
Proposed Refactor Items:
•	Refactor 1: Extract Data : Move all localStorage.getItem() and setItem() calls out of the rendering functions and into storage.js  
•	Refactor 2: Isolate DOM Rendering (SRP). Extract renderHabitGrid and renderDailyDashboard into ui.js.
•	Remove tableTracking.js 
 Task 2: Implement at least 2 refactor changes
Refactored Modules
storage.js: localStorage reads and writes into a single module so no other file uses localStorage directly
Extracted: localStorage.getItem('habit') + JSON.parse() calls that were repeated in 8 locations across in habit.js previously 
Exposes :getHabits() and saveHabits(habits) to read/write the habits array
Exposes : getItem(key) and  setItem(key, value)
habitLogic.js
 Contains all pure data functions for habit operations without DOM or localStorage access
Extracted validateHabits() and calculateStreak() from habit.js
Extracted inline streak increment/decrement logic from the checkbox handler in renderDailyDashboard into toggleCompletion() which now calls  calculateStreak()
 Extracted daily and weekly reset logic from checkAndResetDailyTasks()
 into resetDailyCompletions() and resetWeeklyTotal() Added createHabit()

ui.js Handles all DOM rendering and event  importing data from storage.js
 and habitLogic.js
Extracted: renderHabitGrid() and renderDailyDashboard() from habit.js
Extracted : updateWeeklyProgress() from habit.js
Extracted modal open/close/submit logic from the addHabits() function in habit.js  into 
initModal()
Extracted: file import listener from habit.js into initImport(), which validates to habitLogic.js
Extracted: username prompt logic into initUsername()
Extracted :remove-habit button logic into initRemoveHabit()
theme.js Manages the application's theme state 
Extracted: themeChange() and the saved-theme restore logic from habit.js into initTheme() and applyTheme()
Imports : getItem and setItem from storage.js
app.js Single entry point that load all modules in the correct order on page load
•	Calls checkAndResetDailyTasks(), initUsername(), initTheme(), initModal(), initRemoveHabit(),initImport(),renderHabitGrid(),renderDailyDashboard(), updateWeeklyProgress()
tableTracking.js removed
habit.js (removed ) all logic has been distributed across the five new modules above and no longer loaded by index.html
tableTracking- removed
