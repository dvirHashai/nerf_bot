const consts = require('../assets/files/consts');
const strings = consts.strings;

const publishGameEndToPlayers = (bot, gameId, players, location) => {
  let gameDetailsMessage =
  "GAME END!\n---------\n\n" +
  "Game ID: " + gameId +
  "Location: " + location;

  players.forEach((player, i) => {
    bot.sendMessage(player.tokenId, gameDetailsMessage);
  });
}

export default publishGameEndToPlayers;
