import React from 'react';
import {render} from 'react-dom';
    
import {Sounds, Colors, Timing} from './Data';


class SimonGame extends React.Component {
  
    constructor(props) {
        
        super(props);
        
        this.state = {
            sound: null,
            wrong: false,
            whoseMove: 'computer', //player
            currentSound: 0,
            strict: false,
            winner: false,
            round: 0,
            soundSeries: [ ]
        }
    }
    
    soundIsPlayed(e) {
        const soundUrl = e.target.src || e.path[0].src;
        const sound = Colors.reduce((a, color) => {
            return a + (Sounds[color].src == soundUrl ?  color : '');
        }, '');
        
        this.setState({sound});
    }
    
    soundHasEnded(e) {
        const {whoseMove, soundSeries, currentSound} = this.state;
        this.setState({sound: null});
    }
    
    toggleStrict() {
        const {strict} = this.state;
        this.setState({strict: !strict});
    }
    
    restartGame() {
        this.setState({
            sound: null,
            round: 0,
            wrong: false,
            winner: false,
            whoseMove: 'computer', //player
            currentSound: 0,
            soundSeries: [ Colors[ ~~(Math.random() * 4) ] ]
        });
        
        setTimeout(() => this.playNextSound(), 100);
    }
    
    startOver() {
        const {strict, round, soundSeries} = this.state;
        this.setState({
            sound: null,
            wrong: false,
            round: strict ? 0 : round,
            whoseMove: 'computer',
            currentSound: 0,
            soundSeries: strict ? [ Colors[ ~~(Math.random() * 4) ] ] : soundSeries
        });
        
        setTimeout(() => this.playNextSound(), 100);
    }
    
    playNextRound() {
        const {soundSeries, round} = this.state;
        
        if(round >= 19 ) {
            
            this.setState({
                sound: null,
                wrong: false,
                whoseMove: 'computer', //player
                currentSound: 0,
                winner: true,
                round: 0,
                soundSeries: [ ]
            });
            
        } else {
            soundSeries.push( Colors[ ~~(Math.random() * 4) ] );
            this.setState({
                soundSeries,
                sound: null,
                currentSound: 0,
                round: round + 1,
                whoseMove: 'computer',
            });

            setTimeout(() => this.playNextSound(), 100);
        }
    }
    
    playNextSound() {
        const {currentSound, soundSeries} = this.state;
        
        Sounds[ soundSeries[currentSound] ].play();
        this.setState({
            currentSound: currentSound + 1
        });

        if(currentSound + 1 < soundSeries.length) {
            
            setTimeout(() => this.playNextSound(), Timing.colorPause);
            
        } else {
            
            setTimeout(() => this.setState({sound: null, currentSound: 0, whoseMove: 'player'}), 1000);
        }
    }
    
    componentDidMount() {
        Colors.forEach((sound) => {
            Sounds[sound] = new Audio(Sounds[sound]);
            Sounds[sound].addEventListener('play', this.soundIsPlayed.bind(this));
            Sounds[sound].addEventListener('ended', this.soundHasEnded.bind(this));
        });
    }
    
    componentWillUnmount() {
        Colors.forEach((sound) => {
            Sounds[sound].removeEventListener('play', this.soundIsPlayed);
            Sounds[sound].removeEventListener('ended', this.soundHasEnded);
        });
    }
    
    playSound(s) { // player's turn
        const {sound, whoseMove, currentSound, soundSeries} = this.state;
        
        if(whoseMove == 'player' && !sound) {
            
            if( soundSeries[ currentSound ] == s) { // OK, great!
                
                Sounds[s].play();
                this.setState({currentSound: currentSound + 1});
                
                if(currentSound + 1 >= soundSeries.length) {
                    setTimeout(() => this.playNextRound(), Timing.roundPause);
                }
                
            } else { // Wrong, sorry!
                
                this.setState({wrong: true});
                setTimeout(() => this.startOver(), Timing.roundPause);
            }
        }
    }
    
    render () {
        const {sound, whoseMove, round, strict, soundSeries, wrong, winner} = this.state;
        const count = soundSeries.length;
        const displayCount = winner ? 'Winner!' : ( wrong ? 'Wrong' : (count < 9 ? '0' + (count).toString() : count));
        
        return (
            <div className={"simon " + whoseMove}>
                <div className="row">
                    <div className="button-wrap">
                        <div className={"button green " + (sound == 'green' ? 'play' : '')} onClick={() => this.playSound('green')}></div>
                    </div>
                    <div className="button-wrap">
                        <div className={"button red " + (sound == 'red' ? 'play' : '')} onClick={() => this.playSound('red')}></div>
                    </div>
                </div>
                <div className="row">
                    <div className="button-wrap">
                        <div className={"button yellow " + (sound == 'yellow' ? 'play' : '')} onClick={() => this.playSound('yellow')}></div>
                    </div>
                    <div className="button-wrap">
                        <div className={"button blue " + (sound == 'blue' ? 'play' : '')} onClick={() => this.playSound('blue')}></div>
                    </div>
                </div>
                
                <div className="controls">
                    <div className="controls-wrap">
                        <div className="control-options">
                            <div className="control-count">
                                {displayCount}
                            </div>
                                
                            <div className="control-strict">
                                Strict <span className={"check-switch " + (strict ? 'checked' : '')} onClick={() => this.toggleStrict()}></span>
                            </div>
                            
                            <div className="control-start">
                                <button className="btn" onClick={() => this.restartGame()}>Start</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

render(<SimonGame/>, document.getElementById('app'));
