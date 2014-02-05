var db = require('./mysql-connect');

exports.data = {
    create: function(data, callback) {
        var connection = db.connection.connect();
        connection.query('SELECT MAX(cem_id) AS id FROM arcgov.cemeteries;', function(err, rows) {
            var id = rows[0].id + 1,
                insertString = id+",'"+data.cemetery.cem_name+"','"+data.cemetery.cem_street+"','"+data.cemetery.cem_city+"','"+data.cemetery.cem_state+"','"+data.cemetery.cem_zip+"','"+data.cemetery.cem_capacity+"','"+data.org_id+"'";
            connection.query('INSERT INTO arcgov.cemeteries(cem_id,cem_name,cem_street,cem_city,cem_state,cem_zip,cem_capacity,org_id)' +
                'VALUES('+insertString+');', function(err) {
                connection.end();
                callback(err);
            });
        });
    },
    read: function(callback) {
        var connection = db.connection.connect();
        connection.query('SELECT * FROM arcgov.cemeteries;', function(err, rows) {
            callback(JSON.stringify(rows));
        });
    },
    update: function(data, callback) {
        var connection = db.connection.connect();
        connection.query("UPDATE arcgov.cemeteries " +
                            "SET cem_name='"+data.cemetery.cem_name+"'," +
                                "cem_street='"+data.cemetery.cem_street+"',"+
                                "cem_city='"+data.cemetery.cem_city+"'," +
                                "cem_state='"+data.cemetery.cem_state+"'," +
                                "cem_zip='"+data.cemetery.cem_zip+"'," +
                                "cem_capacity='"+data.cemetery.cem_capacity+"' " +
                            "WHERE cem_id="+data.cemetery.cem_id+" AND org_id="+ data.org_id+';',
        function(err) {
            connection.end();
            callback(err);
        });
    },
    delete: function(data, callback) {
        var connection = db.connection.connect();
        connection.query('DELETE FROM arcgov.cemeteries WHERE cem_id='+data.cem_id+' AND org_id='+data.org_id+';', function(err) {
            callback();
        });
    }
};

