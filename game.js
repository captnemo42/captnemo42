var kBoardWidth = 7;
var kBoardHeight = 7;
var kPieceWidth = 100;
var kPieceHeight = 100;
var kPixelWidth = 1 + (kBoardWidth * kPieceWidth);
var kPixelHeight = 1 + (kBoardHeight * kPieceHeight);

var gCanvasElement;
var gDrawingContext;
var gPattern;

var gPieces;
var gNumPieces;
var gSelectedPieceIndex;
var gSelectedPieceHasMoved;
var gMoveCount;
var gMoveCountElem;
var gGameInProgress;

function Cell(row, column) {
    this.row = row;
    this.column = column;
}

function getCursorPosition(e) {
    /* returns Cell with .row and .column properties */
    var x;
    var y;
    if (e.pageX != undefined && e.pageY != undefined) {
        x = e.pageX;
        y = e.pageY;
    }
    else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= gCanvasElement.offsetLeft;
    y -= gCanvasElement.offsetTop;
    x = Math.min(x, kBoardWidth * kPieceWidth);
    y = Math.min(y, kBoardHeight * kPieceHeight);
    var cell = new Cell(Math.floor(y / kPieceHeight), Math.floor(x / kPieceWidth));
    return cell;
}

function gameOnClick(e) {
    var cell = getCursorPosition(e);
    for (var i = 0; i < gNumPieces; i++) {
        if ((gPieces[i].row == cell.row) &&
            (gPieces[i].column == cell.column)) {
            clickOnPiece(i);
            return;
        }
    }
    clickOnEmptyCell(cell);
}

