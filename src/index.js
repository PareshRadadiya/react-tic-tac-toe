import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={ 'square ' + ( props.isWinner ? 'winner-square' : '' ) } onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(row,column) {
        return (
            <Square
                key={row}
                value={this.props.squares[row]}
                isWinner={ this.props.winner && this.props.winner.indexOf(row) !== -1 }
                onClick={() => this.props.onClick(row,column)}
            />
        );
    }

    render() {
        let row = 0, column = 0;
        let rows = [];
        for ( let i = 0; i < 3; i++) {
            let tempColumn = column;
            let columns = [];
            for ( let j = 0; j < 3; j++) {
                columns.push(this.renderSquare(row,column))
                row++;
                tempColumn = tempColumn + 3;
            }
            rows.push( <div className="board-row" key={i}>{columns}</div>)
            column++;
        }

        return (
            <div>{rows}</div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true,
            isAscOrder: true
        };
    }

    handleClick(row,column) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares [row]) {
            return;
        }

        squares[row] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                row: row,
                column: column
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(e,step) {

        this.setState({
            stepNumber: step,
            xIsNext: ( step % 2 ) === 0
        });
    }

    changeOrder(e) {
        this.setState({
            isAscOrder: ! this.state.isAscOrder
        });
    }

    render() {

        let history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        history = this.state.isAscOrder ? history : history.slice().reverse();

        const moves = history.map((step, index) => {
            let move = this.state.isAscOrder ? index : ( history.length - 1 ) - index;
            const desc = ( this.state.isAscOrder && index ) ||  ( ! this.state.isAscOrder && index !== ( history.length - 1 ) ) ? 'Go to move #' + move + ' ('+ step.row + ',' + step.column +')' : 'Go to game start';
            return (
                <li key={move}>
                    <button className={ move === this.state.stepNumber ? 'selected': ''} onClick={(e) => this.jumpTo(e,move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if ( current.squares.includes(null)) {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        } else {
            if (winner) {
                status = 'Winner ' + ( this.state.xIsNext ? 'O' : 'X' );
            } else {
                status = 'Draw';
            }
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winner={winner}
                        onClick={(row,column) => this.handleClick(row,column)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div className="move-list">
                        <button
                        onClick={(e) => this.changeOrder(e)}
                        >Sort Moves</button>
                        <ol>{moves}</ol>
                    </div>

                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {

    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
            return lines[i];
        }
    }

    return null;
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);
