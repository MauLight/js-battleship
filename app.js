const boardsContainer = document.getElementById("gameboard-container");
const container = document.querySelector(".option-container");
const flipBtn = document.getElementById("flip-btn");

//Option choosing
let angle = 0;
const flipShip = () => {
    const ships = Array.from(container.children);
    angle = angle === 0 ? angle = 90 : angle = 0;

    ships.forEach(ship => ship.style.transform = `rotate(${angle}deg)`)
}

flipBtn.addEventListener("click", flipShip);

//Creating boards
const width = 10

const createBoard = (color, user) => {
    const boardContainer = document.createElement("div");
    boardContainer.classList.add('game-board');
    boardContainer.style.backgroundColor = color;
    boardContainer.id = user;

    for (let i = 0; i < width * width; i++) {
        const block = document.createElement('div');
        block.classList.add('game-block');
        block.id = i;
        boardContainer.append(block);
    }

    boardsContainer.append(boardContainer);
}

createBoard("tomato", 'player');
createBoard("pink", 'AI');

//Creating ships
class Ship {
    constructor(name, length) {
        this.name = name;
        this.length = length;
    }
};

const destroyer = new Ship('destroyer', 2);
const submarine = new Ship('submarine', 3);
const cruiser = new Ship('cruiser', 3);
const battleship = new Ship('battlership', 4);
const carrier = new Ship('carrier', 5);

console.log(destroyer);

const ships = [destroyer, submarine, cruiser, battleship, carrier];

const addShip = (ship) => {
    const allBoardBlocks = document.querySelectorAll('#AI div');
    let randomBoolean = Match.random() < 0.5;
    let isHorizontal = true;
    let randomStartIndex = Math.floor(Math.random() * (width * width));
    console.log(randomStartIndex);

    for (let i = 0; i < ship.length; i++) {
        if(isHorizontal) {
            console.log(allBoardBlocks[number(randomStartIndex) + i]);
        }
    }
}

addShip(destroyer);