// ********************************************
function clickOnEmptyCell(cell) {
    if (gMoveCount < gNumPieces) // player hasn't finished placing pieces
    {        
        if (cell.row == 0 || cell.row ==6)
           if ((cell.column == 1) || (cell.column == 2) || (cell.column == 4) || (cell.column == 5) )
               return;
        if (cell.column == 0 || cell.column == 6)
            if ((cell.row == 1) || (cell.row == 2) || (cell.row == 4) || (cell.row == 5))
                return;
        if (cell.row == 1 || cell.row == 5)
            if ( (cell.column == 2) || (cell.column == 4) )
                return;
        if (cell.column == 1 || cell.column == 5)
            if ((cell.row == 2) || (cell.row == 4))
                return;
        gSelectedPieceIndex = gMoveCount;
        gPieces[gSelectedPieceIndex].row = cell.row;
        gPieces[gSelectedPieceIndex].column = cell.column;
        gMoveCount += 1;
        gSelectedPieceIndex = -1;
        gSelectedPieceHasMoved = false;
        drawBoard();
        return;
    }
    if (gSelectedPieceIndex == -1) { return; }
    var rowDiff = Math.abs(cell.row - gPieces[gSelectedPieceIndex].row);
    var columnDiff = Math.abs(cell.column - gPieces[gSelectedPieceIndex].column);
    
    if (rowDiff > 1) 
        if ( gPieces[gSelectedPieceIndex].column == 3)
            return;
    if (columnDiff > 1)
        if (gPieces[gSelectedPieceIndex].row == 3)
            return;

    if ((rowDiff == 1) && (columnDiff == 1))
    {
        if(gPieces[gSelectedPieceIndex].column == 1 || gPieces[gSelectedPieceIndex].column ==5 )
            if ((gPieces[gSelectedPieceIndex].row == gPieces[gSelectedPieceIndex].column)
                || (gPieces[gSelectedPieceIndex].column == 1 && gPieces[gSelectedPieceIndex].row == 5)
                ||( gPieces[gSelectedPieceIndex].column=5 &&  gPieces[gSelectedPieceIndex].row==1) ){
                gPieces[gSelectedPieceIndex].row = cell.row;
                gPieces[gSelectedPieceIndex].column = cell.column;
                gMoveCount += 1;
                gSelectedPieceIndex = -1;
                gSelectedPieceHasMoved = false;
                drawBoard();
                return;
            }

    }
    if ( (rowDiff == 1) && (columnDiff < 1)         
        && (gPieces[gSelectedPieceIndex].column != 0 ) 
        && (gPieces[gSelectedPieceIndex].column !=6 )
        && (gPieces[gSelectedPieceIndex].row != 0)
        && (gPieces[gSelectedPieceIndex].row != 6)
        && (gPieces[gSelectedPieceIndex].row != 1)
        && (gPieces[gSelectedPieceIndex].row != 5)
        && (gPieces[gSelectedPieceIndex].column != 1)
        && (gPieces[gSelectedPieceIndex].column != 5)
        )
    {
        /* we already know that this click was on an empty square,
           so that must mean this was a valid single-square move */
        gPieces[gSelectedPieceIndex].row = cell.row;
        gPieces[gSelectedPieceIndex].column = cell.column;
        gMoveCount += 1;
        gSelectedPieceIndex = -1;
        gSelectedPieceHasMoved = false;
        drawBoard();
        return;
    }
    if ((rowDiff == 1) && (columnDiff == 1) && (gPieces[gSelectedPieceIndex].row == 0)&& (gPieces[gSelectedPieceIndex].column == 0)) {
        gPieces[gSelectedPieceIndex].row = cell.row;
        gPieces[gSelectedPieceIndex].column = cell.column;
        gMoveCount += 1;
        gSelectedPieceIndex = -1;
        gSelectedPieceHasMoved = false;
        drawBoard();
        return;

    }
    if ((rowDiff == 1) && (columnDiff == 1) && (gPieces[gSelectedPieceIndex].row == 6) && (gPieces[gSelectedPieceIndex].column == 0)) {
        gPieces[gSelectedPieceIndex].row = cell.row;
        gPieces[gSelectedPieceIndex].column = cell.column;
        gMoveCount += 1;
        gSelectedPieceIndex = -1;
        gSelectedPieceHasMoved = false;
        drawBoard();
        return;

    }
    if ((rowDiff == 1) && (columnDiff == 1) && (gPieces[gSelectedPieceIndex].row == 6) && (gPieces[gSelectedPieceIndex].column == 6)) {
        gPieces[gSelectedPieceIndex].row = cell.row;
        gPieces[gSelectedPieceIndex].column = cell.column;
        gMoveCount += 1;
        gSelectedPieceIndex = -1;
        gSelectedPieceHasMoved = false;
        drawBoard();
        return;

    }
    if ((rowDiff == 1) && (columnDiff == 1) && (gPieces[gSelectedPieceIndex].row == 0) && (gPieces[gSelectedPieceIndex].column == 6)) {
        gPieces[gSelectedPieceIndex].row = cell.row;
        gPieces[gSelectedPieceIndex].column = cell.column;
        gMoveCount += 1;
        gSelectedPieceIndex = -1;
        gSelectedPieceHasMoved = false;
        drawBoard();
        return;

    }
    if ((rowDiff == 0) && (columnDiff == 1) && (gPieces[gSelectedPieceIndex].row == 3)  ) {
        gPieces[gSelectedPieceIndex].row = cell.row;
        gPieces[gSelectedPieceIndex].column = cell.column;
        gMoveCount += 1;
        gSelectedPieceIndex = -1;
        gSelectedPieceHasMoved = false;
        drawBoard();
        return;

    }
    if ((rowDiff == 1) && (columnDiff == 0) && (gPieces[gSelectedPieceIndex].column == 3)) {
        gPieces[gSelectedPieceIndex].row = cell.row;
        gPieces[gSelectedPieceIndex].column = cell.column;
        gMoveCount += 1;
        gSelectedPieceIndex = -1;
        gSelectedPieceHasMoved = false;
        drawBoard();
        return;

    }
    if ((rowDiff < 1) && (columnDiff == 1)
        && (gPieces[gSelectedPieceIndex].column != 0)
        && (gPieces[gSelectedPieceIndex].column != 6)
        && (gPieces[gSelectedPieceIndex].row != 0)
        && (gPieces[gSelectedPieceIndex].row != 6)
        && (gPieces[gSelectedPieceIndex].row != 1)
        && (gPieces[gSelectedPieceIndex].row != 5)
        && (gPieces[gSelectedPieceIndex].column != 1)
        && (gPieces[gSelectedPieceIndex].column != 5)
        ) {
        /* we already know that this click was on an empty square,
           so that must mean this was a valid single-square move */
        gPieces[gSelectedPieceIndex].row = cell.row;
        gPieces[gSelectedPieceIndex].column = cell.column;
        gMoveCount += 1;
        gSelectedPieceIndex = -1;
        gSelectedPieceHasMoved = false;
        drawBoard();
        return;
    }
    
    if ((rowDiff == 3) && (columnDiff ==0) ) 
        if ((gPieces[gSelectedPieceIndex].column == 0) || (gPieces[gSelectedPieceIndex].column == 6) || (gPieces[gSelectedPieceIndex].column == 3))
    {
        gPieces[gSelectedPieceIndex].row = cell.row;
        gPieces[gSelectedPieceIndex].column = cell.column;
        gMoveCount += 1;
        gSelectedPieceIndex = -1;
        gSelectedPieceHasMoved = false;
        drawBoard();
        return;
    }
    if ((rowDiff == 0) && (columnDiff ==3) ) 
        if ((gPieces[gSelectedPieceIndex].row == 6) || (gPieces[gSelectedPieceIndex].row == 0) || (gPieces[gSelectedPieceIndex].row == 3))
        {
            gPieces[gSelectedPieceIndex].row = cell.row;
            gPieces[gSelectedPieceIndex].column = cell.column;
            gMoveCount += 1;
            gSelectedPieceIndex = -1;
            gSelectedPieceHasMoved = false;
            drawBoard();
            return;
        }
    if ((rowDiff == 2) && (columnDiff == 0))
        if ((gPieces[gSelectedPieceIndex].column == 1) || (gPieces[gSelectedPieceIndex].column == 5) || (gPieces[gSelectedPieceIndex].column == 3)) {
            gPieces[gSelectedPieceIndex].row = cell.row;
            gPieces[gSelectedPieceIndex].column = cell.column;
            gMoveCount += 1;
            gSelectedPieceIndex = -1;
            gSelectedPieceHasMoved = false;
            drawBoard();
            return;
        } 
    if ((rowDiff == 0) && (columnDiff == 2))
        if ((gPieces[gSelectedPieceIndex].row == 1) || (gPieces[gSelectedPieceIndex].row == 5) || (gPieces[gSelectedPieceIndex].row == 3)) {
            gPieces[gSelectedPieceIndex].row = cell.row;
            gPieces[gSelectedPieceIndex].column = cell.column;
            gMoveCount += 1;
            gSelectedPieceIndex = -1;
            gSelectedPieceHasMoved = false;
            drawBoard();
            return;
        } 
           
    gSelectedPieceIndex = -1;
    gSelectedPieceHasMoved = false;
    drawBoard();
}

