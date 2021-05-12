#!/usr/bin/env zx

const ghUname = `van100j`
const projectNames = [
  "image-search",
  "url-shortener-microservice",
  "header-parser-microservice",
  "timestamp-microservice",
  "map-data-world",
  "force-directed-map",
  "heat-map",
  "scatterplot-graph",
  "bar-chart",
  "roguelike-game",
  "game-of-life",
  "recipe-box",
  "camper-leaderboard",
  "markdown-previewer",
  "simon-game",
  "tic-tac-toe",
  "pomodoro-clock",
  "js-react-calculator",
  "twitchtv-json-api",
  "wikipedia-viewer",
  "show-local-weather",
  "random-quote-machine",
];

for (const name of projectNames) {
  await $`open https://github.com/${ghUname}/${name}`
}

// // Clone from github into dir
// for (const name of projectNames) {
//   console.log(`Cloning ${ghUname}/${name} into ${name}...`)
//   await $`gh repo clone ${ghUname}/${name} ${name}`;
//   await $`rm -rf ${name}/.git`;
// }
