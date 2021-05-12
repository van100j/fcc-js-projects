import React from "react";
import {render} from "react-dom";
import {Mappings, Symbols, Walkers, Weapons, width, height} from "./utils/Data";
import generateRooms from "./utils/helpers";

class RoguelikeGame extends React.Component {

    constructor() {
        super();
        this.state = {
          board: [],
          rooms: [],
          seen: [],
          isInRoom: false,
          position: {},
          previous: ".",
          health: 100,
          level: 0,
          weapon: 'Stick',
          xp: 0,
          dungeon: 1
        };
    }

    inRoom() {
      const {rooms} = this.state;
      const {x, y} = this.state.position;
      return rooms.reduce((isInRoom, r) => isInRoom || (r.x <= x && (r.x + r.w) > x && r.y <= y && (r.y + r.h) > y), false)
    }

    revealRoom() {
      const {seen, rooms} = this.state;
      const {x, y} = this.state.position;
      const room = rooms.filter((r) => r.x <= x && (r.x + r.w) > x && r.y <= y && (r.y + r.h) > y);
      const r = room ? room[0] : null;
      if(r) {
        this.setState({
          seen: seen.map((row, y) => row.map((cell, x) => (r.x <= x && (r.x + r.w) > x && r.y <= y && (r.y + r.h) > y) || cell))
        })
      }
    }

    revealScan() {
      const {board, seen} = this.state;
      const {x, y} = this.state.position;
      [[x-1, y-1], [x, y-1], [x+1, y-1], [x-1, y], [x+1, y], [x-1, y+1], [x, y+1], [x+1, y+1]]
        .map((pos) => {
          const [x, y] = pos;
          if( Walkers.indexOf(board[y][x]) !== -1 ) {
            if(seen[y][x] === false) {
              seen[y][x] = true;
            }
          }
        });
      this.setState({seen});
    }

    revealThings() {
      const {board, seen} = this.state;
      const {x, y} = this.state.position;
      //if(this.inRoom() && !seen[y][x]) {
        this.revealRoom();
      //} else {
        this.revealScan();
      //}
    }

    nextDungeon() {
      const {health, level, weapon, xp, dungeon} = this.state;
      this.setState({
        ...generateRooms(dungeon + 1 == 4),
        health,
        level,
        weapon,
        xp,
        dungeon: dungeon + 1
      });
    }

    youLose() {
      // start again
      this.setState({
        ...generateRooms(),
        health: 100,
        level: 0,
        weapon: 'Stick',
        xp: 0,
        dungeon: 1
      });
      console.log('you lose');
    }

    youWon() {
      // start again
      this.setState({
        ...generateRooms(),
        health: 100,
        level: 0,
        weapon: 'Stick',
        xp: 0,
        dungeon: 1
      });
      console.log('you won');
    }

    pickUpHealth(position, next, previous) {
      const {health, board} = this.state;
      board[position.y][position.x] = previous;
      board[next.y][next.x] = Symbols.get("hero");
      this.setState({
        board,
        previous: Symbols.get("floor"),
        health: health + 20,
        position: {
          ...position,
          ...next
        }
      });
    }

    pickUpWeapon(position, next, previous) {
      const {weapon, board} = this.state;
      board[position.y][position.x] = previous;
      board[next.y][next.x] = Symbols.get("hero");

      const weaponIx = Weapons.indexOf(weapon);

      this.setState({
        board,
        previous: Symbols.get("floor"),
        weapon: Weapons[ weaponIx < Weapons.length - 1 ? weaponIx + 1 : Weapons.length - 1 ],
        position: {
          ...position,
          ...next
        }
      });
    }