// **************************************************************
function clickOnPiece(pieceIndex) {
    if (gMoveCount >= gNumPieces) {
        if (gSelectedPieceIndex == pieceIndex) { return; }
        gSelectedPieceIndex = pieceIndex;
        gSelectedPieceHasMoved = false;
        drawBoard();
    }
    else {
        gSelectedPieceIndex = gMoveCount;
        return;
    }
}

// **************************************************************
function isThereAPieceBetween(cell1, cell2) {
    /* note: assumes cell1 and cell2 are 2 squares away
       either vertically, horizontally, or diagonally */
    var rowBetween = (cell1.row + cell2.row) / 2;
    var columnBetween = (cell1.column + cell2.column) / 2;
    for (var i = 0; i < gNumPieces; i++) {
        if ((gPieces[i].row == rowBetween) &&
            (gPieces[i].column == columnBetween)) {
            return true;
        }
    }
    return false;
}

function isTheGameOver() {
    for (var i = 0; i < gNumPieces; i++) {
        if (gPieces[i].row > 2) {
            return false;
        }
        if (gPieces[i].column < (kBoardWidth - 3)) {
            return false;
        }
    }
    return true;
}


function drawBoard() {
    if (gGameInProgress && isTheGameOver()) {
        endGame();
    }
    gDrawingContext.clearRect(0, 0, kPixelWidth, kPixelHeight);
    gDrawingContext.beginPath();
    /* vertical lines */
    for (var x = 0; x <= kPixelWidth; x += kPieceWidth) {
        gDrawingContext.moveTo(0.5 + x, 0);
        gDrawingContext.lineTo(0.5 + x, kPixelHeight);
    }
    /* horizontal lines */
    for (var y = 0; y <= kPixelHeight; y += kPieceHeight) {
        gDrawingContext.moveTo(0, 0.5 + y);
        gDrawingContext.lineTo(kPixelWidth, 0.5 + y);
    }
    /* draw it! */
    gDrawingContext.strokeStyle = "#ccc";
    gDrawingContext.stroke();
    for (var i = 0; i < gNumPieces; i++) {
        drawPiece(gPieces[i], i == gSelectedPieceIndex);
    }
    window.document.OptionsForm.Moves.value = gMoveCount;
    saveGameState();
}


