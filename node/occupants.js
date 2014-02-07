var db = require('./mysql-connect');

exports.data = {
    create: function(data, callback) {
        var connection = db.connection.connect(),
            occupant = data.occupant,
            plot = data.plot,
            sql;

        sql = "SELECT MAX(occupant_id) AS id FROM arcgov.occupants;";
        connection.query(sql, function(err, rows) {
            var id;
            if (rows && rows[0].id !== null) {
                id = rows[0].id;
            } else {
                id = 1;
            }
            sql = "INSERT INTO arcgov.occupants(occupant_id, occupant_first_name, occupant_last_name, " +
                "occupant_gender, occupant_birth_date, occupant_death_date)" +
                "VALUES ('"+id+"','"+occupant.occupant_first_name+"','"+occupant.occupant_last_name+"'," +
                "'"+occupant.occupant_gender+"','"+occupant.occupant_birth_date+"'," +
                "'"+occupant.occupant_death_date+"');";
            connection.query(sql, function(err) {
                 sql = "UPDATE arcgov.plots " +
                        "SET occupant_id = "+id+
                        " WHERE plot_id="+plot.plot_id+";";
                connection.query(sql, function(err) {
                    connection.end();
                    callback(JSON.stringify({occupant_id: id}));
                });
            });
        });
    },
    read: function(occupant_id, callback) {
        var connection = db.connection.connect(),
            sql;
        if (occupant_id) {
            sql = "SELECT * FROM occupants WHERE occupant_id="+occupant_id+";";
        } else {
            sql = "SELECT * FROM occupants;";
        }
        connection.query(sql, function(err, rows) {
            callback(JSON.stringify(rows));
            connection.end();
        });
    },
    update: function(data, callback) {
        var occupant = data.occupant,
            connection = db.connection.connect(),
            sql;

        sql = "UPDATE arcgov.occupants " +
              "SET occupant_first_name='"+occupant.occupant_first_name+"'," +
                  "occupant_last_name='"+occupant.occupant_last_name+"'," +
                  "occupant_gender='"+occupant.occupant_gender+"'," +
                  "occupant_birth_date='"+occupant.occupant_birth_date+"'," +
                  "occupant_death_date='"+occupant.occupant_death_date+"' " +
              "WHERE occupant_id="+occupant.occupant_id+";";

        connection.query(sql, function(err) {
            callback();
            connection.end();
        });

    },
    delete: function(occupant_id, callback) {
        var connection = db.connection.connect(),
            sql;

        sql = "UPDATE arcgov.plots SET occupant_id=null WHERE occupant_id="+occupant_id+";";
        connection.query(sql, function(err) {
            sql = "DELETE FROM arcgov.occupants WHERE occupant_id="+occupant_id+";";
            connection.query(sql, function(err) {
                callback();
                connection.end();
            });
        });

    }
};

