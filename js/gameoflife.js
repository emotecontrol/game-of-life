/* Game of Life */

var running = false;
var numrows = 40;
var numcols = 60;
var initialized = false;
var board = new Array();
var timer;
var slidevalue = 250;
var countcell = 0;

var Cell = function(x,y) {
	// Cells know their location, and whether they're alive
	this.cellindex = countcell++;
	this.xcoord=x;
	this.ycoord=y;
	this.mycount=0;
	this.alive=false;
	this.lastalive=false;
	this.be_alive = (function(bool) {
		if (bool==true)
			{
			
			this.alive=true;
			}
		if (bool==false)
			{
			
			this.alive=false;
			}
		});
}

function checklife(cell){
	/* get the location and status of a cell */
	var x = cell.xcoord;
	var y = cell.ycoord;
	var isalive = cell.alive;
	var count = 0;
	/* check adjacent cells for life */
	for (var i = -1; i<2; i++){
		for (var j = -1; j<2; j++){
			if (x+i < 0 || x+i >= numcols || y+j < 0 || y+j >= numrows)
				{/* do nothing, because that cell is off the board*/}
			else if (i==0 && j==0)
				{/* do nothing, it's the cell you're working with */}
			
			else 
				{
				/* if the adjacent cell is alive, add to the count */
				if (board[x+i][y+j].lastalive==true && board[x+i][y+j].cellindex < cell.cellindex || board[x+i][y+j].alive==true && board[x+i][y+j].cellindex > cell.cellindex)
					{count++;}
				}
			}
		}
	/* have the cell store the count of ajdacent alive cells */
	cell.mycount = count;
	}

function update_life(cell){
	//alert(cell.cellindex);
	cell.lastalive = cell.alive;
	if (cell.mycount < 2 || cell.mycount > 3)
		{
		cell.be_alive(false);
		}
	else if (cell.mycount == 2 || (cell.mycount == 3 && cell.alive == true))
		{
		/* do not change alive */
		}
	else
		{
		cell.be_alive(true);
		}
	}
	
function initcells(){
	/* create a 2D array of Cell objects */
	var new_board = new Array(numcols);
		for (var k=0; k < numcols; k++){
			new_board[k] = new Array(numrows);
			}
	for (var i=0; i<numrows; i++) {
		for (var j=0; j<numcols; j++){
			new_board[j][i] = new Cell(j,i);
			}
		}
	initialized = true;
	return new_board;
	}

function start_life(is_running){
	// Toggle the boolean var "running", which tells the game whether it is currently running
	if (is_running == false)
		{is_running = true;}
	else
		{is_running = false;}
	return is_running;
	}

function draw_game(){
	
	// set up the canvas
	var grid = document.getElementById("grid");
	var width = 660;
	var height = 440;
	var backgroundColor = "rgb(255,255,255)";
	grid.setAttribute("width", width);
	grid.setAttribute("height", height);
	var ctx = grid.getContext('2d');
	
	// draw the board
	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0,0,width, height);
	
	// draw the grid
	ctx.strokeStyle = "rgb(0,0,0)";
	for (var i=11-0.5; i<=660; i+=11){
		ctx.beginPath();
		ctx.moveTo(i, 0);
		ctx.lineTo(i, 440);
		ctx.stroke();
		}
	for(var j=11-0.5; j<=440; j+=11){
		ctx.beginPath();
		ctx.moveTo(0, j);
		ctx.lineTo(660, j);
		ctx.stroke();
		}

	
	}


function update_cells(cell){
	// iterate through table cells and change their colour depending on whether they're alive
	
	for (row=0; row<numrows; row++){
		for (col=0; col<numcols; col++){
			cell = board[col][row];
			checklife(cell);
			update_life(cell);
			paintCell(cell);
			}
		}	
	}


function main(){
	// initialize the board
	board = initcells();
	// and draw it
	draw_game();
	// then run through the board once to initialize each cell
	update_cells();
	}


