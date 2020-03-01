const consts = require('../assets/files/consts');
const strings = consts.strings;

const publishGameEndToGroup = (bot, gameId, location, winner) => {
  let gameDetailsMessage =
  "Game End!\n---------\n" +
  "Game Id:\n---------\n" +
  gameId +
  "\n\nBattle Location:\n---------\n" +
  location +
  "\n\nWinners:\n---------\n" +
  winner
  bot.sendMessage(consts.channelId_HarelNerfWarz, gameDetailsMessage);
}
export default publishGameEndToGroup;
