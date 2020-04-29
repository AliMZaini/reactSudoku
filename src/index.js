import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Puzzle{
    constructor(puzzle_string) {
        this.puzzle = this.getPuzzleFromString(puzzle_string);
    }

    getPuzzleFromString = (str) => {
        let puzzle_str_arr = str.split("");
        puzzle_str_arr.forEach((sqr_value, index) => {
            var value;
            sqr_value === "." ? value = 0 : value = parseInt(sqr_value);
            puzzle_str_arr[index] = value;
        });
        return puzzle_str_arr;
    }

    getPuzzle = () => {
        return this.puzzle;
    }

    getRow = (row_index) => {
        return this.puzzle.slice(row_index * 9, (row_index + 1) * 9);
    }

    getRows = () => {
        var allRows = [];
        for(var i = 0; i < Math.sqrt(this.puzzle.length); i++){
            allRows.push(this.getRow(i));
        }
        return allRows;
    }

    changeCell = (newValue, index) => {
        console.log(newValue, index);
        this.puzzle[index] = newValue;
    }

}

class Cell extends React.Component{
    constructor() {
        super();
    }

    onChange = (event) =>{
        this.props.cellChange(event.target.value, this.props.index)
    }

    render() {
        var cell_value = this.props.value;
        return (
                <input
                    id={this.props.index}
                    type="text"
                    value={cell_value === 0 ? " " : cell_value}
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

        this.changeCell = this.changeCell.bind(this);

    }

    getPuzzleFromString = (str) => {
        let puzzle_str_arr = str.split("");
        puzzle_str_arr.forEach((sqr_value, index) => {
            var value;
            sqr_value === "." ? value = 0 : value = parseInt(sqr_value);
            puzzle_str_arr[index] = value;
        });
        return puzzle_str_arr;
    }

    getRow = (row_index) => {
        return this.state.puzzle.slice(row_index * 9, (row_index + 1) * 9);
    }

    getRows = () => {
        var allRows = [];
        for(var i = 0; i < Math.sqrt(this.state.puzzle.length); i++){
            allRows.push(this.getRow(i));
        }
        return allRows;
    }

    changeCell = (newValue, index) => {
        console.log(newValue, index);
        var puzzleCopy = this.state.puzzle.split();
        puzzleCopy[index] = newValue;
        this.setState({
            puzzle: puzzleCopy
        })
    }

    render() {
        // TODO validate the string is valid format (length and the characters it contains)
        console.log(this.state.puzzle);
        console.log(this.getRow(8));

        return (
            <div>
                <table>
                    <tbody>
                    {this.getRows().map(function(row, row_index) {
                        return (
                            <tr key={row_index}>
                                {row.map(function (cell_value, cell_index) {
                                    return (
                                        <Cell
                                            value = {cell_value}
                                            index = {row_index * 9 + cell_index}
                                            cellChange = {(a, b) => this.changeCell(a, b)}
                                        />
                                    )
                                })}
                            </tr>
                        )})
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}

ReactDOM.render(
    <Main puzzle="...26.7.168..7..9.19...45..82.1...4...46.29...5...3.28..93...74.4..5..367.3.18..."/>,
    document.getElementById('root')
);