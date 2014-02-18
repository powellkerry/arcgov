var db = require('./mysql-connect');

exports.data = {
    read: function (cem_id, callback) {
        var connection = db.connection.connect(),
            sql = "SELECT * FROM arcgov.media WHERE cem_id=" + cem_id + ";";
        connection.query(sql, function (err, rows) {
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                row.media_location = 'media/' + row.cem_id+'/' + row.file_name;
            }
            callback(JSON.stringify(rows));
            connection.end();
        });
    }
};