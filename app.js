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
const boardSize = width * width;

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
    let randomBoolean = Math.random() < 0.5;
    let isHorizontal = randomBoolean;
    let randomStartIndex = Math.floor(Math.random() * (boardSize));

    let validStart = isHorizontal ? randomStartIndex <= boardSize - ship.length ? randomStartIndex : boardSize - ship.length :
        // handle vertical
        randomStartIndex <= boardSize - (width * ship.length) ? randomStartIndex : randomStartIndex - (ship.length * width) + width;

    console.log(validStart);

    let shipBlocks = [];

    for (let i = 0; i < ship.length; i++) {
        if (isHorizontal) {
            shipBlocks.push(allBoardBlocks[Number(validStart) + i]);
        } else {
            shipBlocks.push(allBoardBlocks[Number(validStart) + (i * width)]);
        }
    }

    let valid

    if (isHorizontal) {
        shipBlocks.every((_shipBlock, index) =>
            valid = shipBlocks[0].id % width !== width - (shipBlocks.length - (index + 1)))
    } else {
        shipBlocks.every((_shipBlock, index) =>
            valid = shipBlocks[0].id < 90 + (width * index + 1))
    }

    const notTaken = shipBlocks.every(shipBlock => !shipBlock.classList.contains('taken'));

    if (valid && notTaken) {
        shipBlocks.forEach(shipBlock => {
            shipBlock.classList.add(ship.name);
            shipBlock.classList.add('taken');
        });
    } else {
        addShip(ship);
    }


    console.log(shipBlocks);
}

ships.forEach(ship => addShip(ship));


addShip(destroyer);

//Drag player ships

let draggedShip
const dragStart = (e) => {
    console.log(e.target);
    draggedShip = e.target;
}
const optionShips = Array.from(container.children);
optionShips.forEach(item => item.addEventListener('dragstart', dragStart));


