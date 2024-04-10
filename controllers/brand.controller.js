import pool from "./db.js";

const brand = {};

brand.checkIfExist = (req, res) => {
    if(req.params.brand) {
        let sql = `SELECT EXISTS (SELECT 1 FROM dtr_overview WHERE Brand=${pool.escape(req.params.brand)} UNION SELECT 1 FROM bl_sl_overview WHERE Brand=${pool.escape(req.params.brand)} UNION SELECT 1 FROM cqs_social_overview WHERE Brand=${pool.escape(req.params.brand)} UNION SELECT 1 FROM creative_view WHERE Brand=${pool.escape(req.params.brand)} UNION SELECT 1 FROM dtr_view WHERE Brand=${pool.escape(req.params.brand)} UNION SELECT 1 FROM targeting_view WHERE Brand=${pool.escape(req.params.brand)} UNION SELECT 1 FROM brand_health_view WHERE Brand=${pool.escape(req.params.brand)} UNION SELECT 1 FROM sales_lift WHERE Brand=${pool.escape(req.params.brand)}) AS exist`;
    
        try {
            pool.getConnection(
                (err, connection) => {
                    if (err) {
                        res.status(500).send({
                            "status": res.statusCode,
                            "message": "Connection cannot be established with MySQL server."
                        });
                    }
                    else {
                        connection.query(sql , (error, results, fields) => {
                            // When done with the connection, release it.
                            connection.release();
                         
                            // Handle error after the release.
                            if (error) {
                                res.status(500).send({
                                    "status": res.statusCode,
                                    "message": "Error: MySQL error"
                                });
                            } else {
                                res.status(200).send({
                                    "status": res.statusCode,
                                    "message": "Success",
                                    "results": results[0]
                                });
                            }
                        });
                    }
                }
            );
    
        } catch(error) {
            res.status(500).send({
                "status": res.statusCode,
                "message": "Error connecting to MySQL server."
            });
        }
    } else {
        res.status(500).send({
            "status": res.statusCode,
            "message": "Brand name is missing"
        });
    }
};

brand.getCampaignStartEndDates = (req, res) => {
    if(req.params.brand && req.query.campaign) {
        let campaigns = [];
        let conditions = '';

        if(req.query.campaign) {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns})`;
        }
        // let sql = `SELECT DISTINCT MktCampaign FROM dtr_overview WHERE Brand=${pool.escape(req.params.brand)} ORDER BY MktCampaign ASC`;
        let sql = `SELECT DATE_FORMAT(MIN(minDay), '%c/%e/%y') AS startDate, DATE_FORMAT(MAX(maxDay), '%c/%e/%y') AS endDate FROM (
            SELECT MIN(Day) AS minDay, MAX(Day) AS maxDay FROM dtr_overview WHERE Brand=${pool.escape(req.params.brand)} ${conditions} 
            UNION 
            SELECT MIN(Day) AS minDay, MAX(Day) AS maxDay FROM dtr_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions}
        ) AS minMax`;
    
        try {
            pool.getConnection(
                (err, connection) => {
                    if (err) {
                        res.status(500).send({
                            "status": res.statusCode,
                            "message": "Connection cannot be established with MySQL server."
                        });
                    }
                    else {
                        connection.query(sql , (error, results, fields) => {
                            // When done with the connection, release it.
                            connection.release();
                         
                            // Handle error after the release.
                            if (error) {
                                res.status(500).send({
                                    "status": res.statusCode,
                                    "message": "Error: MySQL error"
                                });
                            } else {
                                res.status(200).send({
                                    "status": res.statusCode,
                                    "message": "Success",
                                    "results": results
                                });
                            }
                        });
                    }
                }
            );
    
        } catch(error) {
            res.status(500).send({
                "status": res.statusCode,
                "message": "Error connecting to MySQL server."
            });
        }
    } else {
        res.status(500).send({
            "status": res.statusCode,
            "message": "Brand name is missing"
        });
    }
};

export default brand;