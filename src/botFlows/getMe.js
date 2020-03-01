import moment from 'moment';
const consts = require('../assets/files/consts');

function getMe(bot) {
  bot.getMe().then(function(me)
  {
      const meString =
      'Bot operated: ' + moment().format("DD/MM/YYYY HH:mm") + "\n" +
      'Hello! My name is '+  me.first_name + "!" + "\n" +
      'My id is ' + me.id + "\n" +
      'And my username is ' + me.username + "!";
      console.log(meString);
      bot.sendMessage(consts.channelId_NerfWarsBot_Log, meString);
  });
}

export default getMe;
