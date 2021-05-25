const { WAConnection, MessageType, Presence, Mimetype, GroupSettingChange } = require("@adiwajshing/baileys");
const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType;
const { formatCurrency } = require("@coingecko/cryptoformat");
const fs = require("fs");
const fetch = require("node-fetch");
const { info, price, calc, market, trans, gas, menu } = require("./lib");
var {bala, screen} = require('./lib/bnb')
const api = {
    url: "https://pro-api.coinmarketcap.com/v1/",
    key: { "X-CMC_PRO_API_KEY": "71e8a17e-6178-45c2-b5a3-79caea07e303", Accept: "application/json" },
};



const prefix = ".";
const client = new WAConnection();
client.on("qr", () => {
    console.log("scan qr");
});

client.on("credentials-updated", () => {
    fs.writeFileSync("./session.json", JSON.stringify(client.base64EncodedAuthInfo(), null, "\t"));
});

fs.existsSync("./session.json") && client.loadAuthInfo("./session.json");

client.on("connecting", () => {});

client.on("open", () => {});

client.connect({ timeoutMs: 30 * 1000 });
client.on("group-participants-update", async (m) => {
    const mtd = await client.groupMetadata(m.jid);
});

client.on("message-new", async (i) => {
    const reply = (teks) => {
            const from = i.key.remoteJid;
            client.sendMessage(from, teks, text, { quoted: i });
            
        };
    try {
        if (!i.message) return; // console.log(i);
        if (i.key && i.key.remoteJid == "status@broadcast") return;
        //if (i.key.fromMe) return;
        //const from = i.key.remoteJid;
        global.prefix;
        const from = i.key.remoteJid;
        const type = Object.keys(i.message)[0];
        const body =
            type === "conversation" && i.message.conversation.startsWith(prefix)
                ? i.message.conversation
                : type == "imageMessage" && i.message.imageMessage.caption.startsWith(prefix)
                ? i.message.imageMessage.caption
                : type == "videoMessage" && i.message.videoMessage.caption.startsWith(prefix)
                ? i.message.videoMessage.caption
                : type == "extendedTextMessage" && i.message.extendedTextMessage.text.startsWith(prefix)
                ? i.message.extendedTextMessage.text
                : "";
        const botNumber = client.user.jid
        const adminbotnumber = ["62895330199403@s.whatsapp.net"];
        const isGroup = from.endsWith("@g.us");
        const sender = isGroup ? i.participant : i.key.remoteJid;
        const g = isGroup ? await client.groupMetadata(from) : ''
        
        
        const isadminbot = adminbotnumber.includes(sender)
        const groupName = isGroup ? g.subject : ''
		const groupId = isGroup ? g.jid : ''
		const groupMembers = isGroup ? g.participants : ''
		const groupDesc = isGroup ? g.desc : ''
        
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
        
        if(command === 'info'){
            const com = body.split(" ");
            coin = com[1]
            if(coin === 'undefined') return reply('coin nya mana')
            const data = await fetch(`${api.url}cryptocurrency/info?symbol=${coin.toUpperCase()}`, { headers: api.key }).then((res) => res.json())
            reply(info(data.data[coin]))
        }
        
        if(command === 'p'){
            const com = body.split(" ");
            const coin = com[1] || "BTC";
            const convertter = com[2] || "USD";
            //console.log(convertter)
            if(coin === 'undefined') return reply('coin nya mana')
            const data = await fetch(`${api.url}cryptocurrency/quotes/latest?symbol=${coin.toUpperCase()}&&convert=${convertter.toUpperCase()}`, { headers: api.key }).then((res) => res.json())
            reply(price(data.data[coin.toUpperCase()], convertter))
        }
        
        if(command === 'calc'){
            const com = body.split(' ')
            const amount = com[1];
            const coin = com[2]
            if(coin === 'undefined') return reply('coin nya mana')
            const convertter = com[3] || 'USD'
            const data = await fetch(`${api.url}tools/price-conversion?amount=${amount}&symbol=${coin.toUpperCase()}&convert=${convertter.toUpperCase()}`, { headers: api.key }).then((res) => res.json());
            data.data.amount = amount;
            reply(calc(data.data, convertter))
        }
        
        if (command === 'market'){
            const coinL = await fetch('https://api.coingecko.com/api/v3/coins/list').then(res => res.json())
            const coin = body.split(' ')[1]
            if(coin === 'undefined') return reply('coin nya mana')
            let coin_id
            for(let i of coinL){
                if(i.symbol == coin.toLowerCase()){
                    coin_id = i.id
                }
            }
            
            const data = await fetch(`https://api.coingecko.com/api/v3/coins/${coin_id}`).then(res => res.json());
            reply(await market(data, coin))
        }
        
        if (command === 'trans'){
            const text = body.slice(10);
            const code = body.split(' ')[1];
            reply( await trans(text, code))
        }
        
        if(command === 'balance'){
            const address = body.split(' ')[1]
            const balance = await bala(address)
            reply(balance)
        }
        
        if (command === 'tv'){
            const coin = body.split(' ')[1] || 'BTC';
            const int = body.split(' ')[2] || 1;
            
            const buff = new Buffer.from(await screen(coin,int), 'base64')
            client.sendMessage(from, buff, image, {quoted: i})
        }
        
        if (command === 'gas'){
            reply(await gas())
        }
        
        if(command === 'menu'){
            reply(menu())
        }

    } catch (e) {
        reply('_Command salah / coin tidak ada coba cek ulang_');
    }
});

