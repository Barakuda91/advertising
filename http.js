const http = require('http');
const fs = require('fs')


http.createServer(function(request, response){
    fs.readFile('page.html', function(err, data) {
        response.writeHead(200, {'Content-type': 'text/html; charset=utf-8'});
        response.write(data);
        response.end();
    });

}).listen(7000);