function drawPiece(p, selected) {
    var column = p.column;
    var row = p.row;
    var x = (column * kPieceWidth) + (kPieceWidth / 3);
    var y = (row * kPieceHeight) + (kPieceHeight / 3);
    var radius = (kPieceWidth / 3) - (kPieceWidth / 10);
    gDrawingContext.beginPath();
    gDrawingContext.arc(x, y, radius, 0, Math.PI * 2, false);
    gDrawingContext.closePath();
    gDrawingContext.strokeStyle = "#000";
    gDrawingContext.stroke();
    gDrawingContext.fillStyle = "#fff";
    gDrawingContext.fill();
    if (selected) {
        gDrawingContext.fillStyle = "#00ff00";
        gDrawingContext.fill();
    }
}

if (typeof resumeGame != "function") {
    saveGameState = function () {
        return false;
    }
    resumeGame = function () {
        return false;
    }
}

function newGame() {
    gPieces = [
           new Cell(kBoardHeight - 0, 0),
	       new Cell(kBoardHeight - 0, 0),
	       new Cell(kBoardHeight - 0, 0),
	       new Cell(kBoardHeight - 0, 0),
	       new Cell(kBoardHeight - 0, 0),
	       new Cell(kBoardHeight - 0, 0),
	       new Cell(kBoardHeight - 0, 0),
	       new Cell(kBoardHeight - 0, 0),
           new Cell(kBoardHeight - 0, 0),
	       new Cell(kBoardHeight - 0, 0),
	       new Cell(kBoardHeight - 0, 0),
	       new Cell(kBoardHeight - 0, 0)
    ];

    gNumPieces = gPieces.length;
    gSelectedPieceIndex = -1;
    gSelectedPieceHasMoved = false;
    gMoveCount = 0;
    gGameInProgress = true;
    comp_newGame();
    drawBoard();
}

function endGame() {
    gSelectedPieceIndex = -1;
    gGameInProgress = false;
}

function initGame(canvasElement, moveCountElement) {
    if (!canvasElement) {
        canvasElement = document.createElement("canvas");
        canvasElement.id = "board";
        document.body.appendChild(canvasElement);
        //var background = new Image();
        //background.src = "board.png";
    }
    if (!moveCountElement) {
        moveCountElement = document.createElement("p");
        document.body.appendChild(moveCountElement);
    }
    gCanvasElement = canvasElement;
    gCanvasElement.width = kPixelWidth;
    gCanvasElement.height = kPixelHeight;
    gCanvasElement.addEventListener("click", gameOnClick, false);
    gMoveCountElem = moveCountElement;
    gDrawingContext = gCanvasElement.getContext("2d");
    if (!resumeGame()) {
        newGame();
    }
}

// ***********************************************************************************
//************************************************************************************


var comp_kBoardWidth = 7;
var comp_kBoardHeight = 7;
var comp_kPieceWidth = 100;
var comp_kPieceHeight = 100;
var comp_kPixelWidth = 1 + (kBoardWidth * comp_kPieceWidth);
var comp_kPixelHeight = 1 + (comp_kBoardHeight * comp_kPieceHeight);

var gCanvasElement;
var gDrawingContext;
var gPattern;

var comp_gPieces;
var comp_gNumPieces;
var comp_gSelectedPieceIndex;
var comp_gSelectedPieceHasMoved;
var comp_gMoveCount;
var comp_gMoveCountElem;
var comp_gGameInProgress;



