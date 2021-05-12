import React from 'react'
import {render} from 'react-dom'

import {winningRows} from './Data'
    
const doWeHaveWinner = (board, xoro) => {
    
    const winningIx = winningRows.findIndex((c) =>  {
        return board[c[0]] == xoro && board[c[1]] == xoro && board[c[2]] == xoro;
    });
    
    
    if(winningIx !== -1) {
        return winningRows[winningIx];
    }
    
    return false;
}

const computerGetSmartMove = (board, xoro) => {
    const cellPoints = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    const xo = xoro == 'x' ? 'o' : 'x';
    
    winningRows.forEach((c) => {
        const cString = board[ c[0] ].toString() + board[ c[1] ].toString() + board[ c[2] ].toString();
        
        // MAX
        if(cString.indexOf('0') !== -1 && cString.indexOf(xo) === -1) {
            
            if(board[c[0]] === 0 && board[c[1]] == xoro && board[c[2]] == xoro) {
                cellPoints[c[0]] += 1000;
            } else if(board[c[0]] === 0 && (board[c[1]] == xoro || board[c[2]] == xoro)) {
                cellPoints[c[0]] += 10;
            } else if(board[c[0]] === 0) {
                cellPoints[c[0]] += 1;
            }
            
            if(board[c[1]] === 0 && board[c[0]] == xoro && board[c[2]] == xoro) {
                cellPoints[c[1]] += 1000;
            } else if(board[c[1]] === 0 && (board[c[0]] == xoro || board[c[2]] == xoro)) {
                cellPoints[c[1]] += 10;
            } else if(board[c[1]] === 0) {
                cellPoints[c[1]] += 1;
            }
            
            if(board[c[2]] === 0 && board[c[1]] == xoro && board[c[0]] == xoro) {
                cellPoints[c[2]] += 1000;
            } else if(board[c[2]] === 0 && (board[c[1]] == xoro || board[c[0]] == xoro)) {
                cellPoints[c[2]] += 10;
            } else if(board[c[2]] === 0) {
                cellPoints[c[2]] += 1;
            }
        }
        
        // MIN
        if(cString.indexOf('0') !== -1 && cString.indexOf(xoro) === -1) {
            if(board[c[0]] === 0 && board[c[1]] == xo && board[c[2]] == xo) {
                cellPoints[c[0]] += 100;
            }
            
            if(board[c[1]] === 0 && board[c[0]] == xo && board[c[2]] == xo) {
                cellPoints[c[1]] += 100;
            }
            
            if(board[c[2]] === 0 && board[c[1]] == xo && board[c[0]] == xo) {
                cellPoints[c[2]] += 100;
            }
        }
    });
    
    const maxCell = Math.max(...cellPoints);
    return maxCell ? cellPoints.indexOf(maxCell) : board.indexOf(0);
}

class TicTacToe extends React.Component {
  
    constructor() {
        super();
        
        this.state = {
            started: false,
            finished: false,
            xoro: 'x',
            whowon: null,
            whoseTurn: 'player', 
            board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            wins: {
                x: 0,
                o: 0
            }
        };
    }
    
    componentDidMount() {
        const {started, whoseTurn} = this.state;

        (!started && whoseTurn == 'computer' && this.computerMakeMove());
    }
    
    restartGame() {
        
        this.setState({
            started: false,
            finished: false,
            xoro: 'x',
            whowon: null,
            whoseTurn: 'player', // computer || player
            board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            wins: {
                x: 0,
                o: 0
            }
        });
    }
    
    changePlayer(xo) {
        
        this.setState({xoro: xo});
        
        setTimeout(() => {
            this.computerMakeMove()
        }, 250);
    }
    
    computerMakeMove() {
        const {board, xoro} = this.state;
        const xo = xoro == 'x' ? 'o' : 'x';
        
        this.setState({whoseTurn: 'computer'});
        
        setTimeout(() => {
            const ix = computerGetSmartMove(board, xo);
            board[ix] = xo;

            this.setState({
                board,
                started: true,
                whoseTurn: 'player'
            });

            this.gameOver();

        }, 500);
            
    }
    
    endGame(winner) {
        const {xoro} = this.state;
        setTimeout(() => {
            
            this.setState({
                started: true,
                finished: false,
                whowon: null,
                whoseTurn: xoro == 'o' ? 'computer' : 'player', 
                board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            });
            
            
            xoro == 'o' && this.computerMakeMove();
            
        }, 5000);
    }
    
    gameOver() {
        const {board, wins} = this.state;
        const winnerX = doWeHaveWinner(board, 'x');
        const winnerO = doWeHaveWinner(board, 'o');
        
        if(winnerX || winnerO) {
            
            this.setState({
                finished: true,
                whowon: winnerX ? 'x won' : 'o won',
                wins: {
                    x: winnerX ? wins.x + 1 : wins.x,
                    o: winnerO ? wins.o + 1 : wins.o
                }
            });
            
            this.endGame(winnerX ? 'x' : 'o');
            
        } else if(board.indexOf(0) === -1) { // draw?
            
            this.setState({
                finished: true,
                whowon: 'it\'s a draw',
            });
            
            this.endGame(0); //draw
            
        } else {
            return false;
        }
    }
    
    playerMoves(cell) {
        const {whoseTurn, board, xoro} = this.state;
        
        if(whoseTurn == 'player' && board[cell] === 0) {
            
            board[cell] = xoro;
            
            this.setState({
                board,
                started: true,
                whoseTurn: 'computer'
            });
            
            if(!this.gameOver()) {
                this.computerMakeMove();
            }
        }
    }
    
    render () {
        
        const {board, started, xoro, whoseTurn, wins, finished, whowon} = this.state;
        const turns = {
            player: 'Your',
            computer: 'Computer\'s'
        }
        const boardCells = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((cell) => 
                                <div className={"cell cell-" + board[cell]} key={cell.toString()} onClick={() => this.playerMoves(cell)}>
                                { board[cell] === 0 ? '' :
                                    <svg viewBox="0 0 48 48">
                                        <use xlinkHref={"#symbol-" + board[cell]}/>
                                    </svg>
                                }
                                </div>
                            );
        
        const startedLabel = started ? turns[whoseTurn] + " Turn" :
                                <span>start game with X or <span className="change-player" onClick={() => this.changePlayer('o')}>play with O</span></span>
                
        

        return (
            <div className="tic-tac-toe">
                 <div className="status">
                    <div className="status-result"><svg viewBox="0 0 48 48" className="cell-x"><use xlinkHref={"#symbol-x"}/></svg> {wins.x} : {wins.o} <svg viewBox="0 0 48 48" className="cell-o"><use xlinkHref={"#symbol-o"}/></svg></div>
                    <div className="status-label">{finished ? 
                        <span>Game Over</span> 
                        : startedLabel
                    }</div>
                </div>
                <div className="board">
                    {boardCells}
                    <div className={"game-finished " + (finished ? 'show' : '')}>{whowon}</div>
                </div>
                <div className="game-footer" onClick={() => this.restartGame()}>RESTART GAME</div>
            </div>
        )
    }
}

render(<TicTacToe/>, document.getElementById('app'));
