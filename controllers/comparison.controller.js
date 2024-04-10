import pool from "./db.js";

const brand = {};

// Comparison Overview Page
brand.getComparisonCampaigns = (req, res) => {
    if(req.params.brand) {
        let conditions = '';
        conditions += ` AND MktCampaign NOT LIKE '%20' `
        conditions += ` AND MktCampaign NOT LIKE '%19' `
        conditions += ` AND MktCampaign NOT LIKE '%18' `
        conditions += ` AND MktCampaign NOT LIKE '%17' `
        conditions += ` AND MktCampaign NOT LIKE '%16' `

        let sql = `SELECT MktCampaign FROM dtr_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} UNION SELECT MktCampaign FROM targeting_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions}`;
    
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

brand.getComparisonTargetingByCampaign = (req, res) => {
    if(req.params.brand || req.query.campaign) {
        let conditions = '';
        if(req.query.campaign)
            conditions += `AND MktCampaign=${pool.escape(decodeURIComponent(req.query.campaign))} `

        let sql = `SELECT Targeting FROM dtr_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND Targeting!='' UNION SELECT Targeting FROM targeting_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions}  AND Targeting!=''`;

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

brand.getComparisonAudienceByCampaign = (req, res) => {
    if(req.params.brand || req.query.campaign || req.query.targeting) {
        let conditions = '';
        if(req.query.campaign)
            conditions += `AND MktCampaign=${pool.escape(decodeURIComponent(req.query.campaign))} `
        if(req.query.targeting)
            conditions += `AND Targeting=${pool.escape(decodeURIComponent(req.query.targeting))} `

        let sql = `SELECT Audience as Audience FROM dtr_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND Audience!='' UNION SELECT AdGroup as Audience FROM targeting_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions}  AND AdGroup!=''`;
    
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

brand.getComparisonImpressionsSpend = (req, res) => {
    if(req.params.brand || req.query.campaign || req.query.targeting || req.query.audience) {
        let conditions = '';
        if(req.query.campaign)
            conditions += `AND MktCampaign=${pool.escape(decodeURIComponent(req.query.campaign))} `
        if(req.query.targeting)
            conditions += `AND Targeting=${pool.escape(decodeURIComponent(req.query.targeting))} `
        if(req.query.audience)
            conditions += `AND Audience=${pool.escape(decodeURIComponent(req.query.audience))} `

        let sql = `SELECT DATE_FORMAT(Day, '%m-%d-%y') as Date, ROUND(IFNULL(SUM(Imp), 0), 2) as Imp FROM dtr_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND Imp IS NOT NULL GROUP BY Week;
            SELECT DATE_FORMAT(Day, '%m-%d-%y') as Date, ROUND(IFNULL(SUM(Spend), 0), 2) as Spend FROM dtr_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND Spend IS NOT NULL GROUP BY Week`;
            
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
            "message": "Parameters is missing"
        });
    }
};

brand.getComparisonCPVM = (req, res) => {
    if(req.params.brand || req.query.campaign || req.query.targeting || req.query.audience) {
        let conditions = '';
        if(req.query.campaign)
            conditions += `AND MktCampaign=${pool.escape(decodeURIComponent(req.query.campaign))} `
        if(req.query.targeting)
            conditions += `AND Targeting=${pool.escape(decodeURIComponent(req.query.targeting))} `
        if(req.query.audience)
            conditions += `AND Audience=${pool.escape(decodeURIComponent(req.query.audience))} `

        let sql = `SELECT DATE_FORMAT(Day, '%m-%d-%y') as Date, ROUND(IFNULL(SUM(Spend), 0), 2) as Spend, ROUND(IFNULL(SUM(InViewImp), 0), 2) as InViewImp, ROUND(IFNULL(SUM(TwoSecInViewImp), 0), 2) as TwoSecInViewImp FROM dtr_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND Spend IS NOT NULL GROUP BY Week`;
            
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
            "message": "Parameters is missing"
        });
    }
};

brand.getComparisonInViewRate = (req, res) => {
    if(req.params.brand || req.query.campaign || req.query.targeting || req.query.audience) {
        let conditions = '';
        if(req.query.campaign)
            conditions += `AND MktCampaign=${pool.escape(decodeURIComponent(req.query.campaign))} `
        if(req.query.targeting)
            conditions += `AND Targeting=${pool.escape(decodeURIComponent(req.query.targeting))} `
        if(req.query.audience)
            conditions += `AND Audience=${pool.escape(decodeURIComponent(req.query.audience))} `

        let sql = `SELECT DATE_FORMAT(Day, '%m-%d-%y') as Date, ROUND(IFNULL(SUM(InViewImp), 0), 2) as InViewImp, ROUND(IFNULL(SUM(InViewMeasurableImpressions), 0), 2) as InViewMeasurableImpressions FROM dtr_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} GROUP BY Week`;
            
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
            "message": "Parameters is missing"
        });
    }
};

