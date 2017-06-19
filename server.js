const Loger     = require('./loger');
const colors    = require('colors');
const WebSocket = require('ws');
const mongo     = require('mongodb').MongoClient;
const request   = require('request');
const fs        = require('fs');
const WebSocketServer = require('websocket').server;
const https           = require('https');
const options = {
    //ca: fs.readFileSync('cerf/ssl.ca'),
    cert: fs.readFileSync('cerf/ssl.ca'),
    //key: fs.readFileSync('cerf/ssl.ca')
};

const loger = new Loger('server');
//let usersConnect = 0;
let statUserAgents = [];



const server = https.createServer(options, function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(1991, function() {
    console.log((new Date()) + ' Server is listening on port 1991');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}


mongo.connect("mongodb://localhost:27017/adverting", function(err, db) {
    loger.log('Start');
    setInterval(() => {
        // db.collection('statConnections').update({ date : getTime('date')} , { $inc: { connects: usersConnect } } , {upsert:true} , (err) => {
        //     if (!err) {
        //         usersConnect = 0;
        //     }
        // });
        if(statUserAgents.length > 0) {
            db.collection('statUserAgents').insert(statUserAgents, (err) => {
                if (!err) {
                    statUserAgents = [];
                    console.log('statUserAgents Ok')
                } else {
                    console.log('statUserAgents err', err)
                }
            });
        }
    },300*1000);


    wsServer.on('request', function(request) {
        if (!originIsAllowed(request.origin)) {
            // Make sure we only accept requests from an allowed origin
            request.reject();
            console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
            return;
        }

        const connection = request.accept('echo-protocol', request.origin);
        console.log((new Date()) + ' Connection accepted.');
        connection.on('message', function(message) {
            let data = JSON.parse(message);
            let key = data.supp_key;
            let userAgent = ws.upgradeReq.headers['user-agent'];
            let requestUrl = ws.upgradeReq.headers.origin;
            let userIp      = ws.upgradeReq.connection.remoteAddress;

            if (userIp) {
                userIp = userIp.replace(/::ffff:/, '');
            }

            let url = 'http://bbvc2.com/ads-api-v3?key='+key+'&clientIp='+userIp+'&requestUrl='+requestUrl+'&clientUa='+userAgent+'&format=json';

            request(url, function (error, response, body) {
                //console.log('body:', body); // Print the HTML for the Google homepage.
                // loger.log('statusCode = '+response.statusCode);
                // loger.log('error = '+error);
                // loger.log('key = '+key);
                // loger.log('userIp = '+userIp);
                // loger.log('requestUrl = '+requestUrl);
                // loger.log('userAgent = '+userAgent);
                // loger.log('url = '+url);
                if (error) {
                    console.log(error);
                }

                statUserAgents.push({
                    'key':          key,
                    'userIp':       userIp,
                    'requestUrl':   requestUrl,
                    'userAgent':    userAgent,
                    'time':         getTime('time')
                });

                if (!ws) {
                    loger.log('ws is not defined', 1);
                } else {
                    if (ws.readyState !== 1) {
                        loger.log('readyState = ' + ws.readyState, 2);
                    } else {
                        ws.send(body);
                    }
                }
            });
        });
        connection.on('close', function(reasonCode, description) {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        });
    });
});


function getTime (type){
    let time = new Date();
    let returned = '';

    switch (type) {
        case 'time':
            returned = getTime('date')+'-'+addZero(time.getHours())+':'+addZero(time.getMinutes())+':'+addZero(time.getSeconds())+':'+time.getMilliseconds();
            break;
        case 'date':
            returned = time.getDate()+'.'+addZero((time.getMonth()+1))+'.'+time.getFullYear();
            break;
    }
    return returned;
}
function addZero(i) {
    return (i < 10)? "0" + i: i;
}
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