var db = require('./mysql-connect');

exports.data = {
    createUser: function(user, callback) {
        var connection = db.connection.connect(),
            sql="SELECT MAX(user_id) AS id FROM arcgov.users";

        connection.query(sql, function(err, rows) {
            var id;
            if (rows && rows[0].id !== null) {
                id = rows[0].id;
            } else {
                id = 1;
            }
            sql = "INSERT INTO arcgov.users (user_id, first_name, last_name, email)" +
                "VALUES('"+id+"','"+user.first_name+"','"+user.last_name+"','"+user.email+"')";
            connection.query(sql, function(err) {
                sql = "SELECT MAX(password_id) AS id FROM passwords";
                connection.query(sql, function(err, rows) {
                    var passwordId;
                    if (rows && rows[0].id !== null) {
                        passwordId = rows[0].id;
                    } else {
                        passwordId = 1;
                    }
                    sql = "INSERT INTO arcgov.passwords(password_id, user_id, password)" +
                        "VALUES('"+passwordId+"','"+id+"','"+user.password+"')";

                    connection.query(sql, function(err) {
                        callback();
                        connection.end();
                    });

                });

            });
        });
    },
    login: function(email, callback) {
        var connection = db.connection.connect(),
            sql = "SELECT password FROM arcgov.passwords p JOIN arcgov.users u ON(p.user_id=u.user_id) WHERE u.email='"+email+"'";

        connection.query(sql, function(err, rows) {
            if (rows.length > 0) {
                callback(JSON.stringify({password: rows[0].password}));
            } else {
                callback(JSON.stringify({password: 'Password does not exist'}));
            }
        });
    }
}