// ********************************************
function comp_clickOnEmptyCell(cell) {
    if (comp_gMoveCount < comp_gNumPieces) // player hasn't finished placing pieces
    {
        if (cell.row == 0 || cell.row == 6)
            if ((cell.column == 1) || (cell.column == 2) || (cell.column == 4) || (cell.column == 5))
                return;
        if (cell.column == 0 || cell.column == 6)
            if ((cell.row == 1) || (cell.row == 2) || (cell.row == 4) || (cell.row == 5))
                return;
        if (cell.row == 1 || cell.row == 5)
            if ((cell.column == 2) || (cell.column == 4))
                return;
        if (cell.column == 1 || cell.column == 5)
            if ((cell.row == 2) || (cell.row == 4))
                return;
        comp_gSelectedPieceIndex = comp_gMoveCount;
        comp_gPieces[comp_gSelectedPieceIndex].row = cell.row;
        comp_gPieces[comp_gSelectedPieceIndex].column = cell.column;
        comp_gMoveCount += 1;
        comp_gSelectedPieceIndex = -1;
        comp_gSelectedPieceHasMoved = false;
        drawBoard();
        return;
    }
    if (comp_gSelectedPieceIndex == -1) { return; }
    var rowDiff = Math.abs(cell.row - comp_gPieces[comp_gSelectedPieceIndex].row);
    var columnDiff = Math.abs(cell.column - comp_gPieces[comp_gSelectedPieceIndex].column);

    if (rowDiff > 1)
        if (comp_gPieces[comp_gSelectedPieceIndex].column == 3)
            return;
    if (columnDiff > 1)
        if (comp_gPieces[comp_gSelectedPieceIndex].row == 3)
            return;

    if ((rowDiff == 1) && (columnDiff == 1)) {
        if (comp_gPieces[comp_gSelectedPieceIndex].column == 1 || comp_gPieces[comp_gSelectedPieceIndex].column == 5)
            if ((comp_gPieces[comp_gSelectedPieceIndex].row == comp_gPieces[comp_gSelectedPieceIndex].column)
                || (comp_gPieces[comp_gSelectedPieceIndex].column == 1 && comp_gPieces[comp_gSelectedPieceIndex].row == 5)
                || (comp_gPieces[comp_gSelectedPieceIndex].column = 5 && comp_gPieces[comp_gSelectedPieceIndex].row == 1)) {
                comp_gPieces[comp_gSelectedPieceIndex].row = cell.row;
                comp_gPieces[comp_gSelectedPieceIndex].column = cell.column;
                comp_gMoveCount += 1;
                comp_gSelectedPieceIndex = -1;
                comp_gSelectedPieceHasMoved = false;
                drawBoard();
                return;
            }

    }
    if ((rowDiff == 1) && (columnDiff < 1)
        && (comp_gPieces[comp_gSelectedPieceIndex].column != 0)
        && (comp_gPieces[comp_gSelectedPieceIndex].column != 6)
        && (comp_gPieces[comp_gSelectedPieceIndex].row != 0)
        && (comp_gPieces[comp_gSelectedPieceIndex].row != 6)
        && (comp_gPieces[comp_gSelectedPieceIndex].row != 1)
        && (comp_gPieces[comp_gSelectedPieceIndex].row != 5)
        && (comp_gPieces[comp_gSelectedPieceIndex].column != 1)
        && (comp_gPieces[comp_gSelectedPieceIndex].column != 5)
        ) {
        /* we already know that this click was on an empty square,
           so that must mean this was a valid single-square move */
        comp_gPieces[comp_gSelectedPieceIndex].row = cell.row;
        comp_gPieces[comp_gSelectedPieceIndex].column = cell.column;
        comp_gMoveCount += 1;
        comp_gSelectedPieceIndex = -1;
        comp_gSelectedPieceHasMoved = false;
        drawBoard();
        return;
    }
    if ((rowDiff == 1) && (columnDiff == 1) && (comp_gPieces[comp_gSelectedPieceIndex].row == 0) && (comp_gPieces[comp_gSelectedPieceIndex].column == 0)) {
        comp_gPieces[comp_gSelectedPieceIndex].row = cell.row;
        comp_gPieces[comp_gSelectedPieceIndex].column = cell.column;
        comp_gMoveCount += 1;
        comp_gSelectedPieceIndex = -1;
        comp_gSelectedPieceHasMoved = false;
        drawBoard();
        return;

    }
    if ((rowDiff == 1) && (columnDiff == 1) && (comp_gPieces[comp_gSelectedPieceIndex].row == 6) && (comp_gPieces[comp_gSelectedPieceIndex].column == 0)) {
        comp_gPieces[comp_gSelectedPieceIndex].row = cell.row;
        comp_gPieces[comp_gSelectedPieceIndex].column = cell.column;
        comp_gMoveCount += 1;
        comp_gSelectedPieceIndex = -1;
        comp_gSelectedPieceHasMoved = false;
        drawBoard();
        return;

    }
    if ((rowDiff == 1) && (columnDiff == 1) && (comp_gPieces[comp_gSelectedPieceIndex].row == 6) && (comp_gPieces[comp_gSelectedPieceIndex].column == 6)) {
        comp_gPieces[comp_gSelectedPieceIndex].row = cell.row;
        comp_gPieces[comp_gSelectedPieceIndex].column = cell.column;
        comp_gMoveCount += 1;
        comp_gSelectedPieceIndex = -1;
        comp_gSelectedPieceHasMoved = false;
        drawBoard();
        return;

    }
    if ((rowDiff == 1) && (columnDiff == 1) && (comp_gPieces[comp_gSelectedPieceIndex].row == 0) && (comp_gPieces[comp_gSelectedPieceIndex].column == 6)) {
        comp_gPieces[comp_gSelectedPieceIndex].row = cell.row;
        comp_gPieces[comp_gSelectedPieceIndex].column = cell.column;
        comp_gMoveCount += 1;
        comp_gSelectedPieceIndex = -1;
        comp_gSelectedPieceHasMoved = false;
        drawBoard();
        return;

    }
    if ((rowDiff == 0) && (columnDiff == 1) && (comp_gPieces[comp_gSelectedPieceIndex].row == 3)) {
        comp_gPieces[comp_gSelectedPieceIndex].row = cell.row;
        comp_gPieces[comp_gSelectedPieceIndex].column = cell.column;
        comp_gMoveCount += 1;
        comp_gSelectedPieceIndex = -1;
        comp_gSelectedPieceHasMoved = false;
        drawBoard();
        return;

    }
    if ((rowDiff == 1) && (columnDiff == 0) && (comp_gPieces[comp_gSelectedPieceIndex].column == 3)) {
        comp_gPieces[comp_gSelectedPieceIndex].row = cell.row;
        comp_gPieces[comp_gSelectedPieceIndex].column = cell.column;
        comp_gMoveCount += 1;
        comp_gSelectedPieceIndex = -1;
        comp_gSelectedPieceHasMoved = false;
        drawBoard();
        return;

    }
    if ((rowDiff < 1) && (columnDiff == 1)
        && (comp_gPieces[comp_gSelectedPieceIndex].column != 0)
        && (comp_gPieces[comp_gSelectedPieceIndex].column != 6)
        && (comp_gPieces[comp_gSelectedPieceIndex].row != 0)
        && (comp_gPieces[comp_gSelectedPieceIndex].row != 6)
        && (comp_gPieces[comp_gSelectedPieceIndex].row != 1)
        && (comp_gPieces[comp_gSelectedPieceIndex].row != 5)
        && (comp_gPieces[comp_gSelectedPieceIndex].column != 1)
        && (comp_gPieces[comp_gSelectedPieceIndex].column != 5)
        ) {
        /* we already know that this click was on an empty square,
           so that must mean this was a valid single-square move */
        comp_gPieces[comp_gSelectedPieceIndex].row = cell.row;
        comp_gPieces[comp_gSelectedPieceIndex].column = cell.column;
        comp_gMoveCount += 1;
        comp_gSelectedPieceIndex = -1;
        comp_gSelectedPieceHasMoved = false;
        drawBoard();
        return;
    }

    if ((rowDiff == 3) && (columnDiff == 0))
        if ((comp_gPieces[comp_gSelectedPieceIndex].column == 0) || (comp_gPieces[comp_gSelectedPieceIndex].column == 6) || (comp_gPieces[comp_gSelectedPieceIndex].column == 3)) {
            comp_gPieces[comp_gSelectedPieceIndex].row = cell.row;
            comp_gPieces[comp_gSelectedPieceIndex].column = cell.column;
            comp_gMoveCount += 1;
            comp_gSelectedPieceIndex = -1;
            comp_gSelectedPieceHasMoved = false;
            drawBoard();
            return;
        }
    if ((rowDiff == 0) && (columnDiff == 3))
        if ((comp_gPieces[comp_gSelectedPieceIndex].row == 6) || (comp_gPieces[comp_gSelectedPieceIndex].row == 0) || (comp_gPieces[comp_gSelectedPieceIndex].row == 3)) {
            comp_gPieces[comp_gSelectedPieceIndex].row = cell.row;
            comp_gPieces[comp_gSelectedPieceIndex].column = cell.column;
            comp_gMoveCount += 1;
            comp_gSelectedPieceIndex = -1;
            comp_gSelectedPieceHasMoved = false;
            drawBoard();
            return;
        }
    if ((rowDiff == 2) && (columnDiff == 0))
        if ((comp_gPieces[comp_gSelectedPieceIndex].column == 1) || (comp_gPieces[comp_gSelectedPieceIndex].column == 5) || (comp_gPieces[comp_gSelectedPieceIndex].column == 3)) {
            comp_gPieces[comp_gSelectedPieceIndex].row = cell.row;
            comp_gPieces[comp_gSelectedPieceIndex].column = cell.column;
            comp_gMoveCount += 1;
            comp_gSelectedPieceIndex = -1;
            comp_gSelectedPieceHasMoved = false;
            drawBoard();
            return;
        }
    if ((rowDiff == 0) && (columnDiff == 2))
        if ((comp_gPieces[comp_gSelectedPieceIndex].row == 1) || (comp_gPieces[comp_gSelectedPieceIndex].row == 5) || (comp_gPieces[comp_gSelectedPieceIndex].row == 3)) {
            comp_gPieces[comp_gSelectedPieceIndex].row = cell.row;
            comp_gPieces[comp_gSelectedPieceIndex].column = cell.column;
            comp_gMoveCount += 1;
            comp_gSelectedPieceIndex = -1;
            comp_gSelectedPieceHasMoved = false;
            drawBoard();
            return;
        }

    comp_gSelectedPieceIndex = -1;
    comp_gSelectedPieceHasMoved = false;
    drawBoard();
}

