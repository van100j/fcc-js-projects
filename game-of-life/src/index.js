import React from "react";
import {render} from "react-dom";
import Cell from "./components/Cell"
import GenerationsCounter from "./components/GenerationsCounter"
import {isCellAlive, generateRandomBoard, getNextGeneration} from "./utils/helpers"


class GameOfLife extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          current: [],
          next: [],
          generations: 0,
          paused: true,
          width: 50,
          height: 30,
          timing: 50
        };
    }

    generationX() {
      const {generations, width, height, next} = this.state;

      this.setState({
        generations: generations + 1,
        current: next,
        next: getNextGeneration(next, width, height)
      });
    }

    componentDidMount() {
      const {width, height} = this.state;
      const current = generateRandomBoard(width * height);
      this.setState({
        current,
        generations: 1,
        next: getNextGeneration(current, width, height)
      });

      this.startGame();
    }

    componentWillUnmount() {
      this.interval && clearInterval(this.interval);
    }

    startGame() {
      const {timing} = this.state;
      this.setState({paused: false});
      if(this.interval) {
        clearInterval(this.interval);
      }
      this.interval = setInterval((() => {
        this.generationX();
      }).bind(this), timing);
    }

    pauseGame() {
      this.setState({paused: true});
      this.interval && clearInterval(this.interval);
    }

    clearBoard() {
      const {current, next} = this.state;
      this.interval && clearInterval(this.interval);
      this.setState({
        generations: 0,
        paused: true,
        current: current.fill(0),
        next: next.fill(0)
      })
    }

    randomPlay() {
      const {width, height} = this.state;
      const current = generateRandomBoard(width * height);
      this.setState({
        current,
        generations: 1,
        next: getNextGeneration(current, width, height)
      });

      this.startGame();
    }

    setSpeed(speed) {

      clearInterval(this.interval);

      this.setState({ timing: speed });

      setTimeout(() => {
        this.startGame();
      }, 100);
    }

    onToggleCell(ix) {
      const {next} = this.state;
      next[ix] = next[ix] ? 0 : 1;
      this.setState({
        next
      });

    }

    setBoardSize(width, height) {
      const {current, next} = this.state;
      const len = width * height;
      this.clearBoard();
      this.setState({
        width,
        height,
        current: Array.from({length: len}, () => 0),
        next: Array.from({length: len}, () => 0)
      })
    }

    render() {
      const {generations, current, next, width, height} = this.state;

      return (
        <div className={"game-wrapper size" + width}>
          <div className="board">
            { current.map((alive, ix) => <Cell handleClickCell={() => this.onToggleCell(ix)} alive={alive} baby={next[ix]} key={ix} />) }
          </div>
          <GenerationsCounter generations={generations} />
          <div className="settings">

            <div className="controls">
              <button type="button" onClick={this.startGame.bind(this)}>Play</button>
              <button type="button" onClick={this.pauseGame.bind(this)}>Pause</button>
              <button type="button" onClick={this.clearBoard.bind(this)}>Clear</button>
              <button type="button" onClick={this.randomPlay.bind(this)}>Random Play</button>
            </div>

            <div className="grid">
              <button type="button" onClick={() => this.setBoardSize(50, 30)}>50 &times; 30</button>
              <button type="button" onClick={() => this.setBoardSize(60, 40)}>60 &times; 40</button>
              <button type="button" onClick={() => this.setBoardSize(75, 45)}>75 &times; 45</button>
            </div>

            <div className="speed">
              <button type="button" onClick={() => this.setSpeed(250)}>Slow</button>
              <button type="button" onClick={() => this.setSpeed(125)}>Medium</button>
              <button type="button" onClick={() => this.setSpeed(50)}>Fast</button>
            </div>
          </div>
        </div>
      )
    }
}

render(
    <GameOfLife/>, document.getElementById('app'));
