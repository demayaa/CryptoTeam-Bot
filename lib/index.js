require('moment-duration-format')
const { formatCurrency } = require("@coingecko/cryptoformat");
const translate = require('@iamtraction/google-translate');
const moment = require('moment'); // 
const fetch = require("node-fetch");

exports.info = (data) => {
    function c(text) {
        if(text === 'undefined'){
            return '-'
        } else{
            return text
        }
    }
    
    const result = `
*━━°❀ ❬  ${data.name} ❭ ❀°━━*

*coin name   : ${data.name}*
*coin symbol : ${data.symbol}*
*category    : ${data.category}*
*Website     : ${c(data.urls.website[0])}*
*twitter     : ${c(data.urls.twitter[0])}*
*description :*

${data.description}

*Coinmarketcap*
    `
    return result
}


exports.price = (data, conveter) => {
    const quote = data.quote[conveter.toUpperCase()]
    
    const result = `
*━━°❀ ❬  ${data.name} ❭ ❀°━━*

*price : ${formatCurrency(quote.price, conveter.toUpperCase(), 'en')}*
*Volume 24 hours : ${formatCurrency(quote.volume_24h, conveter.toUpperCase(), 'en')}*
*percent 1 hours : ${quote.percent_change_1h} %*
*percent 24 hours : ${quote.percent_change_24h} %*
*percent 7 days : ${quote.percent_change_7d} %*
*percent 30 days : ${quote.percent_change_30d} %*
*market cap : ${formatCurrency(quote.market_cap, conveter.toUpperCase(), 'en')}*
*last updated : ${quote.last_updated}*

*Coinmarketcap*
`
return result
}

exports.calc = (data, currency) => {
    const quote = data.quote[currency.toUpperCase()]
    let cl;
    if(currency == 'IDR'){
        cl = formatCurrency(quote.price, currency, 'id')
    } else {
        cl = formatCurrency(quote.price, currency, 'en')
    }
    const res = `
*━━°❀ ❬  Calculator Crypto ❭ ❀°━━*

Coin       : ${data.name} / ${data.symbol}
Total      : ${data.amount}
Hasil      : ${cl}

*Coinmarketcap*
`
    return res
}

exports.market = async (data, coin) => {
    const ta = []
    
    for(let e=0; e<data.tickers.length;e++){
        ta.push({
            name:data.tickers[e].market.name,
            price:data.tickers[e].converted_last.usd
        })
    }
    const same = [... new Map(ta.map(item => [item['name'], item])).values()]
    const final = []
    
    same.forEach(i => { final.push(`${i.name} = ${formatCurrency(i.price, "USD", "en")} / ${formatCurrency(i.price * 14000, 'IDR', 'id')}`);})
    
    const res = `
*━━°❀ ❬  Market ${coin} ❭ ❀°━━*

${final.join('=>').replace(/=>/g,"\n")}

*Coingecko*
`   
    return res
}

exports.trans = async (data, to) => {
    const res = await translate(data, { to: to }).catch(err => {})
    if(res == undefined || res == null){
        return 'Translate Error'
    } else {
        return res.text
    }
}


const pr = async (eth) => {
    data = await fetch(`https://pro-api.coinmarketcap.com/v1/tools/price-conversion?amount=${eth}&symbol=ETH&convert=USD`, { headers:  { "X-CMC_PRO_API_KEY": "71e8a17e-6178-45c2-b5a3-79caea07e303", Accept: "application/json" } }).then((res) => res.json());
    res = data.data.quote["USD"];
    return res.price
}

exports.gas = async () => {
    const data = await fetch('https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=DNCWUIR9GBCS7DIERYIIWPZ9Z2117IJ9ZZ').then(res => res.json())
    const {LastBlock,SafeGasPrice, ProposeGasPrice, FastGasPrice} = data.result
    const b = [SafeGasPrice,ProposeGasPrice,FastGasPrice]
    const bb = ["Safe GasPrice", "Propose GasPrice", "Fast GasPrice"]
    const r = []
    for(let i in b){
        const da = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasestimate&gasprice=${b[i]*1000000000}&apikey=DNCWUIR9GBCS7DIERYIIWPZ9Z2117IJ9ZZ`).then(res => res.json());
        let t;
        if(da.result<100){
            t = 'seconds'
        }else{
            t = 'minute'
        }
        let eth = b[i] *21000 / 1000000000;
        let erc = b[i] * 3 *21000 / 1000000000;
        r.push(`*${bb[i]}*\nETH : ${eth} / ${formatCurrency(await pr(eth), 'USD', 'en')}\nERC20 : ${erc} / ${ formatCurrency(await pr(erc), 'USD', 'en')}\nEstimate : ${moment.duration(da.result,"seconds").format("mm:ss")} ${t}\n`)
    }
    
        return `
*━━°❀ ❬ *Gas Tricker* ❭ ❀°━━*
*Last Block : ${LastBlock}*
${r.join('=>').replace(/=>/g,"\n")}

*Etherscan.io*
`
    
}

exports.menu = () => {
    const res = `
*━━°❀ ❬ *Menu* ❭ ❀°━━*

*.info*
info coin by coinmarketcap

*.p*
price coin by coinmarketcap

*.calc* 
calculator by coinmarketcap

*.market* 
coin market by coingecko

*.trans* 
Translate

*.gas* 
gasTricker by etherscan

*.balance*
get balance from bsc address

*.menu*
info command bot
`
return res
}


exports.userAccount = function(nomor, address){
    
}