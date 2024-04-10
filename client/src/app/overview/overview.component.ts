import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectChange, MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { StorageService } from '../storage.service';
import { AppService } from '../app.service';

import { spinner } from '../spinner-config';
import { CarouselComponent } from 'angular-bootstrap-md';

export interface Dropwdowns {
  value: string,
  text: string
}

export interface ImpressionChart {
  week: string,
  impression: number
}

export interface ReachChart {
  week: string,
  reach: number
}

export interface SpendChart {
  week: string,
  spend: number
}

export interface CpmChart {
  week: string,
  cpm: number
}

export interface ComScoreChart {
  type: string,
  comScoreBL: number,
  color: string
}

export interface FacebookChart {
  type: string,
  facebookBL: number,
  color: string
}

export interface YouTubeChart {
  type: string,
  youTubeBL: number,
  color: string
}

export interface BrandODCSLChart {
  type: string,
  brandODCSL: number
  date: {
    startDateSL: string,
    endDateSL: string
  }
}

export interface ProductODCSLChart {
  type: string,
  productODCSL: number,
  date: {
    startDateSL: string,
    endDateSL: string
  }
}

const cpmCalc = (spend: number, impression: number) => { return (spend&&impression)?(spend/impression)*1000:0 }

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: [
    './overview.component.css'
  ]
})

export class OverviewComponent implements OnInit {
  // isLeftVisible = true;

  brand:any;

  campaignDate: boolean = false;
  campaignStartDate: string = '';
  campaignEndDate: string = '';

  startDateSL: string = '';
  endDateSL: string = '';

  campaign_summary_campaign: String | null = '';
  campaign_summary_goal: string | null = '';
  campaign_summary_channel: String | null = '';

  campaignSummaryImpressionsClasses = ['widget-180'];
  campaignSummaryReachClasses = ['widget-180'];
  campaignSummarySpendClasses = ['widget-180'];
  campaignSummaryCpmClasses = ['widget-180'];
  campaignSummarySocialSentimentClasses = ['widget-336'];
  campaignSummaryBrandLiftClasses = ['widget-340'];
  campaignSummaryBrandLiftComscoreClasses = ['widget-280'];
  campaignSummaryBrandLiftFacebookClasses = ['widget-280'];
  campaignSummaryCreativeScoreClasses = ['widget-232', 'd-flex', 'flex-column', 'justify-content-center', 'align-items-center'];
  campaignSummarySalesLiftClasses = ['widget-130'];
  campaignSummaryOverviewTargetingClasses = ['widget-233'];

  campaignListForSearch: Dropwdowns[] = [];
  campaignList: Dropwdowns[] = [];

  goalList: Dropwdowns[] = [{
    value: 'grow-brand-awareness',
    text: 'Grow Brand Awareness'
  } , {
    value: 'brand-affinity',
    text: 'Brand Affinity'
  } , {
    value: 'brand-preference',
    text: 'Brand Preference'
  } , {
    value: 'grow-HH-penetration',
    text: 'Grow HH Penetration'
  } , {
    value: 'build-usage-occasions',
    text: 'Build Usage Occasions'
  } , {
    value: 'drive-shopper-action',
    text: 'Drive Shopper Action'
  }];

  goalSelectedChannels: string = '';
  channelListForSearch: Dropwdowns[] = [];
  channelList: Dropwdowns[] = [];

  creativeNameListForSearch: Dropwdowns[] = [];
  creativeNameList: Dropwdowns[] = [];
  studyNameListForSearch: Dropwdowns[] = [];
  studyNameList: Dropwdowns[] = [];
  cellNameListForSearch: Dropwdowns[] = [];
  cellNameList: Dropwdowns[] = [];

  campaign_summary_campaigns = new FormControl();
  campaign_summary_goals = new FormControl();
  campaign_summary_channels = new FormControl();

  campaign_summary_creative_names = new FormControl();
  campaign_summary_study_names = new FormControl();
  campaign_summary_cell_names = new FormControl();

  campaignSummaryImpressionsData = {
    value: 0 as number,
    chart: [{
      "week": "",
      "impression": 0
    }] as any
  };

  campaignSummarySpendData = {
    value: 0 as number,
    chart: [{
      "week": "",
      "spend": 0
    }] as any
  };

  campaignSummaryCpmData = {
    value: 0 as number,
    chart: [{
      "week": "",
      "cpm": 0
    }] as any
  };

  campaignSummaryImpressionDataByTargeting = {
    chart: [] as any
  };

  campaignSummarySpendDataByTargeting = {
    chart: [] as any
  };

  campaignSummaryCPMDataByTargeting = {
    chart: [] as any
  };

  campaignSummarySocialSentimentData = {
    shareOfVoice: 0 as number,
    chart: [] as any[],
    chartIds: [] as any[]
  };

  campaignSummaryComScoreBrandLiftData = {
    chart: [{
      type: "",
      comScoreBL: 0
    }] as any,
    flag: false as boolean
  };

  campaignSummaryFacebookBrandLiftData = {
    chart: [{
      type: "",
      facebookBL: 0
    }] as any,
    flag: false as boolean
  };

  campaignSummaryYouTubeBrandLiftData = {
    chart: [{
      type: "",
      youTubeBL: 0
    }] as any,
    flag: false as boolean
  };

  campaignSummaryCreativeScoreData = {
    value: 0 as number,
    channels: 0 as number,
    creatives: 0 as number,
    chart: [] as any[]
  };

  campaignSummaryBrandODCLiftData = {
    chart: [] as any [],
    chartIds: [] as any,
    roas: 0 as number
  };

  campaignSummaryProductODCLiftData = {
    chart: [] as any [],
    chartIds: [] as any,
    roas: 0 as number
  };

  @ViewChild('campaign') matSelectCampaign: MatSelect;
  @ViewChild('goal') matSelectGoal: MatSelect;
  @ViewChild('channel') matSelectChannel: MatSelect;

  @ViewChild('creativeName') matSelectCreativeName: MatSelect;
  @ViewChild('studyName') matSelectStudyName: MatSelect;
  @ViewChild('cellName') matSelectCellName: MatSelect;

  @ViewChild('carousel') carousel: CarouselComponent;
  @ViewChild('impressionCarousel') impressionCarousel: CarouselComponent;
  @ViewChild('spendCarousel') spendCarousel: CarouselComponent;
  @ViewChild('cpmCarousel') cpmCarousel: CarouselComponent;

  public isFilteredCampaigns(campaign: any) {
    return this.campaignList.find(item => item.value === campaign.value);
  }

  constructor(
    private storageService: StorageService,
    private appService: AppService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
      this.brand = this.route.snapshot.paramMap.get('brand');
      if(this.brand) {
        this.getCampaigns();
      }

      this.campaign_summary_goals.disable();
      this.campaign_summary_channels.disable();
      this.campaign_summary_cell_names.disable();
  }

