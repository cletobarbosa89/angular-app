import pool from "./db.js";

const brand = {};

// Brand Health Page
brand.getBrandHealthCampaigns = (req, res) => {
    if(req.params.brand) {
        let conditions = '';
        conditions += ` AND MktCampaign NOT LIKE '%20' `
        conditions += ` AND MktCampaign NOT LIKE '%19' `
        conditions += ` AND MktCampaign NOT LIKE '%18' `
        conditions += ` AND MktCampaign NOT LIKE '%17' `
        conditions += ` AND MktCampaign NOT LIKE '%16' `

        let sql = `SELECT MktCampaign FROM brand_health_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} UNION SELECT MktCampaign FROM targeting_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions}`;
    
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

brand.getBrandHealthComscoreResults = (req, res) => {
    if(req.params.brand || req.query.campaign) {
        let campaigns = [];
        let conditions = '';
        // if(req.query.campaign)
        //     conditions += `AND MktCampaign=${pool.escape(decodeURIComponent(req.query.campaign))}`
        if(req.query.campaign) {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns})`;
        }

        let sql = `SELECT DISTINCT type FROM brand_health_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions}`;
    
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

brand.getBrandHealthOverallSnapshot = (req, res) => {
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
        if(req.query.type)
            conditions += ` AND type=${pool.escape(decodeURIComponent(req.query.type))} `

        let sql = `SELECT category, isSignificant, IFNULL(SUM(pointLift), 0) as pointLift, IFNULL(AVG(totalControlComplete), 0) as totalControlComplete, IFNULL(AVG(totalTestComplete), 0) as totalTestComplete FROM brand_health_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} GROUP BY category`;
    
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

brand.getBrandHealthPurchaseIntent = (req, res) => {
    if(req.params.brand || req.query.campaign || req.query.category || req.query.type) {
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
        if(req.query.category)
            conditions += ` AND category=${pool.escape(decodeURIComponent(req.query.category))} `
        if(req.query.type)
            conditions += ` AND type=${pool.escape(decodeURIComponent(req.query.type))} `

        let sql = `SELECT name, pointLift, isSignificant FROM brand_health_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} GROUP BY name ORDER BY name ASC`;
    
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

brand.getBrandHealthGetCellNames = (req, res) => {
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

        let sql = `SELECT DISTINCT CellName FROM targeting_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND CellName!='' AND Source='Facebook'`;
    
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

brand.getBrandHealthFacebookBrandLiftByCellName = (req, res) => {
    if(req.params.brand || req.query.campaign || req.query.cellName) {
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
        if(req.query.cellName)
            conditions += ` AND CellName=${pool.escape(decodeURIComponent(req.query.cellName))} `

        let sql = `SELECT QuestionType, FB_BL, isSignificant FROM targeting_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND Source='Facebook' GROUP BY QuestionType`;
    
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

brand.getBrandHealthYouTubeBrandLift = (req, res) => {
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

        let sql = `SELECT Targeting, YT_BL, isSignificant FROM targeting_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND Targeting!='' AND Source='Youtube' GROUP BY Targeting;
            SELECT AdGroup, YT_BL, isSignificant FROM targeting_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND AdGroup!='' AND Source='Youtube' GROUP BY AdGroup`;
    
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