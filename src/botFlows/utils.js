import {reportLog} from '../NerfWarsBot';
const consts = require('../assets/files/consts');
const fs = require('fs');


export const getBotSettings = () => {
  const settingsFile = fs.readFileSync("src/assets/files/settings.txt", 'utf8', (err, data) => {
    if (err) {
       console.log(err);
     }
  });
  let botSettings;
  if (settingsFile.trim().length === 0 || !settingsFile) {
      botSettings = consts.defaultBotSettings;
      console.log("botSettings set to default: ", botSettings);
      updateBotSettings(botSettings);
      reportLog("bot settings reverted to default");
      } else {
    botSettings = JSON.parse(settingsFile);
  }
  console.log("botSettings retrieved: ", botSettings);
  return botSettings;
}

export function updateBotSettings(newBotSettings) {
  console.log("update isactive received:", newBotSettings);
  fs.writeFile('src/assets/files/settings.txt', JSON.stringify(newBotSettings), 'utf8', function (err) {
    if (err) {
      console.log(err);
    }
  });
}

export function getIsActive() {
  const settingsFile = fs.readFileSync("src/assets/files/settings.txt", 'utf8', (err, data) => {
    if (err) {
       console.log(err);
     }
  });
  let botSettings = this.getBotSettings();
  const isActive = botSettings.isActive;
  console.log("getIsActive:", isActive);
  return isActive;
}

export function getPassword() {
  const passFile = fs.readFileSync("src/assets/files/password.txt", 'utf8', (err, data) => {
    if (err) {console.log(err);}
  });
  const password = passFile.trim();
  console.log("password retrieved!, your pass is: ", password);
  reportLog("password retrieved!, your pass is: " + password);
  return password;
}

export function setPassword(newPass) {
  fs.writeFile('src/assets/files/password.txt', newPass, 'utf8', function (err) {
    if (err) {return console.log(err);}
    console.log("The file was saved!, your new pass is: ", newPass);
    getPassword();
  });
}

export async function isAuthorized() {
   return true;
}

export async function verifyAdmin(msg) {
  return true;
  // const member = await bot.getChatMember(consts.channelId_HarelNerfWarz, msg.from.id);
  // if (member) {
  //   if (member.status === "creator" || member.status === "administrator") {
  //     return true;
  //   } else {
  //     console.log("denied! this member is not an admin:", JSON.stringify(member));
  //     reportLog("denied! this member is not an admin:" + JSON.stringify(member));
  //   }
  // } else {
  //   console.log("denied! this member is not in the vip group:", JSON.stringify(member));
  //   reportLog("denied! this member is not in the vip group:" + JSON.stringify(member));
  //   return false;
  // }
}

export async function verifyCreator(msg) {
  return true;
  // const member = await bot.getChatMember(consts.channelId_HarelNerfWarz, msg.from.id);
  // if (member) {
  //   if (member.status === "creator") {
  //     return true;
  //   }
  // } else {
  //   console.log("denied! this member is not a creator:", member)
  //   return false;
  // }
}
