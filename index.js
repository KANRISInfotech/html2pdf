const express = require('express');
const bodyParser = require('body-parser');
/* const path = require('path'); */
const puppeteer = require('puppeteer');
const fs = require('fs');
var cors = require('cors');
var url = require('url');
const app = express();



//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use('/public', express.static(path.join(__dirname, 'public'))); 
//app.use(cors());
app.use(cors({
    origin: 'http://localhost'
}));

app.get('/html2pdf', (req, res) => {
    /* createUrl = req.body.link; */
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var link = req.query.link;
    var pdf_name;
    if (!req.query.name) {
        pdf_name = 'test.pdf'
    } else {
        pdf_name = req.query.name + '.pdf';
    }
    var pdf = function(args) {
            return args;
        }
        (async() => {
            console.log('Service started');
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(link, { waitUntil: 'networkidle2' });
            await page.emulateMedia('screen');
            await page.waitFor(30000);
            var pdf = await page.pdf({ format: 'Letter', printBackground: true, });
            await browser.close();
            console.log("pdf converted")
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=' + pdf_name);
            //var data = fs.readFileSync('./test.pdf');
            res.send(pdf);
        })();
});

app.get('/html2png', (req, res) => {
    /* createUrl = req.body.link; */
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var link = req.query.link;
    var name;
    if (!req.query.name) {
        name = 'test.png'
    } else {
        name = req.query.name + '.png';
    }
    var pdf = function(args) {
            return args;
        }
        (async() => {
            console.log('Service started');
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setViewport({ width: 1440, height: 2560 });
            await page.goto(link, { waitUntil: 'networkidle2' });
            await page.emulateMedia('screen');
            await page.waitFor(10000);
            var png = await page.screenshot({ printBackground: true, fullPage: true });

            await browser.close();
            console.log("Image created - " + name);
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Content-Disposition', 'attachment; filename=' + name);
            res.send(png);
        })();
});

app.listen(4000, () => console.log('server started.....'));