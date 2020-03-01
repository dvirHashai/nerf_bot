const consts = require('../assets/files/consts');
const strings = consts.strings;

const publishGameToPlayers = (bot, gameId, players, location, team, judge) => {
  let gameDetailsMessage =
  "New Game!\n---------\n\n" +
  "Your on team: " + team + "\n" +
  "The base is: " + location + "\n\n" +
  "Your team members:\n---------\n";
  players.forEach((player, i) => {
    gameDetailsMessage += player.name+"\n";
  });

  gameDetailsMessage += "\n" + "REFEREE: " + judge.name;
  gameDetailsMessage +=  "\n\n\n\n\n";

  team == "Defense" ?
  gameDetailsMessage += "You have one minute to set up your perimeter\n\n" :
  gameDetailsMessage += "GO!";

  players.forEach((player, i) => {
    bot.sendMessage(player.tokenId, gameDetailsMessage);
  });
}

export default publishGameToPlayers;
