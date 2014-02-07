var db = require('./mysql-connect');

exports.data = {
    create: function(data, callback) {
        var connection = db.connection.connect();
        connection.query('SELECT MAX(plot_id) AS id FROM arcgov.plots;', function(err,rows) {
            var id, insertString;
            if (rows && rows.length > 0) {
                id = rows[0].id + 1;
            } else {
                id = 1;
            }
            insertString = "INSERT INTO arcgov.plots(plot_id, cem_id, plot_address, plot_price)" +
                "VALUES('"+id+"','"+data.cem_id+"','"+data.plot.plot_address+"','"+data.plot.plot_price+"')";
            connection.query(insertString, function(err) {
                callback(id);
                connection.end();
            });
        });
    },
    read: function(cem_id, callback) {
        var connection = db.connection.connect();
        connection.query('SELECT * FROM arcgov.plots WHERE cem_id='+cem_id+';', function(err, rows) {
            callback(JSON.stringify(rows));
            connection.end();
        });
    },
    update: function(data, callback) {
        var connection = db.connection.connect(),
            sql = "UPDATE arcgov.plots " +
            "SET plot_address='"+data.plot.plot_address+"', " +
                "plot_price='"+data.plot.plot_price+"'" +
            "WHERE plot_id="+data.plot.plot_id+" AND cem_id="+data.cem_id+";";
        connection.query(sql, function(err) {
            callback();
            connection.end();
        });
    },
    delete: function(plot_id, callback) {
        var connection = db.connection.connect(),
            sql = "DELETE FROM arcgov.plots WHERE plot_id="+plot_id+";";
        connection.query(sql, function() {
            callback();
            connection.end();
        });
    }
};
