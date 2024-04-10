import express from 'express';
const brandRouter = express.Router();
import brandController from '../../controllers/brand.controller.js';
import overviewController from '../../controllers/overview.controller.js';
import targetingOverviewController from '../../controllers/targeting-overview.controller.js';
import brandHealthController from '../../controllers/brand-health.controller.js';
import salesLiftController from '../../controllers/sales-lift.controller.js';
import creativeOverviewController from '../../controllers/creative-overview.controller.js';
import comparisonController from '../../controllers/comparison.controller.js';

import apiAuth from '../../middleware/auth.js'


// -- Brand -- //

// @route   GET api/v1/brand/
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand', apiAuth, brandController.checkIfExist);

// @route   GET api/v1/brand/getCampaignStartEndDates
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getCampaignStartEndDates', apiAuth, brandController.getCampaignStartEndDates);


// -- Overview Page -- //

// @route   GET api/v1/brand/campaigns
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/campaigns', apiAuth, overviewController.getCampaigns);

// @route   GET api/v1/brand/goals
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/goals', apiAuth, overviewController.getGoals);

// @route   GET api/v1/brand/channels
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/channels', apiAuth, overviewController.getChannels);

// @route   GET api/v1/brand/creativeNames
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/creativeNames', apiAuth, overviewController.getCreativeNames);

// @route   GET api/v1/brand/studyNames
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/studyNames', apiAuth, overviewController.getStudyNames);

// @route   GET api/v1/brand/cellNames
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/cellNames', apiAuth, overviewController.getCellNames);

// @route   GET api/v1/brand/channelsByCampaign
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/channelsByCampaign', apiAuth, overviewController.getChannelsByCampaign);

// @route   GET api/v1/brand/getChannelsByGoal
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/channelsByGoal', apiAuth, overviewController.getChannelsByGoal);

// @route   GET api/v1/:brand/getImpressionsReachSpendCPM
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getImpressionsReachSpendCPM', apiAuth, overviewController.getImpressionsReachSpendCPM);

// @route   GET api/v1/:brand/getImpressionsReachSpendCPMByTargeting
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getImpressionsReachSpendCPMByTargeting', apiAuth, overviewController.getImpressionsReachSpendCPMByTargeting);

// @route   GET api/v1/:brand/getBrandAndSalesLift
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getBrandAndSalesLift', apiAuth, overviewController.getBrandAndSalesLift);

// @route   GET api/v1/:brand/getBrandAndSalesLift
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getBrandLiftComscore', apiAuth, overviewController.getBrandLiftComscore);

// @route   GET api/v1/:brand/getBrandAndSalesLift
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getBrandLiftFacebook', apiAuth, overviewController.getBrandLiftFacebook);

// @route   GET api/v1/:brand/getCreativeScore
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getCreativeScore', apiAuth, overviewController.getCreativeScore);

// @route   GET api/v1/:brand/getSocialSentiment
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getSocialSentiment', apiAuth, overviewController.getSocialSentiment);


// -- Targeting Overview Page -- //

// @route   GET api/v1/brand/getTargetingOverviewCampaigns
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getTargetingOverviewCampaigns', apiAuth, targetingOverviewController.getTargetingOverviewCampaigns);

// @route   GET api/v1/brand/getTargetingOverviewChannelsByCampaign
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getTargetingOverviewChannelsByCampaign', apiAuth, targetingOverviewController.getTargetingOverviewChannelsByCampaign);

// @route   GET api/v1/brand/getTargetingOverviewChannelsByGoal
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getTargetingOverviewChannelsByGoal', apiAuth, targetingOverviewController.getTargetingOverviewChannelsByGoal);

// @route   GET api/v1/brand/getTargetingOverviewTargetingByCampaign
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getTargetingOverviewTargetingByCampaign', apiAuth, targetingOverviewController.getTargetingOverviewTargetingByCampaign);

// @route   GET api/v1/brand/getTargetingOverviewAudienceByCampaign
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getTargetingOverviewAudienceByCampaign', apiAuth, targetingOverviewController.getTargetingOverviewAudienceByCampaign);

// @route   GET api/v1/brand/getTargetingOverviewTargetingCPM
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getTargetingOverviewTargetingCPM', apiAuth, targetingOverviewController.getTargetingOverviewTargetingCPM);

// @route   GET api/v1/brand/getTargetingOverviewAudienceCPM
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getTargetingOverviewAudienceCPM', apiAuth, targetingOverviewController.getTargetingOverviewAudienceCPM);

// @route   GET api/v1/brand/getTargetingOverviewTargetingInViewRateViewability
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getTargetingOverviewTargetingInViewRateViewability', apiAuth, targetingOverviewController.getTargetingOverviewTargetingInViewRateViewability);

// @route   GET api/v1/brand/getTargetingOverviewAudienceInViewRateViewability
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getTargetingOverviewAudienceInViewRateViewability', apiAuth, targetingOverviewController.getTargetingOverviewAudienceInViewRateViewability);

// @route   GET api/v1/brand/getTargetingOverviewTargetingInViewTimeViewability
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getTargetingOverviewTargetingInViewTimeViewability', apiAuth, targetingOverviewController.getTargetingOverviewTargetingInViewTimeViewability);

