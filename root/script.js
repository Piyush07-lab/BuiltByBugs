// Script file here
// document.querySelector(`.mainTwo`).addEventListener(`click`, function() {
//     this.classList.toggle(`expanded`);
// });

document.getElementById("middleToggle").addEventListener("click", () => {
    document.getElementById("middleToggle").classList.toggle("expanded");
});

const mainTwo = document.getElementbyId("middleToggle");
const toggleBar = document.getElementById("toggleBar");

toggleBar.addEventListener("click", () => {
    mainTwo.classList.toggle("expanded");
});

// console.log(`Script is runnung!`);
