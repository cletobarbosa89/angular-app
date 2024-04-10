import pool from "./db.js";

const brand = {};

// Targeting Overview Page
brand.getTargetingOverviewCampaigns = (req, res) => {
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

brand.getTargetingOverviewChannelsByCampaign = (req, res) => {
    if(req.params.brand || req.query.campaign) {
        let campaigns = [];
        let conditions = '';

        if(req.query.campaign) {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns})`;
        }

        let sql = `SELECT Channel FROM dtr_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} UNION SELECT Channel FROM targeting_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions}`;
        
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

brand.getTargetingOverviewChannelsByGoal = (req, res) => {
    if(req.params.brand && req.query.campaign && req.query.goal) {
        let campaigns = [];
        let conditions = '';

        if(req.query.goal == 'grow-brand-awareness' || req.query.goal == 'brand-affinity' || req.query.goal == 'brand-preference')
            var source = ['Facebook','Youtube','Comscore'];
        if(req.query.goal == 'grow-HH-penetration' || req.query.goal == 'build-usage-occasions' || req.query.goal == 'drive-shopper-action')
            var source = ['ODC', 'IRI'];

        if(req.query.campaign) {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns})`;
        }

        let sql = `SELECT DISTINCT Channel FROM targeting_view WHERE Brand=${pool.escape(req.params.brand)} AND Source IN (${pool.escape(source)}) ${conditions} ORDER BY Channel ASC`;
        
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

                            // results.push({'Channel' : 'Youtube Custom (Test goal)'});
                            // results.push({'Channel' : 'ABC Custom (Test goal)'});
                         
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

brand.getTargetingOverviewTargetingByCampaign = (req, res) => {
    if(req.params.brand || req.query.campaign || req.query.channel) {
        let campaigns = [];
        let channels = [];
        let conditions = '';
        // if(req.query.campaign)
        //     conditions += `AND MktCampaign=${pool.escape(req.query.campaign)} `
        if(req.query.campaign) {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns})`;
        }

        if(req.query.channel) {
            channels = decodeURIComponent(req.query.channel).split(',');
            channels = channels.join("','");
            channels = "'" + channels + "'";
            conditions += `AND Channel IN (${channels})`
        }
        // else if(req.query.campaign && req.query.channel)
        //     conditions = `AND MktCampaign=${pool.escape(req.query.campaign)} AND Channel=${pool.escape(req.query.channel)}`

        let sql = `SELECT Targeting FROM dtr_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND Targeting!='' UNION SELECT Targeting FROM targeting_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND Targeting!=''`;
        
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

brand.getTargetingOverviewAudienceByCampaign = (req, res) => {
    if(req.params.brand || req.query.campaign || req.query.channel || req.query.targeting) {
        let campaigns = [];
        let channels = [];
        let conditions = '';
        // if(req.query.campaign)
        //     conditions += `AND MktCampaign=${pool.escape(req.query.campaign)} `
        if(req.query.campaign) {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns})`;
        }

        if(req.query.channel) {
            channels = decodeURIComponent(req.query.channel).split(',');
            channels = channels.join("','");
            channels = "'" + channels + "'";
            conditions += `AND Channel IN (${channels})`
        }
        if(req.query.targeting)
            conditions += `AND Targeting=${pool.escape(decodeURIComponent(req.query.targeting))} `
        // else if(req.query.campaign && req.query.channel)
        //     conditions = `AND MktCampaign=${pool.escape(req.query.campaign)} AND Channel=${pool.escape(req.query.channel)}`

        let sql = `SELECT Audience as Audience FROM dtr_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND Audience!='' UNION SELECT AdGroup as Audience FROM targeting_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND AdGroup!=''`;
        
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

brand.getTargetingOverviewTargetingCPM = (req, res) => {
    if(req.params.brand && req.query.campaign) {
        let campaigns = [];
        let channels = [];
        let conditions = '';
        // if(req.query.campaign)
        //     conditions += `AND MktCampaign=${pool.escape(req.query.campaign)} `
        if(req.query.campaign) {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns})`;
        }

        if(req.query.channel) {
            channels = decodeURIComponent(req.query.channel).split(',');
            channels = channels.join("','");
            channels = "'" + channels + "'";
            conditions += `AND Channel IN (${channels})`
        }
        if(req.query.targeting)
            conditions += `AND Targeting=${pool.escape(decodeURIComponent(req.query.targeting))} `
        if(req.query.audience)
            conditions += `AND Audience=${pool.escape(decodeURIComponent(req.query.audience))} `

        let sql = `SELECT Targeting, ROUND(IFNULL(SUM(Imp), 0), 2) as Imp FROM dtr_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND Imp IS NOT NULL GROUP BY Targeting ASC;
            SELECT Targeting, ROUND(IFNULL(SUM(Spend), 0), 2) as Spend FROM dtr_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND Spend IS NOT NULL GROUP BY Targeting ASC`;
        
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

brand.getTargetingOverviewAudienceCPM = (req, res) => {
    if(req.params.brand && req.query.campaign) {
        let campaigns = [];
        let channels = [];
        let conditions = '';
        // if(req.query.campaign)
        //     conditions += `AND MktCampaign=${pool.escape(req.query.campaign)} `
        if(req.query.campaign) {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns})`;
        }

        if(req.query.channel) {
            channels = decodeURIComponent(req.query.channel).split(',');
            channels = channels.join("','");
            channels = "'" + channels + "'";
            conditions += `AND Channel IN (${channels})`
        }
        if(req.query.targeting)
            conditions += `AND Targeting=${pool.escape(decodeURIComponent(req.query.targeting))} `
        if(req.query.audience)
            conditions += `AND Audience=${pool.escape(decodeURIComponent(req.query.audience))} `

        let sql = `SELECT Audience, ROUND(IFNULL(SUM(Imp), 0), 2) as Imp FROM dtr_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND Imp IS NOT NULL GROUP BY Audience ASC;
            SELECT Audience, ROUND(IFNULL(SUM(Spend), 0), 2) as Spend FROM dtr_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND Spend IS NOT NULL GROUP BY Audience ASC`;
        
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