// @route   GET api/v1/brand/getTargetingOverviewAudienceInViewTimeViewability
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getTargetingOverviewAudienceInViewTimeViewability', apiAuth, targetingOverviewController.getTargetingOverviewAudienceInViewTimeViewability);

// @route   GET api/v1/brand/getTargetingOverviewSL
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getTargetingOverviewSL', apiAuth, targetingOverviewController.getTargetingOverviewSL);

// @route   GET api/v1/brand/getTargetingOverviewBL
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getTargetingOverviewBL', apiAuth, targetingOverviewController.getTargetingOverviewBL);


// -- Brand Health Page -- //

// @route   GET api/v1/brand/getBrandHealthCampaigns
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getBrandHealthCampaigns', apiAuth, brandHealthController.getBrandHealthCampaigns);

// @route   GET api/v1/brand/getBrandHealthComscoreResults
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getBrandHealthComscoreResults', apiAuth, brandHealthController.getBrandHealthComscoreResults);

// @route   GET api/v1/brand/getBrandHealthOverallSnapshot
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getBrandHealthOverallSnapshot', apiAuth, brandHealthController.getBrandHealthOverallSnapshot);

// @route   GET api/v1/brand/getBrandHealthPurchaseIntent
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getBrandHealthPurchaseIntent', apiAuth, brandHealthController.getBrandHealthPurchaseIntent);

// @route   GET api/v1/brand/getBrandHealthGetCellNames
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getBrandHealthGetCellNames', apiAuth, brandHealthController.getBrandHealthGetCellNames);

// @route   GET api/v1/brand/getBrandHealthFacebookBrandLiftByCellName
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getBrandHealthFacebookBrandLiftByCellName', apiAuth, brandHealthController.getBrandHealthFacebookBrandLiftByCellName);

// @route   GET api/v1/brand/getBrandHealthYouTubeBrandLift
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getBrandHealthYouTubeBrandLift', apiAuth, brandHealthController.getBrandHealthYouTubeBrandLift);


// -- Sales Lift -- //

// @route   GET api/v1/brand/getSalesLiftCampaigns
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getSalesLiftCampaigns', apiAuth, salesLiftController.getSalesLiftCampaigns);

// @route   GET api/v1/brand/getSalesLiftSLData
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getSalesLiftSLData', apiAuth, salesLiftController.getSalesLiftSLData);


// -- Creative Overview Page -- //

// @route   GET api/v1/brand/getCreativeOverviewCampaigns
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getCreativeOverviewCampaigns', apiAuth, creativeOverviewController.getCreativeOverviewCampaigns);

// @route   GET api/v1/brand/getCreativeOverviewChannelsByCampaign
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getCreativeOverviewChannelsByCampaign', apiAuth, creativeOverviewController.getCreativeOverviewChannelsByCampaign);

// @route   GET api/v1/:brand/getCreativesCount
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getCreativesCount', apiAuth, creativeOverviewController.getCreativesCount);

// @route   GET api/v1/:brand/getCreatives
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getCreatives', apiAuth, creativeOverviewController.getCreatives);

// @route   GET api/v1/:brand/getCreatives2
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getCreatives2', apiAuth, creativeOverviewController.getCreatives2);

// @route   GET api/v1/:brand/getCreativesList
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getCreativesList', apiAuth, creativeOverviewController.getCreativesList);


// -- Comparison Page -- //

// @route   GET api/v1/brand/getComparisonCampaigns
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getComparisonCampaigns', apiAuth, comparisonController.getComparisonCampaigns);

// @route   GET api/v1/brand/getComparisonTargetingByCampaign
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getComparisonTargetingByCampaign', apiAuth, comparisonController.getComparisonTargetingByCampaign);

// @route   GET api/v1/brand/getComparisonAudienceByCampaign
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getComparisonAudienceByCampaign', apiAuth, comparisonController.getComparisonAudienceByCampaign);

// @route   GET api/v1/:brand/getComparisonImpressionsSpend
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getComparisonImpressionsSpend', apiAuth, comparisonController.getComparisonImpressionsSpend);

// @route   GET api/v1/:brand/getComparisonCPVM
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getComparisonCPVM', apiAuth, comparisonController.getComparisonCPVM);

// @route   GET api/v1/:brand/getComparisonInViewRate
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getComparisonInViewRate', apiAuth, comparisonController.getComparisonInViewRate);

// @route   GET api/v1/:brand/getComparison2SecVideoInViewRate
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getComparison2SecVideoInViewRate', apiAuth, comparisonController.getComparison2SecVideoInViewRate);

// @route   GET api/v1/:brand/getComparisonInViewTimeDisplay
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getComparisonInViewTimeDisplay', apiAuth, comparisonController.getComparisonInViewTimeDisplay);

// @route   GET api/v1/:brand/getComparisonInViewTimeVideo
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getComparisonInViewTimeVideo', apiAuth, comparisonController.getComparisonInViewTimeVideo);

// @route   GET api/v1/:brand/getComparisonBL
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getComparisonBL', apiAuth, comparisonController.getComparisonBL);

// @route   GET api/v1/:brand/getComparisonSL
// @desc    Brand API route
// @access  Public
brandRouter.get('/:brand/getComparisonSL', apiAuth, comparisonController.getComparisonSL);


export default brandRouter;