// **************************************************************
function comp_clickOnPiece(pieceIndex) {
    if (comp_gMoveCount >= comp_gNumPieces) {
        if (comp_gSelectedPieceIndex == pieceIndex) { return; }
        comp_gSelectedPieceIndex = pieceIndex;
        comp_gSelectedPieceHasMoved = false;
        drawBoard();
    }
    else {
        comp_gSelectedPieceIndex = comp_gMoveCount;
        return;
    }
}

// **************************************************************


function comp_drawPiece(p, selected) {
    var column = p.column;
    var row = p.row;
    var x = (column * comp_kPieceWidth) + (comp_kPieceWidth / 3);
    var y = (row * comp_kPieceHeight) + (comp_kPieceHeight / 3);
    var radius = (comp_kPieceWidth / 3) - (comp_kPieceWidth / 10);
    gDrawingContext.beginPath();
    gDrawingContext.arc(x, y, radius, 0, Math.PI * 2, false);
    gDrawingContext.closePath();
    gDrawingContext.strokeStyle = "#000";
    gDrawingContext.stroke();
    gDrawingContext.fillStyle = "#000";
    gDrawingContext.fill();
    if (selected) {
        gDrawingContext.fillStyle = "#00ff00";
        gDrawingContext.fill();
    }
}

if (typeof resumeGame != "function") {
    saveGameState = function () {
        return false;
    }
    resumeGame = function () {
        return false;
    }
}

function comp_newGame() {
    comp_gPieces = [
          new Cell(comp_kBoardHeight - 0, 0),
          new Cell(comp_kBoardHeight - 0, 0),
          new Cell(comp_kBoardHeight - 0, 0),
          new Cell(comp_kBoardHeight - 0, 0),
          new Cell(comp_kBoardHeight - 0, 0),
          new Cell(comp_kBoardHeight - 0, 0),
          new Cell(comp_kBoardHeight - 0, 0),
          new Cell(comp_kBoardHeight - 0, 0),
          new Cell(comp_kBoardHeight - 0, 0),
          new Cell(comp_kBoardHeight - 0, 0),
          new Cell(comp_kBoardHeight - 0, 0),
          new Cell(comp_kBoardHeight - 0, 0)
    ];

    comp_gNumPieces = comp_gPieces.length;
    comp_gSelectedPieceIndex = -1;
    comp_gSelectedPieceHasMoved = false;
    comp_gMoveCount = 0;
    comp_gGameInProgress = true;
    drawBoard();
}



