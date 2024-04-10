import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectChange, MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { StorageService } from '../storage.service';
import { AppService } from '../app.service';

import { spinner } from '../spinner-config';

export interface Dropwdowns {
  value: string,
  text: string
}

const cpmCalc = (spend: number, impression: number) => { return (spend&&impression)?(spend/impression)*1000:0 }
@Component({
  selector: 'app-targeting-overview',
  templateUrl: './targeting-overview.component.html',
  styleUrls: ['./targeting-overview.component.css']
})
export class TargetingOverviewComponent implements OnInit {
  brand:any;

  campaignDate: boolean = false;
  campaignStartDate: string = '';
  campaignEndDate: string = '';

  chartIds: any[];

  targeting_breakdown_campaign: String | null = '';
  targeting_breakdown_goal: String | null = '';
  targeting_breakdown_channel: String | null = '';
  targeting_breakdown_targeting: String | null = '';
  targeting_breakdown_audience: String | null = '';

  targetingBreakdownCpmClasses = ['widget-260'];
  targetingBreakdownViewabilityClasses = ['widget-260'];
  targetingBreakdownSlClasses = ['widget-320'];
  targetingBreakdownBlClasses = ['widget-320'];

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
  channelListForSearch: any[] = [];
  channelList: any[] = [];

  targetingListForSearch: Dropwdowns[] = [];
  targetingList: Dropwdowns[] = [];

  audienceListForSearch: Dropwdowns[] = [];
  audienceList: Dropwdowns[] = [];

  targeting_breakdown_campaigns = new FormControl();
  targeting_breakdown_goals = new FormControl();
  targeting_breakdown_channels = new FormControl();
  targeting_breakdown_targetings = new FormControl();
  targeting_breakdown_audiences = new FormControl();

  targetingBreakdownCpmData = {
    chart: [] as any[],
    chartIds: [] as any[]
  };

  targetingBreakdownViewabilityData = {
    chart: [] as any[],
    chartIds: [] as any[],
    details: [] as any
  };

  targetingBreakdownSlData = {
    chart: [] as any[],
    roas: [{
      brandRoas: 0 as number,
      productRoas: 0 as number
    }]
  }

  targetingBreakdownBlData = {
    chart: [] as any[]
  }

  @ViewChild('campaign') matSelectCampaign: MatSelect;
  @ViewChild('goal') matSelectGoal: MatSelect;
  @ViewChild('channel') matSelectChannel: MatSelect;
  @ViewChild('targeting') matSelectTargeting: MatSelect;
  @ViewChild('audience') matSelectAudience: MatSelect;

  public isFilteredCampaigns(campaign: any) {
    return this.campaignList.find(item => item.value === campaign.value);
  }

  constructor(
    private storageService: StorageService,
    private appService: AppService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.chartIds = [];

    this.brand = this.route.snapshot.paramMap.get('brand');
    if(this.brand) {
      this.getTargetingOverviewCampaigns();
    }

    this.targeting_breakdown_goals.disable();
    this.targeting_breakdown_channels.disable();
    this.targeting_breakdown_targetings.disable();
    this.targeting_breakdown_audiences.disable();
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

    this.matSelectTargeting.openedChange.subscribe(opened => {
      if (opened) {
        this.matSelectTargeting.panel.nativeElement.addEventListener('mouseleave', () => {
          this.matSelectTargeting.close();
          this.targetingList = this.targetingListForSearch;
        })
      }
    });

    this.matSelectAudience.openedChange.subscribe(opened => {
      if (opened) {
        this.matSelectAudience.panel.nativeElement.addEventListener('mouseleave', () => {
          this.matSelectAudience.close();
          this.audienceList = this.audienceListForSearch;
        })
      }
    });
  }

  randomNumber() {
    return Math.floor(Math.random()*1000000);
  }

