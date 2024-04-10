import pool from "./db.js";

const brand = {};

// Overview Page
brand.getCampaigns = (req, res) => {
    if(req.params.brand) {
        let conditions = '';
        conditions += ` AND MktCampaign NOT LIKE '%20' `
        conditions += ` AND MktCampaign NOT LIKE '%19' `
        conditions += ` AND MktCampaign NOT LIKE '%18' `
        conditions += ` AND MktCampaign NOT LIKE '%17' `
        conditions += ` AND MktCampaign NOT LIKE '%16' `

        // let sql = `SELECT DISTINCT MktCampaign FROM dtr_overview WHERE Brand=${pool.escape(req.params.brand)} ORDER BY MktCampaign ASC`;
        let sql = `SELECT MktCampaign FROM dtr_overview WHERE Brand=${pool.escape(req.params.brand)} ${conditions} UNION SELECT MktCampaign FROM bl_sl_overview WHERE Brand=${pool.escape(req.params.brand)} ${conditions} UNION SELECT MktCampaign FROM cqs_social_overview WHERE Brand=${pool.escape(req.params.brand)} ${conditions}`;
    
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

brand.getGoals = (req, res) => {
    if(req.params.brand) {
        let sql = `SELECT DISTINCT Goal FROM bl_sl_overview WHERE Brand=${pool.escape(req.params.brand)} ORDER BY Goal ASC`;
    
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

brand.getChannels = (req, res) => {
    if(req.params.brand) {
        // let sql = `SELECT DISTINCT Channel FROM dtr_overview WHERE Brand=${pool.escape(req.params.brand)} ORDER BY Channel ASC`;
        let sql = `SELECT Channel FROM dtr_overview WHERE Brand=${pool.escape(req.params.brand)} UNION DISTINCT SELECT Channel FROM bl_sl_overview WHERE Brand=${pool.escape(req.params.brand)} UNION DISTINCT SELECT Channel FROM cqs_social_overview WHERE Brand=${pool.escape(req.params.brand)} ORDER BY Channel ASC`;
    
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

brand.getCreativeNames = (req, res) => {
    if(req.params.brand && req.query.campaign) {
        let campaigns = [];
        let conditions = '';

        if(req.query.campaign) {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns})`;
        }

        let sql = `SELECT DISTINCT creativeName FROM bl_sl_overview WHERE Brand=${pool.escape(req.params.brand)} AND creativeName != '' ${conditions}`;
    
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

brand.getStudyNames = (req, res) => {
    if(req.params.brand && req.query.campaign) {
        let campaigns = [];
        let conditions = '';

        if(req.query.campaign) {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns})`;
        }

        let sql = `SELECT DISTINCT StudyName FROM bl_sl_overview WHERE Brand=${pool.escape(req.params.brand)} AND source='Facebook' AND StudyName != '' ${conditions}`;
    
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

brand.getCellNames = (req, res) => {
    if(req.params.brand && req.query.campaign && req.query.studyName) {
        let campaigns = [];
        let conditions = '';

        if(req.query.campaign) {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns})`;
        }

        let sql = `SELECT DISTINCT CellName FROM bl_sl_overview WHERE Brand=${pool.escape(req.params.brand)} AND StudyName=${pool.escape(decodeURIComponent(req.query.studyName))} AND CellName != '' ${conditions}`;
    
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

brand.getChannelsByCampaign = (req, res) => {
    if(req.params.brand && req.query.campaign) {
        let campaigns = [];
        let conditions = '';

        if(req.query.campaign) {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns})`;
        }

        let sql = `SELECT Channel FROM dtr_overview WHERE Brand=${pool.escape(req.params.brand)} ${conditions} UNION SELECT Channel FROM bl_sl_overview WHERE Brand=${pool.escape(req.params.brand)} ${conditions} UNION SELECT Channel FROM cqs_social_overview WHERE Brand=${pool.escape(req.params.brand)} ${conditions}`;
    
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

brand.getChannelsByGoal = (req, res) => {
    if(req.params.brand && req.query.campaign && req.query.goal) {
        let campaigns = [];
        let conditions = '';

        if(req.query.campaign) {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns})`;
        }

        if(req.query.goal == 'grow-brand-awareness' || req.query.goal == 'brand-affinity' || req.query.goal == 'brand-preference')
            var source = ['Facebook','Youtube','Comscore'];
        if(req.query.goal == 'grow-HH-penetration' || req.query.goal == 'build-usage-occasions' || req.query.goal == 'drive-shopper-action')
            var source = ['ODC', 'IRI'];

        let sql = `SELECT DISTINCT Channel FROM bl_sl_overview WHERE Brand=${pool.escape(req.params.brand)} AND Source IN (${pool.escape(source)}) ${conditions} ORDER BY Channel ASC`;
    
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

brand.getImpressionsReachSpendCPM = (req, res) => {
    if(req.params.brand || req.query.campaign || req.query.channel) {
        let campaigns = [];
        let conditions = '';

        if(req.query.campaign && req.query.channel=="''") {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns})`;
            // conditions = `AND MktCampaign=${pool.escape(req.query.campaign)}`
        }
        else if(!req.query.campaign && req.query.channel!="''")
            conditions = `AND Channel IN (${decodeURIComponent(req.query.channel)})`
        else if(req.query.campaign && req.query.channel!="''") {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns}) AND Channel IN (${decodeURIComponent(req.query.channel)})`;
            // conditions = `AND MktCampaign=${pool.escape(req.query.campaign)} AND Channel IN (${req.query.channel})`
        }

        let sql = `SELECT DATE_FORMAT(Day, '%m-%d-%y') as Date, ROUND(IFNULL(SUM(Imp), 0), 2) as Imp FROM dtr_overview WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND Imp IS NOT NULL GROUP BY Week;
            SELECT DATE_FORMAT(Day, '%m-%d-%y') as Date, ROUND(IFNULL(SUM(Spend), 0), 2) as Spend FROM dtr_overview WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND Spend IS NOT NULL GROUP BY Week`;
            // SELECT DATE_FORMAT(Day, '%m-%d-%y') as Date, Week, ROUND(IFNULL(AVG(CPM), 0), 2) as CPM, ROUND(IFNULL(AVG(CPMGoal), 0), 2) as CPMGoal FROM dtr_overview WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND CPM IS NOT NULL GROUP BY Week`;
            // SELECT * FROM dtr_overview WHERE Brand=${pool.escape(req.params.brand)} AND Campaign=${pool.escape(req.query.campaign)} ORDER BY Week ASC`;
            // SELECT YEAR(Day) as Year, Week, ROUND(IFNULL(SUM(Reach), 0), 2) as Reach, ROUND(IFNULL(SUM(ReachGoal), 0), 2) as ReachGoal FROM dtr_overview WHERE Brand=${pool.escape(req.params.brand)} AND MktCampaign=${pool.escape(req.query.campaign)} AND Reach IS NOT NULL GROUP BY Week;
    
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

brand.getImpressionsReachSpendCPMByTargeting = (req, res) => {
    if(req.params.brand || req.query.campaign || req.query.channel) {
        let campaigns = [];
        let conditions = '';

        if(req.query.campaign && req.query.channel=="''") {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns})`;
            // conditions = `AND MktCampaign=${pool.escape(req.query.campaign)}`
        }
        else if(!req.query.campaign && req.query.channel!="''")
            conditions = `AND Channel IN (${decodeURIComponent(req.query.channel)})`
        else if(req.query.campaign && req.query.channel!="''") {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns}) AND Channel IN (${decodeURIComponent(req.query.channel)})`;
            // conditions = `AND MktCampaign=${pool.escape(req.query.campaign)} AND Channel IN (${req.query.channel})`
        }

        let sql = `SELECT Targeting, ROUND(IFNULL(SUM(Imp), 0), 2) as Imp FROM dtr_overview WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND Imp IS NOT NULL GROUP BY Targeting;
            SELECT Targeting, ROUND(IFNULL(SUM(Spend), 0), 2) as Spend FROM dtr_overview WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND Spend IS NOT NULL GROUP BY Targeting`;
                
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

brand.getBrandAndSalesLift = (req, res) => {
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

        // let sql = `SELECT QuestionType, IFNULL(AVG(Comscore_BL), 0) as Comscore_BL, IFNULL(AVG(FB_BL), 0) as FB_BL, IFNULL(AVG(YT_BL), 0) as YT_BL FROM bl_sl_overview WHERE Brand=${pool.escape(req.params.brand)} ${conditions} GROUP BY QuestionType;
        // SELECT Channel, IFNULL(AVG(Brand_ODC_SL), 0) as Brand_ODC_SL, DATE_FORMAT(MIN(StartDateSL), '%d %b %Y') as StartDateSL, DATE_FORMAT(MAX(EndDateSL), '%d %b %Y') as EndDateSL FROM bl_sl_overview WHERE Brand=${pool.escape(req.params.brand)} ${conditions} GROUP BY Channel ORDER BY Brand_ODC_SL DESC;
        // SELECT Channel, IFNULL(AVG(Prod_ODC_SL), 0) as Prod_ODC_SL, DATE_FORMAT(MIN(StartDateSL), '%d %b %Y') as StartDateSL, DATE_FORMAT(MAX(EndDateSL), '%d %b %Y') as EndDateSL FROM bl_sl_overview WHERE Brand=${pool.escape(req.params.brand)} ${conditions} GROUP BY Channel ORDER BY Prod_ODC_SL DESC`;

        let sql = `SELECT QuestionType, IFNULL(AVG(Comscore_BL), 0) as Comscore_BL, isSignificant FROM bl_sl_overview WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND creativeName!='' GROUP BY QuestionType;
        SELECT Channel, IFNULL(AVG(Brand_ODC_SL), 0) as Brand_ODC_SL, DATE_FORMAT(MIN(StartDateSL), '%d %b %Y') as StartDateSL, DATE_FORMAT(MAX(EndDateSL), '%d %b %Y') as EndDateSL, isSignificant FROM bl_sl_overview WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND Source IN ("ODC", "IRI") AND upcLevel="brand" GROUP BY Channel ORDER BY Brand_ODC_SL DESC;
        SELECT Channel, IFNULL(AVG(Prod_ODC_SL), 0) as Prod_ODC_SL, DATE_FORMAT(MIN(StartDateSL), '%d %b %Y') as StartDateSL, DATE_FORMAT(MAX(EndDateSL), '%d %b %Y') as EndDateSL, isSignificant FROM bl_sl_overview WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND Source IN ("ODC", "IRI") AND upcLevel="product" GROUP BY Channel ORDER BY Prod_ODC_SL DESC;
        SELECT QuestionType, IFNULL(AVG(FB_BL), 0) as FB_BL, isSignificant FROM bl_sl_overview WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND StudyName!='' GROUP BY QuestionType;
        SELECT QuestionType, IFNULL(AVG(YT_BL), 0) as YT_BL, isSignificant FROM bl_sl_overview WHERE Brand=${pool.escape(req.params.brand)} ${conditions} GROUP BY QuestionType;
        SELECT AVG(SL_ROAS) as SL_ROAS FROM bl_sl_overview WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND Source IN ("ODC", "IRI") AND upcLevel="brand" GROUP BY MktCampaign;
        SELECT AVG(SL_ROAS) as SL_ROAS FROM bl_sl_overview WHERE Brand=${pool.escape(req.params.brand)} ${conditions} AND Source IN ("ODC", "IRI") AND upcLevel="product" GROUP BY MktCampaign`;

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

brand.getBrandLiftComscore = (req, res) => {
    if(req.params.brand || req.query.campaign || req.query.channel || req.query.creativeName) {
        let campaigns = [];
        let conditions = '';

        if(req.query.campaign && req.query.channel=="''") {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns}) AND creativeName=${pool.escape(decodeURIComponent(req.query.creativeName))}`;
            // conditions = `AND MktCampaign=${pool.escape(req.query.campaign)} AND creativeName=${pool.escape(req.query.creativeName)}`;
        }
        else if(!req.query.campaign && req.query.channel!="''")
            conditions = `AND Channel IN (${decodeURIComponent(req.query.channel)}) AND creativeName=${pool.escape(decodeURIComponent(req.query.creativeName))}`;
        else if(req.query.campaign && req.query.channel!="''") {
            campaigns = decodeURIComponent(req.query.campaign).split(',');
            campaigns = campaigns.join('","');
            campaigns = '"' + campaigns + '"';
            conditions += `AND MktCampaign IN (${campaigns}) AND Channel IN (${decodeURIComponent(req.query.channel)}) AND creativeName=${pool.escape(decodeURIComponent(req.query.creativeName))}`;
            // conditions = `AND MktCampaign=${pool.escape(req.query.campaign)} AND Channel IN (${req.query.channel}) AND creativeName=${pool.escape(req.query.creativeName)}`;
        }

        let sql = `SELECT QuestionType, IFNULL(AVG(Comscore_BL), 0) as Comscore_BL, isSignificant FROM bl_sl_overview WHERE Brand=${pool.escape(req.params.brand)} ${conditions} GROUP BY QuestionType`;

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

brand.getBrandLiftFacebook = (req, res) => {
    if(req.params.brand || req.query.campaign || req.query.channel || req.query.studyName || req.query.cellName) {
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

        if(req.query.studyName && req.query.cellName)
            conditions += ` AND StudyName=${pool.escape(decodeURIComponent(req.query.studyName))} AND CellName=${pool.escape(decodeURIComponent(req.query.cellName))}`;
        if(!req.query.studyName && req.query.cellName)
            conditions += ` AND CellName=${pool.escape(decodeURIComponent(req.query.cellName))}`;
        if(req.query.studyName && !req.query.cellName)
            conditions += ` AND StudyName=${pool.escape(decodeURIComponent(req.query.studyName))}`;
        

        let sql = `SELECT QuestionType, ROUND(IFNULL(AVG(FB_BL), 0), 2) as FB_BL, isSignificant FROM bl_sl_overview WHERE Brand=${pool.escape(req.params.brand)} ${conditions} GROUP BY QuestionType`;
        
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

brand.getCreativeScore = (req, res) => {
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

        let sql = `SELECT AVG(weightedCQS) as creativeScore, COUNT(DISTINCT Channel) as channels, COUNT(DISTINCT creativeName) as creatives FROM cqs_social_overview WHERE Brand=${pool.escape(req.params.brand)} ${conditions}`;
            // SELECT AVG(CQS) as creativeScore, creativeName FROM cqs_social_overview WHERE Brand=${pool.escape(req.params.brand)} ${conditions} GROUP BY creativeName ORDER BY creativeScore DESC LIMIT 5`;
              
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

brand.getSocialSentiment = (req, res) => {
    if(req.params.brand) {
        let sql = `SELECT PositivePerc, NeutralPerc, NegativePerc, ShareOfVoicePerc FROM sprinklr_overview WHERE Brand=${pool.escape(req.params.brand)}`;
 
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