brand.getComparison2SecVideoInViewRate = (req, res) => {
    if(req.params.brand || req.query.campaign || req.query.targeting || req.query.audience) {
        let conditions = '';
        if(req.query.campaign)
            conditions += `AND MktCampaign=${pool.escape(decodeURIComponent(req.query.campaign))} `
        if(req.query.targeting)
            conditions += `AND Targeting=${pool.escape(decodeURIComponent(req.query.targeting))} `
        if(req.query.audience)
            conditions += `AND Audience=${pool.escape(decodeURIComponent(req.query.audience))} `

        let sql = `SELECT DATE_FORMAT(Day, '%m-%d-%y') as Date, ROUND(IFNULL(SUM(TwoSecInViewImp), 0), 2) as TwoSecInViewImp, ROUND(IFNULL(SUM(InViewMeasurableImpressions), 0), 2) as InViewMeasurableImpressions FROM dtr_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} GROUP BY Week`;
            
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
            "message": "Parameters is missing"
        });
    }
};

brand.getComparisonInViewTimeDisplay = (req, res) => {
    if(req.params.brand || req.query.campaign || req.query.targeting || req.query.audience) {
        let conditions = '';
        if(req.query.campaign)
            conditions += `AND MktCampaign=${pool.escape(decodeURIComponent(req.query.campaign))} `
        if(req.query.targeting)
            conditions += `AND Targeting=${pool.escape(decodeURIComponent(req.query.targeting))} `
        if(req.query.audience)
            conditions += `AND Audience=${pool.escape(decodeURIComponent(req.query.audience))} `

        let sql = `SELECT DATE_FORMAT(Day, '%m-%d-%y') as Date, ROUND(IFNULL(SUM(TotExposureTime), 0), 2) as TotExposureTime, ROUND(IFNULL(SUM(InViewImp), 0), 2) as InViewImp FROM dtr_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} GROUP BY Week`;
            
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
            "message": "Parameters is missing"
        });
    }
};

brand.getComparisonInViewTimeVideo = (req, res) => {
    if(req.params.brand || req.query.campaign || req.query.targeting || req.query.audience) {
        let conditions = '';
        if(req.query.campaign)
            conditions += `AND MktCampaign=${pool.escape(decodeURIComponent(req.query.campaign))} `
        if(req.query.targeting)
            conditions += `AND Targeting=${pool.escape(decodeURIComponent(req.query.targeting))} `
        if(req.query.audience)
            conditions += `AND Audience=${pool.escape(decodeURIComponent(req.query.audience))} `

        let sql = `SELECT DATE_FORMAT(Day, '%m-%d-%y') as Date, ROUND(IFNULL(SUM(TotExposureTime), 0), 2) as TotExposureTime, ROUND(IFNULL(SUM(TwoSecInViewImp), 0), 2) as TwoSecInViewImp FROM dtr_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} GROUP BY Week`;
            
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
            "message": "Parameters is missing"
        });
    }
};

brand.getComparisonBL = (req, res) => {
    if(req.params.brand || req.query.campaign || req.query.targeting || req.query.audience) {
        let conditions = '';
        if(req.query.campaign)
            conditions += `AND MktCampaign=${pool.escape(decodeURIComponent(req.query.campaign))} `
        if(req.query.targeting)
            conditions += `AND Targeting=${pool.escape(decodeURIComponent(req.query.targeting))} `
        if(req.query.audience)
            conditions += `AND AdGroup=${pool.escape(decodeURIComponent(req.query.audience))} `

        let sql = `SELECT AdGroup, IFNULL(AVG(Comscore_BL), 0) as Comscore_BL FROM targeting_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND Source='comscore' AND Comscore_BL IS NOT NULL GROUP BY AdGroup;
                SELECT AdGroup, IFNULL(AVG(FB_BL), 0) as FB_BL FROM targeting_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND Source='Facebook' AND FB_BL IS NOT NULL GROUP BY AdGroup;
                SELECT AdGroup, IFNULL(AVG(YT_BL), 0) as YT_BL FROM targeting_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND Source='Youtube' AND YT_BL IS NOT NULL GROUP BY AdGroup`;

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
            "message": "Parameters is missing"
        });
    }
};

brand.getComparisonSL = (req, res) => {
    if(req.params.brand || req.query.campaign || req.query.targeting || req.query.audience) {
        let conditions = '';
        if(req.query.campaign)
            conditions += `AND MktCampaign=${pool.escape(decodeURIComponent(req.query.campaign))} `
        if(req.query.targeting)
            conditions += `AND Targeting=${pool.escape(decodeURIComponent(req.query.targeting))} `
        if(req.query.audience)
            conditions += `AND AdGroup=${pool.escape(decodeURIComponent(req.query.audience))} `

        let sql = `SELECT AdGroup, IFNULL(AVG(Brand_ODC_SL), 0) as Brand_ODC_SL FROM targeting_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND Source IN ("ODC", "IRI") AND Brand_ODC_SL IS NOT NULL GROUP BY AdGroup;
                SELECT AdGroup, IFNULL(AVG(Prod_ODC_SL), 0) as Prod_ODC_SL FROM targeting_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND Source IN ("ODC", "IRI") AND Prod_ODC_SL IS NOT NULL GROUP BY AdGroup`;

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
            "message": "Parameters is missing"
        });
    }
};

export default brand;