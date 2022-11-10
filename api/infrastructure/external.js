const axios = require('axios');
const regex = new RegExp(`(USD)([A-Z]{3})`)
const config = require('../../config.json');

exports.getCurrencyConversion = async (from, to, value)=>{
    
    let currencyValues = [];
    try{
        const URL = `https://api.apilayer.com/currency_data/live?source=${from}&currencies=${to}`  
        const currenyLayerResponse = await axios.get(URL, { headers: { apikey: config.currenyLayer } })
        const { quotes } = currenyLayerResponse.data;
        Object.entries(quotes).map(([currency,conversionRate])=>{
            const regexResponse = currency.match(regex)
            const toCurrency = regexResponse[2]
            currencyValues.push({price: Math.round(value*conversionRate,2), currency : toCurrency})
        })
    }catch(e){
        console.log(e)
        throw e
    }
    return currencyValues
}