  ngOnInit(): void {
    this.targeting_breakdown_campaign = this.storageService.getFromStorage('mat-select-targeting-breakdown-campaign');
    // this.targeting_breakdown_goal = this.storageService.getFromStorage('mat-select-targeting-breakdown-goal');
    this.targeting_breakdown_channel = this.storageService.getFromStorage('mat-select-targeting-breakdown-channel');
    this.targeting_breakdown_targeting = this.storageService.getFromStorage('mat-select-targeting-breakdown-targeting');
    this.targeting_breakdown_audience = this.storageService.getFromStorage('mat-select-targeting-breakdown-audience');

    this.targeting_breakdown_campaigns.setValue(this.targeting_breakdown_campaign?.split(','));
    // this.targeting_breakdown_goals.setValue(this.targeting_breakdown_goal);
    this.targeting_breakdown_channels.setValue(this.targeting_breakdown_channel?.split(','));
    this.targeting_breakdown_targetings.setValue(this.targeting_breakdown_targeting);
    this.targeting_breakdown_audiences.setValue(this.targeting_breakdown_audience);

    // if(this.storageService.getFromStorage('mat-select-targeting-breakdown-campaign')) {
    //   // this.targeting_breakdown_goals.enable();
    //   this.targeting_breakdown_channels.enable();
    //   this.targeting_breakdown_targetings.enable();

    //   let campaign: any = this.targeting_breakdown_campaigns.value?this.targeting_breakdown_campaigns.value:'';
    //   let channel: any = this.targeting_breakdown_channels.value?this.targeting_breakdown_channels.value:'';
    //   let targeting: any = this.targeting_breakdown_targetings.value?this.targeting_breakdown_targetings.value:'';
    //   let audience: any = this.targeting_breakdown_audiences.value?this.targeting_breakdown_audiences.value:'';

    //   if(campaign) {
    //     this.getCampaignStartEndDates(campaign);

    //     this.getTargetingOverviewChannelsByCampaign(campaign).then(() => {});
    //     // this.getTargetingOverviewTargetingByCampaign(campaign, '');

    //     // if(targeting) {
    //     //   this.getTargetingOverviewAudienceByCampaign(campaign, '', targeting);
    //     // }

    //     if(campaign && channel) {
    //       this.getTargetingOverviewTargetingByCampaign(campaign, channel);

    //       if(targeting) {
    //         this.getTargetingOverviewAudienceByCampaign(campaign, channel, targeting);
    //       }

    //       this.getTargetingOverviewCPM(campaign, channel, targeting, audience);
    //       this.getTargetingOverviewViewability(campaign, channel, targeting, audience);
    //       // this.getTargetingOverviewSL(campaign, channel, targeting, audience, goal);
    //       // this.getTargetingOverviewBL(campaign, channel, targeting, audience, goal);
    //     } else {
    //       this.getTargetingOverviewCPM(campaign, '', targeting, audience);
    //       this.getTargetingOverviewViewability(campaign, '', targeting, audience);
    //     }
    //   }
    // } else {
    //   this.targeting_breakdown_channels.disable();
    //   this.targeting_breakdown_targetings.disable();
    //   this.targeting_breakdown_audiences.disable();
    // }

    // if(this.storageService.getFromStorage('mat-select-targeting-breakdown-goal')) {
    //   this.targeting_breakdown_channels.enable();
    //   this.targeting_breakdown_targetings.enable();
    //   this.targeting_breakdown_audiences.enable();

    //   let campaign: any = this.targeting_breakdown_campaigns.value;
    //   let goal: any = this.targeting_breakdown_goals.value;

    //   this.getTargetingOverviewChannelsByCampaign(campaign).then(() => {
    //     if(goal)
    //       this.getTargetingOverviewChannelsByGoal(campaign, goal).then(() => {
    //         let campaign: any = this.targeting_breakdown_campaigns.value?this.targeting_breakdown_campaigns.value:'';
    //         let goal: any = this.targeting_breakdown_goals.value?this.targeting_breakdown_goals.value:'';
    //         let channel: any = this.targeting_breakdown_channels.value?this.targeting_breakdown_channels.value:'';
    //         let targeting: any = this.targeting_breakdown_targetings.value?this.targeting_breakdown_targetings.value:'';
    //         let audience: any = this.targeting_breakdown_audiences.value?this.targeting_breakdown_audiences.value:'';

    //         if(campaign && goal && this.targeting_breakdown_channels.value == undefined) {
    //           this.getTargetingOverviewTargetingByCampaign(campaign, this.goalSelectedChannels);
    //           this.getTargetingOverviewAudienceByCampaign(campaign, this.goalSelectedChannels, targeting);

    //           this.getTargetingOverviewCPM(campaign, this.goalSelectedChannels, targeting, audience);
    //           this.getTargetingOverviewViewability(campaign, this.goalSelectedChannels, targeting, audience);
    //           // this.getTargetingOverviewSL(campaign, this.goalSelectedChannels, targeting, audience, goal);
    //           // this.getTargetingOverviewBL(campaign, this.goalSelectedChannels, targeting, audience, goal);
    //         }
    //       // },
    //       // (error) => {
    //       //   this.getTargetingOverviewChannelsByCampaign(campaign);
    //       });
    //   });
    // } else {
    //   this.targeting_breakdown_targetings.disable();
    //   this.targeting_breakdown_audiences.disable();
    // }

    // if(this.storageService.getFromStorage('mat-select-targeting-breakdown-campaign') || this.storageService.getFromStorage('mat-select-targeting-breakdown-goal')) {
    //   let campaign: any = this.targeting_breakdown_campaigns.value;
    //   let goal: any = this.targeting_breakdown_goals.value;

    //   if(campaign)
    //     this.getCampaignStartEndDates(campaign);
    //     this.getTargetingOverviewChannelsByCampaign(campaign).then(() => {
    //       if(goal)
    //         this.getTargetingOverviewChannelsByGoal(goal).then(() => {},
    //         (error) => {
    //           this.getTargetingOverviewChannelsByCampaign(campaign);
    //         });
    //     });

    //     if(!campaign && goal)
    //       this.getTargetingOverviewChannelsByGoal(goal);
    // } else {
    //   this.channelList = [];
    //   this.channelListForSearch = [];

    //   this.targetingListForSearch = [];
    //   this.targetingList = [];

    //   this.audienceListForSearch = [];
    //   this.audienceList = [];
    // }

    if(this.storageService.getFromStorage('mat-select-targeting-breakdown-campaign') || this.storageService.getFromStorage('mat-select-targeting-breakdown-channel') || this.storageService.getFromStorage('mat-select-targeting-breakdown-targeting') || this.storageService.getFromStorage('mat-select-targeting-breakdown-audience')) {
      let campaign: any = this.targeting_breakdown_campaigns.value?this.targeting_breakdown_campaigns.value:'';
      let goal: any = this.targeting_breakdown_goals.value?this.targeting_breakdown_goals.value:'';
      let channel: any = this.targeting_breakdown_channels.value?this.targeting_breakdown_channels.value:'';
      let targeting: any = this.targeting_breakdown_targetings.value?this.targeting_breakdown_targetings.value:'';
      let audience: any = this.targeting_breakdown_audiences.value?this.targeting_breakdown_audiences.value:'';

      // if(campaign && goal && !this.targeting_breakdown_channels.value.length) {
      //   this.getTargetingOverviewTargetingByCampaign(campaign, this.goalSelectedChannels);
      //   this.getTargetingOverviewAudienceByCampaign(campaign, this.goalSelectedChannels);

      //   this.getTargetingOverviewCPM(campaign, this.goalSelectedChannels, targeting, audience);
      //   this.getTargetingOverviewViewability(campaign, this.goalSelectedChannels, targeting, audience);
      //   // this.getTargetingOverviewSL(campaign, channel, targeting, audience, goal);
      //   // this.getTargetingOverviewBL(campaign, channel, targeting, audience, goal);
      // }

      if(campaign) {
        this.targeting_breakdown_channels.enable();
        this.targeting_breakdown_targetings.enable();

        this.getCampaignStartEndDates(campaign);
        this.getTargetingOverviewChannelsByCampaign(campaign).then(() => {});
        this.getTargetingOverviewTargetingByCampaign(campaign, channel);

        if(targeting) {
          this.targeting_breakdown_audiences.enable();

          this.getTargetingOverviewAudienceByCampaign(campaign, channel, targeting);
        }

        if(channel) {
          this.getTargetingOverviewCPM(campaign, channel, targeting, audience);
          this.getTargetingOverviewViewability(campaign, channel, targeting, audience);
          // this.getTargetingOverviewSL(campaign, channel, targeting, audience, goal);
          // this.getTargetingOverviewBL(campaign, channel, targeting, audience, goal);
        } else {
          this.getTargetingOverviewCPM(campaign, '', targeting, audience);
          this.getTargetingOverviewViewability(campaign, '', targeting, audience);
        }
      }
    } else {
      this.targeting_breakdown_channels.disable();
      this.targeting_breakdown_targetings.disable();
      this.targeting_breakdown_audiences.disable();
    }
  }

  // test function
  getRandomIds(data: any) {
    let random: number;
    do {
      random = this.randomNumber();
    } while(this.chartIds.includes(random));

    this.chartIds.push(random);
    data.chartIds.push(random);
  }

