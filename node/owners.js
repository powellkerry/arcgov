var db = require('./mysql-connect');

exports.data = {
    create: function(data, callback) {
       var owner = data.owner,
           plot = data.plot,
           connection = db.connection.connect();

        connection.query('SELECT MAX(owner_id) AS id FROM arcgov.owners', function(err, rows) {
            var id,
                sql;
            if (rows && rows.length > 0) {
                id = rows[0].id +1;
            } else {
                id=1;
            }
            sql = "INSERT INTO arcgov.owners(owner_id, owner_first_name,owner_last_name," +
                                            "owner_street,owner_city,owner_state,owner_zip," +
                                            "owner_billing_street,owner_billing_city,owner_billing_state," +
                                            "owner_billing_zip)" +
                "VALUES("+id+",'"+owner.owner_first_name+"','"+owner.owner_last_name+"'," +
                        "'"+owner.owner_street+"','"+owner.owner_city+"','"+owner.owner_state+"','"+owner.owner_zip+"'," +
                        "'"+owner.owner_billing_street+"','"+owner.owner_billing_city+"','"+owner.owner_billing_state+"'," +
                        "'"+owner.owner_billing_zip+"');";
            connection.query(sql, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    connection.query("UPDATE arcgov.plots SET owner_id="+id+" WHERE plot_id="+plot.plot_id+";", function(err) {
                        callback(JSON.stringify({owner_id: id}));
                        connection.end();
                    });
                }
            });
        });
    },
    read: function(owner_id, callback) {
        var connection = db.connection.connect(),
            sql;
        if (owner_id) {
            sql = "SELECT * FROM arcgov.owners WHERE owner_id="+owner_id+";";
        } else {
            sql = "SELECT * FROM arcgov.owners";
        }
        connection.query(sql, function(err, rows) {
            callback(JSON.stringify(rows));
            connection.end();
        });
    },
    update: function(owner, callback) {
        var connection = db.connection.connect(),
            sql;

        sql = "UPDATE arcgov.owners " +
                "SET owner_first_name='"+owner.owner_first_name+"'," +
                    "owner_last_name='"+owner.owner_last_name+"'," +
                    "owner_street='"+owner.owner_street+"'," +
                    "owner_city='"+owner.owner_city+"'," +
                    "owner_state='"+owner.owner_state+"'," +
                    "owner_zip='"+owner.owner_zip+"'," +
                    "owner_billing_street='"+owner.owner_billing_street+"'," +
                    "owner_billing_city='"+owner.owner_billing_city+"'," +
                    "owner_billing_state='"+owner.owner_billing_state+"'," +
                    "owner_billing_zip='"+owner.owner_billing_zip+"' " +
                "WHERE owner_id="+owner.owner_id+";";

        connection.query(sql, function(err) {
            callback();
            connection.end();
        });
    },
    delete: function(owner_id, callback) {
        var connection = db.connection.connect(),
            sql;

        sql = "UPDATE arcgov.plots SET owner_id=null WHERE owner_id="+owner_id+";";
        connection.query(sql, function(err) {
            connection.query("DELETE FROM arcgov.owners WHERE owner_id="+owner_id+";",function(err) {
                callback();
                connection.end();
            });
        });

    }
};