brand.getTargetingOverviewTargetingInViewRateViewability = (req, res) => {
    if(req.params.brand && req.query.campaign) {
        let campaigns = [];
        let channels = [];
        let conditions = '';
        // if(req.query.campaign)
        //     conditions += `AND MktCampaign=${pool.escape(req.query.campaign)} `
        if(req.query.campaign) {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns})`;
        }

        if(req.query.channel) {
            channels = decodeURIComponent(req.query.channel).split(',');
            channels = channels.join("','");
            channels = "'" + channels + "'";
            conditions += `AND Channel IN (${channels})`
        }
        if(req.query.targeting)
            conditions += `AND Targeting=${pool.escape(decodeURIComponent(req.query.targeting))} `
        if(req.query.audience)
            conditions += `AND Audience=${pool.escape(decodeURIComponent(req.query.audience))} `

        let sql = `SELECT Targeting, IFNULL(SUM(InViewImp), 0) as InViewImpressions, IFNULL(SUM(TwoSecInViewImp), 0) as TwoSecInViewImpressions, IFNULL(SUM(InViewMeasurableImpressions), 0) as InViewMeasurableImpressions, IFNULL(SUM(TotExposureTime), 0) as TotalExposureTime FROM dtr_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} GROUP BY Targeting ASC`;
        
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

brand.getTargetingOverviewAudienceInViewRateViewability = (req, res) => {
    if(req.params.brand && req.query.campaign) {
        let campaigns = [];
        let channels = [];
        let conditions = '';
        // if(req.query.campaign)
        //     conditions += `AND MktCampaign=${pool.escape(req.query.campaign)} `
        if(req.query.campaign) {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns})`;
        }

        if(req.query.channel) {
            channels = decodeURIComponent(req.query.channel).split(',');
            channels = channels.join("','");
            channels = "'" + channels + "'";
            conditions += `AND Channel IN (${channels})`
        }
        if(req.query.targeting)
            conditions += `AND Targeting=${pool.escape(decodeURIComponent(req.query.targeting))} `
        if(req.query.audience)
            conditions += `AND Audience=${pool.escape(decodeURIComponent(req.query.audience))} `

        let sql = `SELECT Audience, IFNULL(SUM(InViewImp), 0) as InViewImpressions, IFNULL(SUM(TwoSecInViewImp), 0) as TwoSecInViewImpressions, IFNULL(SUM(InViewMeasurableImpressions), 0) as InViewMeasurableImpressions, IFNULL(SUM(TotExposureTime), 0) as TotalExposureTime FROM dtr_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} GROUP BY Audience ASC`;
        
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

