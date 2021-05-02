const Web3 = require("web3");

const SHA256 = require("crypto-js/sha256");

class Accounts {
    constructor(){
        this.user = []
        this.url = {
            testnet:'https://ropsten.infura.io/v3/c8c68171ab784466b1fa039562b02cb0',
            mainnet:'https://bsc-dataseed3.defibit.io/'
        }
        this.data = []
        this.cl = []
    }
    
    addAddress(data){
        const cek = this.user.find(({user}) => user === data.user)
        if(cek){
            const cekAddress = cek.address.find((add) => add === data.address)
            if(cekAddress){
                return 'address dah ada !!!'
            }else{
                cek.address.push(data.address.toLowerCase())
                return 'success'
            }
        } else {
            this.user.push({
                user: data.user,
                address: [data.address.toLowerCase()]
            })
            return 'success'
        }
    }
    
    async checker(client){
        try {
        this.web3 = new Web3(this.url.testnet)
        const block = await this.web3.eth.getBlock("latest");
        if (block && block.transactions) {
            for (let i of block.transactions) {
                const tx = await this.web3.eth.getTransaction(i)
                const {blockNumber,from,to,value, hash} = tx
                for(let e of this.user){
                    if(to !== null){
                        const a = e.address.find((address) => address === to.toLowerCase())
                        if(a){
                            this.database(client,{blockNumber,from,to,value, hash})
                            console.log(this.cl[this.cl.length - 1])
                        }
                    }
                }
            }
        }
        } catch (e) {console.log(e.message)}
    }
    
    database(client,data){
        data.tm = Date.now()
        data.hash = SHA256(JSON.stringify(data)).toString()
        this.data.push(data)
        let ar = this.data.filter((v,i,a)=>a.findIndex(t=>(t.hash === v.hash))===i)
        let num = ar.find(({hash}) => hash == data.hash)
        console.log(num)
    }
}


module.exports = Accounts;

/*
ioClient.on("pending-transaction", async (hash) => {
    try {
        const web3 = new Web3("https://bsc-dataseed3.defibit.io/");
        const tx = await web3.eth.getTransaction(hash)
        const {blockNumber,from,to,value} = tx
        
        user.map((address) => {
            
        })
        
    } catch (e) {}
});

                const web3 = new Web3("https://bsc-dataseed3.defibit.io/");
                const tx = await web3.eth.getTransaction(hash)
                const {blockNumber,from,to,value} = tx*/
                