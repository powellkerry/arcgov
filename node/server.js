var http = require('http'),
    mysql = require('mysql'),
    fs=require('fs').
    cemeteries=require('./cemeteries');

var mime = require('mime');

http.createServer(function(request, response) {
    if (request.url == '/') {
        request.url = '/index.html';
    }
    switch (request.url) {
        case '/loadCemeteries' :
            var connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'arcgov',
                database: 'arcgov'
            });
            connection.connect();
            connection.query('SELECT * FROM arcgov.cemeteries', function(err, rows) {
                response.writeHeader(200, {"Content-Type": "application/json"});
                response.write(JSON.stringify(rows));
                response.end();
            });
            connection.end();
            break;
        case '/createCemetery' :
            request.on('data', function(chunk) {
                var data = JSON.parse(chunk.toString());
                console.log(cemeteries);
                cemeteries.create(data, function() {
                    response.writeHeader(200, {"Content-Type": "application/JSON"});
                    response.end();
                });
            });
            break;
        default:
            var requestUrl = request.url.substr(1, request.url.length);
            fs.readFile(requestUrl ,function(err, html) {
                if (err) {
                    console.log(err);
                } else {
                    response.writeHeader(200, {"Content-Type": mime.lookup(requestUrl)});
                    response.write(html);
                    response.end();
                }
            });
            break;
    }

}).listen(8080);