
// Javascript program to find the
// next optimal move for a player
class Move {
    constructor() {
        let row, col;
    }
}

let player = 'x', opponent = 'o';
let gCurrSymbol = 'o'
let gBoard = null
function init() {
    gBoard = createMat(3, 3);
    renderMat(gBoard, '.board')
}

// This function returns true if there are moves
// remaining on the board. It returns false if
// there are no moves left to play.
function isMovesLeft(board) {
    for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++)
            if (board[i][j] == '_')
                return true;

    return false;
}

// This is the evaluation function as discussed
// in the previous article ( http://goo.gl/sJgv68 )
function evaluate(b) {

    // Checking for Rows for X or O victory.
    for (let row = 0; row < 3; row++) {
        if (b[row][0] == b[row][1] &&
            b[row][1] == b[row][2]) {
            if (b[row][0] == player)
                return +10;

            else if (b[row][0] == opponent)
                return -10;
        }
    }

    // Checking for Columns for X or O victory.
    for (let col = 0; col < 3; col++) {
        if (b[0][col] == b[1][col] &&
            b[1][col] == b[2][col]) {
            if (b[0][col] == player)
                return +10;

            else if (b[0][col] == opponent)
                return -10;
        }
    }

    // Checking for Diagonals for X or O victory.
    if (b[0][0] == b[1][1] && b[1][1] == b[2][2]) {
        if (b[0][0] == player)
            return +10;

        else if (b[0][0] == opponent)
            return -10;
    }

    if (b[0][2] == b[1][1] &&
        b[1][1] == b[2][0]) {
        if (b[0][2] == player)
            return +10;

        else if (b[0][2] == opponent)
            return -10;
    }

    // Else if none of them have
    // won then return 0
    return 0;
}

// This is the minimax function. It
// considers all the possible ways
// the game can go and returns the
// value of the board
function minimax(board, depth, isMax) {
    let score = evaluate(board);

    // If Maximizer has won the game
    // return his/her evaluated score
    if (score == 10)
        return score;

    // If Minimizer has won the game
    // return his/her evaluated score
    if (score == -10)
        return score;

    // If there are no more moves and
    // no winner then it is a tie
    if (isMovesLeft(board) == false)
        return 0;

    // If this maximizer's move
    if (isMax) {
        let best = -1000;

        // Traverse all cells
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {

                // Check if cell is empty
                if (board[i][j] == '_') {

                    // Make the move
                    board[i][j] = player;

                    // Call minimax recursively
                    // and choose the maximum value
                    best = Math.max(best, minimax(board,
                        depth + 1, !isMax));

                    // Undo the move
                    board[i][j] = '_';
                }
            }
        }
        return best;
    }

    // If this minimizer's move
    else {
        let best = 1000;

        // Traverse all cells
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {

                // Check if cell is empty
                if (board[i][j] == '_') {

                    // Make the move
                    board[i][j] = opponent;

                    // Call minimax recursively and
                    // choose the minimum value
                    best = Math.min(best, minimax(board,
                        depth + 1, !isMax));

                    // Undo the move
                    board[i][j] = '_';
                }
            }
        }
        return best;
    }
}

// This will return the best possible
// move for the player
function findBestMove(board) {
    let bestVal = -1000;
    let bestMove = { row: null, col: null }//new Move();//{row,col}
    bestMove.row = -1;
    bestMove.col = -1;

    // Traverse all cells, evaluate
    // minimax function for all empty
    // cells. And return the cell
    // with optimal value.
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {

            // Check if cell is empty
            if (board[i][j] == '_') {

                // Make the move
                board[i][j] = player;

                // compute evaluation function
                // for this move.
                let moveVal = minimax(board, 0, false);

                // Undo the move
                board[i][j] = '_';

                // If the value of the current move
                // is more than the best value, then
                // update best
                if (moveVal > bestVal) {
                    bestMove.row = i;
                    bestMove.col = j;
                    bestVal = moveVal;
                }
            }
        }
    }

    // document.write("The value of the best Move " +
    //     "is : ", bestVal + "<br><br>");

    return bestMove;
}

function createMat(rows, cols) {
    var mat = [];
    for (var i = 0; i < rows; i++) {
        mat[i] = [];
        for (var j = 0; j < cols; j++) {
            mat[i][j] = '_';
        }
    }
    console.table(mat);
    return mat;
}

function renderMat(mat, selector) {
    var strHTML = '';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = 'cell' + i + '-' + j;
            var loc = {
                i: i, j: j,
                toString() {
                    return this.i + ' ' + this.j
                }
            }
            strHTML += `<td onclick="playTurn(this,'${loc}')" class="${className}"> ${cell} </td>`;
        }
        strHTML += '</tr>';
    }
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}



function playTurn(elCell, loc) {
    if (elCell.innerText !== '_') return
    const nums = loc.split(' ')
    gBoard[+nums[0]][+nums[1]] = gCurrSymbol
    elCell.innerText = gCurrSymbol
    console.log('computer turn!');
    showLoading()
    setTimeout(playComputerTurn, 1000) //playComputerTurn()
}

function showLoading() {
    const elImg = document.querySelector('.load')
    elImg.style.display = 'block';
    setTimeout(() => {
        elImg.style.display = 'none';
    }, 1000)
}

function playComputerTurn() {
    const bestMove = findBestMove(gBoard);
    if (bestMove.row < 0) return
    gBoard[bestMove.row][bestMove.col] = player
    console.table(gBoard)
    const selector = `.cell${bestMove.row}-${bestMove.col}`
    const elCell = document.querySelector(selector)
    elCell.innerText = player
}







