var mysql = require('mysql');

cemeteries = {};

cemeteries.create = function(data, callback) {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'arcgov',
        database: 'arcgov'
    });
    connection.connect();
    connection.query('SELECT MAX(cem_id) AS id FROM arcgov.cemeteries;', function(err, rows) {
        var id = rows[0].id + 1,
            insertString = id+",'"+data.cemetery.cem_name+"','"+data.cemetery.cem_street+"','"+data.cemetery.cem_city+"','"+data.cemetery.cem_state+"','"+data.cemetery.cem_zip+"','"+data.cemetery.cem_capacity+"','"+data.org_id+"'";
        connection.query('INSERT INTO arcgov.cemeteries(cem_id,cem_name,cem_street,cem_city,cem_state,cem_zip,cem_capacity,org_id)' +
            'VALUES('+insertString+');', function(err) {
            connection.end();
            callback(err);
        });
    });
}

