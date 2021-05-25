const puppeteer = require('puppeteer');
const ex = require('express')
const bp = require('body-parser')
const fs = require('fs')


var app = new ex()
app.use(bp.json())
app.get('/',(req,res) => {
   res.json('hello')
})

app.post('/screen', (req, res) => {
    var {url} = req.body;
    var browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    var page = await browser.newPage();
    await page.goto(url);
    await page.waitFor(1000);
    await page.screenshot({ path: 'example.png' });
    await browser.close();
    
    const contents = fs.readFileSync('./example.png', {encoding: 'base64'});
    res.json({data: contents})
})

app.listen(3000, () => {console.log('running')})

