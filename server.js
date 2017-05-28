const Loger     = require('./loger');
const http      = require('http');
const colors    = require('colors');
//const config    = require('config');
//const md5       = require('md5');
//const router    = require('router');
//const validator = require('validator');
const WebSocket = require('ws');
const mongo    = require('mongodb').MongoClient;
//const bodyParser    = require('body-parser');
//const finalhandler  = require('finalhandler');
//const jsonWebToken  = require('json-web-token');
const request       = require('request');
const fs       = require('fs');

const wss = new WebSocket.Server({
    port: 1991
});

const loger = new Loger('server');
let usersConnect = 0;
let statUserAgents = [];

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

    wss.on('connection',(ws) => {
        //usersConnect++;
console.log('connect');
        ws.on('error', (err) => {
            loger.log(err);
        });
        ws.on('message', (message) => {
            let data = JSON.parse(message);
            console.log(data);
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
                loger.log('statusCode = '+response.statusCode);
                loger.log('error = '+error);
                loger.log('key = '+key);
                loger.log('userIp = '+userIp);
                loger.log('requestUrl = '+requestUrl);
                loger.log('userAgent = '+userAgent);
                loger.log('url = '+url);
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
                        console.log('response');
                        ws.send(body);
                    }
                }
            });
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