  ngAfterViewInit() {
    this.matSelectCampaign.openedChange.subscribe(opened => {
      if (opened) {
        this.matSelectCampaign.panel.nativeElement.addEventListener('mouseleave', () => {
          this.matSelectCampaign.close();
          this.campaignList = this.campaignListForSearch;
        })
      }
    });

    // this.matSelectGoal.openedChange.subscribe(opened => {
    //   if (opened) {
    //     this.matSelectGoal.panel.nativeElement.addEventListener('mouseleave', () => {
    //       this.matSelectGoal.close();
    //     })
    //   }
    // });

    this.matSelectChannel.openedChange.subscribe(opened => {
      if (opened) {
        this.matSelectChannel.panel.nativeElement.addEventListener('mouseleave', () => {
          this.matSelectChannel.close();
          this.channelList = this.channelListForSearch;
        })
      }
    });

    this.matSelectCreativeName.openedChange.subscribe(opened => {
      if (opened) {
        this.matSelectCreativeName.panel.nativeElement.addEventListener('mouseleave', () => {
          this.matSelectCreativeName.close();
          this.creativeNameList = this.creativeNameListForSearch;
        })
      }
    });

    this.matSelectStudyName.openedChange.subscribe(opened => {
      if (opened) {
        this.matSelectStudyName.panel.nativeElement.addEventListener('mouseleave', () => {
          this.matSelectStudyName.close();
          this.studyNameList = this.studyNameListForSearch;
        })
      }
    });

    this.matSelectCellName.openedChange.subscribe(opened => {
      if (opened) {
        this.matSelectCellName.panel.nativeElement.addEventListener('mouseleave', () => {
          this.matSelectCellName.close();
          this.cellNameList = this.cellNameListForSearch;
        })
      }
    });
  }

  randomNumber() {
    return Math.floor(Math.random()*1000000);
  }

