const boardsContainer = document.getElementById("gameboard-container");
const container = document.querySelector(".option-container");
const flipBtn = document.getElementById("flip-btn");
const startButton = document.getElementById("start-btn");
const infoDisplay = document.getElementById('info');
const turnDisplay = document.getElementById('turn-display');

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
const battleship = new Ship('battleship', 4);
const carrier = new Ship('carrier', 5);

let notDropped;

const handleValidity = (allBoardBlocks, isHorizontal, startIndex, ship) => {
    let validStart = isHorizontal ? startIndex <= boardSize - ship.length ? startIndex : boardSize - ship.length :
        // handle vertical
        startIndex <= boardSize - (width * ship.length) ? startIndex : startIndex - (ship.length * width) + width;

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


    return { shipBlocks, valid, notTaken };
}

const ships = [destroyer, submarine, cruiser, battleship, carrier];

const addShip = (user, ship, startId) => {
    const allBoardBlocks = document.querySelectorAll(`#${user} div`);
    let randomBoolean = Math.random() < 0.5;
    let isHorizontal = user === 'player' ? angle === 0 : randomBoolean;
    let randomStartIndex = Math.floor(Math.random() * (boardSize));

    let startIndex = startId ? startId : randomStartIndex;

    const { shipBlocks, valid, notTaken } = handleValidity(allBoardBlocks, isHorizontal, startIndex, ship);

    if (valid && notTaken) {
        shipBlocks.forEach(shipBlock => {
            shipBlock.classList.add(ship.name);
            shipBlock.classList.add('taken');
        });
    } else {
        if (user === 'AI') addShip(user, ship, startId);
        if (user === 'player') notDropped = true;
    }


    console.log(shipBlocks);
}

ships.forEach(ship => addShip('AI', ship));


//addShip(destroyer);

//Drag player ships


let draggedShip
const dragStart = (e) => {
    notDropped = false;
    console.log(e.target);
    draggedShip = e.target;
}

const dragOver = (e) => {
    e.preventDefault();
    const ship = ships[draggedShip.id];
    highlightArea(e.target.id, ship);
}

const dropShip = (e) => {
    const startId = e.target.id;
    const ship = ships[draggedShip.id];
    addShip('player', ship, startId);
    if (!notDropped) {
        draggedShip.remove();
    }
}


const optionShips = Array.from(container.children);
optionShips.forEach(item => item.addEventListener('dragstart', dragStart));

const allPlayerBlocks = document.querySelectorAll('#player div');
allPlayerBlocks.forEach(block => block.addEventListener('dragover', dragOver));
allPlayerBlocks.forEach(block => block.addEventListener('drop', dropShip));

//Add highlight

const highlightArea = (startIndex, ship) => {
    const allPlayerBlocks = document.querySelectorAll('#player div');
    let isHorizontal = angle === 0;

    const { shipBlocks, valid, notTaken } = handleValidity(allPlayerBlocks, isHorizontal, startIndex, ship);

    if (valid && notTaken) {
        shipBlocks.forEach(block => {
            block.classList.add('hover');
            setTimeout(() => block.classList.remove('hover'), 500);
        })
    }

}

//Start game

let gameOver = false;
let playerTurn;

const startGame = () => {

    if (playerTurn === undefined) {
        if (container.children.length != 0) {
            infoDisplay.textContent = "Place your pieces first!";
        }
        else {
            const allAiBlocks = document.querySelectorAll('#AI div');
            allAiBlocks.forEach(block => block.addEventListener('click', handleClick));
            playerTurn = true;
            turnDisplay.textContent = 'GO!';
            infoDisplay.textContent = 'The game has started!';
        }
    }
}

startButton.addEventListener('click', startGame);

let playerHits = [];
let aiHits = [];
const playerSunkShips = [];
const aiSunkShips = [];

const handleClick = (e) => {
    if (!gameOver) {
        if (e.target.classList.contains('taken')) {
            e.target.classList.add('boom');
            infoDisplay.textContent = "That's a hit! AI ship has taken damage.";
            let classes = Array.from(e.target.classList);
            classes = classes.filter(className => className !== 'game-block');
            classes = classes.filter(className => className !== 'boom');
            classes = classes.filter(className => className !== 'taken');
            playerHits.push(...classes);
            checkScore('player', playerHits, playerSunkShips);
        }
        if (!e.target.classList.contains('taken')) {
            infoDisplay.textContent = "You missed!";
            e.target.classList.add('empty');
        }
        playerTurn = false;
        const allBoardBlocks = document.querySelectorAll("#AI div");
        allBoardBlocks.forEach(block => block.replaceWith(block.cloneNode(true))); //Remove eventListeners from items.
        setTimeout(aiGo, 3000);
    }
}

// Define AI go

const aiGo = () => {
    if (!gameOver) {
        turnDisplay.textContent = "AI's turn!";
        infoDisplay.textContent = "AI is thinking...";
        setTimeout(() => {
            let randomGo = Math.floor(Math.random() * boardSize);
            const allPlayerBlocks = document.querySelectorAll('#player div');

            if (allPlayerBlocks[randomGo].classList.contains('taken') && allPlayerBlocks[randomGo].classList.contains('boom')) {
                aiGo();
                return;
            }
            else if (allPlayerBlocks[randomGo].classList.contains('taken') && !allPlayerBlocks[randomGo].classList.contains('boom')) {
                allPlayerBlocks[randomGo].classList.add('boom');
                infoDisplay.textContent = "AI just hit your ship!";
                let classes = Array.from(allPlayerBlocks[randomGo].classList);
                classes = classes.filter(className => className !== 'block');
                classes = classes.filter(className => className !== 'boom');
                classes = classes.filter(className => className !== 'taken');
                aiHits.push(...classes);
                checkScore('AI', aiHits, aiSunkShips);
            }
            else {
                infoDisplay.textContent = "AI missed!";
                allPlayerBlocks[randomGo].classList.add('empty');
            }
        }, 3000);

        setTimeout(() => {
            playerTurn = true;
            turnDisplay.textContent = "It's your turn.";
            infoDisplay.textContent = "Attack your enemy!";
            const allAiBlocks = document.querySelectorAll('#AI div');
            allAiBlocks.forEach(block => block.addEventListener('click', handleClick));
        }, 6000);
    }
}

const checkScore = (user, hits, sunkShips) => {

    const checkShip = (shipName, shipLength) => {
        if (hits.filter(hitShip => hitShip === shipName).length === shipLength) {
            infoDisplay.textContent = `You just sunk ${user}'s ${shipName}`;
            if (user === 'player') {
                playerHits = hits.filter(hitShip => hitShip !== shipName);
            }
            if (user === 'AI') {
                aiHits = hits.filter(hitShip => hitShip !== shipName);
            }

            sunkShips.push(shipName);
        }
    }

    checkShip('destroyer', 2);
    checkShip('submarine', 3);
    checkShip('cruiser', 3);
    checkShip('battleship', 4);
    checkShip('carrier', 5);


    if (playerSunkShips.length === 5) {
        infoDisplay.textContent = "You sunk all the AI's ships! YOU WON!";
        gameOver = true;
    }
    if (aiSunkShips.length === 5) {
        infoDisplay.textContent = "AI sunk all of your ships! AI WON!";
        gameOver = true;
    }

};




