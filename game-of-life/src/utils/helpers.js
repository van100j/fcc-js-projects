export const isCellAlive = (arr, ix, width, height, cell) => {

  ////////////////////////////////////
  // i-width-1  i-width   i-width+1 //
  // i-1         CELL           i+1 //
  // i+width-1  i+width   i+width+1 //
  ////////////////////////////////////

  let score = 0;
  if(ix % width == 0) { // first column

    if(ix < width) { // first row
      score = arr[height * width - 1] + arr[(height - 1) * width] + arr[(height - 1) * width + 1] +
              arr[width - 1] + arr[1] +
              arr[2 * width - 1] + arr[ix + width] + arr[ix + width + 1];
    } else if (ix >= width * (height - 1)) { // last row
      score = arr[ix - width] + arr[ix - width + 1] + arr[ix - 1] +
              arr[ix + 1] + arr[height * width - 1] +
              arr[0] + arr[1] + arr[width - 1];
    } else {
      score = arr[ix - width] + arr[ix - width + 1] + arr[ix - 1] +
              arr[ix + 1] + arr[ix + width - 1] +
              arr[ix + width] + arr[ix + width + 1] + arr[ix + 2 * width - 1];
    }

  } else if(ix % width == width - 1) { // last column

    if(ix < width) { // first row
      score = arr[height * width - 1] + arr[height * width - 2] + arr[(height - 1) * width] +
              arr[ix - 1] + arr[0] +
              arr[ix + width - 1] + arr[ix + width] + arr[ix + 1];
    } else if (ix >= width * (height - 1)) { // last row
      score = arr[ix - width - 1] + arr[ix - width] + arr[ix - 2 * width + 1] +
              arr[ix - 1] + arr[ix - width + 1] +
              arr[0] + arr[width - 1] + arr[width - 2];
    } else {
      score = arr[ix - width] + arr[ix - width - 1] + arr[ix - 2 * width + 1] +
              arr[ix - 1] + arr[ix - width + 1] +
              arr[ix + 1] + arr[ix + width - 1] + arr[ix + width];
    }

  } else { // any other column
    if(ix < width) { // first row
      score = arr[(height - 1) * width + ix - 1] + arr[(height - 1) * width + ix] + arr[(height - 1) * width + ix + 1] +
              arr[ix - 1] + arr[ix + 1] +
              arr[ix + width - 1] + arr[ix + width] + arr[ix + width + 1];
    } else if (ix >= width * (height - 1)) { // last row
      score = arr[ix%width - 1] + arr[ix%width] + arr[ix%width + 1] +
              arr[ix - 1] + arr[ix + 1] +
              arr[ix - width - 1] + arr[ix - width] + arr[ix - width + 1];
    } else {
      score = arr[ix - width - 1] + arr[ix - width] + arr[ix - width + 1] +
              arr[ix - 1] + arr[ix + 1] +
              arr[ix + width - 1] + arr[ix + width] + arr[ix + width + 1];
    }
  }

  if(!cell && score == 3) return 1;
  if(cell && score < 2) return 0;
  if(cell && score >= 2 && score <= 3) return 1;

  return 0;
}

export const generateRandomBoard = (len) => {
  return Array.from({length: len}, () => Math.round(Math.random()))
}

export const getNextGeneration = (current, width, height) => {
  return current.map((cell, i, current) => isCellAlive(current, i, width, height, cell));
}