  clearTargetingBreakdownStorage() {
    if(this.targeting_breakdown_campaigns.value || this.targeting_breakdown_goals.value || this.targeting_breakdown_channels.value || this.targeting_breakdown_targetings.value || this.targeting_breakdown_audiences.value) {
      this.targeting_breakdown_campaigns.setValue('');
      this.targeting_breakdown_goals.setValue('');
      this.targeting_breakdown_channels.setValue('');
      this.targeting_breakdown_targetings.setValue('');
      this.targeting_breakdown_audiences.setValue('');

      this.storageService.removeFromStorage('mat-select-targeting-breakdown-campaign');
      this.storageService.removeFromStorage('mat-select-targeting-breakdown-goal');
      this.storageService.removeFromStorage('mat-select-targeting-breakdown-channel');
      this.storageService.removeFromStorage('mat-select-targeting-breakdown-targeting');
      this.storageService.removeFromStorage('mat-select-targeting-breakdown-audience');

      this.targeting_breakdown_goals.disable();
      this.targeting_breakdown_channels.disable();
      this.targeting_breakdown_targetings.disable();
      this.targeting_breakdown_audiences.disable();

      this.campaignDate = false;
      this.campaignStartDate = '';
      this.campaignEndDate = '';

      this.channelList = [];
      this.channelListForSearch = [];

      this.targetingListForSearch = [];
      this.targetingList = [];

      this.audienceListForSearch = [];
      this.audienceList = [];

      this.targetingBreakdownCpmData = {
        chart: [],
        chartIds: []
      };

      this.targetingBreakdownViewabilityData = {
        chart: [],
        chartIds: [],
        details: []
      };

      this.targetingBreakdownSlData = {
        chart: [],
        roas: [{
          brandRoas: 0,
          productRoas: 0
        }]
      }

      this.targetingBreakdownBlData = {
        chart: []
      }
    } else {
      this.snackBar.open(`Filters are clear`, 'X', {
        horizontalPosition: spinner.horizontalPosition,
        verticalPosition: spinner.verticalPosition,
        duration: spinner.duration
      });
    }
  }

