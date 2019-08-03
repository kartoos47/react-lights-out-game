import React, { Component, Fragment } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {
  static defaultProps = {
    nrows: 5,
    ncols: 5,
    chanceLightStartsOn: 0.25
  };

  constructor(props) {
    super(props);
    this.state = {
      hasWon: false,
      board: this.createBoard()
    };
    this.flipCellsAround = this.flipCellsAround.bind(this);
    this.restartGame = this.restartGame.bind(this);
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */

  createBoard() {
    let board = [];
    // TODO: create array-of-arrays of true/false values
    for (let y = 0; y < this.props.nrows; y++) {
      let row = [];
      for (let x = 0; x < this.props.ncols; x++) {
        row.push(Math.random() < this.props.chanceLightStartsOn);
      }
      board.push(row);
    }
    return board;
  }

  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(coord) {
    let { ncols, nrows } = this.props;
    let newBoard = [...this.state.board];
    let [y, x] = coord.split("-").map(Number);

    const flipCell = (y, x) => {
      // if this coord is actually on board, flip it

      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        newBoard[y][x] = !newBoard[y][x];
      }
    };

    flipCell(y, x); //Flip initial cell
    flipCell(y, x - 1); //Flip left
    flipCell(y, x + 1); // Flip right
    flipCell(y - 1, x); // Flip below
    flipCell(y + 1, x); // Flip above

    // TODO: flip this cell and the cells around it

    // win when every cell is turned off
    // TODO: determine is the game has been won

    const hasWon = newBoard.every(row => row.every(cell => !cell));

    this.setState({ board: newBoard, hasWon: hasWon });
  }

  restartGame() {
    this.setState({
      hasWon: false,
      board: this.createBoard()
    });
  }

  /** Render game board or winning message. */

  render() {
    // if the game is won, just show a winning msg & render nothing else
    if (this.state.hasWon) {
      return (
        <Fragment>
          <div className="board-title">
            <div className="winner">
              <span className="neon-orange">You</span>
              <span className="neon-blue">Won</span>
            </div>
          </div>

          <button className="restart-btn" onClick={this.restartGame}>
            Play Again
          </button>
        </Fragment>
      );
    }

    let tblBoard = this.state.board.map((item, index) => (
      <tr key={index}>
        {item.map((val, idx) => (
          <Cell
            key={`${index}-${idx}`}
            position={`${index}-${idx}`}
            isLit={val}
            flipCellsAroundMe={this.flipCellsAround}
          />
        ))}
      </tr>
    ));

    return (
      <div>
        <div className="board-title">
          <div className="neon-orange">Lights</div>
          <div className="neon-blue">Out</div>
        </div>
        <table className="Board">
          <tbody>{tblBoard}</tbody>
        </table>
      </div>
    );
  }
}

export default Board;
