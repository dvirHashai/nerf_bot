const consts = require('../assets/files/consts');
const strings = consts.strings;

const checkPlayerAvailability = (bot, players, gameId) => {

console.log("checkPlayerAvailability", players.length, players, gameId);
const canPlayOption = {
  text: strings.canPlay,
  callback_data: strings.canPlay+"/"+gameId
}
  players.forEach(player=>{
    bot.sendMessage(player.tokenId, strings.areYouAvailable, {
      force_reply: true,
      reply_markup: {
        inline_keyboard: [[...consts.canYouPlayOptions, canPlayOption]]
      }
    })//.then(m => console.log("m", m));
  });
}
 export default checkPlayerAvailability