brand.getTargetingOverviewTargetingInViewTimeViewability = (req, res) => {
    if(req.params.brand && req.query.campaign) {
        let campaigns = [];
        let channels = [];
        let conditions = '';
        // if(req.query.campaign)
        //     conditions += `AND MktCampaign=${pool.escape(req.query.campaign)} `
        if(req.query.campaign) {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns})`;
        }

        if(req.query.channel) {
            channels = decodeURIComponent(req.query.channel).split(',');
            channels = channels.join("','");
            channels = "'" + channels + "'";
            conditions += `AND Channel IN (${channels})`
        }
        if(req.query.targeting)
            conditions += `AND Targeting=${pool.escape(decodeURIComponent(req.query.targeting))} `
        if(req.query.audience)
            conditions += `AND Audience=${pool.escape(decodeURIComponent(req.query.audience))} `

        let sql = `SELECT Targeting, IFNULL(SUM(InViewImp), 0) as InViewImpressions, IFNULL(SUM(TwoSecInViewImp), 0) as TwoSecInViewImpressions, IFNULL(SUM(InViewMeasurableImpressions), 0) as InViewMeasurableImpressions, IFNULL(SUM(TotExposureTime), 0) as TotalExposureTime FROM dtr_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} GROUP BY Targeting ASC`;
        
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

brand.getTargetingOverviewAudienceInViewTimeViewability = (req, res) => {
    if(req.params.brand && req.query.campaign) {
        let campaigns = [];
        let channels = [];
        let conditions = '';
        // if(req.query.campaign)
        //     conditions += `AND MktCampaign=${pool.escape(req.query.campaign)} `
        if(req.query.campaign) {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns})`;
        }

        if(req.query.channel) {
            channels = decodeURIComponent(req.query.channel).split(',');
            channels = channels.join("','");
            channels = "'" + channels + "'";
            conditions += `AND Channel IN (${channels})`
        }
        if(req.query.targeting)
            conditions += `AND Targeting=${pool.escape(decodeURIComponent(req.query.targeting))} `
        if(req.query.audience)
            conditions += `AND Audience=${pool.escape(decodeURIComponent(req.query.audience))} `

        let sql = `SELECT Audience, IFNULL(SUM(InViewImp), 0) as InViewImpressions, IFNULL(SUM(TwoSecInViewImp), 0) as TwoSecInViewImpressions, IFNULL(SUM(InViewMeasurableImpressions), 0) as InViewMeasurableImpressions, IFNULL(SUM(TotExposureTime), 0) as TotalExposureTime FROM dtr_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} GROUP BY Audience ASC`;
        
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

brand.getTargetingOverviewSL = (req, res) => {
    if(req.params.brand && req.query.campaign && req.query.goal) {
        let channels = [];
        let conditions = '';
        if(req.query.campaign)
            conditions += `AND MktCampaign=${pool.escape(decodeURIComponent(req.query.campaign))} `
        if(req.query.channel) {
            channels = decodeURIComponent(req.query.channel).split(',');
            channels = channels.join("','");
            channels = "'" + channels + "'";
            conditions += `AND Channel IN (${channels})`
        }
        if(req.query.targeting)
            conditions += `AND Targeting=${pool.escape(decodeURIComponent(req.query.targeting))} `
        if(req.query.audience)
            conditions += `AND AdGroup=${pool.escape(decodeURIComponent(req.query.audience))} `

        if(req.query.goal == 'grow-brand-awareness' || req.query.goal == 'brand-affinity' || req.query.goal == 'brand-preference')
            conditions += `AND Source IN ('Facebook','Youtube','comscore')`;
        if(req.query.goal == 'grow-HH-penetration' || req.query.goal == 'build-usage-occasions' || req.query.goal == 'drive-shopper-action')
            conditions += `AND Source IN ('ODC','IRI')`;

        let sql = `SELECT Targeting, Brand_ODC_SL, isSignificant FROM targeting_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} GROUP BY Targeting ASC ORDER BY Brand_ODC_SL DESC;
            SELECT Targeting, Prod_ODC_SL, isSignificant FROM targeting_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} GROUP BY Targeting ASC ORDER BY Prod_ODC_SL DESC;
            SELECT AVG(SL_ROAS) as SL_ROAS FROM targeting_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND upcLevel="brand" GROUP BY MktCampaign;
            SELECT AVG(SL_ROAS) as SL_ROAS FROM targeting_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND upcLevel="product" GROUP BY MktCampaign`;
        
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

brand.getTargetingOverviewBL = (req, res) => {
    if(req.params.brand && req.query.campaign && req.query.goal) {
        let channels = [];
        let conditions = '';
        if(req.query.campaign)
            conditions += `AND MktCampaign=${pool.escape(decodeURIComponent(req.query.campaign))} `
        if(req.query.channel) {
            channels = decodeURIComponent(req.query.channel).split(',');
            channels = channels.join("','");
            channels = "'" + channels + "'";
            conditions += `AND Channel IN (${channels})`
        }
        if(req.query.targeting)
            conditions += `AND Targeting=${pool.escape(decodeURIComponent(req.query.targeting))} `
        if(req.query.audience)
            conditions += `AND AdGroup=${pool.escape(decodeURIComponent(req.query.audience))} `

        if(req.query.goal == 'grow-brand-awareness' || req.query.goal == 'brand-affinity' || req.query.goal == 'brand-preference')
            conditions += `AND Source IN ('Facebook','Youtube','comscore')`;
        if(req.query.goal == 'grow-HH-penetration' || req.query.goal == 'build-usage-occasions' || req.query.goal == 'drive-shopper-action')
            conditions += `AND Source IN ('ODC','IRI')`;

        let sql = `SELECT Targeting, Comscore_BL, isSignificant FROM targeting_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} GROUP BY Targeting ASC ORDER BY Comscore_BL DESC;
            SELECT Targeting, YT_BL, isSignificant FROM targeting_view WHERE Brand=${pool.escape(req.params.brand)} ${conditions} GROUP BY Targeting ASC ORDER BY YT_BL DESC`;
        
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