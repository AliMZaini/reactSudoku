# reactSudoku
Sudoku in React

This is an iteration on my previous implementation of sudoku in JS, which you can see [here](https://github.com/zaini/jsudoku).

This time you can actually solve the puzzle yourself, import/export the board or have it automatically solved.

You can try it here: https://old.zaini.me/reactSudoku/

# Things to add

* Custom board sizes/difficulty

* Randomly generate/load puzzles

* Validate board strings properly

* Make it not look ugly af

* Redo all the code so it's actually usable

# About

The solver uses a simple backtracking algorithm from here: https://see.stanford.edu/materials/icspacs106b/Lecture11.pdf

You can read more about the algorithm here: https://en.wikipedia.org/wiki/Sudoku_solving_algorithms

Most the code is identical to the JS implementation, this just includes a UI and some additional features that are enabled by including a parser.
