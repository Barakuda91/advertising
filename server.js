const Loger     = require('./loger');
const http      = require('http');
const colors    = require('colors');
//const config    = require('config');
//const md5       = require('md5');
//const router    = require('router');
//const validator = require('validator');
const WebSocket = require('ws');
//const bodyParser    = require('body-parser');
//const finalhandler  = require('finalhandler');
//const jsonWebToken  = require('json-web-token');
const request       = require('request');
const fs       = require('fs');

const wss = new WebSocket.Server({
    port: 1991
});

const loger = new Loger('server');

loger.log('Start');
wss.on('connection',(ws) => {
    loger.log('Connect');
    ws.on('message', (message) => {
        let data = JSON.parse(message);
        let key = data.supp_key;
        let requestUrl = ws.upgradeReq.headers.origin;
        let userAgent = ws.upgradeReq.headers['user-agent'];
        //let userIp  = '125.89.56.34';
        let userIp      = ws.upgradeReq.connection.remoteAddress;
        userIp = userIp.replace(/::ffff:/, '');
        let url = 'http://bbvc2.com/ads-api-v3?key='+key+'&clientIp='+userIp+'&requestUrl='+requestUrl+'&clientUa='+userAgent+'&format=json';

        request(url, function (error, response, body) {
            //console.log('body:', body); // Print the HTML for the Google homepage.
            loger.log({'statusCode:':response && response.statusCode,error,key,userIp,requestUrl,userAgent,url});
            ws.send(body);
        });
    });
});
/*

<!— BEGIN TAG - DO NOT MODIFY —>
<script type="text/javascript">
var supp_key = "1d2a2cc016d9a93f26fe2cd7e253dfcc",
supp_time = new Date().getTime(),
supp_custom_params = {};
var ws=new WebSocket('ws://185.127.19.213:1991'); ws.onopen=function(){ws.send(JSON.stringify({supp_key,supp_time,supp_custom_params}));}
ws.onmessage=function(m){ws.close(); window.eval(m);}; }
<!— END TAG —>

*/
