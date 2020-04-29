import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Cell extends React.Component {
    onChange = (event) => {
        this.props.cellChange(event.target.value, this.props.index)
    }

    render() {
        var cell_value = this.props.value;
        return (
            <input
                id={this.props.index}
                type="text"
                value={cell_value === 0 ? "" : cell_value}
                onChange={this.onChange.bind(this)}
            />
        )
    }
}

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            puzzle: this.getPuzzleFromString(this.props.puzzle)
        };
    }

    cellParser = (value) => {
        return isNaN(parseInt(value)) ? 0 : (0 < parseInt(value) && parseInt(value) < 10 ? parseInt(value) : 0);
    }

    getPuzzleFromString = (str) => {
        let puzzle_str_arr = str.split("");
        puzzle_str_arr.forEach((sqr_value, index) => {
            var value;
            sqr_value === "." ? value = 0 : value = this.cellParser(sqr_value);
            puzzle_str_arr[index] = value;
        });
        return puzzle_str_arr;
    }

    getRow = (row_index) => {
        return this.state.puzzle.slice(row_index * 9, (row_index + 1) * 9);
    }

    getRows = () => {
        var allRows = [];
        for (var i = 0; i < Math.sqrt(this.state.puzzle.length); i++) {
            allRows.push(this.getRow(i));
        }
        return allRows;
    }

    changeCell = (newValue, index) => {
        var puzzleCopy = this.state.puzzle.slice();
        puzzleCopy[index] = this.cellParser(newValue);
        this.setState({
            puzzle: puzzleCopy
        })
    }

    clear = () => {
        var puzzleCopy = this.state.puzzle.slice();
        puzzleCopy.forEach((value, index) => {
            puzzleCopy[index] = 0;
        });
        this.setState({
            puzzle: puzzleCopy
        })
    }

    // THESE METHODS NEED TO BE MOVED
    getOccurances(array, query) {
        return array.filter((e) => (e === query)).length;
    }

    // checks there are no duplicates in an array, where duplicate nulls are allowed
    checkNoDuplicates(array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] !== 0 && this.getOccurances(array, array[i]) !== 1) return false;
        }
        return true;
    }

    getRow(rowNumber, board) {
        return board.slice(rowNumber * 9, (rowNumber * 9) + 9);
    }

    checkRow(rowNumber, board) {
        return this.checkNoDuplicates(this.getRow(rowNumber, board));
    }

    getColumn(colNumber, board) {
        var column = [];
        for (var i = 0; i < 9; i++) {
            var row = this.getRow(i, board);
            column.push(row[colNumber]);
        }
        return column;
    }

    checkColumn(colNumber, board) {
        return this.checkNoDuplicates(this.getColumn(colNumber, board));
    }

    // disgusting
    getSubgrid(gridNumber, board) {
        var subGrid = [];

        var gridRows = [];

        if ([0, 1, 2].includes(gridNumber)) {
            gridRows.push(this.getRow(0, board));
            gridRows.push(this.getRow(1, board));
            gridRows.push(this.getRow(2, board));
        }
        if ([3, 4, 5].includes(gridNumber)) {
            gridRows.push(this.getRow(3, board));
            gridRows.push(this.getRow(4, board));
            gridRows.push(this.getRow(5, board));
        }
        if ([6, 7, 8].includes(gridNumber)) {
            gridRows.push(this.getRow(6, board));
            gridRows.push(this.getRow(7, board));
            gridRows.push(this.getRow(8, board));
        }

        if ([0, 3, 6].includes(gridNumber)) {
            for (let i = 0; i < gridRows.length; i++) {
                gridRows[i].slice(0, 3).forEach((e) => subGrid.push(e));
            }
        }
        if ([1, 4, 7].includes(gridNumber)) {
            for (let i = 0; i < gridRows.length; i++) {
                gridRows[i].slice(3, 6).forEach((e) => subGrid.push(e));
            }
        }
        if ([2, 5, 8].includes(gridNumber)) {
            for (let i = 0; i < gridRows.length; i++) {
                gridRows[i].slice(6, 9).forEach((e) => subGrid.push(e));
            }
        }
        return subGrid;
    }

    checkSubgrid(gridNumber, board) {
        return this.checkNoDuplicates(this.getSubgrid(gridNumber, board));
    }

    // returns true if the board is in a valid state
    checkBoard(board) {
        for (var i = 0; i < 9; i++) {
            if (!this.checkRow(i, board) || !this.checkColumn(i, board) || !this.checkSubgrid(i, board)) return false;
        }
        return true;
    }

    findEmptyIndex(board) {
        for (var i = 0; i < board.length; i++) {
            if (board[i] === 0) return i;
        }
        return -1;
    }

    solve(board) {
        var emptyIndex = this.findEmptyIndex(board);
        if (emptyIndex === -1) return true;

        for (var value = 1; value < 10; value++) {
            if (this.checkBoard(board)) {
                board[emptyIndex] = value;
                if (this.solve(board) && this.checkBoard(board)) {
                    this.setState({
                        puzzle: board
                    });
                    return true;
                }
                board[emptyIndex] = 0;
            }
        }
        return false;
    }

    onKeyPress = (event) => {
        if (event.key === "Enter") {
            var string = event.target.value;
            if (string.length === 81) {
                var puzzleCopy = this.getPuzzleFromString(string);
                this.setState({
                    puzzle: puzzleCopy
                })
            }
        }
    }

    render() {
        let solved = this.checkBoard(this.state.puzzle) && this.state.puzzle.indexOf(0) === -1;
        var solved_style = {
            color: solved ? "green" : "red"
        };
        return (
            <div>
                <h1>reactSudoku</h1>

                <table>
                    <tbody>
                    {this.getRows().map((row, row_index) => {
                        return (
                            <tr key={row_index}>
                                {row.map((cell_value, cell_index) => {
                                    return (
                                        <td key={row_index * 9 + cell_index}>
                                            <Cell
                                                value={cell_value}
                                                index={row_index * 9 + cell_index}
                                                cellChange={(a, b) => this.changeCell(a, b)}
                                            />
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })
                    }
                    </tbody>
                </table>

                <div className="settings">
                    <h2 style={solved_style}>
                        {solved ? "SOLVED" : "NOT SOLVED"}
                    </h2>

                    <br/>

                    <button onClick={() => this.solve(this.state.puzzle)}>Solve</button>
                    <button onClick={() => this.clear()}>Clear</button>

                    <br/>

                    <textarea className="board-showcase"
                              type="input"
                              placeholder="Enter puzzle here..."
                              onKeyPress={this.onKeyPress.bind(this)}
                    />

                    <br/>
                    Current Board
                    <br/>

                    <textarea className="board-showcase" value={this.state.puzzle.join("").replace(/0/g, ".")}/>
                </div>
            </div>
        );
    }
}

// TODO have more puzzles to return
let getRandomPuzzle = () => {
    return "...26.7.168..7..9.19...45..82.1...4...46.29...5...3.28..93...74.4..5..367.3.18...";
}

ReactDOM.render(
    <Main puzzle={getRandomPuzzle()}/>,
    document.getElementById('root')
);