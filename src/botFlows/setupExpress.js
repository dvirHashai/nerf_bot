const express = require('express');
const path = require('path');
const fs = require('fs');
import publishGameToGroup from '../Commands/publishGameToGroup';
import publishGameToPlayers from '../Commands/publishGameToPlayers';
import pollJudgeForWinner from '../Commands/pollJudgeForWinner';
import checkPlayerAvailability from '../Commands/checkPlayerAvailability';
const bodyParser = require('body-parser');


//mids
const allowCrossDomain = function(req, res, next) {
     res.header('Access-Control-Allow-Origin', "*");
     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
     res.header('Access-Control-Allow-Headers', 'Content-Type');
     next();
}

const logAllTheShit = function(req, res, next) {
      console.log("req.body", req.body);
      next();
}

function setupExpress(bot, app, port) {
  app.use(allowCrossDomain);
  // app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(logAllTheShit);


  app.listen(port, () => {console.log(`NerfWars miniserver online!`);});

  app.get('/', (req, res) => {
    console.log("/ triggered");
    res.sendStatus(200);
  });
  app.get('/tunnelTest', (req, res) => {
    console.log("/tunnelTest triggered");
    res.sendStatus(200);
  });
  app.get('/info', (req, res) => {
    console.log("/info triggered");
    res.sendStatus(200);
  });
  // check players availability
  app.post('/checkPlayers', (req, res) => {
      console.log("/checkPlayers triggered");
      const gameId = req.body.gameId;
      const players = req.body.players;
      checkPlayerAvailability(bot, players, gameId);
      res.sendStatus(200);
  });
  // publish game
  app.post('/publishGameToGroup', (req, res) => {
      console.log("/publishGameToGroup triggered");
      const gameData = req.body;
      const gameId = gameData.gameId;
      const attackers = gameData.attackers;
      const defenders = gameData.defenders;
      const location = gameData.location;
      publishGameToGroup(bot, gameId, attackers, defenders, location);
      res.sendStatus(200);
  });
  // publish game to defenders first then to attackers
  app.post('/publishGameToPlayersWithDelay', (req, res) => {
      console.log("/publishGameToPlayersWithDelay triggered");
      const gameData = req.body;
      console.log("gameData", JSON.stringify(gameData));
      const gameId = gameData.gameId;
      const attackers = gameData.attackers.map(item=>item.Item);
      const defenders = gameData.defenders.map(item=>item.Item);
      const location = gameData.location;
      const judge = gameData.judge;
      publishGameToPlayers(bot, gameId, defenders, location, "Defense", judge);
      setTimeout(()=>{ publishGameToPlayers(bot, gameId, attackers, location, "Offense", judge); }, 60000);
      res.sendStatus(200);
  });
  // end game and poll judge
  app.post('/pollJudgeForWinner', (req, res) => {
      console.log("/pollJudgeForWinner triggered");
      const gameData = req.body;
      const gameId = gameData.gameId;
      const judge = gameData.judge;
      pollJudgeForWinner(bot, judge, gameId);
      res.sendStatus(200);
  });
}

export default setupExpress;
