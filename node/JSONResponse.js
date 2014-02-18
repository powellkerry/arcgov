exports.send = function (response, data) {
    response.writeHeader(200, {"Content-Type": "application/json"});
    if (data) {
        response.write(data);
    }
    response.end();
};