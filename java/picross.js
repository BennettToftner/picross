//Structural variables
var canvas = document.getElementById("game-canvas");
var CANVAS_X = canvas.offsetLeft;
var CANVAS_Y = canvas.offsetTop;
var ctx = canvas.getContext('2d');
var DELAY = 20;

//Solution variables
var CORRECT_CHANCE = 70;
var solution = [];

//Grid and square variables
var SQUARE_SIZE = 40;
var GRID_HEIGHT = 10;
var GRID_WIDTH = 10;
var GRID_X = 200;
var GRID_Y = 200;
var GRID_SPACING = 2;
var GRID_X_MAX = GRID_X + (SQUARE_SIZE * GRID_WIDTH) + (GRID_SPACING * GRID_WIDTH * 2);
var GRID_Y_MAX = GRID_Y + (SQUARE_SIZE * GRID_HEIGHT) + (GRID_SPACING * GRID_HEIGHT * 2);
var grid = [];

//Number text variables
var TEXT_SIZE = SQUARE_SIZE;
var TEXT_APPENDIX = "px Helvetica";
var TEXT_FONT = TEXT_SIZE + TEXT_APPENDIX;
var topNums = [];
var sideNums = [];

var topMarked = [];
var sideMarked = [];

//Winning variables
var win = false;
var winner = document.getElementById("winner-text");

//Debug variables
var debug = document.getElementById("debug-text");

//Main program
fillGrid();
makeSolution();
getNums();
setInterval(drawGrid, DELAY);
canvas.addEventListener('click', setVisibility, false);
//End main program

function getMarkableNums()
{
    topMarked.length = 0;
    for (var r = 0; r < topNums.length; r++)
    {
        topMarked.push([]);
        var n = 0;
        for (var c = 0; c < topNums[r].length; c++)
        {
            if(grid[r][c].state == "invisible")
            {
                if(n != 0)
                {
                    if(topNums[r].indexOf(n) > 0 && Math.max(topNums[r]) == n)
                    {
                        topMarked[r].push(n);
                    }
                    else if((topNums[r].indexOf(n) == 0 && c - n * 2 <= 0) || (topNums[r].indexOf(n) == topNums[r].length - 1 && c + n - 1 >= GRID_HEIGHT))
                    {
                        topMarked[r].push(n);
                    }
                    //all are complete - new function?
                    n = 0;
                }
            }
            else
            {
                n++;
            }
        }
    }
}

function getNums()
{
    //topNums filled
    for (var r = 0; r < GRID_WIDTH; r++)
    {
        topNums.push([]);
        var n = 0;
        for (var c = 0; c < GRID_HEIGHT; c++)
        {
            if(solution[r][c] == false)
            {
                if(n != 0)
                {
                    topNums[r].push(n);
                    n = 0;
                }
            }
            else
            {
                n++;
            }
        }
        if(n != 0)
        {
            topNums[r].push(n);
            n = 0;
        }
    }

    //sideNums filled
    for (var r = 0; r < GRID_HEIGHT; r++)
    {
        sideNums.push([]);
        n = 0;
        for (var c = 0; c < GRID_WIDTH; c++)
        {
            if(solution[c][r] == false)
            {
                if(n != 0)
                {
                    sideNums[r].push(n);
                    n = 0;
                }
            }
            else
            {
                n++;
            }
        }
        if(n != 0)
        {
            sideNums[r].push(n);
            n = 0;
        }
    }
}

//HERE: do marking things
function displayNums()
{
    //topNums displayed
    var x = GRID_X + GRID_SPACING
    for (var r = 0; r < topNums.length; r++)
    {
        var y = GRID_Y - GRID_SPACING * 2;
        for (var c = topNums[r].length - 1; c >= 0; c--)
        {
            var mark = false;
            debug.innerHTML = topMarked[c];
            if(topMarked.indexOf(c) >= 0)
            {
                mark = true;
            }
            drawNumber(topNums[r][c], x, y, mark);
            y -= TEXT_SIZE;
        }
        x += SQUARE_SIZE + (GRID_SPACING * 2);
    }

    //sideNums displayed
    y = GRID_Y + GRID_SPACING * 2 + TEXT_SIZE;
    for (var r = 0; r < sideNums.length; r++)
    {
        x = GRID_X - TEXT_SIZE;
        for (var c = sideNums[r].length - 1; c >= 0; c--)
        {
            drawText(sideNums[r][c], x, y);
            x -= TEXT_SIZE;
        }
        y += TEXT_SIZE + (GRID_SPACING * 2);
    }

}

