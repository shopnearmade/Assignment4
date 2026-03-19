const cells = document.querySelectorAll(".track");
cells.forEach(cell => {
    cell.dataset.value = 0;
    cell.addEventListener("click", function () {
        if (cell.dataset.value == 0) {
            cell.dataset.value = 1;
            cell.classList.add("done");
        } 
        else {
            cell.dataset.value = 0;
            cell.classList.remove("done");
        }
    });
});
function countHabit(habitName) {
    const cells = document.querySelectorAll(`[data-habit="${habitName}"]`);
    cells.forEach(cell => {
    if(cell.dataset.value == 1){
        countHabit++;
    }
    });
    return countHabit;
}
