
const axios = require('axios');
const cheerio = require('cheerio');

async function getRedditPost(){
  try{
    const siteURL = 'https://www.reddit.com/r/cryptocurrencymemes/new/';

    const { data } = await axios({
      method: "GET",
      url: siteURL
    });

    const $ = cheerio.load(data);
    
    const elemSelector = '#SHORTCUT_FOCUSABLE_DIV > div:nth-child(4) > div > div > div > div._3ozFtOe6WpJEMUtxDOIvtU > div._31N0dvxfpsO6Ur5AKx4O5d > div._1OVBBWLtHoSPfGCRaPzpTf._3nSp9cdBpqL13CqjdMr2L_._2OVNlZuUd8L9v0yVECZ2iA > div.rpBJOHq2PR60pnwJlUyP0';

    let memes = [];
    $(elemSelector).children().each((childIndex, childElement) => {
      $(childElement).find('img').each((i, element) => {
        let src = element.attribs.src;
        if(!(src.includes('redditstatic.com') || src.includes('award_images')))
          memes.push(src);
      });
    });
    let random = Math.floor(Math.random() * memes.length);
    //console.log(memes[random]);
    return memes[random];
    //memes.forEach(i => console.log(i));
    // $(elemSelector).each((parentIndex, parentElement) => {
    //   let keyIdx = 0;
    //   const coinObj ={}
    //   if(parentIndex <= 10) {
    //   $(parentElement).children().each((childIndex, childElement) => {
    //     let tdValue = $(childElement).text();

    //     if(keyIdx === 1 || keyIdx ===6) {
    //       tdValue = $('p:first-child', $(childElement).html()).text();
    //     }

    //     if(tdValue){
    //       coinObj[keys[keyIdx]] = tdValue;

    //       keyIdx++
    //     }
    //   });
    //   coinArr.push(coinObj);
    //   }
    // });
    // return coinArr;
  }
  catch(e){
    console.log(e);
  }
}


async function getCoinName(symbol){
  try{
    const siteURL = 'https://www.google.com/search?q=' + symbol + 'coinmarketcap';
    const { data } = await axios({
      method: "GET",
      url: siteURL
    });

    const $ = cheerio.load(data);

    const element = '#rso > div:nth-child(1) > div > div > div:nth-child(1) > div > div > div > div.yuRUbf > a';
    console.log($(element).text());
    console.log("I'm here");

    //#rso > div:nth-child(1) > div > div > div:nth-child(1) > div > div > div > div.yuRUbf > a

    return 0;
  }
  catch(e){
    console.log(e);
  }
}

async function getCoinFeed(name){
  try{
    await getCoinName(name);
    const siteURL = 'https://coinmarketcap.com/currencies/' + name;
    const { data } = await axios({
      method: "GET",
      url: siteURL
    });

    const $ = cheerio.load(data);
  
    const keys = {
      'price': '#__next > div > div > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div.sc-16r8icm-0.jKrmxw.container > div > div.sc-16r8icm-0.sc-19zk94m-1.gRSJaB > div.sc-16r8icm-0.iutcov > div.sc-16r8icm-0.hgKnTV > div > div:nth-child(2) > table > tbody > tr:nth-child(1) > td',
      'change' : '#__next > div.bywovg-1.fUzJes > div > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div.sc-16r8icm-0.jKrmxw.container > div > div.sc-16r8icm-0.sc-19zk94m-1.gRSJaB > div.sc-16r8icm-0.iutcov > div.sc-16r8icm-0.hgKnTV > div > div:nth-child(2) > table > tbody > tr:nth-child(2) > td > div > span',
      'low24h': '#__next > div > div > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div.sc-16r8icm-0.jKrmxw.container > div > div.sc-16r8icm-0.sc-19zk94m-1.gRSJaB > div.sc-16r8icm-0.iutcov > div.sc-16r8icm-0.hgKnTV > div > div:nth-child(2) > table > tbody > tr:nth-child(3) > td > div:nth-child(1)',
      'high24h': '#__next > div > div > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div.sc-16r8icm-0.jKrmxw.container > div > div.sc-16r8icm-0.sc-19zk94m-1.gRSJaB > div.sc-16r8icm-0.iutcov > div.sc-16r8icm-0.hgKnTV > div > div:nth-child(2) > table > tbody > tr:nth-child(3) > td > div:nth-child(2)',
      'tradingVolume': '#__next > div.bywovg-1.fUzJes > div > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div.sc-16r8icm-0.jKrmxw.container > div > div.sc-16r8icm-0.sc-19zk94m-1.gRSJaB > div.sc-16r8icm-0.iutcov > div.sc-16r8icm-0.hgKnTV > div > div:nth-child(2) > table > tbody > tr:nth-child(4) > td > span',
      'marketCap' : '#__next > div.bywovg-1.fUzJes > div > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div.sc-16r8icm-0.jKrmxw.container > div > div.sc-16r8icm-0.sc-19zk94m-1.gRSJaB > div.sc-16r8icm-0.iutcov > div.sc-16r8icm-0.hgKnTV > div > div:nth-child(3) > table > tbody > tr:nth-child(1) > td > span',
      'rank': '#__next > div > div > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div.sc-16r8icm-0.jKrmxw.container > div > div.sc-16r8icm-0.sc-19zk94m-1.gRSJaB > div.sc-16r8icm-0.iutcov > div.sc-16r8icm-0.hgKnTV > div > div:nth-child(2) > table > tbody > tr:nth-child(7) > td'
    };
    
    const coinArr = {};

    for(let i in keys){
      coinArr[i] = $(keys[i]).text();
    }
    coinArr.low24h = coinArr.low24h.slice(0, -2);
    return coinArr;
  }
  catch(e){
    return 400;
  }
}

