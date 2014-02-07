var http = require('http'),
    mysql = require('mysql'),
    fs=require('fs'),
    JSONResponse = require('./JSONResponse'),
    cemetery = require('./cemeteries'),
    plots = require('./plots'),
    owners = require('./owners'),
    occupants = require('./occupants');

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
                    JSONResponse.send(response, data);
                });
            });
            break;
        case '/loadCemeteries' :
            cemetery.data.read(null, function(data) {
                JSONResponse.send(response, data);
            });
            break;
        case '/createCemetery' :
            request.on('data', function(chunk) {
                var data = JSON.parse(chunk);
                cemetery.data.create(data, function() {
                    JSONResponse.send(response);
                });
            });
            break;
        case '/updateCemetery' :
            request.on('data', function(chunk) {
                var data = JSON.parse(chunk);
                cemetery.data.update(data, function() {
                    JSONResponse.send(response);
                });
            });
            break;
        case '/deleteCemetery' :
            request.on('data', function(chunk) {
                var data = JSON.parse(chunk);
                cemetery.data.delete(data, function() {
                    JSONResponse.send(response);
                });
            });
            break;
        case '/createPlot':
            request.on('data', function(chunk) {
                var data = JSON.parse(chunk);
                plots.data.create(data, function(id) {
                    data = "{\"plot_id\":"+ id +"}";
                    JSONResponse.send(response, data);
                });
            });
            break;
        case '/updatePlot':
            request.on('data', function(chunk) {
                var data = JSON.parse(chunk);
                plots.data.update(data, function() {
                    JSONResponse.send(response);
                });
            });
            break;

        case '/deletePlot':
            request.on('data', function(chunk) {
                var data = JSON.parse(chunk);
                plots.data.delete(data.plot_id, function() {
                    JSONResponse.send(response);
                });
            });
            break;
        case '/loadPlots' :
            request.on('data', function(chunk) {
                var data = JSON.parse(chunk);
                plots.data.read(data.cem_id, function(data) {
                    JSONResponse.send(response, data);
                });
            });
            break;
        case '/loadOwner' :
            request.on('data', function(chunk) {
               var data = JSON.parse(chunk);
                owners.data.read(data.owner_id, function(data) {
                    JSONResponse.send(response, data);
                });
            });
            break;
        case '/createOwner' :
            request.on('data', function(chunk) {
                var data = JSON.parse(chunk);
                owners.data.create(data, function(data) {
                    JSONResponse.send(response, data);
                });
            });
            break;
        case '/updateOwner' :
            request.on('data', function(chunk) {
                var data = JSON.parse(chunk);
                owners.data.update(data.owner, function() {
                    JSONResponse.send(response);
                });
            });
            break;
        case '/deleteOwner' :
            request.on('data', function(chunk) {
                var data = JSON.parse(chunk);
                owners.data.delete(data.owner_id, function() {
                    JSONResponse.send(response);
                });
            });
            break;
        case '/loadOccupant' :
            request.on('data', function(chunk) {
                var data = JSON.parse(chunk);
                occupants.data.read(data.occupant_id, function(data) {
                    JSONResponse.send(response, data);
                });
            });
            break;
        case '/createOccupant' :
            request.on('data', function(chunk) {
                var data = JSON.parse(chunk);
                occupants.data.create(data, function(data) {
                    JSONResponse.send(response, data);
                });
            });
            break;
        case '/updateOccupant' :
            request.on('data', function(chunk) {
                var data = JSON.parse(chunk);
                occupants.data.update(data, function(data) {
                    JSONResponse.send(response);
                });
            });
            break;
        case '/deleteOccupant' :
            request.on('data', function(chunk) {
                var data = JSON.parse(chunk);
                occupants.data.delete(data.occupant_id, function() {
                    JSONResponse.send(response);
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