var http = require('http'),
    mysql = require('mysql'),
    fs=require('fs'),
    JSONResponse = require('./JSONResponse'),
    cemetery = require('./cemeteries'),
    plots = require('./plots'),
    owners = require('./owners'),
    occupants = require('./occupants'),
    authentication = require('./authentication'),
    mime = require('mime'),
    processRequest = function(request, response, data) {
        switch (request.url) {
            case '/loadCemetery' :
                cemetery.data.read(data.cem_id, function(data) {
                    JSONResponse.send(response, data);
                });
                break;
            case '/loadCemeteries' :
                cemetery.data.read(null, function(data) {
                    JSONResponse.send(response, data);
                });
                break;
            case '/createCemetery' :
                cemetery.data.create(data, function() {
                    JSONResponse.send(response);
                });
                break;
            case '/updateCemetery' :
                cemetery.data.update(data, function() {
                    JSONResponse.send(response);
                });
                break;
            case '/deleteCemetery' :
                cemetery.data.delete(data, function() {
                    JSONResponse.send(response);
                });
                break;
            case '/createPlot':
                plots.data.create(data, function(id) {
                    data = "{\"plot_id\":"+ id +"}";
                    JSONResponse.send(response, data);
                });
                break;
            case '/updatePlot':
                plots.data.update(data, function() {
                    JSONResponse.send(response);
                });
                break;

            case '/deletePlot':
                plots.data.delete(data.plot_id, function() {
                    JSONResponse.send(response);
                });
                break;
            case '/loadPlots' :
                plots.data.read(data.cem_id, function(data) {
                    JSONResponse.send(response, data);
                });
                break;
            case '/loadOwner' :
                owners.data.read(data.owner_id, function(data) {
                    JSONResponse.send(response, data);
                });
                break;
            case '/createOwner' :
                owners.data.create(data, function(data) {
                    JSONResponse.send(response, data);
                });
                break;
            case '/updateOwner' :
                owners.data.update(data.owner, function() {
                    JSONResponse.send(response);
                });
                break;
            case '/deleteOwner' :
                owners.data.delete(data.owner_id, function() {
                    JSONResponse.send(response);
                });
                break;
            case '/loadOccupant' :
                occupants.data.read(data.occupant_id, function(data) {
                    JSONResponse.send(response, data);
                });
                break;
            case '/createOccupant' :
                occupants.data.create(data, function(data) {
                    JSONResponse.send(response, data);
                });
                break;
            case '/updateOccupant' :
                occupants.data.update(data, function(data) {
                    JSONResponse.send(response);
                });
                break;
            case '/deleteOccupant' :
                occupants.data.delete(data.occupant_id, function() {
                    JSONResponse.send(response);
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
    };

http.createServer(function(request, response) {
    if (request.url == '/') {
        request.url = '/index.html';
    }
    if (authentication.data.restrictedUrls.indexOf(request.url) == -1) {
        switch (request.url) {
            case '/register' :
                request.on('data', function(chunk) {
                    var data = JSON.parse(chunk);
                    authentication.data.createUser(data.user, function() {
                        JSONResponse.send(response);
                    });
                });
                break;
            case '/login':
                request.on('data', function(chunk) {
                    var data = JSON.parse(chunk);
                    authentication.data.login(data.email, function(data) {
                        JSONResponse.send(response, data);
                    });
                });
                break;
            default :
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

    } else {
        request.on('data', function(chunk) {
            var data = JSON.parse(chunk);
            authentication.data.authenticate(request.url, data.auth, function(authenticated) {
                if (authenticated) {
                    processRequest(request, response, data);
                } else {
                    response.writeHeader(401, {"Content-Type": "Application/JSON"});
                    response.write(JSON.stringify({error:"User not authenticated"}));
                    response.end();
                }
            });
        });
    }
}).listen(8080);