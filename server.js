const utils = require('./utils');
const { Client, Intents, MessageAttachment } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });
const scrapper = require('./scrapper');
const coinMarketCap = require('./coinmarketcap');

const token = process.env['TOKEN_R'];

const commands = [
  "> !p - Coin's Price",
  "> !c - Coin's Chart",
  "> !top10 - Top 10 Coins by MarketCap",

  "> !dom - Chart of BTC Dominance",
  "> !best - List of top 5 gainers in 24H",
  "> !worst - List of top 5 losers in 24H",
  "> !ta - Coin's Technical Analysis", 


  //News & Events
  "> !news - News for a specific coin",
  "> !events - Show Events for specific Coin",
  "> !reddit - Check Posts of a subreddit",

  //Funny stuff
  "> !quote", //return a quote
  "> !meme", //send a meme
  "> !gif" //send a gift

];

bot.on('ready',() =>{
    console.log('My coolest bot!');
})

bot.on('messageCreate', msg => {
  if(msg.author.username == "WorldTrendRealTime") return;
  if(utils.isCommand(msg.content)){
    let command = utils.getCommand(msg.content);
    let params = utils.getParameters(msg.content);
    switch(command){
      case "top10":
        try{
          coinMarketCap.getPriceFeed().then((data) => {
            let str = "**Top 10 cryptocurrencies by market cap:** \n \n";
            for(let i of data){
// Documentation:
// https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyListingsLatest
              if(parseInt(i.cmc_rank) <= 10){
                str += "**Rank:** " + i.cmc_rank +
                "\n**Name:** " + i.name +
                "\n**Price:** " + i.quote.USD.price.toFixed(3) + " USD\n\n";
              }
            }
            msg.reply(str);
          });
        }
        catch(e){
          console.log("Error at top10 command server.js\n" + e);
        }
      break;
      case "p":
        if(params.length == 0){
          msg.reply("Invalid syntax.");
          break;
        }
        try{
          coinMarketCap.getCoinFeed(params[0]).then((data) => {
            if(data == 400){
              msg.reply("Cannot find your ShitCoin.");
              return;
            }
            //scrap low high
            scrapper.getLowHigh(data.slug).then(lohi => {
// Documentation:
// https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyQuotesLatest
              let arr = [
                "**Name:** " + data.name + " (" + data.symbol + ")",
                "**Rank:** " + data.cmc_rank,
                "**Price:** $" + data.quote.USD.price,
                "**Low 24H:** " + lohi.low24h,
                "**High 24H:** " + lohi.high24h,
                // "**Price [BTC]:** " + data.quote.BTC.price,
                "**Percent Change 24H:** " + data.quote.USD.percent_change_24h + "%",
                "**Percent Change 7D:** " + data.quote.USD.percent_change_7d + "%",
                "**Trading Volume:** " + data.quote.USD.volume_24h,
                "**Market Cap:** " + data.quote.USD.market_cap
              ];
              msg.reply(arr.join('\n'));// it was a pain to add \n at the end every time, so yeah
            });
          });
        }
        catch(e){
          console.log("Error at p command server.js\n" + e);
        }
      break;
      case "test":
        const attach = new MessageAttachment('https://preview.redd.it/xxjo1jhywa281.jpg?width=640&crop=smart&auto=webp&s=4f48f4f986b1b584c8d5f3e814e046eb9830376d');
        msg.reply("There you go", attach);
        console.log(attach);
      break;
      case "help":
        let str = "\n**List of commands:**\n" + commands.join("\n") + "";
        msg.reply(str);
      break;
      case "dm":
        console.log(msg.member.send);
        msg.member.send(msg.content.replace("!dm", ""));
      break;
      default:
        msg.reply("`Command not supported. Try !help`");
    }
  }
});

bot.login(token);

// module.exports = {};