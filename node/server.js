var http = require('http'),
    mysql = require('mysql'),
    fs=require('fs'),
    cemetery=require('./cemeteries');

var mime = require('mime');

http.createServer(function(request, response) {
    if (request.url == '/') {
        request.url = '/index.html';
    }
    switch (request.url) {
        case '/loadCemetery' :
            request.on('data', function(chunk) {
                var data = JSON.parse(chunk);
                cemetery.data.read(data.cem_id, function(data) {
                    response.writeHeader(200, {"Content-Type": "application/json"});
                    response.write(data);
                    response.end();
                });
            });
            break;
        case '/loadCemeteries' :
            cemetery.data.read(null, function(data) {
                response.writeHeader(200, {"Content-Type": "application/json"});
                response.write(data);
                response.end();
            });
            break;
        case '/createCemetery' :
            request.on('data', function(chunk) {
                var data = JSON.parse(chunk);
                cemetery.data.create(data, function() {
                    response.writeHeader(200, {"Content-Type": "application/JSON"});
                    response.end();
                });
            });
            break;
        case '/updateCemetery' :
            request.on('data', function(chunk) {
                var data = JSON.parse(chunk);
                cemetery.data.update(data, function() {
                    response.writeHeader(200, {"Content-Type": "application/JSON"});
                    response.end();
                });
            });
            break;
        case '/deleteCemetery' :
            request.on('data', function(chunk) {
                var data = JSON.parse(chunk);
                cemetery.data.delete(data, function() {
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