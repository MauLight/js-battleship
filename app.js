
const container = document.querySelector(".option-container");
const flipBtn = document.getElementById("flip-btn");

const flipShip = () => {
    const ships = Array.from(container.children);
    ships.forEach(ship => ship.style.transform = `rotate(90deg)`)
}

flipBtn.addEventListener("click", flipShip);