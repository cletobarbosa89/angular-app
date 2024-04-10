import pool from "./db.js";

const test = {};

test.test = (req, res) => {
    let sql = `SELECT DISTINCT Channel FROM bl_sl_overview WHERE Brand='Test' AND Source IN ('ODC') ORDER BY Channel ASC`;

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

                    connection.query(sql , (error, results, fields) => {
                        // console.log(name);
                        // console.log(error);
                        // console.log(results);
                        // console.log(fields);

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
                            res.status(200).send({
                                "status": res.statusCode,
                                "message": "Success",
                                "results": results,
                                "fields": fields
                            });
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

    // try {
    //     pool.getConnection(
    //         (err, connection) => {
    //             if (err) {
    //                 // console.log("Connection cannot be established with MySQL server.");

    //                 res.status(500).send({
    //                     "status": res.statusCode,
    //                     "message": "Connection cannot be established with MySQL server.",
    //                     "results": [],
    //                     "fields": []
    //                 });
    //             }
    //             else {
    //                 // console.log("Connection established with MySQL server.");
    //                 // console.log('connected as id (' + connection.threadId + ').');

    //                 connection.query(sql)
    //                 .stream()
    //                 .pipe(process.stdout);
    //             }
    //         }
    //     );

    // } catch(error) {
    //     // console.log("Error connecting to MySQL server.");

    //     res.status(500).send({
    //         "status": res.statusCode,
    //         "message": "Error connecting to MySQL server.",
    //         "results": [],
    //         "fields": []
    //     });
    // }
};

export default test;