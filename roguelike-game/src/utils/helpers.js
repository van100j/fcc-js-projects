import * as d3 from "d3-array";
import {width, height, Symbols} from "./Data";

// includes x1 & x2
function range(x1, x2, end = 1) {
  if(x1 < x2) {
    return d3.range(x1, x2 + end);
  }
  return d3.range(x2, x1 + end).reverse();
}

export default function generateRooms(last = false) {

  let board = Array(height).fill("").map(() => Array(width).fill("?"));
  const numRooms = 9; // randomize??
  const initRoomIx = ~~(Math.random() * numRooms);

  const rooms = Array(numRooms).fill("").map((el, i) => {

    const w = ~~(Math.random() * (16 - 4) + 5);
    const h = ~~(Math.random() * (8 - 4) + 5);
    const j = ~~(i / 3);

    const x = ~~(i % 3 * width / 3 + Math.random() * (width / 3 - w));
    const y = ~~(j * height / 3 + Math.random() * (height / 3 - h));

    board = board.map((row, rowIx) => {
      if(rowIx >= y && rowIx < y + h) {
        row.fill(Symbols.get("floor"), x, x + w);
        row.fill(Symbols.get("wall-v"), x, x + 1);
        row.fill(Symbols.get("wall-v"), x + w - 1, x + w);
      }

      if(rowIx == y) {
        row.fill(Symbols.get("corner-tl"), x, x + 1);
        row.fill(Symbols.get("wall-h"), x + 1, x + w - 1);
        row.fill(Symbols.get("corner-tr"), x + w - 1, x + w);
      } else if(rowIx == y + h - 1) {
        row.fill(Symbols.get("corner-bl"), x, x + 1);
        row.fill(Symbols.get("wall-h"), x + 1, x + w - 1);
        row.fill(Symbols.get("corner-br"), x + w - 1, x + w);
      }
      return row;
    });

    board[~~(Math.random() * (h - 2) + y + 1)][~~(Math.random() * (w - 2) + x + 1)] = Symbols.get("enemy");

    const randomVar = ~~(Math.random() * 10);
    if( randomVar < 6) {
      board[~~(Math.random() * (h - 2) + y + 1)][~~(Math.random() * (w - 2) + x + 1)] = Symbols.get("health");
    } else if(randomVar < 8) {
      board[~~(Math.random() * (h - 2) + y + 1)][~~(Math.random() * (w - 2) + x + 1)] = Symbols.get("weapon");
    }

    return { w, h, x, y, room: i };
  });

  const links = [
    [{source: 0, dir: 'x', target: 1}],
    [{source: 1, dir: 'x', target: 2}],
    [{source: 2, dir: 'y', target: 5}],
    [{source: 3, dir: 'y', target: 6}, {source: 3, dir: 'x', target: 4}],
    [{source: 4, dir: 'x', target: 5}],
    [{source: 6, dir: 'x', target: 7}],
    [{source: 7, dir: 'x', target: 8}],
    [{source: 5, dir: 'y', target: 8}]
  ];

  links.map((roomLink) => {
    const roomIx = roomLink[0].source;
    const room = rooms[roomIx];

    const passages = roomLink.map((link) => {

      const {dir, target} = link;
      const targetRoom = rooms[target];

      if(dir == 'x') {
        return [
          [ target > roomIx ? (room.x + room.w - 1) : room.x,
            room.y + 1 + ~~(Math.random() * (room.h - 2))
          ],
          [ target < roomIx ? (targetRoom.x + targetRoom.w - 1) : targetRoom.x,
            targetRoom.y + 1 + ~~(Math.random() * (targetRoom.h - 2))
          ]
        ]
      } else {
        return [
          [ room.x + 1 + ~~(Math.random() * (room.w - 2)),
            target > roomIx ? (room.y + room.h - 1) : room.y,
          ],
          [ targetRoom.x + 1 + ~~(Math.random() * (targetRoom.w - 2)),
            target < roomIx ? (targetRoom.y + targetRoom.h - 1) : targetRoom.y,
          ]
        ]
      }
    });

    passages.map((passage) => {
      const [door1, door2] = passage;
      const [x1, y1] = door1;
      const [x2, y2] = door2;

      const [xh, yh] = [ Math.round((x1 + x2) / 2), Math.round((y1 + y2) / 2)];

      board[ y1 ][ x1 ] = Symbols.get("door");
      board[ y2 ][ x2 ] = Symbols.get("door");

      const drawPassageCoords = (() => {
        let coords = [];

        const yStart = board[ y1 - 1 ][ x1 ] == "?" ? y1 - 1 : y1 + 1;
        const yHalfEnd = Math.abs(y1 - y2) <= 3 ? yStart : board[ y1 - 1 ][ x1 ] == "?" ? yh - 1 : yh + 1;
        const yEnd = Math.abs(y1 - y2) <= 3 ? yStart : y2 > y1 ? y2 + 1 : y2 - 1;

        const xStart = board[ y1 ][ x1 - 1 ] == "?" ? x1 - 1 : x1 + 1;
        const xHalfEnd = Math.abs(x1 - x2) <= 3 ? xStart : board[ y1 ][ x1 - 1 ] == "?" ? xh - 1 : xh + 1;
        const xEnd = Math.abs(x1 - x2) <= 3 ? xStart : x2 > x1 ? x2 + 1 : x2 - 1;

        if(board[ y1 + 1 ][ x1 ] == "?" || board[ y1 - 1 ][ x1 ] == "?") {
          coords = range(yStart, yHalfEnd).reduce((a, y) => [...a, [x1, y]], coords);
          coords = range(x1, x2).reduce((a, x) => [...a, [x, yHalfEnd]], coords );
          coords = range(yHalfEnd, y2, 0).reduce((a, y) => [...a, [x2, y]], coords );
        } else {
          coords = range(xStart, xHalfEnd).reduce((a, x) => [...a, [x, y1]], coords);
          coords = range(y1, y2).reduce((a, y) => [...a, [xHalfEnd, y]], coords );
          coords = range(xHalfEnd, x2, 0).reduce((a, x) => [...a, [x, y2]], coords );
        }

        return coords;
      })();

      drawPassageCoords.map(c => board[ c[1] ][ c[0] ] = Symbols.get("passage"));
    });
  });

  const iRoom = rooms[ initRoomIx ];
  board[iRoom.y + 2][iRoom.x + 2] = Symbols.get("hero");

  if(last) {
    const bossRoom = rooms[~~(Math.random() * numRooms)];
    board[ ~~(Math.random() * (bossRoom.h - 2)) + bossRoom.y + 1][ ~~(Math.random() * (bossRoom.w - 2)) + bossRoom.x + 1] = Symbols.get("boss");
  } else {
    const portalRoom = rooms[~~(Math.random() * numRooms)];
    board[ ~~(Math.random() * (portalRoom.h - 2)) + portalRoom.y + 1][ ~~(Math.random() * (portalRoom.w - 2)) + portalRoom.x + 1] = Symbols.get("portal");
  }

  const seen = board.map((row, rowIx) => row.map((cell, cellIx) => iRoom.x <= cellIx && (iRoom.x + iRoom.w) > cellIx && iRoom.y <= rowIx && (iRoom.y + iRoom.h) > rowIx));

  return {
    board,
    seen,
    rooms,
    room: iRoom,
    isInRoom: true,
    position: {
      x: iRoom.x + 2,
      y: iRoom.y + 2
    }
  }

}
