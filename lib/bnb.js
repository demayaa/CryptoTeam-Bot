var  fetch = require("node-fetch");
var jsonInterface = require('human-standard-token-abi')
var apikey = 'NHRGCP9D3YS9IPNNRYXB7P3XBSSA41XP3D'
//var address = '0x33d290C2C7264Dd239CDbBB842CaB5028C8b36ee'
var Contract = require('web3-eth-contract');
Contract.setProvider('https://bsc-dataseed3.defibit.io/');


exports.bala = async (address) => {
    var {result} = await fetch(`https://api.bscscan.com/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=Infinity&sort=asc&apikey=${apikey}`).then(res => res.json())
    
    var tx = []
    result.map((data) => {
        if(data.to.toLowerCase() === address.toLowerCase()){
            tx.push(data)
        }
    })
    var removeDuplicat = [... new Map(tx.map(item => [item['tokenSymbol'], item])).values()]
    
    var bal = []
    for(let i of removeDuplicat){
        var contract = new Contract(jsonInterface, i.contractAddress);
        var symbol =  await contract.methods.symbol().call();
        var decimal = await contract.methods.decimals().call()
        var balance = await contract.methods.balanceOf(address).call() / 10 ** decimal
        
        bal.push({symbol, balance})
    }
    
    var yes = bal.filter(({balance}) => balance > 0)
    var r = []
    for(let e of yes){
        r.push(`${e.symbol} : ${e.balance}\n`)
    }
    return `
*━━°❀ ❬ * Balance * ❭ ❀°━━*

account : ${address}
balance : 
${r.join('')}`
}



exports.screen = async (coin, interval) => {
    const rawResponse = await fetch('http://45.32.113.224:3000/screen', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({url:`http://45.32.113.224/?coin=${coin.toUpperCase()}&&interval=${interval}`})
    }).then(res => res.json())
    return rawResponse.data
}