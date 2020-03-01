import moment from 'moment';
import {reportLog} from '../NerfWarsBot';
const consts = require('../assets/files/consts');
const utils = require('./utils');
const ngrokUtils = require('./ngrokUtils');
const fs = require('fs');

function onText(bot) {

    bot.onText(/cmnds/, async (msg) => {
      const isAdmin = await utils.verifyAdmin(msg);
      if (isAdmin) {
        const chatId = msg.chat.id.toString();
        const cmndsFile = fs.readFileSync("src/commands.txt", 'utf8', (err, data) => {
          if (err) {
             console.log(err);
           }
        });
        bot.sendMessage(chatId, cmndsFile);
        reportLog(`cmnds`);
      }
  });

  bot.onText(/getTunnel/, async (msg) => {
    const isAdmin = await utils.verifyAdmin(msg);
    if (isAdmin) {
      const chatId = msg.chat.id.toString();
      ngrokUtils.getNgrokTunnel(bot, msg, 8080);
    }
});

  bot.onText(/\/setIsActive (.+)/, async (msg, match) => {
    console.log("setIsActive Called");
    const isAdmin = await utils.verifyAdmin(msg);

    const updateSettingsFile = (receivedIsActive) => {
      console.log("updating setting file, new settings:");
      let newBotSettings = utils.getBotSettings();
      newBotSettings.isActive = receivedIsActive;
      console.log("updating setting file, new settings:", newBotSettings);
      utils.updateBotSettings(newBotSettings);
    }

    if (isAdmin) {
      let receivedIsActive = match[1];
      console.log("setIsActive received value:", receivedIsActive);
      if (receivedIsActive === "true") {
          updateSettingsFile(true);
          bot.sendMessage(msg.chat.id, "bot is now active! (will respond normally)");
          reportLog("setIsActive: true");
        }
      if (receivedIsActive === "false") {
          updateSettingsFile(false);
          bot.sendMessage(msg.chat.id, "bot is now inactive! (will respond to admin inline text commands only)");
          reportLog("setIsActive: false");
        }
    }
  });

  bot.onText(/\/setPass (.+)/, async (msg, match) => {
    const isAdmin = await utils.verifyCreator(msg);
    if (isAdmin) {
      const newPassword = match[1];
      utils.setPassword(newPassword);
      reportLog(`setPass`);
    }
  });

}

export default onText;
