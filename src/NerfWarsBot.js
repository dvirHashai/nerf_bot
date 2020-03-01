// @flow

//  SETUP
import publishGameResultsToGroup from './Commands/publishGameResultsToGroup';

import getMe from './botFlows/getMe';
import onText from './botFlows/onText';
import setupExpress from './botFlows/setupExpress';

let isActive = false;

const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const axios = require('axios');
const moment = require('moment');
const path = require('path');
const express = require('express');
const _ = require('lodash');
const consts = require('./assets/files/consts');
const utils = require('./botFlows/utils');

const strings = consts.strings;
const token = consts.botConsts.token;
const botLink = consts.botConsts.link;
const bot = new TelegramBot(token, {polling: true});

//GLOBALS
let sessions = [];
let lastMessageId = 0;
let userName = "";
let userId = "";
let tunnel = "";
//////// Miniserver Endpoints
const app = express();
setupExpress(bot, app, 8080);
app.get('/', (req, res) => {
  res.send(200);
});
////////
isActive = utils.getIsActive();
utils.getPassword();
getMe(bot);
onText(bot);

export function reportLog(msgToLog) {
  bot.sendMessage(consts.channelId_NerfWarsBot_Log, msgToLog);
}

Object.defineProperty(Array.prototype, 'chunk_inefficient', {
    value: function(chunkSize) {
        var array=this;
        return [].concat.apply([],
            array.map(function(elem,i) {
                return i%chunkSize ? [] : [array.slice(i,i+chunkSize)];
            })
        );
    }
});

setInterval(function(){
  const activeStatus = isActive ? "Active" : "Inactive";
  const report = "BOT RUNNING, status: "+ activeStatus +"," + "\n"+ moment().format("DD/MM/YYYY HH:mm");
  console.log(report);
  reportLog(report);
}, 600000);

bot.on("polling_error", (err) => {
  console.log("polling_error!", err);
  reportLog("polling_error!:" + err.toString());
});
bot.on('error', async (msg) => {
  reportLog(msg);
})
bot.on('webhook_error', async (msg) => {
  reportLog(msg);
})

bot.on('message', async (msg) => {
  if (!utils.getIsActive()) {
    return;
  }
    console.log("onMessage: message: ", msg);
    const chatId = msg.chat.id.toString();
    const fromId = msg.from.id.toString();

    const auth = await utils.isAuthorized(msg);
    if (!auth) {
      console.log("onMessage: UNAUTHORIZED!");
      return;
    }

    if (msg.text && msg.text[0] !== "/" && msg.text !== "/start") {
      bot.sendMessage(msg.chat.id, "press /start");
    }
});

function sendBotInviteToGroup(){
  bot.sendMessage(consts.channelId_HarelNerfWarz, "הזמנה לבוט המטורף שלנו", {
    force_reply: true,
    reply_markup: {
      inline_keyboard: [consts.botInviteOptions]
    }
  })
}
// sendBotInviteToGroup();

function startSession(msg) {
  const stream = fs.createReadStream('src/assets/photos/nerfLogo.jpg');

    bot.sendPhoto(msg.chat.id, stream, {}, consts.photoFileOpts).then(() => {
      bot.sendMessage(msg.chat.id, strings.welcome).then(()=>{
        const userId = msg.from.id;
        let newSession = consts.newSession;
        newSession.date = moment();
        newSession.userId = userId;
        newSession.userName = msg.from.username;
        newSession.lastMessageId = msg.message_id;

        const index = sessions.findIndex(s => s.userId === msg.from.id);
          if (index !== -1) {
            sessions[index] = newSession;
          } else {
            sessions.push(newSession);
          }
        })
      })//.then(m => updateLastMessageIdForSessionByUserId(m.chat.id, m.message_id));
}

bot.onText(/start/, async (msg) => {
  if (!utils.getIsActive()) {
    return;
  }
  if (msg.from.is_bot === false) {
  // console.log("\t/start: \n\t" + moment().format("DD/MM/YYYY HH:mm") + "\n\t from.id: ", msg.from.id, "\n\t from.username: ", msg.from.username);
  const chatId = msg.chat.id.toString();
  const fromId = msg.from.id.toString();

  const auth = await utils.isAuthorized(msg);
  if (!auth) {
    console.log("/start: UNAUTHORIZED");
    bot.sendMessage(message.chat.id, "עלייך לקבל הזמנה לקבוצת מלחמות הנרף של הראל על מנת להשתמש בבוט");
    return
  }
    startSession(msg);
    console.log("/start: starting new session");
}});

bot.on("callback_query", (callbackQuery) => {
  if (!utils.getIsActive()) {
    return;
  }
  // const currentSession = sessions[getSessionIndexByUserId(msg.chat.id)];
  const msg = callbackQuery.message;
  const data = callbackQuery.data;
  const playerId = msg.chat.id;
  console.log("message", msg);
  console.log("data", data);

  // if (msg && msg.message_id !== getLastMessageIdForSessionByUserId(msg.chat.id)) {
  //   console.log("Error! - callback msg id different from incoming reply msg id, user prbbly pressed previous message button");
  //   return;
  // }

//player isAvailable answers
  if (data.includes(strings.canPlay)) {
      bot.sendMessage(playerId, "אישור התקבל, התכונן לפעולה והמתן להזנקה");
      const gameIdString = data.replace(strings.canPlay+"/","");
      console.log("gameIdString", gameIdString);
      setPlayerAvailable(playerId, gameIdString);
    return;
  }
  if (data === strings.cantPlay) {
    bot.sendMessage(playerId, "סירוב התקבל, אתה מתבקש לא לשתף פעולה עם המשחק הקרוב באופן מודיעיני או קרבי, אתה מוזמן לשבת בפינה ולבכות כמו ילדה קטנה כשכולם נהנים בלעדייך")
    return;
  }
  //judge answers
  if (data.includes(strings.attackerWon)) {
    bot.sendMessage(playerId, "תודה")
    setGameWinner(data.replace(strings.attackerWon, ""), "attackers");
    publishGameResultsToGroup(bot, "id123", "the kitchen", "attackers");
    return;
  }
  if (data.includes(strings.defenderWon)) {
    bot.sendMessage(playerId, "תודה")
    setGameWinner(data.replace(strings.defenderWon, ""), "defenders");
    publishGameResultsToGroup(bot, "id123", "the kitchen", "defenders");
    return;
  }
});

function getSessionIndexByUserId(userId) {
  const index = sessions.findIndex(s => s.userId === userId);
  return index;
}

function updateLastMessageIdForSessionByUserId(userId, lastMessageId) {
  const index = getSessionIndexByUserId(userId)
  if (index != -1) {
    sessions[index].lastMessageId = lastMessageId;
  }
}

function getLastMessageIdForSessionByUserId(userId) {
  const session = sessions[getSessionIndexByUserId(userId)];
  if (session) {
    return session.lastMessageId;
  } else {
    return -1;
  }
}

////////    LAMBDA LOGIC GOES IN HERE    ////////
//attackers - defenders
const setGameWinner = async (gameId, winningTeam) => {
  console.log("winningTeam, game", winningTeam, gameId);
  try {
    axios.post(consts.lambdaUrl + gameId, {winners: winningTeam});
  } catch (e) {
    console.log("Error!:", e);
  }
}

const setPlayerAvailable = (playerId, gameId) => {
  console.log("player, game", playerId, gameId);
  try {
    axios.post(consts.lambdaUrl + gameId, {playerId});
  } catch (e) {
    console.log("Error!:", e);
  }
}