async function getPriceFeed(){
  try{
    const siteURL = 'https://coinmarketcap.com/';

    const { data } = await axios({
      method: "GET",
      url: siteURL
    });

    const $ = cheerio.load(data);
    
    const elemSelector = '#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div > div.h7vnx2-1.bFzXgL > table > tbody > tr';

    const keys = [
      'rank',
      'name',
      'price',
      '24h',
      '7d',
      'marketCap',
      'volume',
      'circulatingSupply'
    ];

    const coinArr = [];

    $(elemSelector).each((parentIndex, parentElement) => {
      let keyIdx = 0;
      const coinObj ={}
      if(parentIndex <= 10) {
      $(parentElement).children().each((childIndex, childElement) => {
        let tdValue = $(childElement).text();

        if(keyIdx === 1 || keyIdx ===6) {
          tdValue = $('p:first-child', $(childElement).html()).text();
        }

        if(tdValue){
          coinObj[keys[keyIdx]] = tdValue;

          keyIdx++
        }
      });
      coinArr.push(coinObj);
      }
      
    });
    return coinArr;
  }

  catch(e){
    console.log(e);
  }
}

async function getLowHigh(slug){
  try{
    const siteURL = 'https://coinmarketcap.com/currencies/' + slug;
    const { data } = await axios({
      method: "GET",
      url: siteURL
    });

    const $ = cheerio.load(data);
  
    const keys = {
      'low24h': '#__next > div > div > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div.sc-16r8icm-0.jKrmxw.container > div > div.sc-16r8icm-0.sc-19zk94m-1.gRSJaB > div.sc-16r8icm-0.iutcov > div.sc-16r8icm-0.hgKnTV > div > div:nth-child(2) > table > tbody > tr:nth-child(3) > td > div:nth-child(1)',
      'high24h': '#__next > div > div > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div.sc-16r8icm-0.jKrmxw.container > div > div.sc-16r8icm-0.sc-19zk94m-1.gRSJaB > div.sc-16r8icm-0.iutcov > div.sc-16r8icm-0.hgKnTV > div > div:nth-child(2) > table > tbody > tr:nth-child(3) > td > div:nth-child(2)'
    };
    
    const coinArr = {};

    for(let i in keys){
      coinArr[i] = $(keys[i]).text();
    }
    coinArr.low24h = coinArr.low24h.slice(0, -2);
    return coinArr;
  }
  catch(e){
    console.log(e)
    return 400;
  }
}

const express = require('express');
const app = express();

app.get('/api/price-feed', async(req, res)=>{
  try {
    const priceFeed = await getCoinFeed('bitcoin');
    return res.status(200).json({
      result: priceFeed,
    })
  } catch(err) {
    return res.status(500).json({
      err: err.toString(),
    })
  }
})

app.listen(3000,() => {
  console.log('running on port 3000');
})

//getLowHigh('bitcoin').then(data => console.log(data));
getRedditPost();
module.exports = { getLowHigh };