    startFight(position, next, previous) {
      const {health, weapon, level, board, xp} = this.state;
      const weaponCon = Weapons.indexOf(weapon) / Weapons.length;
      const levelCon = level / 10;

      if(~~(Math.random() * 10 + weaponCon + levelCon) > 5) {
        board[position.y][position.x] = previous;
        board[next.y][next.x] = Symbols.get("hero");

        this.setState({
          board,
          xp: xp + 20 >= 100 ? 0 : xp + 20,
          level: level + (xp + 20 >= 100 ? 1 : 0),
          previous: Symbols.get("floor"),
          position: {
            ...position,
            ...next
          }
        });
      } else {
        const damage = ~~(Math.random() * 18 + 2);
        if(health - damage <= 0) {
          this.youLose();
        } else {
          this.setState({
            health: health - damage
          });
        }
      }
    }

    fightBoss(position, next, previous) {
      const {health, weapon, level, board, xp} = this.state;
      const weaponCon = Weapons.indexOf(weapon) / Weapons.length;
      const levelCon = level / 10;

      if(~~(Math.random() * 10 + weaponCon + levelCon) > 8) {
        this.youWon();
      } else {
        const damage = ~~(Math.random() * 28 + 2);
        if(health - damage <= 0) {
          this.youLose();
        } else {
          this.setState({
            health: health - damage
          });
        }
      }
    }

    makeMove(dir) {
      const { position, board, rooms, previous } = this.state;
      const next = {
        y: position.y + dir[1],
        x: position.x + dir[0]
      }
      const nextPrevious = board[next.y][next.x];

      if( Walkers.indexOf(board[next.y][next.x]) !== -1 ) {
        if(board[next.y][next.x] == Symbols.get('portal')) {
          this.nextDungeon();
        } else if(board[next.y][next.x] == Symbols.get('enemy')) { // enemy
          this.startFight(position, next, previous);
        } else if(board[next.y][next.x] == Symbols.get('boss')) { // boss
          this.fightBoss(position, next, previous);
        } else if (board[next.y][next.x] == Symbols.get('health')) { // food/star
          this.pickUpHealth(position, next, previous);
        } else if(board[next.y][next.x] == Symbols.get('weapon')) { // weapon
          this.pickUpWeapon(position, next, previous);
        } else {
          board[position.y][position.x] = previous;
          board[next.y][next.x] = Symbols.get("hero");
          this.setState({
            board,
            previous: nextPrevious,
            position: {
              ...position,
              ...next
            }
          });

          this.revealThings();
        }
      }
    }

    keyPressedDown = (e) => {
      const { key, keyIdentifier } = e; // keyIdentifier for Safari

      if(key == 'ArrowRight' || keyIdentifier == 'Right') {
        e.preventDefault()
        this.makeMove([1, 0]);
      } else if(key == 'ArrowLeft' || keyIdentifier == 'Left') {
        e.preventDefault()
        this.makeMove([-1, 0]);
      } else if(key == 'ArrowDown' || keyIdentifier == 'Down') {
        e.preventDefault()
        this.makeMove([0, 1]);
      } else if(key == 'ArrowUp' || keyIdentifier == 'Up') {
        e.preventDefault()
        this.makeMove([0, -1]);
      }
    }

    componentDidMount() {
      this.setState(generateRooms());
      document.addEventListener('keydown', this.keyPressedDown)
    }

    componentWillUnmount() {
      document.removeEventListener('keydown', this.keyPressedDown)
    }

    render() {
      const {board, seen, weapon, health, level, xp, dungeon} = this.state;
      return (
        <div>
          <div className="game-info">
            Health: {health} / Weapon: {weapon} / Level: {level} / XP: {xp} / Dungeon: {dungeon}
          </div>
          <div className={"game-wrapper"}>
          {
            board.map((row, rowIx) => {
              return row.map((cell, cellIx) => {
                return <span key={rowIx + "-" + cellIx}
                             className={Mappings.get(cell) + (seen[rowIx][cellIx] ? " seen" : "")}></span>
              })
            })
          }
          </div>
        </div>
      )
    }
}

render(<RoguelikeGame/>, document.getElementById('app'));
