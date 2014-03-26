This is a <a href="http://en.wikipedia.org/wiki/Conway's_Game_of_Life">Conway's Game of Life</a> that I put together in order to teach myself Javascript.  When I started this project, the only things I knew about Javascript were basic things like variables, loops, etc.  I had to teach myself jQuery and how to use canvas in order to get this thing off the ground.

The game is simple.  Click on cells to turn them black or white.  Then, click "start" and the cells will live or die according to a set of rules:

1. Any live cell with fewer than two live neighbours dies, as if caused by under-population.
2. Any live cell with two or three live neighbours lives on to the next generation.
3. Any live cell with more than three live neighbours dies, as if by overcrowding.
4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

From these simple rules, complicated outcomes can arise.

The speed control slider bar is from the jQuery UI library.

Note: This is actually version 2 of the game.  I got the idea to make this game when I ran across an exercise for building a table in HTML using Javascript that would display a checkerboard with specifiable dimensions.  The idea was to fill in each table cell with either a black or white background, while iterating through and laying out the table.  I took this idea and expanded it into version 1.  It was composed of an enormous table, and I used jQuery to grab inputs and change the cell contents.  It ran like molasses, as you might imagine.  But once I had that working, it didn't take long to rewrite the interface in canvas.
