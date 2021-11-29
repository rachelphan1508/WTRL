const axios = require('axios');

/**
 * getPriceFeed
 * @returns {Object} returns the data cointaining the first results ordered by ranking
 */
//just made a change
async function getPriceFeed(){
  try{
    // Documentation:
    // https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyListingsLatest
    const siteURL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';

    const response = await axios.get(siteURL, {
      method: 'GET',
      params: {
        // 'start': '1',
        'limit': '10',
        'convert': 'USD'
      },
      headers: {
        'X-CMC_PRO_API_KEY': process.env['coinmarketcap_R']
      }
    });

    return response.data.data;
  }
  catch(e){
    console.log(e);
  }
}

/**
 * getCoinFeed
 * Params:
 * @param {string} name is the slug/symbol/id of the currency to search for
 * @param {number=} type = 0 means that it is set to 0 if not defined in call (optional)
 * @returns {Object|number} returns the data of the first coin found with a specified name or a number containing the error status
 */
async function getCoinFeed(name, type = 0){
  try{
    // Documentation:
    // https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyQuotesLatest
    const siteURL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';
    let currency = "USD";
    name = name.toLowerCase();
    let needle = { symbol : name, convert : currency };
    if(type == 0)
      needle = { slug : name, convert : currency };
    const response = await axios.get(siteURL, {
      method: 'GET',
      params: needle,
      headers: {
        'X-CMC_PRO_API_KEY': process.env['coinmarketcap_D']
      }
    });
    //console.log(response.data.data);
    for(let i in response.data.data) {
      for(let j in response.data.data[i].quote[currency]){
        let x = response.data.data[i].quote[currency][j];
        if(typeof(x) == 'number'){
          let decimals = -Math.floor(Math.log10(x) + 1);
          if(decimals > 2 && x != 0){
            response.data.data[i].quote[currency][j] = x.toFixed(decimals + 1);
          }
          else if(x != 0)
            response.data.data[i].quote[currency][j] = x.toFixed(2);
        }
      }
      //console.log(response.data.data[i]);
      return response.data.data[i]; 
    }//so it returns just the first result
  }
  catch(e){
    if(e.response.status == 400){
      if(type == 0)
        return getCoinFeed(name, 1);
      else
        return e.response.status;
    }
    console.log("Error at coinmarketcap.js getCoinFeed function\n" + e);
    return e.response.status;//some error other than 400
  }
}

//yay!}
//getCoinFeed("1027", 0).then((data) => console.log(data));
module.exports = { getPriceFeed, getCoinFeed };