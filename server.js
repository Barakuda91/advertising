//const loger     = require('./loger');
const http      = require('http');
//const colors    = require('colors');
//const config    = require('config');
//const md5       = require('md5');
//const router    = require('router');
//const validator = require('validator');
const WebSocket = require('ws');
//const bodyParser    = require('body-parser');
//const finalhandler  = require('finalhandler');
//const jsonWebToken  = require('json-web-token');
const request       = require('request');

const wss = new WebSocket.Server({
    port: 1991
});

wss.on('connection',(ws) => {
    console.log('Connect');
    ws.on('message', (message) => {
        let data = JSON.parse(message);
        let key = data.supp_key;
        let url = 'http://bbvc2.com/ads-api-v3?key='+key;
        request(url, function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.
            ws.send(JSON.stringify({body}));
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