  onChange(selected: MatSelectChange) {
    if(selected.source.id == 'mat-select-targeting-breakdown-campaign') {
      if(this.targeting_breakdown_campaigns.value.length) {
        this.storageService.addToStorage('mat-select-targeting-breakdown-campaign', selected.value);
        // this.targeting_breakdown_goals.enable();
        this.targeting_breakdown_channels.enable();
        this.targeting_breakdown_targetings.enable();
        this.targeting_breakdown_audiences.disable();

        // this.targeting_breakdown_goals.setValue('');
        this.targeting_breakdown_channels.setValue('');
        this.targeting_breakdown_targetings.setValue('');
        this.targeting_breakdown_audiences.setValue('');

        this.storageService.removeFromStorage('mat-select-targeting-breakdown-goal');
        this.storageService.removeFromStorage('mat-select-targeting-breakdown-channel');
        this.storageService.removeFromStorage('mat-select-targeting-breakdown-targeting');
        this.storageService.removeFromStorage('mat-select-targeting-breakdown-audience');

        this.channelList = [];
        this.channelListForSearch = [];

        this.targetingListForSearch = [];
        this.targetingList = [];

        this.audienceListForSearch = [];
        this.audienceList = [];

        this.targetingBreakdownCpmData = {
          chart: [],
          chartIds: []
        };

        this.targetingBreakdownViewabilityData = {
          chart: [],
          chartIds: [],
          details: []
        };

        this.targetingBreakdownSlData = {
          chart: [],
          roas: [{
            brandRoas: 0,
            productRoas: 0
          }]
        }

        this.targetingBreakdownBlData = {
          chart: []
        }

        let campaign: any = this.targeting_breakdown_campaigns.value?this.targeting_breakdown_campaigns.value:'';
        // let goal: any = this.targeting_breakdown_goals.value?this.targeting_breakdown_goals.value:'';
        // let channel: any = this.targeting_breakdown_channels.value?this.targeting_breakdown_channels.value:'';
        let targeting: any = this.targeting_breakdown_targetings.value?this.targeting_breakdown_targetings.value:'';
        let audience: any = this.targeting_breakdown_audiences.value?this.targeting_breakdown_audiences.value:'';

        if(campaign) {
          this.getCampaignStartEndDates(campaign);
          this.getTargetingOverviewChannelsByCampaign(campaign).then(() => {});
          this.getTargetingOverviewTargetingByCampaign(campaign, '');
          // this.getTargetingOverviewAudienceByCampaign(campaign, this.goalSelectedChannels);

          this.getTargetingOverviewCPM(campaign, '', targeting, audience);
          this.getTargetingOverviewViewability(campaign, '', targeting, audience);
          // this.getTargetingOverviewSL(campaign, this.goalSelectedChannels, targeting, audience, goal);
          // this.getTargetingOverviewBL(campaign, this.goalSelectedChannels, targeting, audience, goal);
        }

      } else {
        this.storageService.removeFromStorage('mat-select-targeting-breakdown-campaign');
        this.storageService.removeFromStorage('mat-select-targeting-breakdown-goal');
        this.storageService.removeFromStorage('mat-select-targeting-breakdown-channel');
        this.storageService.removeFromStorage('mat-select-targeting-breakdown-targeting');
        this.storageService.removeFromStorage('mat-select-targeting-breakdown-audience');

        // this.targeting_breakdown_goals.setValue('');
        this.targeting_breakdown_channels.setValue('');
        this.targeting_breakdown_targetings.setValue('');
        this.targeting_breakdown_audiences.setValue('');

        // this.targeting_breakdown_goals.disable();
        this.targeting_breakdown_channels.disable();
        this.targeting_breakdown_targetings.disable();
        this.targeting_breakdown_audiences.disable();

        // reset data
        this.campaignDate = false;
        this.campaignStartDate = '';
        this.campaignEndDate = '';

        this.channelList = [];
        this.channelListForSearch = [];

        this.targetingListForSearch = [];
        this.targetingList = [];

        this.audienceListForSearch = [];
        this.audienceList = [];

        this.targetingBreakdownCpmData = {
          chart: [],
          chartIds: []
        };

        this.targetingBreakdownViewabilityData = {
          chart: [],
          chartIds: [],
          details: []
        };

        this.targetingBreakdownSlData = {
          chart: [],
          roas: [{
            brandRoas: 0,
            productRoas: 0
          }]
        }

        this.targetingBreakdownBlData = {
          chart: []
        }
      }
    }

    // if(selected.source.id == 'mat-select-targeting-breakdown-goal') {
    //   if(this.targeting_breakdown_goals.value != undefined) {
    //     this.storageService.addToStorage('mat-select-targeting-breakdown-goal', selected.value);
    //     this.storageService.removeFromStorage('mat-select-targeting-breakdown-targeting');
    //     this.storageService.removeFromStorage('mat-select-targeting-breakdown-audience');
    //     this.targeting_breakdown_channels.enable();
    //     this.targeting_breakdown_targetings.enable();
    //     this.targeting_breakdown_audiences.disable();

    //     this.targeting_breakdown_channels.setValue('');
    //     this.targeting_breakdown_targetings.setValue('');
    //     this.targeting_breakdown_audiences.setValue('');

    //     let campaign: any = this.targeting_breakdown_campaigns.value?this.targeting_breakdown_campaigns.value:'';
    //     let goal: any = this.targeting_breakdown_goals.value?this.targeting_breakdown_goals.value:'';
    //     let channel: any = this.targeting_breakdown_channels.value?this.targeting_breakdown_channels.value:'';
    //     let targeting: any = this.targeting_breakdown_targetings.value?this.targeting_breakdown_targetings.value:'';
    //     let audience: any = this.targeting_breakdown_audiences.value?this.targeting_breakdown_audiences.value:'';

    //     this.getTargetingOverviewChannelsByCampaign(campaign).then(() => {
    //       if(goal) {
    //         this.getTargetingOverviewChannelsByGoal(campaign, goal).then(() => {
    //           if(campaign && goal) {
    //             this.getTargetingOverviewTargetingByCampaign(campaign, this.goalSelectedChannels);
    //             // this.getTargetingOverviewAudienceByCampaign(campaign, this.goalSelectedChannels);

    //             this.getTargetingOverviewCPM(campaign, this.goalSelectedChannels, targeting, audience);
    //             this.getTargetingOverviewViewability(campaign, this.goalSelectedChannels, targeting, audience);
    //             // this.getTargetingOverviewSL(campaign, this.goalSelectedChannels, targeting, audience, goal);
    //             // this.getTargetingOverviewBL(campaign, this.goalSelectedChannels, targeting, audience, goal);

    //           }
    //         // },
    //         // (error) => {
    //         //   this.getTargetingOverviewChannelsByCampaign(campaign);
    //         });
    //       }
    //     });

    //   } else {
    //     this.storageService.removeFromStorage('mat-select-targeting-breakdown-goal');
    //     this.storageService.removeFromStorage('mat-select-targeting-breakdown-channel');
    //     this.storageService.removeFromStorage('mat-select-targeting-breakdown-targeting');
    //     this.storageService.removeFromStorage('mat-select-targeting-breakdown-audience');

    //     this.targeting_breakdown_channels.setValue('');
    //     this.targeting_breakdown_targetings.setValue('');
    //     this.targeting_breakdown_audiences.setValue('');

    //     this.targeting_breakdown_channels.disable();
    //     this.targeting_breakdown_targetings.disable();
    //     this.targeting_breakdown_audiences.disable();

    //     // reset data
    //     this.campaignDate = false;
    //     this.campaignStartDate = '';
    //     this.campaignEndDate = '';

    //     this.channelList = [];
    //     this.channelListForSearch = [];

    //     this.targetingListForSearch = [];
    //     this.targetingList = [];

    //     this.audienceListForSearch = [];
    //     this.audienceList = [];

    //     this.targetingBreakdownCpmData = {
    //       chart: [],
    //       chartIds: []
    //     };

    //     this.targetingBreakdownViewabilityData = {
    //       chart: [],
    //       chartIds: [],
    //       details: [{
    //         type: '',
    //          name: ''
    //       }]
    //     };

    //     this.targetingBreakdownSlData = {
    //       chart: [],
    //       roas: [{
    //         brandRoas: 0,
    //         productRoas: 0
    //       }]
    //     }

    //     this.targetingBreakdownBlData = {
    //       chart: []
    //     }
    //   }
    // }

    if(selected.source.id == 'mat-select-targeting-breakdown-channel') {
      if(this.targeting_breakdown_channels.value.length) {
        this.storageService.addToStorage('mat-select-targeting-breakdown-channel', selected.value);

        this.storageService.removeFromStorage('mat-select-targeting-breakdown-targeting');
        this.storageService.removeFromStorage('mat-select-targeting-breakdown-audience');
        this.targeting_breakdown_targetings.setValue('');
        this.targeting_breakdown_audiences.setValue('');

        let campaign: any = this.targeting_breakdown_campaigns.value?this.targeting_breakdown_campaigns.value:'';
        // let goal: any = this.targeting_breakdown_goals.value?this.targeting_breakdown_goals.value:'';
        let channel: any = this.targeting_breakdown_channels.value?this.targeting_breakdown_channels.value:'';
        let targeting: any = this.targeting_breakdown_targetings.value?this.targeting_breakdown_targetings.value:'';
        let audience: any = this.targeting_breakdown_audiences.value?this.targeting_breakdown_audiences.value:'';

        this.getTargetingOverviewTargetingByCampaign(campaign, channel);
        // this.getTargetingOverviewAudienceByCampaign(campaign, channel);

        this.getTargetingOverviewCPM(campaign, channel, targeting, audience);
        this.getTargetingOverviewViewability(campaign, channel, targeting, audience);
        // this.getTargetingOverviewSL(campaign, channel, targeting, audience, goal);
        // this.getTargetingOverviewBL(campaign, channel, targeting, audience, goal);
      } else {
        this.storageService.removeFromStorage('mat-select-targeting-breakdown-channel');
        this.storageService.removeFromStorage('mat-select-targeting-breakdown-targeting');
        this.storageService.removeFromStorage('mat-select-targeting-breakdown-audience');
        this.targeting_breakdown_targetings.setValue('');
        this.targeting_breakdown_audiences.setValue('');

        let campaign: any = this.targeting_breakdown_campaigns.value?this.targeting_breakdown_campaigns.value:'';
        // let goal: any = this.targeting_breakdown_goals.value?this.targeting_breakdown_goals.value:'';
        let targeting: any = this.targeting_breakdown_targetings.value?this.targeting_breakdown_targetings.value:'';
        let audience: any = this.targeting_breakdown_audiences.value?this.targeting_breakdown_audiences.value:'';

        if(campaign && this.goalSelectedChannels=='') {
          this.getTargetingOverviewTargetingByCampaign(campaign, '');
          // this.getTargetingOverviewAudienceByCampaign(campaign, this.goalSelectedChannels);

          this.getTargetingOverviewCPM(campaign, '', targeting, audience);
          this.getTargetingOverviewViewability(campaign, '', targeting, audience);
          // this.getTargetingOverviewSL(campaign, this.goalSelectedChannels, targeting, audience, goal);
          // this.getTargetingOverviewBL(campaign, this.goalSelectedChannels, targeting, audience, goal);
        }
      }
    }

    if(selected.source.id == 'mat-select-targeting-breakdown-targeting') {
      if(this.targeting_breakdown_targetings.value != undefined) {
        this.storageService.addToStorage('mat-select-targeting-breakdown-targeting', selected.value);
        this.targeting_breakdown_audiences.enable();

        this.targeting_breakdown_audiences.setValue('');

        let campaign: any = this.targeting_breakdown_campaigns.value?this.targeting_breakdown_campaigns.value:'';
        // let goal: any = this.targeting_breakdown_goals.value?this.targeting_breakdown_goals.value:'';
        let channel: any = this.targeting_breakdown_channels.value?this.targeting_breakdown_channels.value:'';
        let targeting: any = this.targeting_breakdown_targetings.value?this.targeting_breakdown_targetings.value:'';
        let audience: any = this.targeting_breakdown_audiences.value?this.targeting_breakdown_audiences.value:'';

        if(campaign && this.goalSelectedChannels=='' && !channel) {
          this.getTargetingOverviewAudienceByCampaign(campaign, '', targeting);
          this.getTargetingOverviewCPM(campaign, '', targeting, audience);
          this.getTargetingOverviewViewability(campaign, '', targeting, audience);
          // this.getTargetingOverviewSL(campaign, this.goalSelectedChannels, targeting, audience, goal);
          // this.getTargetingOverviewBL(campaign, this.goalSelectedChannels, targeting, audience, goal);
        }

        if(campaign && channel) {
          this.getTargetingOverviewAudienceByCampaign(campaign, channel, targeting);
          this.getTargetingOverviewCPM(campaign, channel, targeting, audience);
          this.getTargetingOverviewViewability(campaign, channel, targeting, audience);
          // this.getTargetingOverviewSL(campaign, channel, targeting, audience, goal);
          // this.getTargetingOverviewBL(campaign, channel, targeting, audience, goal);
        }
      } else {
        this.storageService.removeFromStorage('mat-select-targeting-breakdown-targeting');
        this.targeting_breakdown_audiences.disable();

        this.targeting_breakdown_audiences.setValue('');

        let campaign: any = this.targeting_breakdown_campaigns.value?this.targeting_breakdown_campaigns.value:'';
        // let goal: any = this.targeting_breakdown_goals.value?this.targeting_breakdown_goals.value:'';
        let channel: any = this.targeting_breakdown_channels.value?this.targeting_breakdown_channels.value:'';
        let targeting: any = this.targeting_breakdown_targetings.value?this.targeting_breakdown_targetings.value:'';
        let audience: any = this.targeting_breakdown_audiences.value?this.targeting_breakdown_audiences.value:'';

        if(campaign && this.goalSelectedChannels=='' && !channel) {
          this.getTargetingOverviewAudienceByCampaign(campaign, '', targeting);
          this.getTargetingOverviewCPM(campaign, '', targeting, audience);
          this.getTargetingOverviewViewability(campaign, '', targeting, audience);
          // this.getTargetingOverviewSL(campaign, this.goalSelectedChannels, targeting, audience, goal);
          // this.getTargetingOverviewBL(campaign, this.goalSelectedChannels, targeting, audience, goal);
        }

        if(campaign && channel) {
          this.getTargetingOverviewAudienceByCampaign(campaign, channel, targeting);
          this.getTargetingOverviewCPM(campaign, channel, targeting, audience);
          this.getTargetingOverviewViewability(campaign, channel, targeting, audience);
          // this.getTargetingOverviewSL(campaign, channel, targeting, audience, goal);
          // this.getTargetingOverviewBL(campaign, channel, targeting, audience, goal);
        }
      }
    }

    if(selected.source.id == 'mat-select-targeting-breakdown-audience') {
      if(this.targeting_breakdown_audiences.value != undefined) {
        this.storageService.addToStorage('mat-select-targeting-breakdown-audience', selected.value);

        let campaign: any = this.targeting_breakdown_campaigns.value?this.targeting_breakdown_campaigns.value:'';
        // let goal: any = this.targeting_breakdown_goals.value?this.targeting_breakdown_goals.value:'';
        let channel: any = this.targeting_breakdown_channels.value?this.targeting_breakdown_channels.value:'';
        let targeting: any = this.targeting_breakdown_targetings.value?this.targeting_breakdown_targetings.value:'';
        let audience: any = this.targeting_breakdown_audiences.value?this.targeting_breakdown_audiences.value:'';

        if(campaign && this.goalSelectedChannels=='' && !channel) {
          this.getTargetingOverviewCPM(campaign, '', targeting, audience);
          this.getTargetingOverviewViewability(campaign, '', targeting, audience);
          // this.getTargetingOverviewSL(campaign, this.goalSelectedChannels, targeting, audience, goal);
          // this.getTargetingOverviewBL(campaign, this.goalSelectedChannels, targeting, audience, goal);
        }

        if(campaign && channel) {
          this.getTargetingOverviewCPM(campaign, channel, targeting, audience);
          this.getTargetingOverviewViewability(campaign, channel, targeting, audience);
          // this.getTargetingOverviewSL(campaign, channel, targeting, audience, goal);
          // this.getTargetingOverviewBL(campaign, channel, targeting, audience, goal);
        }
      } else {
        this.storageService.removeFromStorage('mat-select-targeting-breakdown-audience');

        let campaign: any = this.targeting_breakdown_campaigns.value?this.targeting_breakdown_campaigns.value:'';
        // let goal: any = this.targeting_breakdown_goals.value?this.targeting_breakdown_goals.value:'';
        let channel: any = this.targeting_breakdown_channels.value?this.targeting_breakdown_channels.value:'';
        let targeting: any = this.targeting_breakdown_targetings.value?this.targeting_breakdown_targetings.value:'';
        let audience: any = this.targeting_breakdown_audiences.value?this.targeting_breakdown_audiences.value:'';

        if(campaign && this.goalSelectedChannels=='' && !channel) {
          this.getTargetingOverviewCPM(campaign, '', targeting, audience);
          this.getTargetingOverviewViewability(campaign, '', targeting, audience);
          // this.getTargetingOverviewSL(campaign, this.goalSelectedChannels, targeting, audience, goal);
          // this.getTargetingOverviewBL(campaign, this.goalSelectedChannels, targeting, audience, goal);
        }

        if(campaign && channel) {
          this.getTargetingOverviewCPM(campaign, channel, targeting, audience);
          this.getTargetingOverviewViewability(campaign, channel, targeting, audience);
          // this.getTargetingOverviewSL(campaign, channel, targeting, audience, goal);
          // this.getTargetingOverviewBL(campaign, channel, targeting, audience, goal);
        }
      }
    }
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

  getTargetingOverviewCampaigns() {
    this.appService.getTargetingOverviewCampaigns(this.brand).subscribe((response) => {
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

  getTargetingOverviewChannelsByCampaign(campaign: string) {
    var promise = new Promise<void>((resolve, reject) => {
      this.channelList = [];
      this.channelListForSearch = [];

      this.appService.getTargetingOverviewChannelsByCampaign(this.brand, campaign).subscribe((response) => {
          if(response.status == 200) {
            response.results.forEach((channel: any) => {
              // console.log(channel);
              // let channelArray = {
              //   value: channel.Channel,
              //   text: channel.Channel
              // }

              if(this.channelList.find(value => value == channel.Channel) == null)
                this.channelList.push(channel.Channel);
              if(this.channelListForSearch.find(value => value == channel.Channel) == null)
                this.channelListForSearch.push(channel.Channel);

              // if(this.channelList.find(channel => channel.value == channelArray.value) == null)
              //   this.channelList.push(channelArray);
              // if(this.channelListForSearch.find(channel => channel.value == channelArray.value) == null)
              //   this.channelListForSearch.push(channelArray);
            });

            this.channelList.sort((a, b) => a.localeCompare(b));
            this.channelListForSearch.sort((a, b) => a.localeCompare(b));
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

  getTargetingOverviewChannelsByGoal(campaign: string, goal: string) {
    var promise = new Promise<void>((resolve, reject) => {
    this.appService.getTargetingOverviewChannelsByGoal(this.brand, campaign, goal).subscribe((response) => {
        if(response.status == 200) {
          let goalChannels: any[] = [];
          // if(!response.results.length)
          //   reject();
          response.results.forEach((channel: any) => {
            goalChannels.push(channel.Channel);
            // console.log(channel);
            // let channelArray = {
            //   value: channel.Channel,
            //   text: channel.Channel
            // }
            // if(this.channelList.find(channel => channel.value == channelArray.value) == null)
            //   this.channelList.push(channelArray);
            // if(this.channelListForSearch.find(channel => channel.value == channelArray.value) == null)
            //   this.channelListForSearch.push(channelArray);

            if(this.channelList.find(value => value == channel.Channel) == null)
                this.channelList.push(channel.Channel);
            if(this.channelListForSearch.find(value => value == channel.Channel) == null)
              this.channelListForSearch.push(channel.Channel);
          });

          // this.channelList.sort((a, b) => a.value.localeCompare(b.value));
          // this.channelListForSearch.sort((a, b) => a.value.localeCompare(b.value));
          this.channelList.sort((a, b) => a.localeCompare(b));
          this.channelListForSearch.sort((a, b) => a.localeCompare(b));

          this.goalSelectedChannels = goalChannels.join(",");
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

  getTargetingOverviewTargetingByCampaign(campaign: string, channel: string) {
    var promise = new Promise<void>((resolve, reject) => {

      this.appService.getTargetingOverviewTargetingByCampaign(this.brand, campaign, channel).subscribe((response) => {
        // reset data
        this.targetingListForSearch = [];
        this.targetingList = [];

        if(response.status == 200) {
          response.results.forEach((targeting: any) => {
            // console.log(channel);
            let targetingArray = {
              value: targeting.Targeting,
              text: targeting.Targeting
            }

            if(this.targetingList.find(targeting => targeting.value == targetingArray.value) == null)
              this.targetingList.push(targetingArray);
            if(this.targetingListForSearch.find(targeting => targeting.value == targetingArray.value) == null)
              this.targetingListForSearch.push(targetingArray);
          });

          this.targetingList.sort((a, b) => a.value.localeCompare(b.value));
          this.targetingListForSearch.sort((a, b) => a.value.localeCompare(b.value));
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

  getTargetingOverviewAudienceByCampaign(campaign: string, channel: string, targeting: string) {
    var promise = new Promise<void>((resolve, reject) => {

      this.appService.getTargetingOverviewAudienceByCampaign(this.brand, campaign, channel, targeting).subscribe((response) => {
        // reset data
        this.audienceListForSearch = [];
        this.audienceList = [];

        if(response.status == 200) {
          response.results.forEach((audience: any) => {
            // console.log(channel);
            let audienceArray = {
              value: audience.Audience,
              text: audience.Audience
            }

            if(this.audienceList.find(audience => audience.value == audienceArray.value) == null)
              this.audienceList.push(audienceArray);
            if(this.audienceListForSearch.find(audience => audience.value == audienceArray.value) == null)
              this.audienceListForSearch.push(audienceArray);
          });

          this.audienceList.sort((a, b) => a.value.localeCompare(b.value));
          this.audienceListForSearch.sort((a, b) => a.value.localeCompare(b.value));
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

  getTargetingOverviewCPM(campaign: string, channel: string, targeting: string, audience: string) {
    // Reset data
    this.targetingBreakdownCpmData = {
      chart: [],
      chartIds: []
    };

    this.appService.getTargetingOverviewTargetingCPM(this.brand, campaign, channel, targeting, audience).subscribe((response) => {

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
          });
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
          });
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
                  cpmTargeting.push(cpmArray);
                // }
              }
            });
          });

          cpmTargeting.sort((a, b) => {
            return a.cpm - b.cpm;
          })

          this.targetingBreakdownCpmData.chart.push(cpmTargeting);

          let random: number;
          do {
            random = this.randomNumber();
          } while(this.targetingBreakdownCpmData.chartIds.includes(random));
          this.targetingBreakdownCpmData.chartIds.push(random);

          // console.log(this.targetingBreakdownCpmData);
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

    this.appService.getTargetingOverviewAudienceCPM(this.brand, campaign, channel, targeting, audience).subscribe((response) => {
      if(response.status == 200) {
        let impressionsAudience: any[] = [];
        let spendsAudience:any[] = [];
        let cpmAudience:any[] = [];

        if(response.results[0].length) {
          response.results[0].forEach((impression: any) => {
            let impressionArray: any;

            if(impression.Imp) {
              impressionArray = {
                audience: impression.Audience,
                impression: impression.Imp
              }
            } else {
              impressionArray = {
                audience: impression.Audience,
                impression: 0
              }
            }

            impressionsAudience.push(impressionArray);
          });
        }

        if(response.results[1].length) {
          response.results[1].forEach((spend: any) => {
            let spendArray: any;

            if(spend.Spend) {
              spendArray = {
                audience: spend.Audience,
                spend: spend.Spend
              }
            } else {
              spendArray ={
                audience: spend.Audience,
                spend: 0
              }
            }

            spendsAudience.push(spendArray);
          });
        }

        if(impressionsAudience.length && spendsAudience.length) {
          let cpmArray: any;

          impressionsAudience.forEach((impression: any, index: number) => {
            spendsAudience.forEach((spend: any) => {
              if(impression.audience == spend.audience) {
                // if(index < 10) {
                  cpmArray ={
                    audience: spend.audience,
                    cpm: cpmCalc(spend.spend, impression.impression).toFixed(2)
                  }
                  cpmAudience.push(cpmArray);
                // }
              }
            });
          });

          cpmAudience.sort((a, b) => {
            return a.cpm - b.cpm;
          })

          this.targetingBreakdownCpmData.chart.push(cpmAudience);

          let random: number;
          do {
            random = this.randomNumber();
          } while(this.targetingBreakdownCpmData.chartIds.includes(random));
          this.targetingBreakdownCpmData.chartIds.push(random);

          // console.log(this.targetingBreakdownCpmData);
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

  getTargetingOverviewViewability(campaign: string, channel: string, targeting: string, audience: string) {
    // Reset data
    this.targetingBreakdownViewabilityData = {
      chart: [],
      chartIds: [],
      details: []
    };

    this.appService.getTargetingOverviewTargetingInViewRateViewability(this.brand, campaign, channel, targeting, audience).subscribe((response) => {
      let viewabilityRateTargetingArray: any[] = [];

      if(response.status == 200) {

        if(response.results.length) {
          let viewabilityArray: any;

          response.results.forEach((viewability: any) => {
            let inViewRate = 0;

            let InViewRateDisplay = 0;
            let InViewRateVideo = 0;

            if(viewability.InViewMeasurableImpressions) {
              InViewRateDisplay = (viewability.InViewImpressions/viewability.InViewMeasurableImpressions)
            }

            if(viewability.InViewMeasurableImpressions) {
              InViewRateVideo = (viewability.TwoSecInViewImpressions/viewability.InViewMeasurableImpressions)
            }

            if(InViewRateDisplay > 0 && InViewRateDisplay > InViewRateVideo)
              inViewRate = InViewRateDisplay;
            if(InViewRateVideo > InViewRateDisplay && InViewRateVideo > 0)
              inViewRate = InViewRateVideo

            viewabilityArray = {
              targeting: viewability.Targeting,
              viewability: (inViewRate*100).toFixed(2)
            }

            viewabilityRateTargetingArray.push(viewabilityArray);
          });

          viewabilityRateTargetingArray.sort((a, b) => {
            return a.viewability - b.viewability;
          })

          this.targetingBreakdownViewabilityData.chart.push(viewabilityRateTargetingArray);
          this.targetingBreakdownViewabilityData.details.push({type: 'Targeting Type', name: 'In View Rate', unit: '%'})

          let random: number;
          do {
            random = this.randomNumber();
          } while(this.targetingBreakdownViewabilityData.chartIds.includes(random));
          this.targetingBreakdownViewabilityData.chartIds.push(random);
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

    this.appService.getTargetingOverviewAudienceInViewRateViewability(this.brand, campaign, channel, targeting, audience).subscribe((response) => {
      let viewabilityRateAudienceArray: any[] = [];

      if(response.status == 200) {
        if(response.results.length) {
          let viewabilityArray: any;

          response.results.forEach((viewability: any) => {
            let inViewRate = 0;

            let InViewRateDisplay = 0;
            let InViewRateVideo = 0;

            if(viewability.InViewMeasurableImpressions) {
              InViewRateDisplay = (viewability.InViewImpressions/viewability.InViewMeasurableImpressions)
            }

            if(viewability.InViewMeasurableImpressions) {
              InViewRateVideo = (viewability.TwoSecInViewImpressions/viewability.InViewMeasurableImpressions)
            }

            if(InViewRateDisplay > 0 && InViewRateDisplay > InViewRateVideo)
              inViewRate = InViewRateDisplay;
            if(InViewRateVideo > InViewRateDisplay && InViewRateVideo > 0)
              inViewRate = InViewRateVideo

            viewabilityArray = {
              audience: viewability.Audience,
              viewability: (inViewRate*100).toFixed(2)
            }

            viewabilityRateAudienceArray.push(viewabilityArray);
          });

          viewabilityRateAudienceArray.sort((a, b) => {
            return a.viewability - b.viewability;
          })

          this.targetingBreakdownViewabilityData.chart.push(viewabilityRateAudienceArray);
          this.targetingBreakdownViewabilityData.details.push({type: 'Audience Type', name: 'In View Rate', unit: '%'});

          let random: number;
          do {
            random = this.randomNumber();
          } while(this.targetingBreakdownViewabilityData.chartIds.includes(random));
          this.targetingBreakdownViewabilityData.chartIds.push(random);
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

    this.appService.getTargetingOverviewTargetingInViewTimeViewability(this.brand, campaign, channel, targeting, audience).subscribe((response) => {
      let viewabilityTimeTargetingArray: any[] = [];

      if(response.status == 200) {
        if(response.results.length) {
          let viewabilityArray: any;

          response.results.forEach((viewability: any) => {
            let inViewTime = 0;

            let InViewTimeDisplay = 0;
            let InViewTimeVideo = 0;

            if(viewability.InViewImpressions) {
              InViewTimeDisplay = (viewability.TotalExposureTime/viewability.InViewImpressions)
            }

            if(viewability.TwoSecInViewImpressions) {
              InViewTimeVideo = (viewability.TotalExposureTime/viewability.TwoSecInViewImpressions)
            }

            if(InViewTimeDisplay > 0 && InViewTimeDisplay > InViewTimeVideo)
              inViewTime = InViewTimeDisplay;
            if(InViewTimeVideo > InViewTimeDisplay && InViewTimeVideo > 0)
              inViewTime = InViewTimeVideo

            viewabilityArray = {
              targeting: viewability.Targeting,
              viewability: (inViewTime).toFixed(2)
            }

            viewabilityTimeTargetingArray.push(viewabilityArray);
          });

          viewabilityTimeTargetingArray.sort((a, b) => {
            return a.viewability - b.viewability;
          })

          this.targetingBreakdownViewabilityData.chart.push(viewabilityTimeTargetingArray);
          this.targetingBreakdownViewabilityData.details.push({type: 'Targeting Type', name: 'In View Time', unit: ''});

          let random: number;
          do {
            random = this.randomNumber();
          } while(this.targetingBreakdownViewabilityData.chartIds.includes(random));
          this.targetingBreakdownViewabilityData.chartIds.push(random);
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

    this.appService.getTargetingOverviewAudienceInViewTimeViewability(this.brand, campaign, channel, targeting, audience).subscribe((response) => {
      let viewabilityTimeAudienceArray: any[] = [];

      if(response.status == 200) {
        if(response.results.length) {
          let viewabilityArray: any;

          response.results.forEach((viewability: any) => {
            let inViewTime = 0;

            let InViewTimeDisplay = 0;
            let InViewTimeVideo = 0;

            if(viewability.InViewImpressions) {
              InViewTimeDisplay = (viewability.TotalExposureTime/viewability.InViewImpressions)
            }

            if(viewability.TwoSecInViewImpressions) {
              InViewTimeVideo = (viewability.TotalExposureTime/viewability.TwoSecInViewImpressions)
            }

            if(InViewTimeDisplay > 0 && InViewTimeDisplay > InViewTimeVideo)
              inViewTime = InViewTimeDisplay;
            if(InViewTimeVideo > InViewTimeDisplay && InViewTimeVideo > 0)
              inViewTime = InViewTimeVideo

            viewabilityArray = {
              audience: viewability.Audience,
              viewability: (inViewTime).toFixed(2)
            }

            viewabilityTimeAudienceArray.push(viewabilityArray);
          });

          viewabilityTimeAudienceArray.sort((a, b) => {
            return a.viewability - b.viewability;
          })

          this.targetingBreakdownViewabilityData.chart.push(viewabilityTimeAudienceArray);
          this.targetingBreakdownViewabilityData.details.push({type: 'Audience Type', name: 'In View Time', unit: ''});

          let random: number;
          do {
            random = this.randomNumber();
          } while(this.targetingBreakdownViewabilityData.chartIds.includes(random));
          this.targetingBreakdownViewabilityData.chartIds.push(random);
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


  getTargetingOverviewSL(campaign: string, channel: string, targeting: string, audience: string, goal: string) {
    this.appService.getTargetingOverviewSL(this.brand, campaign, channel, targeting, audience, goal).subscribe((response) => {
      // Reset data
      this.targetingBreakdownSlData = {
        chart: [],
        roas: [{
          brandRoas: 0,
          productRoas: 0
        }]
      };

      if(response.status == 200) {
        let BrandSLArray: any[] = [];
        let ProdSLArray: any[] = [];

        if(response.results[0].length) {
          let SL: any = [];

          response.results[0].forEach((sl: any) => {
            if(sl.Brand_ODC_SL) {
              SL = {
                type: sl.Targeting?sl.Targeting:'-',
                sl: (sl.Brand_ODC_SL).toFixed(2),
                isSignificant: sl.isSignificant=='True'?1:0
              }
            } else {
              SL = {
                type: sl.Targeting?sl.Targeting:'-',
                sl: (0).toFixed(2),
                isSignificant: sl.isSignificant=='True'?1:0
              }
            }

            BrandSLArray.push(SL);
          });

          BrandSLArray.sort((a, b) => {
            return b.sl - a.sl;
          })

          this.targetingBreakdownSlData.chart.push(BrandSLArray);
        }

        if(response.results[1].length) {
          let SL: any = [];

          response.results[1].forEach((sl: any) => {
            if(sl.Prod_ODC_SL) {
              SL = {
                type: sl.Targeting?sl.Targeting:'-',
                sl: (sl.Prod_ODC_SL).toFixed(2),
                isSignificant: sl.isSignificant=='True'?1:0
              }
            } else {
              SL = {
                type: sl.Targeting?sl.Targeting:'-',
                sl: (0).toFixed(2),
                isSignificant: sl.isSignificant=='True'?1:0
              }
            }

            ProdSLArray.push(SL);
          });;

          ProdSLArray.sort((a, b) => {
            return b.sl - a.sl;
          })

          this.targetingBreakdownSlData.chart.push(ProdSLArray);
        }

        if(response.results[2].length) {
          this.targetingBreakdownSlData.roas[0].brandRoas = response.results[2][0].SL_ROAS.toFixed(3);
        }

        if(response.results[3].length) {
          this.targetingBreakdownSlData.roas[0].productRoas = response.results[3][0].SL_ROAS.toFixed(3);
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

  getTargetingOverviewBL(campaign: string, channel: string, targeting: string, audience: string, goal: string) {
    this.appService.getTargetingOverviewBL(this.brand, campaign, channel, targeting, audience, goal).subscribe((response) => {
      // Reset data
      this.targetingBreakdownBlData = {
        chart: []
      };

      if(response.status == 200) {
        let ComscoreBLArray: any[] = [];
        let YouTubeBLArray: any[] = [];

        if(response.results[0].length) {
          let BL: any = [];

          response.results[0].forEach((bl: any) => {
            if(bl.Comscore_BL) {
              BL = {
                type: bl.Targeting?bl.Targeting:'-',
                bl: (bl.Comscore_BL).toFixed(2),
                isSignificant: bl.isSignificant=='True'?1:0
              }
            } else {
              BL = {
                type: bl.Targeting?bl.Targeting:'-',
                bl: (0).toFixed(2),
                isSignificant: bl.isSignificant=='True'?1:0
              }
            }

            ComscoreBLArray.push(BL);
          });

          ComscoreBLArray.sort((a, b) => {
            return b.bl - a.bl;
          })

          this.targetingBreakdownBlData.chart.push(ComscoreBLArray);
        }

        if(response.results[1].length) {
          let BL: any = [];

          response.results[1].forEach((bl: any) => {
            if(bl.YT_BL) {
              BL = {
                type: bl.Targeting?bl.Targeting:'-',
                bl: (bl.YT_BL).toFixed(2),
                isSignificant: bl.isSignificant=='True'?1:0
              }
            } else {
              BL = {
                type: bl.Targeting?bl.Targeting:'-',
                bl: (0).toFixed(2),
                isSignificant: bl.isSignificant=='True'?1:0
              }
            }

            YouTubeBLArray.push(BL);
          });;

          YouTubeBLArray.sort((a, b) => {
            return b.bl - a.bl;
          })

          this.targetingBreakdownBlData.chart.push(YouTubeBLArray);
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
}
