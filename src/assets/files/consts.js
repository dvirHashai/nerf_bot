
export const channelId_NerfWarsBot_Log = '-1001450133613';
// vip invite Link:  https://t.me/joinchat/AAAAAEhv1sf2sVF69-YriQ

export const channelId_HarelNerfWarz = '-1001215289031';
// vip invite Link:  https://t.me/joinchat/AAAAAEhv1sf2sVF69-YriQ

export const botConsts = {
  token: '1002270486:AAGwN4Y16tf9JbPgeX-WPrHe-LHxZgPvcBA',
  link: "http://t.me/DigitalNerfWarsBot"
}

export const lambdaUrl = "https://m9iboowws1.execute-api.eu-central-1.amazonaws.com/dev/game/?gameId="

export const strings = {
  welcome: "ברוך הבא לבוט מלחמות הנרף של הראל",
  areYouAvailable: "האם אתה זמין למשחק?",
  startGame: "התחל משחק",
  canPlay: "I'm in",
  cantPlay: "I'm out",

  whoWon: "Which team won this round?",
  attacker: "Attacker",
  defender: "Defender",
  attackerWon: "Attacker Won",
  defenderWon: "Defender Won",

};

const whoWonOptions = [{
  text: strings.attacker,
  callback_data: strings.attackerWon
},{
  text: strings.defender,
  callback_data: strings.defenderWon
}];

export const canYouPlayOptions = [{
  text: strings.cantPlay,
  callback_data: strings.cantPlay
}];

const botInviteOptions = [{
  text: "לבוט",
  url: botConsts.link
}];

export const photoFileOpts = {
filename: 'NerfWars!',
contentType: 'image/jpeg',
};

export const newUser = {
  userId: "",
  userName: "",
  userNameHistory:[],
  userLanguage: "he",
  gamification: {
    rank: 0,
    score: 0,
  }
};

export const newSession = {
  date: "",
  userId: "",
  userName: "",
  lastMessageId: "",
  user: {}
};

export const defaultBotSettings = {
  isActive: true
}