  ngOnInit() {
    if(this.storageService.getFromStorage('mat-select-campaign-summary-campaign')) {
      // this.campaign_summary_goals.enable();
      this.campaign_summary_channels.enable();

      this.campaign_summary_campaign = this.storageService.getFromStorage('mat-select-campaign-summary-campaign');
      let campaign: any = this.storageService.getFromStorage('mat-select-campaign-summary-campaign');
      // this.getCampaignStartEndDates(campaign);
    } else {
      // this.campaign_summary_goals.disable();
      this.campaign_summary_channels.disable();
      this.campaign_summary_campaign = '';
    }

    if(this.storageService.getFromStorage('mat-select-campaign-summary-goal')) {
      // this.campaign_summary_channels.enable();
      this.campaign_summary_goal = this.storageService.getFromStorage('mat-select-campaign-summary-goal');
    } else {
      // this.campaign_summary_channels.disable();
      this.campaign_summary_goal = '';
    }

    if(this.storageService.getFromStorage('mat-select-campaign-summary-channel'))
      this.campaign_summary_channel = this.storageService.getFromStorage('mat-select-campaign-summary-channel');
    else
      this.campaign_summary_channel = '';

    if(this.storageService.getFromStorage('mat-select-campaign-summary-campaign') && !this.storageService.getFromStorage('mat-select-campaign-summary-channel')) {
      let campaign: any = this.storageService.getFromStorage('mat-select-campaign-summary-campaign');
      let goal: any = this.storageService.getFromStorage('mat-select-campaign-summary-goal');

      if(campaign)
        this.getCampaignStartEndDates(campaign);
        // this.getSocialSentiment(); // CLIENT REMOVED
        this.getCreativeNames(campaign);
        this.getStudyNames(campaign);
        this.getChannelsByCampaign(campaign).then(() => {
          // if(goal)
            // this.getChannelsByGoal(campaign, goal).then(() => {
              if(campaign && this.goalSelectedChannels=='') {
                this.getImpressionsReachSpendCPM(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', '', false);
                this.getImpressionsReachSpendCPMByTargeting(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', '', false);
                this.getBrandAndSalesLift(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', '', false);
                this.getCreativeScore(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.campaign_summary_channels.value?this.campaign_summary_channels.value:'', false);
              } else if(this.goalSelectedChannels) {
                this.getImpressionsReachSpendCPM(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.goalSelectedChannels, true);
                this.getImpressionsReachSpendCPMByTargeting(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.goalSelectedChannels, true);
                this.getBrandAndSalesLift(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.goalSelectedChannels, true);
                this.getCreativeScore(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.campaign_summary_channels.value?this.campaign_summary_channels.value:'', false);
              } else {
                this.campaignSummaryComScoreBrandLiftData = {
                  chart: [],
                  flag: false
                };

                this.campaignSummaryFacebookBrandLiftData = {
                  chart: [],
                  flag: false
                };

                this.campaignSummaryYouTubeBrandLiftData = {
                  chart: [],
                  flag: false
                };

                this.campaignSummaryBrandODCLiftData = {
                  chart: [],
                  chartIds: [],
                  roas: 0
                };

                this.campaignSummaryProductODCLiftData = {
                  chart: [],
                  chartIds: [],
                  roas: 0
                };

                this.campaignSummaryCreativeScoreData = {
                  value: 0,
                  channels: 0,
                  creatives: 0,
                  chart: []
                };
              }
            // });;
        });

        // if(!campaign && goal)
        //   this.getChannelsByGoal(goal).then(() => {
        //     if(this.goalSelectedChannels) {
        //       this.getImpressionsReachSpendCPM(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.goalSelectedChannels, true);
        //       this.getBrandAndSalesLift(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.goalSelectedChannels, true);
        //       this.getCreativeScore(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.goalSelectedChannels, true);
        //     } else {
        //       this.campaignSummaryComScoreBrandLiftData = {
        //         chart: [],
        //         flag: false
        //       };

        //       this.campaignSummaryFacebookBrandLiftData = {
        //         chart: [],
        //         flag: false
        //       };

        //       this.campaignSummaryYouTubeBrandLiftData = {
        //         chart: [],
        //         flag: false
        //       };

        //       this.campaignSummaryProductODCLiftData = {
        //         chart: [],
        //         chartIds: [],
        //         roas: 0
        //       };

        //       this.campaignSummaryBrandODCLiftData = {
        //         chart: [],
        //         chartIds: [],
        //         roas: 0
        //       };

        //       this.campaignSummaryCreativeScoreData = {
        //         value: 0,
        //         channels: 0,
        //         creatives: 0,
        //         chart: []
        //       };
        //     }
        //   });
    } else {
      // this.getChannels();
    }

    this.campaign_summary_campaigns.setValue(this.campaign_summary_campaign?.split(','));
    this.campaign_summary_goals.setValue(this.campaign_summary_goal);
    this.campaign_summary_channels.setValue(this.campaign_summary_channel);

    if(this.storageService.getFromStorage('mat-select-campaign-summary-campaign') && this.storageService.getFromStorage('mat-select-campaign-summary-channel')) {


      let campaign: any = this.storageService.getFromStorage('mat-select-campaign-summary-campaign');
      let goal: any = this.storageService.getFromStorage('mat-select-campaign-summary-goal');

      if(campaign)
        this.getCampaignStartEndDates(campaign);
        // this.getSocialSentiment(); // CLIENT REMOVED
        this.getCreativeNames(campaign);
        this.getStudyNames(campaign);
        this.getChannelsByCampaign(campaign).then(() => {
          // if(goal)
            // this.getChannelsByGoal(campaign, goal).then(() => {
              this.getImpressionsReachSpendCPM(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.campaign_summary_channels.value?this.campaign_summary_channels.value:'', false);
              this.getImpressionsReachSpendCPMByTargeting(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.campaign_summary_channels.value?this.campaign_summary_channels.value:'', false);
              this.getBrandAndSalesLift(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.campaign_summary_channels.value?this.campaign_summary_channels.value:'', false);
              this.getCreativeScore(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.campaign_summary_channels.value?this.campaign_summary_channels.value:'', false);
            // });;
        });
    }
  }

  onChange(selected: MatSelectChange) {
    if(selected.source.id == 'mat-select-campaign-summary-campaign') {
      this.carousel.selectSlide(0);
      // this.impressionCarousel.selectSlide(0);
      // this.spendCarousel.selectSlide(0);
      // this.cpmCarousel.selectSlide(0);

      if(this.campaign_summary_campaigns.value.length) {
        this.storageService.addToStorage('mat-select-campaign-summary-campaign', selected.value);
        // this.campaign_summary_goals.enable();
        this.campaign_summary_channels.enable();

        this.cellNameList = [];
        this.cellNameListForSearch = [];
        this.campaign_summary_channels.setValue('');
        this.campaign_summary_creative_names.setValue('');
        this.campaign_summary_study_names.setValue('');
        this.campaign_summary_cell_names.setValue('');
        this.storageService.removeFromStorage('mat-select-campaign-summary-channel');

        this.getCampaignStartEndDates(selected.value);

        this.getChannelsByCampaign(selected.value);
        this.getCreativeNames(selected.value);
        this.getStudyNames(selected.value);

        // this.getSocialSentiment(); // CLIENT REMOVED

        if(this.campaign_summary_campaigns.value)
          // this.getChannelsByGoal(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', '').then(() => {
            if(this.campaign_summary_campaigns.value && this.goalSelectedChannels=='') {
              this.getImpressionsReachSpendCPM(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', '', false);
              this.getImpressionsReachSpendCPMByTargeting(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', '', false);
              this.getBrandAndSalesLift(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', '', false);
              this.getCreativeScore(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.campaign_summary_channels.value?this.campaign_summary_channels.value:'', false);
            }
            // else if(selected.value && this.goalSelectedChannels) {
            //   this.getImpressionsReachSpendCPM(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.goalSelectedChannels, true);
            //   this.getBrandAndSalesLift(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.goalSelectedChannels, true);
            //   this.getCreativeScore(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.campaign_summary_channels.value?this.campaign_summary_channels.value:'', false);
            // }
          // });

      } else {
        this.storageService.removeFromStorage('mat-select-campaign-summary-campaign');
        this.storageService.removeFromStorage('mat-select-campaign-summary-goal');
        this.storageService.removeFromStorage('mat-select-campaign-summary-channel');

        // this.campaign_summary_goals.disable();
        this.campaign_summary_channels.disable();

        this.campaign_summary_goals.setValue('');
        this.campaign_summary_channels.setValue('');

        // Reset data
        this.creativeNameListForSearch = [];
        this.creativeNameList = [];
        this.studyNameListForSearch = [];
        this.studyNameList = [];
        this.cellNameListForSearch = [];
        this.cellNameList = [];

        this.campaign_summary_creative_names.setValue('');
        this.campaign_summary_study_names.setValue('');
        this.campaign_summary_cell_names.setValue('');

        this.campaignDate = false;
        this.campaignStartDate = '';
        this.campaignEndDate = '';

        this.campaignSummaryImpressionsData = {
          value: 0,
          chart: []
        };

        this.campaignSummarySpendData = {
          value: 0,
          chart: []
        };

        this.campaignSummaryCpmData = {
          value: 0,
          chart: []
        };

        this.campaignSummaryImpressionDataByTargeting = {
          chart: []
        };

        this.campaignSummarySpendDataByTargeting = {
          chart: []
        };

        this.campaignSummaryCPMDataByTargeting = {
          chart: []
        };

        this.campaignSummaryComScoreBrandLiftData = {
          chart: [],
          flag: false
        };

        this.campaignSummaryFacebookBrandLiftData = {
          chart: [],
          flag: false
        };

        this.campaignSummaryYouTubeBrandLiftData = {
          chart: [],
          flag: false
        };

        this.campaignSummaryCreativeScoreData = {
          value: 0,
          channels: 0,
          creatives: 0,
          chart: []
        };

        this.campaignSummarySocialSentimentData = {
          shareOfVoice: 0,
          chart: [],
          chartIds: []
        };

        this.campaignSummaryProductODCLiftData = {
          chart: [],
          chartIds: [],
          roas: 0
        };

        this.campaignSummaryBrandODCLiftData = {
          chart: [],
          chartIds: [],
          roas: 0
        };

        this.startDateSL = '';
        this.endDateSL = '';
      }
    }

    // if(selected.source.id == 'mat-select-campaign-summary-goal') {
    //   this.carousel.selectSlide(0);

    //   if(this.campaign_summary_goals.value != undefined) {
    //     this.storageService.addToStorage('mat-select-campaign-summary-goal', selected.value);
    //     this.storageService.removeFromStorage('mat-select-campaign-summary-channel');
    //     this.campaign_summary_channels.enable();
    //     this.campaign_summary_channels.setValue('');

    //     this.cellNameList = [];
    //     this.cellNameListForSearch = [];
    //     this.campaign_summary_creative_names.setValue('');
    //     this.campaign_summary_study_names.setValue('');
    //     this.campaign_summary_cell_names.setValue('');

    //     this.goalSelectedChannels = '';

    //     this.getChannelsByGoal(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', selected.value).then(() => {
    //       if(this.campaign_summary_campaigns.value && this.goalSelectedChannels=='') {
    //         this.getImpressionsReachSpendCPM(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', '', false);
    //         this.getBrandAndSalesLift(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', '', false);
    //         this.getCreativeScore(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.campaign_summary_channels.value?this.campaign_summary_channels.value:'', false);
    //       } else if(this.campaign_summary_campaigns.value && this.goalSelectedChannels) {
    //         this.getImpressionsReachSpendCPM(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.goalSelectedChannels, true);
    //         this.getBrandAndSalesLift(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.goalSelectedChannels, true);
    //         this.getCreativeScore(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.campaign_summary_channels.value?this.campaign_summary_channels.value:'', false);
    //       } else {
    //         this.campaignSummaryComScoreBrandLiftData = {
    //           chart: [],
    //           flag: false
    //         };

    //         this.campaignSummaryFacebookBrandLiftData = {
    //           chart: [],
    //           flag: false
    //         };

    //         this.campaignSummaryYouTubeBrandLiftData = {
    //           chart: [],
    //           flag: false
    //         };

    //         this.campaignSummaryProductODCLiftData = {
    //           chart: [],
    //           chartIds: [],
    //           roas: 0
    //         };

    //         this.campaignSummaryBrandODCLiftData = {
    //           chart: [],
    //           chartIds: [],
    //           roas: 0
    //         };

    //         this.campaignSummaryCreativeScoreData = {
    //           value: 0,
    //           channels: 0,
    //           creatives: 0,
    //           chart: []
    //         };
    //       }
    //     });
    //   } else {
    //     this.storageService.removeFromStorage('mat-select-campaign-summary-goal');
    //     this.storageService.removeFromStorage('mat-select-campaign-summary-channel');

    //     this.campaign_summary_channels.disable();

    //     this.campaign_summary_channels.setValue('');

    //     // Reset data
    //     this.creativeNameListForSearch = [];
    //     this.creativeNameList = [];
    //     this.studyNameListForSearch = [];
    //     this.studyNameList = [];
    //     this.cellNameListForSearch = [];
    //     this.cellNameList = [];

    //     this.campaign_summary_creative_names.setValue('');
    //     this.campaign_summary_study_names.setValue('');
    //     this.campaign_summary_cell_names.setValue('');

    //     this.campaignDate = false;
    //     this.campaignStartDate = '';
    //     this.campaignEndDate = '';

    //     this.goalSelectedChannels = '';

    //     this.campaignSummaryImpressionsData = {
    //       value: 0,
    //       chart: [],
    //       goal: 0
    //     };

    //     this.campaignSummarySpendData = {
    //       value: 0,
    //       chart: [],
    //       goal: 0
    //     };

    //     this.campaignSummaryCpmData = {
    //       value: 0,
    //       chart: [],
    //       goal: 0
    //     };

    //     this.campaignSummaryComScoreBrandLiftData = {
    //       chart: [],
    //       flag: false
    //     };

    //     this.campaignSummaryFacebookBrandLiftData = {
    //       chart: [],
    //       flag: false
    //     };

    //     this.campaignSummaryYouTubeBrandLiftData = {
    //       chart: [],
    //       flag: false
    //     };

    //     this.campaignSummaryCreativeScoreData = {
    //       value: 0,
    //       channels: 0,
    //       creatives: 0,
    //       chart: []
    //     };

    //     this.campaignSummarySocialSentimentData = {
    //       shareOfVoice: 0,
    //       chart: [],
    //       chartIds: []
    //     };

    //     this.campaignSummaryProductODCLiftData = {
    //       chart: [],
    //       chartIds: [],
    //       roas: 0
    //     };

    //     this.campaignSummaryBrandODCLiftData = {
    //       chart: [],
    //       chartIds: [],
    //       roas: 0
    //     };

    //     this.startDateSL = '';
    //     this.endDateSL = '';
    //   }
    // }

    if(selected.source.id == 'mat-select-campaign-summary-channel') {
      this.carousel.selectSlide(0);
      // this.impressionCarousel.selectSlide(0);
      // this.spendCarousel.selectSlide(0);
      // this.cpmCarousel.selectSlide(0);

      if(this.campaign_summary_channels.value != undefined) {
        this.storageService.addToStorage('mat-select-campaign-summary-channel', selected.value);

        this.cellNameList = [];
        this.cellNameListForSearch = [];
        this.campaign_summary_creative_names.setValue('');
        this.campaign_summary_study_names.setValue('');
        this.campaign_summary_cell_names.setValue('');

        if(this.campaign_summary_campaigns.value && selected.value) {
          this.getImpressionsReachSpendCPM(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', selected.value, false);
          this.getImpressionsReachSpendCPMByTargeting(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', selected.value, false);
          this.getBrandAndSalesLift(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', selected.value, false);
          this.getCreativeScore(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', selected.value, false);
        }
      } else {
        this.storageService.removeFromStorage('mat-select-campaign-summary-channel');

        if(this.campaign_summary_campaigns.value && this.goalSelectedChannels=='') {
          this.getImpressionsReachSpendCPM(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', '', false);
          this.getImpressionsReachSpendCPMByTargeting(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', '', false);
          this.getBrandAndSalesLift(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', '', false);
          this.getCreativeScore(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.campaign_summary_channels.value?this.campaign_summary_channels.value:'', false);
        } else if(this.campaign_summary_campaigns.value && this.goalSelectedChannels) {
          this.getImpressionsReachSpendCPM(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.goalSelectedChannels, true);
          this.getImpressionsReachSpendCPMByTargeting(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.goalSelectedChannels, true);
          this.getBrandAndSalesLift(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.goalSelectedChannels, true);
          this.getCreativeScore(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.campaign_summary_channels.value?this.campaign_summary_channels.value:'', false);
        }
      }
    }

    if(selected.source.id == 'mat-select-campaign-summary-creative-name') {
      this.getBrandLiftComscore(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.campaign_summary_channels.value?this.campaign_summary_channels.value:'', selected.value, false);
    }

    if(selected.source.id == 'mat-select-campaign-summary-study-name') {
      this.campaignSummaryFacebookBrandLiftData.chart = [];
      this.cellNameListForSearch = [];
      this.cellNameList = [];
      this.campaign_summary_cell_names.enable();
      this.getCellNames(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', selected.value);
    }

    if(selected.source.id == 'mat-select-campaign-summary-cell-name') {
      this.campaignSummaryFacebookBrandLiftData.chart = [];
      this.getBrandLiftFacebook(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.campaign_summary_channels.value?this.campaign_summary_channels.value:'', this.campaign_summary_study_names.value?this.campaign_summary_study_names.value:'', selected.value, false);
    }
  }

  clearCampaignSummaryStorage() {
    this.carousel.selectSlide(0);
    this.impressionCarousel.selectSlide(0);
    this.spendCarousel.selectSlide(0);
    this.cpmCarousel.selectSlide(0);

    this.campaign_summary_goals.disable();
    this.campaign_summary_channels.disable();
    this.campaign_summary_cell_names.disable();

    if(this.campaign_summary_campaigns.value || this.campaign_summary_goals.value || this.campaign_summary_channels.value || this.campaign_summary_campaigns.value == undefined || this.campaign_summary_goals.value == undefined || this.campaign_summary_channels.value == undefined) {
      this.creativeNameListForSearch = [];
      this.creativeNameList = [];
      this.studyNameListForSearch = [];
      this.studyNameList = [];
      this.cellNameListForSearch = [];
      this.cellNameList = [];

      // this.getChannels();

      this.campaign_summary_campaigns.setValue('');
      this.campaign_summary_goals.setValue('');
      this.campaign_summary_channels.setValue('');

      this.cellNameList = [];
      this.campaign_summary_creative_names.setValue('');
      this.campaign_summary_study_names.setValue('');
      this.campaign_summary_cell_names.setValue('');

      this.storageService.removeFromStorage('mat-select-campaign-summary-campaign');
      this.storageService.removeFromStorage('mat-select-campaign-summary-goal');
      this.storageService.removeFromStorage('mat-select-campaign-summary-channel');

      // Reset data
      this.campaignDate = false;
      this.campaignStartDate = '';
      this.campaignEndDate = '';

      this.goalSelectedChannels = '';

      this.campaignSummaryImpressionsData = {
        value: 0,
        chart: []
      };

      this.campaignSummarySpendData = {
        value: 0,
        chart: []
      };

      this.campaignSummaryCpmData = {
        value: 0,
        chart: []
      };

      this.campaignSummaryImpressionDataByTargeting = {
        chart: []
      };

      this.campaignSummarySpendDataByTargeting = {
        chart: []
      };

      this.campaignSummaryCPMDataByTargeting = {
        chart: []
      };

      this.campaignSummaryComScoreBrandLiftData = {
        chart: [],
        flag: false
      };

      this.campaignSummaryFacebookBrandLiftData = {
        chart: [],
        flag: false
      };

      this.campaignSummaryYouTubeBrandLiftData = {
        chart: [],
        flag: false
      };

      this.campaignSummaryCreativeScoreData = {
        value: 0,
        channels: 0,
        creatives: 0,
        chart: []
      };

      this.campaignSummarySocialSentimentData = {
        shareOfVoice: 0,
        chart: [],
        chartIds: []
      };

      this.campaignSummaryProductODCLiftData = {
        chart: [],
        chartIds: [],
        roas: 0
      };

      this.campaignSummaryBrandODCLiftData = {
        chart: [],
        chartIds: [],
        roas: 0
      };

      this.startDateSL = '';
      this.endDateSL = '';
    } else {
      this.snackBar.open(`Filters are clear`, 'X', {
        horizontalPosition: spinner.horizontalPosition,
        verticalPosition: spinner.verticalPosition,
        duration: spinner.duration
      });
    }
  }

  clearComscoreFilter() {
    if(this.campaign_summary_creative_names.value) {
      this.campaign_summary_creative_names.setValue('');
      if(this.campaign_summary_goals.value && !this.campaign_summary_channels.value) {
        this.goalSelectedChannels = '';
        this.getChannelsByGoal(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.campaign_summary_goals.value).then(() => {
          if(this.goalSelectedChannels)
            this.getBrandAndSalesLift(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.goalSelectedChannels, true);
        });
      } else {
        this.getBrandAndSalesLift(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.campaign_summary_channels.value?this.campaign_summary_channels.value:'', false);
      }
    } else {
      this.snackBar.open(`Filters are clear`, 'X', {
        horizontalPosition: spinner.horizontalPosition,
        verticalPosition: spinner.verticalPosition,
        duration: spinner.duration
      });
    }
  }

  clearFacebookFilter() {
    this.cellNameList = [];
    this.cellNameListForSearch = [];
    this.campaign_summary_cell_names.disable();

    if(this.campaign_summary_study_names.value || this.campaign_summary_cell_names.value) {
      this.campaign_summary_study_names.setValue('');
      this.campaign_summary_cell_names.setValue('');
      if(this.campaign_summary_goals.value && !this.campaign_summary_channels.value) {
        this.goalSelectedChannels = '';
        this.getChannelsByGoal(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.campaign_summary_goals.value).then(() => {
          if(this.goalSelectedChannels)
            this.getBrandAndSalesLift(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.goalSelectedChannels, true);
        });
      } else {
        this.getBrandAndSalesLift(this.campaign_summary_campaigns.value?this.campaign_summary_campaigns.value:'', this.campaign_summary_channels.value?this.campaign_summary_channels.value:'', false);
      }
    } else {
      this.snackBar.open(`Filters are clear`, 'X', {
        horizontalPosition: spinner.horizontalPosition,
        verticalPosition: spinner.verticalPosition,
        duration: spinner.duration
      });
    }
  }

  getCampaigns() {
    this.appService.getCampaigns(this.brand).subscribe((response) => {
      if(response.status == 200) {
        response.results.forEach((campaign: any) => {
          // console.log(campaign);
          let campaignArray = {
            value: campaign.MktCampaign,
            text: campaign.MktCampaign
          }

          this.campaignList.push(campaignArray);
          this.campaignListForSearch.push(campaignArray);
        });

        this.campaignList.sort((a, b) => a.value.localeCompare(b.value));
        this.campaignListForSearch.sort((a, b) => a.value.localeCompare(b.value));
      }
    },
    (error) => {
      this.snackBar.open(`API error: ${error}`, 'X', {
        horizontalPosition: spinner.horizontalPosition,
        verticalPosition: spinner.verticalPosition,
        duration: spinner.duration
      });
    });
  }

  getChannels() {
    this.channelList = [];
    this.channelListForSearch = [];

    this.appService.getChannels(this.brand).subscribe((response) => {
      if(response.status == 200) {
        response.results.forEach((channel: any) => {
          // console.log(channel);
          let channelArray = {
            value: channel.Channel,
            text: channel.Channel
          }

          if(this.channelList.find(channel => channel.value == channelArray.value) == null)
            this.channelList.push(channelArray);
          if(this.channelListForSearch.find(channel => channel.value == channelArray.value) == null)
            this.channelListForSearch.push(channelArray);
        });

        this.channelList.sort((a, b) => a.value.localeCompare(b.value));
        this.channelListForSearch.sort((a, b) => a.value.localeCompare(b.value));
      }
    },
    (error) => {
      this.snackBar.open(`API error: ${error}`, 'X', {
        horizontalPosition: spinner.horizontalPosition,
        verticalPosition: spinner.verticalPosition,
        duration: spinner.duration
      });
    });
  }

  getCampaignStartEndDates(campaign: string) {
    this.appService.getCampaignStartEndDates(this.brand, campaign).subscribe((response) => {
      if(response.status == 200) {
        this.campaignDate = true;
        this.campaignStartDate = '';
        this.campaignEndDate = '';

        if(response.results[0].startDate) {
          this.campaignStartDate = response.results[0].startDate
        }

        if(response.results[0].endDate) {
          this.campaignEndDate = response.results[0].endDate
        }
      }
    },
    (error) => {
      this.snackBar.open(`API error: ${error}`, 'X', {
        horizontalPosition: spinner.horizontalPosition,
        verticalPosition: spinner.verticalPosition,
        duration: spinner.duration
      });
    });
  }

  getCreativeNames(campaign: string) {
    this.creativeNameList = [];
    this.creativeNameListForSearch = [];

    this.appService.getCreativeNames(this.brand, campaign).subscribe((response) => {
      if(response.status == 200) {
        response.results.forEach((creative: any) => {
          let creativeArray = {
            value: creative.creativeName,
            text: creative.creativeName
          }

          this.creativeNameList.push(creativeArray);
          this.creativeNameListForSearch.push(creativeArray);
        });

        this.creativeNameList.sort((a, b) => a.value.localeCompare(b.value));
        this.creativeNameListForSearch.sort((a, b) => a.value.localeCompare(b.value));
      }
    },
    (error) => {
      this.snackBar.open(`API error: ${error}`, 'X', {
        horizontalPosition: spinner.horizontalPosition,
        verticalPosition: spinner.verticalPosition,
        duration: spinner.duration
      });
    });
  }

  getStudyNames(campaign: string) {
    this.studyNameList = [];
    this.studyNameListForSearch = [];

    this.appService.getStudyNames(this.brand, campaign).subscribe((response) => {
      if(response.status == 200) {
        response.results.forEach((name: any) => {
          let nameArray = {
            value: name.StudyName,
            text: name.StudyName
          }

          this.studyNameList.push(nameArray);
          this.studyNameListForSearch.push(nameArray);
        });

        this.studyNameList.sort((a, b) => a.value.localeCompare(b.value));
        this.studyNameListForSearch.sort((a, b) => a.value.localeCompare(b.value));
      }
    },
    (error) => {
      this.snackBar.open(`API error: ${error}`, 'X', {
        horizontalPosition: spinner.horizontalPosition,
        verticalPosition: spinner.verticalPosition,
        duration: spinner.duration
      });
    });
  }

  getCellNames(campaign: string, studyName: string) {
    this.cellNameList = [];
    this.cellNameListForSearch = [];

    this.appService.getCellNames(this.brand, campaign, studyName).subscribe((response) => {
      if(response.status == 200) {
        response.results.forEach((name: any) => {
          let nameArray = {
            value: name.CellName,
            text: name.CellName
          }

          this.cellNameList.push(nameArray);
          this.cellNameListForSearch.push(nameArray);
        });

        this.cellNameList.sort((a, b) => a.value.localeCompare(b.value));
        this.cellNameListForSearch.sort((a, b) => a.value.localeCompare(b.value));
      }
    },
    (error) => {
      this.snackBar.open(`API error: ${error}`, 'X', {
        horizontalPosition: spinner.horizontalPosition,
        verticalPosition: spinner.verticalPosition,
        duration: spinner.duration
      });
    });
  }

  getChannelsByCampaign(campaign: string) {
    var promise = new Promise<void>((resolve, reject) => {
      this.channelList = [];
      this.channelListForSearch = [];

      this.appService.getChannelsByCampaign(this.brand, campaign).subscribe((response) => {
          if(response.status == 200) {
            response.results.forEach((channel: any) => {
              // console.log(channel);
              let channelArray = {
                value: channel.Channel,
                text: channel.Channel
              }

              if(this.channelList.find(channel => channel.value == channelArray.value) == null)
                this.channelList.push(channelArray);
              if(this.channelListForSearch.find(channel => channel.value == channelArray.value) == null)
                this.channelListForSearch.push(channelArray);
            });

            this.channelList.sort((a, b) => a.value.localeCompare(b.value));
            this.channelListForSearch.sort((a, b) => a.value.localeCompare(b.value));
          }
          resolve();
        },
        (error) => {
          this.snackBar.open(`API error: ${error}`, 'X', {
            horizontalPosition: spinner.horizontalPosition,
            verticalPosition: spinner.verticalPosition,
            duration: spinner.duration
          });
          reject();
        });
    });

    return promise;
  }

  getChannelsByGoal(campaign: string, goal: string) {
    var promise = new Promise<void>((resolve, reject) => {
    this.appService.getChannelsByGoal(this.brand, campaign, goal).subscribe((response) => {
        if(response.status == 200) {
          let goalChannels: any[] = [];
          response.results.forEach((channel: any) => {
            goalChannels.push(channel.Channel);
            // console.log(channel);
            let channelArray = {
              value: channel.Channel,
              text: channel.Channel
            }
            if(this.channelList.find(channel => channel.value == channelArray.value) == null)
              this.channelList.push(channelArray);
            if(this.channelListForSearch.find(channel => channel.value == channelArray.value) == null)
              this.channelListForSearch.push(channelArray);
          });

          this.channelList.sort((a, b) => a.value.localeCompare(b.value));
          this.channelListForSearch.sort((a, b) => a.value.localeCompare(b.value));
          // this.goalSelectedChannels = goalChannels.join(",");
          this.goalSelectedChannels = goalChannels.map(function (a) { return "'" + a.replace("'", "''") + "'"; }).join();
        }
        resolve();
      },
      (error) => {
        this.snackBar.open(`API error: ${error}`, 'X', {
          horizontalPosition: spinner.horizontalPosition,
          verticalPosition: spinner.verticalPosition,
          duration: spinner.duration
        });
        reject();
      });
    });

    return promise;
  }

  getImpressionsReachSpendCPM(campaign: string, channel: string, flag: boolean) {
    if(!flag)
      channel = "'" + channel + "'";
    this.appService.getImpressionsReachSpendCPM(this.brand, campaign, channel).subscribe((response) => {

      // Reset data
      this.campaignSummaryImpressionsData = {
        value: 0,
        chart: []
      };

      this.campaignSummarySpendData = {
        value: 0,
        chart: []
      };

      this.campaignSummaryCpmData = {
        value: 0,
        chart: []
      };

      if(response.status == 200) {
        let impressions: any[] = [];
        let spends:any[] = [];

        // console.log(response.results)
        if(response.results[0].length) {
          let total = 0;

          response.results[0].forEach((impression: any) => {
            // console.log(impression);
            let impressionArray: ImpressionChart;

            if(impression.Imp) {
              impressionArray = {
                week: `${impression.Date}`,
                impression: impression.Imp
              }
              total += impression.Imp;
            } else {
              impressionArray = {
                week: `${impression.Date}`,
                impression: 0
              }
            }

            this.campaignSummaryImpressionsData.chart.push(impressionArray);
            impressions.push(impressionArray);
          });

          this.campaignSummaryImpressionsData.value = total;
        }

        if(response.results[1].length) {
          let total = 0;

          response.results[1].forEach((spend: any) => {
            // console.log(spend);
            let spendArray: SpendChart;

            if(spend.Spend) {
              spendArray = {
                week: `${spend.Date}`,
                spend: spend.Spend
              }
              total += spend.Spend;
            } else {
              spendArray ={
                week: `${spend.Date}`,
                spend: 0
              }
            }

            this.campaignSummarySpendData.chart.push(spendArray);
            spends.push(spendArray);
          });

          this.campaignSummarySpendData.value = total;
        }

        // console.log(impressions);
        // console.log(spends);

        if(impressions.length && spends.length) {
          let cpmArray: CpmChart;
          let total:any[] = []

          impressions.forEach((impression: any) => {
            spends.forEach((spend: any) => {
              if(impression.week == spend.week) {
                cpmArray ={
                  week: `${spend.week}`,
                  cpm: cpmCalc(spend.spend, impression.impression)
                }
                total.push(cpmCalc(spend.spend, impression.impression));
                this.campaignSummaryCpmData.chart.push(cpmArray);
              }
            });
          });

          if(this.campaignSummarySpendData.value && this.campaignSummaryImpressionsData.value)
            this.campaignSummaryCpmData.value = cpmCalc(this.campaignSummarySpendData.value, this.campaignSummaryImpressionsData.value);

        }
      }
    },
    (error) => {
      this.snackBar.open(`API error: ${error}`, 'X', {
        horizontalPosition: spinner.horizontalPosition,
        verticalPosition: spinner.verticalPosition,
        duration: spinner.duration
      });
    });
  }

  getImpressionsReachSpendCPMByTargeting(campaign: string, channel: string, flag: boolean) {
    if(!flag)
      channel = "'" + channel + "'";
    this.appService.getImpressionsReachSpendCPMByTargeting(this.brand, campaign, channel).subscribe((response) => {

      // reset data
      this.campaignSummaryImpressionDataByTargeting = {
        chart: []
      };

      this.campaignSummarySpendDataByTargeting = {
        chart: []
      };

      this.campaignSummaryCPMDataByTargeting = {
        chart: []
      };

      if(response.status == 200) {
        let impressionsTargeting: any[] = [];
        let spendsTargeting:any[] = [];
        let cpmTargeting:any[] = [];

        if(response.results[0].length) {
          response.results[0].forEach((impression: any) => {
            let impressionArray: any;

            if(impression.Imp) {
              impressionArray = {
                targeting: impression.Targeting,
                impression: impression.Imp
              }
            } else {
              impressionArray = {
                targeting: impression.Targeting,
                impression: 0
              }
            }

            impressionsTargeting.push(impressionArray);
            this.campaignSummaryImpressionDataByTargeting.chart.push(impressionArray);
          });

          this.campaignSummaryImpressionDataByTargeting.chart.sort((a:any, b:any) => {
            return a.impression - b.impression;
          })
        }

        if(response.results[1].length) {
          response.results[1].forEach((spend: any) => {
            let spendArray: any;

            if(spend.Spend) {
              spendArray = {
                targeting: spend.Targeting,
                spend: spend.Spend
              }
            } else {
              spendArray ={
                targeting: spend.Targeting,
                spend: 0
              }
            }

            spendsTargeting.push(spendArray);
            this.campaignSummarySpendDataByTargeting.chart.push(spendArray);
          });

          this.campaignSummarySpendDataByTargeting.chart.sort((a:any, b:any) => {
            return a.spend - b.spend;
          })
        }

        if(impressionsTargeting.length && spendsTargeting.length) {
          let cpmArray: any;

          impressionsTargeting.forEach((impression: any, index: number) => {
            spendsTargeting.forEach((spend: any) => {
              if(impression.targeting == spend.targeting) {
                // if(index < 10) {
                  cpmArray = {
                    targeting: spend.targeting,
                    cpm: cpmCalc(spend.spend, impression.impression).toFixed(2)
                  }
                  // cpmTargeting.push(cpmArray);
                // }
                this.campaignSummaryCPMDataByTargeting.chart.push(cpmArray);
              }
            });
          });

          this.campaignSummaryCPMDataByTargeting.chart.sort((a:any, b:any) => {
            return a.cpm - b.cpm;
          })
        }
      }
    },
    (error) => {
      this.snackBar.open(`API error: ${error}`, 'X', {
        horizontalPosition: spinner.horizontalPosition,
        verticalPosition: spinner.verticalPosition,
        duration: spinner.duration
      });
    });
  }

  getBrandAndSalesLift(campaign: string, channel: string, flag: boolean) {
    if(!flag)
      channel = "'" + channel + "'";
    this.appService.getBrandAndSalesLift(this.brand, campaign, channel).subscribe((response) => {

      // Reset data
      this.campaignSummaryComScoreBrandLiftData = {
        chart: [],
        flag: false
      };

      this.campaignSummaryFacebookBrandLiftData = {
        chart: [],
        flag: false
      };

      this.campaignSummaryYouTubeBrandLiftData = {
        chart: [],
        flag: false
      };

      this.campaignSummaryProductODCLiftData = {
        chart: [],
        chartIds: [],
        roas: 0
      };

      this.campaignSummaryBrandODCLiftData = {
        chart: [],
        chartIds: [],
        roas: 0
      };

      // console.log(response);
      if(response.status == 200) {
        let comScoreCount = 0;
        let facebookCount = 0;

        if(response.results[0].length) {

          response.results[0].forEach((brandLift: any) => {
            if(brandLift.Comscore_BL!=null && brandLift.Comscore_BL!=0) {
                comScoreCount++;
              }
            });
            if(comScoreCount)
              this.campaignSummaryComScoreBrandLiftData.flag = true;
        }

        if(response.results[3].length) {

          response.results[3].forEach((brandLift: any) => {
            if(brandLift.FB_BL!=null && brandLift.FB_BL!=0) {
              facebookCount++;
            }
          });
          if(facebookCount)
            this.campaignSummaryFacebookBrandLiftData.flag = true;
        }

        if(response.results[3].length) {
          response.results[4].forEach((brandLift: any) => {
            let youTubeArray: YouTubeChart;

            if(brandLift.YT_BL!=null && brandLift.YT_BL!=0 && brandLift.QuestionType!='') {
              youTubeArray = {
                type: brandLift.QuestionType.replaceAll('_', ' '),
                youTubeBL: brandLift.YT_BL,
                color: brandLift.isSignificant=='True'?'#0079bc':'#b7e4fd'
              }
              this.campaignSummaryYouTubeBrandLiftData.chart.push(youTubeArray);
            }
          });
          if(this.campaignSummaryYouTubeBrandLiftData.chart.length)
            this.campaignSummaryYouTubeBrandLiftData.flag = true;
        }


        if(response.results[1].length) {

          response.results[1].forEach((brandLift: any) => {
            if(brandLift.Channel != null) {
              let trademarkArray: any[] = [];

              if(brandLift.Brand_ODC_SL!=null && brandLift.Brand_ODC_SL!=0) {
                trademarkArray = [{
                  type: brandLift.Channel,
                  brandODCSL: (brandLift.Brand_ODC_SL).toFixed(4),
                  date: {
                    startDateSL: brandLift.StartDateSL?brandLift.StartDateSL:'',
                    endDateSL: brandLift.EndDateSL?brandLift.EndDateSL:''
                  },
                  color: brandLift.isSignificant=='True'?'#0079bc':'#b7e4fd'
                }];

                this.campaignSummaryBrandODCLiftData.chart.push(trademarkArray);

                let random: number;
                do {
                  random = this.randomNumber();
                } while(this.campaignSummaryBrandODCLiftData.chartIds.includes(random));
                this.campaignSummaryBrandODCLiftData.chartIds.push(random);
              }
            }
          });
        }

        if(response.results[2].length) {
          response.results[2].forEach((brandLift: any) => {
            if(brandLift.Channel != null) {
              let productArray: any[] = [];

              if(brandLift.Prod_ODC_SL!=null && brandLift.Prod_ODC_SL!=0) {
                productArray = [{
                  type: brandLift.Channel,
                  productODCSL: (brandLift.Prod_ODC_SL).toFixed(4),
                  date: {
                    startDateSL: brandLift.StartDateSL?brandLift.StartDateSL:'',
                    endDateSL: brandLift.EndDateSL?brandLift.EndDateSL:''
                  },
                  color: brandLift.isSignificant=='True'?'#0079bc':'#b7e4fd'
                }];

                this.campaignSummaryProductODCLiftData.chart.push(productArray);

                let random: number;
                do {
                  random = this.randomNumber();
                } while(this.campaignSummaryProductODCLiftData.chartIds.includes(random));
                this.campaignSummaryProductODCLiftData.chartIds.push(random);
              }
            }
          });

          // console.log(this.campaignSummaryProductODCLiftData.chart);
        }

        if(response.results[5].length || response.results[6].length) {
          response.results[5].forEach((roas: any) => {
            this.campaignSummaryBrandODCLiftData.roas = roas.SL_ROAS.toFixed(3);
          });

          response.results[6].forEach((roas: any) => {
            this.campaignSummaryProductODCLiftData.roas = roas.SL_ROAS.toFixed(3);
          });
        }
      }
    },
    (error) => {
      this.snackBar.open(`API error: ${error}`, 'X', {
        horizontalPosition: spinner.horizontalPosition,
        verticalPosition: spinner.verticalPosition,
        duration: spinner.duration
      });
    });
  }

  getBrandLiftComscore(campaign: string, channel: string, dtrCreative: string, flag: boolean) {
    if(!flag)
      channel = "'" + channel + "'";
    this.appService.getBrandLiftComscore(this.brand, campaign, channel, dtrCreative).subscribe((response) => {

      // Reset data
      this.campaignSummaryComScoreBrandLiftData = {
        chart: [],
        flag: false
      };

      // console.log(response);
      if(response.status == 200) {
        if(response.results.length) {

          response.results.forEach((brandLift: any) => {
            let comScoreArray: ComScoreChart;

            if(brandLift.Comscore_BL!=null&&brandLift.QuestionType!='') {
              comScoreArray = {
                type: brandLift.QuestionType.replaceAll('_', ' '),
                comScoreBL: brandLift.Comscore_BL,
                color: brandLift.isSignificant=='True'?'#0079bc':'#b7e4fd'
              }
              this.campaignSummaryComScoreBrandLiftData.chart.push(comScoreArray);
            }
          });

          if(this.campaignSummaryComScoreBrandLiftData.chart.length)
            this.campaignSummaryComScoreBrandLiftData.flag = true;
        }
      }
    },
    (error) => {
      this.snackBar.open(`API error: ${error}`, 'X', {
        horizontalPosition: spinner.horizontalPosition,
        verticalPosition: spinner.verticalPosition,
        duration: spinner.duration
      });
    });
  }

  getBrandLiftFacebook(campaign: string, channel: string, studyName: string, cellName: string, flag: boolean) {
    if(!flag)
      channel = "'" + channel + "'";
    this.appService.getBrandLiftFacebook(this.brand, campaign, channel, studyName, cellName).subscribe((response) => {

      // Reset data
      this.campaignSummaryFacebookBrandLiftData = {
        chart: [],
        flag: false
      };

      // console.log(response);
      if(response.status == 200) {
        if(response.results.length) {

          response.results.forEach((brandLift: any) => {
            let facebookArray: FacebookChart;

            if(brandLift.FB_BL!=null&&brandLift.QuestionType!='') {
              facebookArray = {
                type: brandLift.QuestionType.replaceAll('_', ' '),
                facebookBL: brandLift.FB_BL,
                color: brandLift.isSignificant=='True'?'#0079bc':'#b7e4fd'
              }

              this.campaignSummaryFacebookBrandLiftData.chart.push(facebookArray);
            }
          });

          if(this.campaignSummaryFacebookBrandLiftData.chart.length)
            this.campaignSummaryFacebookBrandLiftData.flag = true;
        }
      }
    },
    (error) => {
      this.snackBar.open(`API error: ${error}`, 'X', {
        horizontalPosition: spinner.horizontalPosition,
        verticalPosition: spinner.verticalPosition,
        duration: spinner.duration
      });
    });
  }

  getCreativeScore(campaign: string, channel: string, flag: boolean) {
    if(!flag)
      channel = "'" + channel + "'";
    this.appService.getCreativeScore(this.brand, campaign, channel).subscribe((response) => {

      // Reset data
      this.campaignSummaryCreativeScoreData = {
        value: 0,
        channels: 0,
        creatives: 0,
        chart: []
      };

      if(response.status == 200) {
        if(response.results.length) {
          this.campaignSummaryCreativeScoreData.value = response.results[0].creativeScore?(response.results[0].creativeScore*100):0;
          this.campaignSummaryCreativeScoreData.channels = response.results[0].channels?response.results[0].channels:0;
          this.campaignSummaryCreativeScoreData.creatives = response.results[0].creatives?response.results[0].creatives:0;
          this.campaignSummaryCreativeScoreData.chart = [{
            category: "",
            value: response.results[0].creativeScore?(response.results[0].creativeScore*100):0,
            full:100
          }]
        }
      }
    },
    (error) => {
      this.snackBar.open(`API error: ${error}`, 'X', {
        horizontalPosition: spinner.horizontalPosition,
        verticalPosition: spinner.verticalPosition,
        duration: spinner.duration
      });
    });
  }

  getSocialSentiment() {
    this.appService.getSocialSentiment(this.brand).subscribe((response) => {

      if(response.status == 200) {
        this.campaignSummarySocialSentimentData.chart = [];

        if(response.results.length) {
            this.campaignSummarySocialSentimentData.chart.push({
              type: 'Negative',
              value: response.results[0].NegativePerc
            }, {
              type: 'Neutral',
              value: response.results[0].NeutralPerc
            }, {
              type: 'Positive',
              value: response.results[0].PositivePerc
            });

            this.campaignSummarySocialSentimentData.shareOfVoice = response.results[0].ShareOfVoicePerc;
        }

        let random: number;
        do {
          random = this.randomNumber();
        } while(this.campaignSummarySocialSentimentData.chartIds.includes(random));
        this.campaignSummarySocialSentimentData.chartIds.push(random);

        // console.log(this.campaignSummarySocialSentimentData)
      }
    },
    (error) => {
      this.snackBar.open(`API error: ${error}`, 'X', {
        horizontalPosition: spinner.horizontalPosition,
        verticalPosition: spinner.verticalPosition,
        duration: spinner.duration
      });
    });
  }
}