function setVisibility(e)
{
    var x = e.pageX - CANVAS_X;
    var y = e.pageY - CANVAS_Y;
    var xPos = -1;
    var yPos = -1;

    var curX = GRID_X;
    var c = -1;
    while (curX <= x && curX <= GRID_X_MAX)
    {
        curX += (GRID_SPACING * 2) + SQUARE_SIZE;
        c++;
    }
    xPos = c;

    var curY = GRID_Y;
    c = -1;
    while (curY <= y && curY <= GRID_Y_MAX)
    {
        curY += (GRID_SPACING * 2) + SQUARE_SIZE;
        c++;
    }
    yPos = c;

    if (xPos > -1 && xPos < grid.length && yPos > -1 && yPos < grid[0].length)
    {
        if(grid[xPos][yPos].state == "visible")
        {
            grid[xPos][yPos].state = "x";
        }
        else if(grid[xPos][yPos].state == "x")
        {
            grid[xPos][yPos].state = "invisible"
        }
        else
        {
            grid[xPos][yPos].state = "visible"
        }
    }
    checkGrid();
    getMarkableNums();
}

function checkGrid()
{
    for (var r = 0; r < GRID_WIDTH; r++)
    {
        for(var c = 0; c < GRID_HEIGHT; c++)
        {
            if((grid[r][c].state == "visible") != solution[r][c])
            {
                return;
            }
        }
    }
    winner.innerHTML = "You win!";
}

function fillGrid()
{
    for(var r = 0; r < GRID_WIDTH; r++)
    {
        grid.push([]);
        for (var c = 0; c < GRID_HEIGHT; c++)
        {
            var gridSquare = 
            {
                size: SQUARE_SIZE,
                color: "#000000",
                x: GRID_X + (GRID_SPACING * ((2 * r) + 1)) + (r * SQUARE_SIZE),
                y: GRID_Y + (GRID_SPACING * ((2 * c) + 1)) + (c * SQUARE_SIZE),
                state: "invisible"
            };
            grid[r].push(gridSquare);
        }
    }
}

function makeSolution()
{
    for (var r = 0; r < GRID_WIDTH; r++)
    {
        solution.push([]);
        for(var c = 0; c < GRID_HEIGHT; c++)
        {
            var bool = false;
            var rand = Math.floor(Math.random() * 100) + 1;
            if (rand <= CORRECT_CHANCE)
            {
                bool = true;
            }
            solution[r].push(bool);
        }
    }
    
}

function drawText(txt, x, y)
{
    var tempFont = TEXT_FONT;
    if(txt == "X")
    {
        tempFont = (TEXT_SIZE * 1.2) + TEXT_APPENDIX;
    }
    ctx.font = tempFont;
    ctx.fillText(txt, x, y);
}

function drawNumber(txt, x, y, mark)
{
    var tempFont = TEXT_FONT;
    if (txt >= 10)
    {
        tempFont = (TEXT_SIZE * 0.8) + TEXT_APPENDIX;
    }
    if(mark)
    {
        ctx.fillStyle = "red";
    }
    ctx.font = tempFont;
    ctx.fillText(txt, x, y);
}

function drawSquare(square)
{
    ctx.fillStyle = square.color;
    ctx.fillRect(square.x, square.y, square.size, square.size);
}

function drawGridLine(x, y, x1, y1)
{
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}

function drawGrid()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var r = 0; r < GRID_WIDTH; r++)
    {
        
        for (var c = 0; c < GRID_HEIGHT; c++)
        {
            drawGridLine(GRID_X, GRID_Y + (SQUARE_SIZE * c) + (GRID_SPACING * c * 2), GRID_X + (SQUARE_SIZE * GRID_WIDTH) + (GRID_SPACING * GRID_WIDTH * 2), GRID_Y + (SQUARE_SIZE * c) + (GRID_SPACING * c * 2));
            drawGridLine(GRID_X + (SQUARE_SIZE * r) + (GRID_SPACING * r * 2), GRID_Y, GRID_X + (SQUARE_SIZE * r) + (GRID_SPACING * r * 2), GRID_Y + (SQUARE_SIZE * GRID_HEIGHT) + (GRID_SPACING * GRID_HEIGHT * 2));
            if (grid[r][c].state == "visible")
            {
                drawSquare(grid[r][c]);
            }
            else if (grid[r][c].state == "x")
            {
                drawText("X" , grid[r][c].x, grid[r][c].y + SQUARE_SIZE);
            }
        }
        
    }
    //Bottom and rightmost line
    drawGridLine(GRID_X, GRID_Y_MAX, GRID_X_MAX, GRID_Y_MAX);
    drawGridLine(GRID_X_MAX, GRID_Y, GRID_X_MAX, GRID_Y_MAX);
    displayNums();
}
