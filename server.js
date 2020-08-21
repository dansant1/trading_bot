const express = require('express')
const bodyParser = require('body-parser');
const app = express()

const BOT = require("./bot.js")

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.send("BINANCE API MORANGESOFT")
})
 
const bot = app.route("/bot")

bot.post( function (req, res) {
    
    var d = new Date();
    d.setDate(d.getDate() - 1);

    var v = new Date();
    v.setDate(v.getDate() - 2);


    let symbol = req.body.symbol;
    let startTime =  v.getTime() //req.body.startTime;
    let endTime = d.getTime() //req.body.endTime;
    let interval = "5m" //req.body.interval;

    console.log( symbol )
    
    if ( symbol !== "" ) {
        BOT.getData( symbol, startTime, endTime, interval )

        res.send("OK")
    } 
})

 
app.use( function(req, res, next) {
    res.status(404);
});
 
app.listen(process.env.PORT || 8000, () => {
    console.log("SERVIDOR CORRIENDO")
})