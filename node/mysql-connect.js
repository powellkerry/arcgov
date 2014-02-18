var mysql = require('mysql');

exports.connection = {
    connect: function () {
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'arcgov',
            database: 'arcgov'
        });
        connection.connect();
        return connection;
    }
};