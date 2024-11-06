const board = [
    [5, 3, '', '', 7, '', '', '', ''],
    [6, '', '', 1, 9, 5, '', '', ''],
    ['', 9, 8, '', '', '', '', 6, ''],
    [8, '', '', '', 6, '', '', '', 3],
    [4, '', '', 8, '', 3, '', '', 1],
    [7, '', '', '', 2, '', '', '', 6],
    ['', 6, '', '', '', '', 2, 8, ''],
    ['', '', '', 4, 1, 9, '', '', 5],
    ['', '', '', '', 8, '', '', 7, 9]
];

// The correct solution to the Sudoku puzzle
const solution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
];


let history = [];
let redoStack = [];

function generateBoard() {
    const boardElement = document.getElementById("sudokuBoard");
    boardElement.innerHTML = "";

    board.forEach((row, i) => {
        row.forEach((value, j) => {
            const cell = document.createElement("input");
            cell.type = "text";
            cell.classList.add("cell");
            if (i % 3 === 0) cell.classList.add("subgrid-border");
            if (j % 3 === 0) cell.classList.add("subgrid-border");
            if (i == 2 || i == 5) {
                cell.classList.add("horizontal-line");
            }
            if (j == 2 || j == 5) {
                cell.classList.add("vertical-line");
            }
            cell.value = value ? value : "";
            cell.readOnly = value ? true : false;
            cell.oninput = () => handleInput(i, j, cell.value);

            boardElement.appendChild(cell);
        });
    });
}

function handleInput(row, col, value) {
    history.push({ row, col, prevValue: board[row][col], newValue: value });
    board[row][col] = parseInt(value) || "";
    redoStack = [];
    checkDuplicates();
}

function checkDuplicates() {
    clearHighlights();

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col]) {
                if (
                    hasDuplicateInRow(row, col) ||
                    hasDuplicateInCol(row, col) ||
                    hasDuplicateInSubgrid(row, col)
                ) {
                    highlightError(row, col);
                }
            }
        }
    }
}

function hasDuplicateInRow(row, col) {
    return board[row].filter((v, idx) => v === board[row][col] && idx !== col).length > 0;
}

function hasDuplicateInCol(row, col) {
    return board.filter((r, idx) => r[col] === board[row][col] && idx !== row).length > 0;
}

function hasDuplicateInSubgrid(row, col) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (board[i][j] === board[row][col] && (i !== row || j !== col)) {
                return true;
            }
        }
    }
    return false;
}

function clearHighlights() {
    document.querySelectorAll(".cell").forEach(cell => cell.classList.remove("highlight"));
}

function highlightError(row, col) {
    const cell = document.querySelector(`#sudokuBoard .cell:nth-child(${row * 9 + col + 1})`);
    cell.classList.add("highlight");
}

function checkSolution() {
    let isCorrect = true;

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const userValue = board[row][col];
            const correctValue = solution[row][col];

            if (userValue !== correctValue) {
                isCorrect = false;
                highlightError(row, col);
            }
        }
    }

    if (isCorrect) {
        document.getElementById("popup").classList.remove("hidden");
        
    } else {
        alert("There are errors in your solution. Please correct them.");
    }
}


function giveHint() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (!board[row][col]) { 
                board[row][col] = solution[row][col]; 
                generateBoard(); 
                return;
            }
        }
    }
}


function undo() {
    if (history.length > 0) {
        const lastMove = history.pop();
        redoStack.push(lastMove);
        board[lastMove.row][lastMove.col] = lastMove.prevValue;
        generateBoard();
    }
}

function redo() {
    if (redoStack.length > 0) {
        const move = redoStack.pop();
        history.push(move);
        board[move.row][move.col] = move.newValue;
        generateBoard();
    }
}

function closePopup() {
    document.getElementById("popup").classList.add("hidden");
}

generateBoard();
