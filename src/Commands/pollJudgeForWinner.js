const consts = require('../assets/files/consts');
const strings = consts.strings;

const pollJudgeForWinner = (bot, judge, gameId) => {
  const whoWonOptions = [{
    text: strings.attacker,
    callback_data: strings.attackerWon
  },{
    text: strings.defender,
    callback_data: strings.defenderWon
  }];

    bot.sendMessage(judge.tokenId, strings.whoWon, {
      force_reply: true,
      reply_markup: {
        inline_keyboard: [whoWonOptions]
      }
    })
}

export default pollJudgeForWinner
