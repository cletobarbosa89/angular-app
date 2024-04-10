import pool from "./db.js";

const duration = {};

duration.duration = (req, res) => {
    let sql = `SELECT Brand FROM dtr_overview UNION SELECT Brand FROM bl_sl_overview UNION SELECT Brand FROM cqs_social_overview UNION SELECT Brand FROM creative_view UNION SELECT Brand FROM dtr_view UNION SELECT Brand FROM targeting_view UNION SELECT Brand FROM sales_lift ORDER BY Brand`;
    try {
        pool.getConnection(
            (err, connection) => {
                if (err) {
                    // console.log("Connection cannot be established with MySQL server.");

                    res.status(500).send({
                        "status": res.statusCode,
                        "message": "Connection cannot be established with MySQL server.",
                        "results": [],
                        "fields": []
                    });
                }
                else {
                    // console.log("Connection established with MySQL server.");
                    // console.log('connected as id (' + connection.threadId + ').');

                    // get a timestamp before running the query
                    var pre_query = new Date().getTime();

                    connection.query(sql , (error, results, fields) => {
                        // console.log(name);
                        // console.log(error);
                        // console.log(results);
                        // console.log(fields);

                        // get a timestamp after running the query
                        var post_query = new Date().getTime();
                        // calculate the duration in seconds
                        var duration = (post_query - pre_query) / 1000;

                        // When done with the connection, release it.
                        connection.release();
                     
                        // Handle error after the release.
                        if (error) {
                            // console.log("Error: MySQL error");

                            res.status(500).send({
                                "status": res.statusCode,
                                "message": "Error: MySQL error",
                                "results": [],
                                "fields": []
                            });                            
                        } else {
                            // console.log("Connection released to pool.");

                            // console.log(fields);
                            // res.status(200).send({
                            //     "status": res.statusCode,
                            //     "message": "Success",
                            //     "results": results,
                            //     "fields": fields
                            // });

                            res.write('<p>Status: ' + res.statusCode + '</p>');
                            res.write('Query Duration: ' + duration + 's</p>');
                            res.send();
                        }
                        
                        // Don't use the connection here, it has been returned to the pool.
                    });
                }
            }
        );

    } catch(error) {
        // console.log("Error connecting to MySQL server.");

        res.status(500).send({
            "status": res.statusCode,
            "message": "Error connecting to MySQL server.",
            "results": [],
            "fields": []
        });
    }
};

export default duration;