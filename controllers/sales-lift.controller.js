import pool from "./db.js";

const brand = {};

// Sales Lift Page
brand.getSalesLiftCampaigns = (req, res) => {
    if(req.params.brand) {
        let conditions = '';
        conditions += ` AND MktCampaign NOT LIKE '%20' `
        conditions += ` AND MktCampaign NOT LIKE '%19' `
        conditions += ` AND MktCampaign NOT LIKE '%18' `
        conditions += ` AND MktCampaign NOT LIKE '%17' `
        conditions += ` AND MktCampaign NOT LIKE '%16' `

        let sql = `SELECT DISTINCT MktCampaign FROM sales_lift WHERE Brand=${pool.escape(req.params.brand)} ${conditions}`;
    
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

brand.getSalesLiftSLData = (req, res) => {
    if(req.params.brand || req.query.campaign) {
        let campaigns = [];
        let conditions = '';
        // if(req.query.campaign)
        //     conditions += `AND MktCampaign=${pool.escape(decodeURIComponent(req.query.campaign))}`
        if(req.query.campaign) {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += ` AND MktCampaign IN (${campaigns}) `;
        }
        
        let sql = `SELECT adTactic, IFNULL(AVG(Prod_ODC_SL), 0) as Prod_ODC_SL, IFNULL(AVG(Brand_ODC_SL), 0) as Brand_ODC_SL, isSignificant FROM sales_lift WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND adGroup='audience' GROUP BY adTactic;
                SELECT adTactic, IFNULL(AVG(Prod_ODC_SL), 0) as Prod_ODC_SL, IFNULL(AVG(Brand_ODC_SL), 0) as Brand_ODC_SL, isSignificant FROM sales_lift WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND adGroup='platform' GROUP BY adTactic;
                SELECT adTactic, IFNULL(AVG(Prod_ODC_SL), 0) as Prod_ODC_SL, IFNULL(AVG(Brand_ODC_SL), 0) as Brand_ODC_SL, isSignificant FROM sales_lift WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND adGroup='placement' GROUP BY adTactic;
                SELECT adTactic, IFNULL(AVG(Prod_ODC_SL), 0) as Prod_ODC_SL, IFNULL(AVG(Brand_ODC_SL), 0) as Brand_ODC_SL, isSignificant FROM sales_lift WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND adGroup='new_existing' GROUP BY adTactic;
                SELECT AVG(SL_ROAS) as SL_ROAS FROM sales_lift WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND adGroup='audience' AND upcLevel="brand" GROUP BY MktCampaign;
                SELECT AVG(SL_ROAS) as SL_ROAS FROM sales_lift WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND adGroup='audience' AND upcLevel="product" GROUP BY MktCampaign;
                SELECT AVG(SL_ROAS) as SL_ROAS FROM sales_lift WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND adGroup='platform' AND upcLevel="brand" GROUP BY MktCampaign;
                SELECT AVG(SL_ROAS) as SL_ROAS FROM sales_lift WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND adGroup='platform' AND upcLevel="product" GROUP BY MktCampaign;
                SELECT AVG(SL_ROAS) as SL_ROAS FROM sales_lift WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND adGroup='placement' AND upcLevel="brand" GROUP BY MktCampaign;
                SELECT AVG(SL_ROAS) as SL_ROAS FROM sales_lift WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND adGroup='placement' AND upcLevel="product" GROUP BY MktCampaign;
                SELECT AVG(SL_ROAS) as SL_ROAS FROM sales_lift WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND adGroup='new_existing' AND upcLevel="brand" GROUP BY MktCampaign;
                SELECT AVG(SL_ROAS) as SL_ROAS FROM sales_lift WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND adGroup='new_existing' AND upcLevel="product" GROUP BY MktCampaign`;
    
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