const ngrok = require('ngrok');
const axios = require('axios');
const fs = require('fs');
import {reportLog} from '../NerfWarsBot';

export async function openTunnel(bot, msg, port) {
    console.log(`connecting to ngrok..`);
    reportLog(`connecting to ngrok..`);

    try {
      const url = await ngrok.connect(port);
      console.log(`opened new tunnel: `, url);
      setCachedTunnel(url);
      reportLog(`ngrok responded with url: ` + url);
      const tunnel = url+'/';
      bot.sendMessage(msg.chat.id, tunnel);
      return tunnel;
    } catch (e){
      console.log(`ngrok error!: `, e);
      reportLog(`ngrok error!: ` + e.toString());
    }
}

export async function closeTunnel() {
  setCachedTunnel("");
  console.log(`closing tunnel..`);
  reportLog(`closing tunnel..`);
  await ngrok.disconnect(); // stops all
  await ngrok.kill(); // kills ngrok process
}

export async function testTunnel(bot, msg, tunnel) {
    //if respone not error - tunnel is active
    const response = await axios.get(tunnel+"tunnelTest");
    reportLog("ngrok test response:\n" +
              "status: " + response.status + "\n" +
              "statusText: " + response.statusText + "\n");
    // console.log("ngrok test response keys", Object.keys(response));
    console.log("ngrok test response: ", response.status, response.statusText);
    bot.sendMessage(msg.chat.id, tunnel);
}

export async function getNgrokTunnel(bot, msg, port) {
  let currentTunnel = getCachedTunnel();
  console.log("cached ngrok tunnel: ", currentTunnel)
  if (currentTunnel === "") {
    currentTunnel = await openTunnel(bot, msg, port);
    setCachedTunnel(currentTunnel);
    return;
  } else {
    try {
      const res = await testTunnel(bot, msg, currentTunnel);
    } catch (error) {
      console.error("tunnel error:", error + "\n\nreopening manage site..");
      reportLog("tunnel error:" + error.toString() + "\n\nreopening manage site..");
      await closeTunnel(); // stops all
      currentTunnel = await openTunnel(bot, msg, port);
      setCachedTunnel(currentTunnel);
    }
  }
}

export function getCachedTunnel() {
  const ngrokFile = fs.readFileSync("src/assets/files/ngrokTunnelCache.txt", 'utf8', (err, data) => {
    if (err) {console.log(err);}
  });
  const tunnel = ngrokFile.trim();
  return tunnel;
}

export function setCachedTunnel(newTunnel) {
  fs.writeFile('src/assets/files/ngrokTunnelCache.txt', newTunnel, 'utf8', function (err) {
    if (err) {return console.log(err);}
    console.log("The file was saved!, your new tunnel is: ", newTunnel);
  });
}