//get position of mouse relative to canvas
function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}

    //to get useful coords:
    //coords = canvas.relMouseCoords(event);
	//canvasX = coords.x;
	//canvasY = coords.y;
}
//add relMouseCoords to the canvas prototype for convenience
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

//colour in cells based on whether they're alive or not.
function paintCell(cell){
	var grid = document.getElementById("grid");
	var ctx = grid.getContext('2d');
	gridx = cell.xcoord;
	gridy = cell.ycoord;
	//alert(cell.cellindex);
	ctx.fillStyle = (cell.alive ? "#000" : "#FFF");
	ctx.fillRect(gridx*11, gridy*11, 10, 10);
}

//retrieve a cell based on the x and y position of the mouse
function getCell(x, y){
	//figure out which cell we're in
	cellx = Math.floor(x/11);
	celly = Math.floor(y/11);
	//grab that cell and return it
	cell = board[cellx][celly];
	return cell;
}

//toggle the aliveness of a cell
function changeCell(cell){
	if (cell.alive == true){
            	cell.be_alive(false)
            	paintCell(cell);
            } else {
            	cell.be_alive(true)
            	paintCell(cell);
            }
}

//unbind things that could change the state of a cell until the next time you mousedown
function finishCellPaint(canvas){
	$(canvas).unbind("mousemove")
	.unbind("mouseup")
	.unbind("mouseout");
}

$(document).ready(function()
	{
	
	$("#startbutton").click(function(){
		// If the game is not running, start iterating run_board every 0.25 sec, else stop the game
		if (!running)
			{
			$(this).val("Stop");
			startTime = Date.now();
			running = start_life(running);
			timer = setInterval(update_cells, slidevalue);
			}
		else
			{
			$(this).val("Start");
			running = start_life(running);
			clearInterval(timer);
			}
		});
	
	// A button with the label "Iterate" moves the game one step forward
	$("#iter_button").click(function(){
		if(!running)
			{
			update_cells();
			}
		});
	
	// A button with the label "Clear" sets all the cells to white
	$("#clearbutton").click(function(){
		// stop the game
		if (running)
			$("#startbutton").trigger("click");
		for (rows=0; rows<numrows; rows++)
			{
			for (cols=0; cols<numcols; cols++)
				{
				/* grab the cell from each col/row index and make it dead */
				cell = board[cols][rows];
				cell.be_alive(false);
				}
			}
		//redraw the board to clear it
		draw_game();
		});

	$("#invertbutton").click(function(){
		for (rows=0; rows<numrows; rows++)
			{
			for (cols=0; cols<numcols; cols++)
				{
				/* grab the cell from each col/row index and make it dead */
				cell = board[cols][rows];
				changeCell(cell);
				}
			}
	})

	// change a cell from alive to dead when you click it...
	$("#grid").mousedown(function (event) {
            coords = this.relMouseCoords(event);
            cell = getCell(coords.x, coords.y);
            oldcell = cell;
            changeCell(cell);
            
        	// ...and when you mouse over it while holding down the button
            $(this).mousemove(function (event) {
            	coords = this.relMouseCoords(event);
            	newcell = getCell(coords.x, coords.y);
            	if (newcell !== oldcell){
            		oldcell = newcell;
            		changeCell(oldcell);
            	}
            }).mouseup(function (event) {
            	finishCellPaint(document.getElementById("grid"))
            }).mouseout(function (event) {
            	finishCellPaint(document.getElementById("grid"))
            });
        });

	$(function(){
		// initialize slider bar
		$("#speedslide" ).slider({ 
			animate: "fast", 
			min: -0.50,
			max: 0.00,
			step: 0.01,
			value: -0.25,
			slide: setSpeed,
			change: setSpeed
			});
		});

		// set the speed of the game to the speed of the slider
		function setSpeed(){
			slidevalue = (Math.floor(1000*(Math.abs($("#speedslide").slider("value")).toFixed(2))));
			//$("#speedtext").val(100-slidevalue);
			if (running)
				{
				clearInterval(timer);
				timer = setInterval(update_cells, slidevalue)
				}
			}

	// Start everything by calling main()	
		main();
		
	});






