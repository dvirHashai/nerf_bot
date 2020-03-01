const consts = require('../assets/files/consts');
const strings = consts.strings;

const publishGameToGroup = (bot, gameId, attackersArray, defendersArray, location) => {
  let gameDetailsMessage =
  "New Game!\n---------\n" +
  "Battle Location:\n---------\n" +
  location +
  "\n\nDefenders:\n---------\n";
  defendersArray.forEach((defPlayer, i) => {
    gameDetailsMessage += defPlayer.name+"\n";
  });
  gameDetailsMessage +=
  "\n\nAttackers:\n---------\n";
  attackersArray.forEach((atkPlayer, i) => {
    gameDetailsMessage += atkPlayer.name+"\n";
  });
  bot.sendMessage(consts.channelId_HarelNerfWarz, gameDetailsMessage);
}
export default publishGameToGroup;
