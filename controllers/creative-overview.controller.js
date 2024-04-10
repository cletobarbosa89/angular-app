import pool from "./db.js";

const brand = {};

// Creative Overview Page
brand.getCreativeOverviewCampaigns = (req, res) => {
    if(req.params.brand) {
        let conditions = '';
        conditions += ` AND MktCampaign NOT LIKE '%20' `
        conditions += ` AND MktCampaign NOT LIKE '%19' `
        conditions += ` AND MktCampaign NOT LIKE '%18' `
        conditions += ` AND MktCampaign NOT LIKE '%17' `
        conditions += ` AND MktCampaign NOT LIKE '%16' `

        let sql = `SELECT DISTINCT MktCampaign FROM creative_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions}`;
    
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

brand.getCreativeOverviewChannelsByCampaign = (req, res) => {
    if(req.params.brand || req.query.campaign) {
        let campaigns = [];
        let conditions = [];

        if(req.query.campaign) {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns})`;
        }
        // let sql = `SELECT DISTINCT Channel FROM dtr_overview WHERE Brand=${pool.escape(req.params.brand)} ORDER BY Channel ASC`;
        let sql = `SELECT DISTINCT Channel FROM creative_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions}`;
    
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

brand.getCreativesCount = (req, res) => {
    if(req.params.brand || req.query.campaign || req.query.channel) {
        let conditions = '';
        if(req.query.campaign && req.query.channel=="''")
            conditions = `AND MktCampaign=${pool.escape(req.query.campaign)}`;
        else if(!req.query.campaign && req.query.channel!="''")
            conditions = `AND Channel IN (${req.query.channel})`;
        else if(req.query.campaign && req.query.channel!="''")
            conditions = `AND MktCampaign=${pool.escape(req.query.campaign)} AND Channel IN (${req.query.channel})`;

        let sql = `SELECT COUNT(DISTINCT CreativeName) as creativeCount FROM creative_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} ORDER BY AssetType DESC, CreativeName ASC`;
   
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

brand.getCreatives = (req, res) => {
    if(req.params.brand || req.query.campaign || req.query.channel) {
        let campaigns = [];
        let conditions = '';
        if(req.query.campaign && req.query.channel=="''") {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns})`;
            // conditions = `AND MktCampaign=${pool.escape(req.query.campaign)}`;
        }
        else if(!req.query.campaign && req.query.channel!="''")
            conditions = `AND Channel IN (${decodeURIComponent(req.query.channel)})`;
        else if(req.query.campaign && req.query.channel!="''") {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns}) AND Channel IN (${decodeURIComponent(req.query.channel)})`;
            // conditions = `AND MktCampaign=${pool.escape(req.query.campaign)} AND Channel IN (${req.query.channel})`;
        }

        // let sql = `SELECT CreativeName, CreativeLink, CQS as creativeScore, IFNULL(InViewTimeDisplay, 0) as InViewTimeDisplay, IFNULL(InViewTimeVideo, 0) as InViewTimeVideo, IFNULL(InViewRateDisplay, 0) as InViewRateDisplay, IFNULL(InViewRateVideo, 0) as InViewRateVideo FROM creative_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions}`;
        // let sql = `SELECT DISTINCT CreativeName, AssetType FROM creative_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} ORDER BY AssetType DESC, CreativeName ASC`;
        let sql = `SELECT CreativeName, AssetType, IFNULL(AVG(CQS), 0) as creativeScore, IFNULL(SUM(InViewImpressions), 0) as InViewImpressions, IFNULL(SUM(TwoSecInViewImpressions), 0) as TwoSecInViewImpressions, IFNULL(SUM(InViewMeasurableImpressions), 0) as InViewMeasurableImpressions, IFNULL(SUM(TotalExposureTime), 0) as TotalExposureTime, IFNULL(SUM(TotalExposureTimeSec), 0) as TotalExposureTimeSec FROM creative_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} GROUP BY CreativeName ORDER BY AssetType DESC, CreativeName ASC LIMIT ${req.query.limit} OFFSET ${req.query.offset};
        SELECT CreativeName, SUM(amountSpend) as amountSpend FROM (SELECT CreativeName, IFNULL(SUM(DISTINCT FlightActualizedCost ), 0) as amountSpend FROM creative_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} GROUP BY CreativeId, CreativeName, FlightActualizedCost) AS t1 GROUP BY CreativeName ORDER BY CreativeName ASC`;
   
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

brand.getCreatives2 = (req, res) => {
    if(req.params.brand || req.query.campaign || req.query.channel) {
        let campaigns = [];
        let conditions = '';
        if(req.query.campaign && req.query.channel=="''") {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns})`;
            // conditions = `AND MktCampaign=${pool.escape(req.query.campaign)}`;
        }
        else if(!req.query.campaign && req.query.channel!="''")
            conditions = `AND Channel IN (${decodeURIComponent(req.query.channel)})`;
        else if(req.query.campaign && req.query.channel!="''") {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns}) AND Channel IN (${decodeURIComponent(req.query.channel)})`;
            // conditions = `AND MktCampaign=${pool.escape(req.query.campaign)} AND Channel IN (${req.query.channel})`;
        }

        // let sql = `SELECT CreativeName, CreativeLink, CQS as creativeScore, IFNULL(InViewTimeDisplay, 0) as InViewTimeDisplay, IFNULL(InViewTimeVideo, 0) as InViewTimeVideo, IFNULL(InViewRateDisplay, 0) as InViewRateDisplay, IFNULL(InViewRateVideo, 0) as InViewRateVideo FROM creative_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions}`;
        // let sql = `SELECT DISTINCT CreativeName, AssetType FROM creative_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} ORDER BY AssetType DESC, CreativeName ASC`;
        let sql = `SELECT DISTINCT CreativeName, AssetType, IFNULL(AVG(CQS), 0) as creativeScore, IFNULL(SUM(InViewImpressions), 0) as InViewImpressions, IFNULL(SUM(TwoSecInViewImpressions), 0) as TwoSecInViewImpressions, IFNULL(SUM(InViewMeasurableImpressions), 0) as InViewMeasurableImpressions, IFNULL(SUM(TotalExposureTime), 0) as TotalExposureTime, IFNULL(SUM(TotalExposureTimeSec), 0) as TotalExposureTimeSec FROM creative_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} GROUP BY CreativeName ORDER BY AssetType DESC, CreativeName ASC LIMIT ${req.query.limit} OFFSET ${req.query.offset};
        SELECT CreativeName, SUM(amountSpend) as amountSpend FROM (SELECT CreativeName, IFNULL(SUM(DISTINCT FlightActualizedCost ), 0) as amountSpend FROM creative_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} GROUP BY CreativeId, CreativeName, FlightActualizedCost ASC) AS t1 GROUP BY CreativeName ORDER BY CreativeName ASC`;
   
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

brand.getCreativesList = (req, res) => {
    if(req.params.brand || req.query.campaign || req.query.channel || req.query.creativeName) {
        let campaigns = [];
        let conditions = '';
        if(req.query.campaign && req.query.channel=="''") {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND CreativeName=${pool.escape(decodeURIComponent(req.query.creativeName))} AND MktCampaign IN (${campaigns})`;
            // conditions = `AND CreativeName=${pool.escape(decodeURIComponent(req.query.creativeName))} AND MktCampaign=${pool.escape(req.query.campaign)}`;
        }
        else if(!req.query.campaign && req.query.channel!="''")
            conditions = `AND CreativeName=${pool.escape(decodeURIComponent(req.query.creativeName))} AND Channel IN (${decodeURIComponent(req.query.channel)})`;
        else if(req.query.campaign && req.query.channel!="''") {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND CreativeName=${pool.escape(decodeURIComponent(req.query.creativeName))} AND MktCampaign IN (${campaigns}) AND Channel IN (${decodeURIComponent(req.query.channel)})`;
            // conditions = `AND CreativeName=${pool.escape(decodeURIComponent(req.query.creativeName))} AND MktCampaign=${pool.escape(req.query.campaign)} AND Channel IN (${req.query.channel})`;
        }

        // let sql = `SELECT CreativeId, CreativeName, CreativeLink, AssetType, CQS as creativeScore, IFNULL(SUM(Spend), 0) as amountSpend, GuideLines, IFNULL(SUM(InViewImpressions), 0) as InViewImpressions, IFNULL(SUM(TwoSecInViewImpressions), 0) as TwoSecInViewImpressions, IFNULL(SUM(InViewMeasurableImpressions), 0) as InViewMeasurableImpressions, IFNULL(SUM(TotalExposureTime), 0) as TotalExposureTime FROM creative_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} GROUP BY CreativeId`;
        let sql = `SELECT CreativeId, CreativeName, CreativeLink, AssetType, GuideLines FROM creative_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} GROUP BY CreativeId`;

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