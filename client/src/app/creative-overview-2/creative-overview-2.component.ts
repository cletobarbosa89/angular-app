import { Component, Input, OnInit, ViewChild, Inject, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectChange, MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectionList } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { StorageService } from '../storage.service';
import { AppService } from '../app.service';

import { spinner } from '../spinner-config';

export interface DialogData {
  link: ''
}

export interface DialogDataGuidelines {
  id: '',
  guidelines: '',
  creativeName: ''
}

export interface Dropwdowns {
  value: string,
  text: string
}

@Component({
  selector: 'app-creative-overview-2',
  templateUrl: './creative-overview-2.component.html',
  styleUrls: ['./creative-overview-2.component.css']
})
export class CreativeOverview2Component implements OnInit {

  brand:any;

  campaignDate: boolean = false;
  campaignStartDate: string = '';
  campaignEndDate: string = '';

  creative_overview_campaign: String | null = '';
  creative_overview_channel: String | null = '';

  creativeOverviewDigitalScoreClasses = ['widget-320'];

  campaignListForSearch: Dropwdowns[] = [];
  campaignList: Dropwdowns[] = [];

  channelListForSearch: Dropwdowns[] = [];
  channelList: Dropwdowns[] = [];

  creative_overview_campaigns = new FormControl();
  creative_overview_channels = new FormControl();

  creativeOverviewDigitalCreativesCount: number = 0;
  creativeOverviewDigitalCreativesLimit: number = 6;
  creativeOverviewDigitalCreativesOffset: number = 0;
  creativeOverviewDigitalCreativesOnScrollDisabled: boolean = false;

  creativeOverviewDigitalCreativeScoreData = {
    creatives: [] as any[]
  };

  @ViewChild('campaign') matSelectCampaign: MatSelect;
  @ViewChild('channel') matSelectChannel: MatSelect;
  @ViewChild('infiniteScroll') infiniteScroll: ElementRef;

  public isFilteredCampaigns(campaign: any) {
    return this.campaignList.find(item => item.value === campaign.value);
  }

  constructor(
    private storageService: StorageService,
    private appService: AppService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.brand = this.route.snapshot.paramMap.get('brand');
    if(this.brand) {
      this.getCreativeOverviewCampaigns();
      // this.getCreativeOverviewChannels();
    }

    this.creative_overview_channels.disable();
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

    this.matSelectChannel.openedChange.subscribe(opened => {
      if (opened) {
        this.matSelectChannel.panel.nativeElement.addEventListener('mouseleave', () => {
          this.matSelectChannel.close();
          this.channelList = this.channelListForSearch;
        })
      }
    });
  }

  openDialogImage(event: any) {
    let type = event.target.dataset.type;
    let link = event.target.dataset.link;

    this.dialog.open(CreativeOverviewDialogImage2, {
      data: {
        link: link,
      },
    });
  }

  openDialogVideo(event: any) {
    let type = event.target.dataset.type;
    let link = event.target.dataset.link;

    this.dialog.open(CreativeOverviewDialogVideo2, {
      data: {
        type: type,
        link: link,
      },
    });
  }

  openDialogGuidelines(event: any) {
    let guidelines = event.target.dataset.guidelines;
    let creativeName = event.target.dataset.creativename;
    let id = event.target.dataset.id;

    let position = {}
    if((id+1)%3==0)
      position = {
        right: '5%'
      }
    if(id%3==0)
      position = {
        left: '5%'
      }

    this.dialog.open(CreativeOverviewDialogGuidelines2, {
      data: {
        guidelines: guidelines,
        creativeName: creativeName
      },
      position: position
    });
  }

  ngOnInit(): void {
    this.creativeOverviewDigitalCreativesCount = 0;
    this.creativeOverviewDigitalCreativesLimit = 6;
    this.creativeOverviewDigitalCreativesOffset = 0;

    if(this.storageService.getFromStorage('mat-select-creative-overview-campaign')) {
      this.creative_overview_campaign = this.storageService.getFromStorage('mat-select-creative-overview-campaign');
      this.creative_overview_campaigns.setValue(this.creative_overview_campaign?.split(','));
      this.creative_overview_channels.enable();

      let campaign: any = this.creative_overview_campaigns.value;
      this.getCampaignStartEndDates(campaign);
      this.getCreativeOverviewChannelsByCampaign(campaign);
    }

    if(this.storageService.getFromStorage('mat-select-creative-overview-channel')) {
      this.creative_overview_channel = this.storageService.getFromStorage('mat-select-creative-overview-channel');
      this.creative_overview_channels.setValue(this.creative_overview_channel);
      this.creative_overview_channels.enable();
    }

    if(this.storageService.getFromStorage('mat-select-creative-overview-campaign') && this.storageService.getFromStorage('mat-select-creative-overview-channel')) {
      this.getCreativesCount(this.creative_overview_campaigns.value?this.creative_overview_campaigns.value:'', this.creative_overview_channels.value?this.creative_overview_channels.value:'', false).then(() => {
        if(this.creativeOverviewDigitalCreativesCount <= this.creativeOverviewDigitalCreativesLimit) {
          this.creativeOverviewDigitalCreativesOnScrollDisabled = true;
          this.creativeOverviewDigitalCreativesLimit = this.creativeOverviewDigitalCreativesCount
        } else {
          this.creativeOverviewDigitalCreativesOnScrollDisabled = false;
        }

        this.getCreatives2(this.creative_overview_campaigns.value?this.creative_overview_campaigns.value:'', this.creative_overview_channels.value?this.creative_overview_channels.value:'', false, this.creativeOverviewDigitalCreativesOffset, this.creativeOverviewDigitalCreativesLimit, true);
      });
    }

    // if(this.storageService.getFromStorage('mat-select-creative-overview-campaign') && this.storageService.getFromStorage('mat-select-creative-overview-channel')) {
    //   this.getCreatives(this.creative_overview_campaigns.value?this.creative_overview_campaigns.value:'', this.creative_overview_channels.value?this.creative_overview_channels.value:'', false);
    // }

    // Feature for converting JSON string to object array
    // let test = "[{'guideline_id': 'c6a4ccf9-9b45-4768-a489-3a19aed3dc96', 'guideline_name': 'Designed for Sound On', 'value': 1.0},{'guideline_id': '73833341-16ff-4a67-ab60-08af1307de10', 'guideline_name': '[Optional] Quick Shots', 'value': 0.0},{'guideline_id': '7950c621-14e9-4cc4-9f8e-e24103e0e091', 'guideline_name': '[Optional] Call to Action Button [In-Flight Only]', 'value': 0.0},{'guideline_id': '28eacd23-54fa-42e9-a4a7-469f7e637d82', 'guideline_name': '[Optional] Clear Concise Text', 'value': 1.0},{'guideline_id': 'f413d58a-645b-4fba-b862-0ece77a87d76', 'guideline_name': 'Brand - Present', 'value': 1.0},{'guideline_id': '0a51f528-60e5-4f8d-998e-22687ba7e7e2', 'guideline_name': 'Designed for Sound Off', 'value': 1.0},{'guideline_id': '1df2c196-84d7-4b34-b6c7-fcc4c1c69287', 'guideline_name': '[Optional] Highlight The Product', 'value': 1.0},{'guideline_id': 'c105243d-011a-4653-a32f-4e78ba5b4a4c', 'guideline_name': '[Optional] Close-Ups: Human Face', 'value': 0.0},{'guideline_id': '5a1901d3-6813-4d8a-b7b7-4077c48b9d6e', 'guideline_name': 'Tight Framing', 'value': 0.0},{'guideline_id': 'dbd54d88-ff7c-4c57-a66f-1a1b13f49d4b', 'guideline_name': '[Optional] Movement', 'value': 1.0},{'guideline_id': '872227bc-e3af-455b-9a8e-6d123aeb1f23', 'guideline_name': '[Optional] Brand - Audio Mention', 'value': 1.0},{'guideline_id': 'ba9f903d-cf7b-4e36-841d-a9f2ea9021a8', 'guideline_name': '[Optional] CTA - Text In Creative', 'value': 0.0},{'guideline_id': 'cf881c7f-f7d1-45fd-84db-b00f1ec7159a', 'guideline_name': '[Optional] CTA - Audio Mention', 'value': 1.0},{'guideline_id': '34ef17e0-f51e-4ed1-a6c6-b79bf0a57697', 'guideline_name': '[Optional] Branding From Second Zero', 'value': 1.0},{'guideline_id': '4b4d102e-fbea-49b9-ae18-7cc1cce468bd', 'guideline_name': 'Platform Aspect Ratio', 'value': 1.0},{'guideline_id': 'b427e796-fb87-439f-a7d4-7079eb487201', 'guideline_name': 'Quick Shots or Movement', 'value': 1.0}]"
    // let test = "[{'guideline_id': 'c6a4ccf9-9b45-4768-a489-3a19aed3dc96', 'guideline_name': 'Designed for Sound On', 'value': 1.0}, {'guideline_id': '73833341-16ff-4a67-ab60-08af1307de10', 'guideline_name': '[Optional] Quick Shots', 'value': 0.0}, {'guideline_id': '7950c621-14e9-4cc4-9f8e-e24103e0e091', 'guideline_name': '[Optional] Call to Action Button [In-Flight Only]', 'value': 1.0}, {'guideline_id': '28eacd23-54fa-42e9-a4a7-469f7e637d82', 'guideline_name': '[Optional] Clear Concise Text', 'value': 1.0}, {'guideline_id': 'f413d58a-645b-4fba-b862-0ece77a87d76', 'guideline_name': 'Brand - Present', 'value': 1.0}, {'guideline_id': '0a51f528-60e5-4f8d-998e-22687ba7e7e2', 'guideline_name': 'Designed for Sound Off', 'value': 1.0}, {'guideline_id': '1df2c196-84d7-4b34-b6c7-fcc4c1c69287', 'guideline_name': '[Optional] Highlight The Product', 'value': 1.0}, {'guideline_id': 'c105243d-011a-4653-a32f-4e78ba5b4a4c', 'guideline_name': '[Optional] Close-Ups: Human Face', 'value': 0.0}, {'guideline_id': '5a1901d3-6813-4d8a-b7b7-4077c48b9d6e', 'guideline_name': 'Tight Framing', 'value': 0.0}, {'guideline_id': 'dbd54d88-ff7c-4c57-a66f-1a1b13f49d4b', 'guideline_name': '[Optional] Movement', 'value': 1.0}, {'guideline_id': '872227bc-e3af-455b-9a8e-6d123aeb1f23', 'guideline_name': '[Optional] Brand - Audio Mention', 'value': 1.0}, {'guideline_id': 'ba9f903d-cf7b-4e36-841d-a9f2ea9021a8', 'guideline_name': '[Optional] CTA - Text In Creative', 'value': 0.0}, {'guideline_id': 'cf881c7f-f7d1-45fd-84db-b00f1ec7159a', 'guideline_name': '[Optional] CTA - Audio Mention', 'value': 1.0}, {'guideline_id': '34ef17e0-f51e-4ed1-a6c6-b79bf0a57697', 'guideline_name': '[Optional] Branding From Second Zero', 'value': 1.0}, {'guideline_id': '4b4d102e-fbea-49b9-ae18-7cc1cce468bd', 'guideline_name': 'Platform Aspect Ratio', 'value': 1.0}, {'guideline_id': 'b427e796-fb87-439f-a7d4-7079eb487201', 'guideline_name': 'Quick Shots or Movement', 'value': 1.0}, {'guideline_id': '56fba38a-492d-417e-ba0e-6066aed4302b', 'guideline_name': '[Optional] Tight Framing (Pack or Face at 30%)', 'value': 1.0}, {'guideline_id': 'b2e58488-4279-4707-bcaf-d12fd30c7099', 'guideline_name': ' [Optional] Tight Framing (New Definition at 30%)', 'value': 1.0}, {'guideline_id': '5eabbcaf-80e7-4f97-9ff0-064e73876e7c', 'guideline_name': '[Optional] Tight Framing (Pack or Person at 30%)', 'value': 1.0}]";
    // let test = "[{'guideline_id': 'c6a4ccf9-9b45-4768-a489-3a19aed3dc96', 'guideline_name': 'Designed for Sound On', 'value': 1.0}, {'guideline_id': '73833341-16ff-4a67-ab60-08af1307de10', 'guideline_name': '[Optional] Quick Shots', 'value': 0.0}, {'guideline_id': '7950c621-14e9-4cc4-9f8e-e24103e0e091', 'guideline_name': '[Optional] Call to Action Button [In-Flight Only]', 'value': 1.0}, {'guideline_id': '28eacd23-54fa-42e9-a4a7-469f7e637d82', 'guideline_name': '[Optional] Clear Concise Text', 'value': 1.0}, {'guideline_id': 'f413d58a-645b-4fba-b862-0ece77a87d76', 'guideline_name': 'Brand - Present', 'value': 1.0}, {'guideline_id': '0a51f528-60e5-4f8d-998e-22687ba7e7e2', 'guideline_name': 'Designed for Sound Off', 'value': 1.0}, {'guideline_id': '1df2c196-84d7-4b34-b6c7-fcc4c1c69287', 'guideline_name': '[Optional] Highlight The Product', 'value': 1.0}, {'guideline_id': 'c105243d-011a-4653-a32f-4e78ba5b4a4c', 'guideline_name': '[Optional] Close-Ups: Human Face', 'value': 0.0}, {'guideline_id': '5a1901d3-6813-4d8a-b7b7-4077c48b9d6e', 'guideline_name': 'Tight Framing', 'value': 0.0}, {'guideline_id': 'dbd54d88-ff7c-4c57-a66f-1a1b13f49d4b', 'guideline_name': '[Optional] Movement', 'value': 1.0}, {'guideline_id': '872227bc-e3af-455b-9a8e-6d123aeb1f23', 'guideline_name': '[Optional] Brand - Audio Mention', 'value': 1.0}, {'guideline_id': 'ba9f903d-cf7b-4e36-841d-a9f2ea9021a8', 'guideline_name': '[Optional] CTA - Text In Creative', 'value': 0.0}, {'guideline_id': 'cf881c7f-f7d1-45fd-84db-b00f1ec7159a', 'guideline_name': '[Optional] CTA - Audio Mention', 'value': 1.0}, {'guideline_id': '34ef17e0-f51e-4ed1-a6c6-b79bf0a57697', 'guideline_name': '[Optional] Branding From Second Zero', 'value': 1.0}, {'guideline_id': '4b4d102e-fbea-49b9-ae18-7cc1cce468bd', 'guideline_name': 'Platform Aspect Ratio', 'value': 1.0}, {'guideline_id': 'b427e796-fb87-439f-a7d4-7079eb487201', 'guideline_name': 'Quick Shots or Movement', 'value': 1.0}, {'guideline_id': '56fba38a-492d-417e-ba0e-6066aed4302b', 'guideline_name': '[Optional] Tight Framing (Pack or Face at 30%)', 'value': 1.0}, {'guideline_id': 'b2e58488-4279-4707-bcaf-d12fd30c7099', 'guideline_name': ' [Optional] Tight Framing (New Definition at 30%)', 'value': 1.0}, {'guideline_id': '5eabbcaf-80e7-4f97-9ff0-064e73876e7c', 'guideline_name': '[Optional] Tight Framing (Pack or Person at 30%)', 'value': 1.0}]";
    // let b = test.replace(/'/g, '"');
    // console.log(b);
    // console.log(JSON.parse(b));
    // let c = JSON.parse(b)

    // c.forEach((element: any) => {
    //   if(!element.guideline_name.includes("[Optional]"))
    //     console.log(element)
    // });
  }

  onChange(selected: MatSelectChange) {
    this.creativeOverviewDigitalCreativesCount = 0;
    this.creativeOverviewDigitalCreativesLimit = 6;
    this.creativeOverviewDigitalCreativesOffset = 0;

    if(selected.source.id == 'mat-select-creative-overview-campaign') {
      if(this.creative_overview_campaigns.value.length) {
        this.storageService.addToStorage('mat-select-creative-overview-campaign', selected.value);
        this.creative_overview_channels.enable();
        this.creative_overview_channels.setValue('');
        this.storageService.removeFromStorage('mat-select-creative-overview-channel');

        this.creativeOverviewDigitalCreativeScoreData = {
          creatives: []
        };

        this.getCampaignStartEndDates(selected.value);
        this.getCreativeOverviewChannelsByCampaign(selected.value);
      } else {
        this.storageService.removeFromStorage('mat-select-creative-overview-campaign');
        this.storageService.removeFromStorage('mat-select-creative-overview-channel');

        this.creative_overview_channels.disable();

        this.creative_overview_channels.setValue('');

        this.campaignDate = false;
        this.campaignStartDate = '';
        this.campaignEndDate = '';

        this.creativeOverviewDigitalCreativeScoreData = {
          creatives: []
        };
      }
    }

    if(selected.source.id == 'mat-select-creative-overview-channel') {
      if(this.creative_overview_channels.value != undefined) {
        this.storageService.addToStorage('mat-select-creative-overview-channel', selected.value);
      } else {
        this.storageService.removeFromStorage('mat-select-creative-overview-channel');

        this.campaignDate = false;
        this.campaignStartDate = '';
        this.campaignEndDate = '';

        this.creativeOverviewDigitalCreativeScoreData = {
          creatives: []
        };
      }

      this.infiniteScroll.nativeElement.scrollTop = 0;
    }

    if(this.creative_overview_campaigns.value && this.creative_overview_channels.value) {
      this.getCreativesCount(this.creative_overview_campaigns.value?this.creative_overview_campaigns.value:'', this.creative_overview_channels.value?this.creative_overview_channels.value:'', false).then(() => {
        if(this.creativeOverviewDigitalCreativesCount <= this.creativeOverviewDigitalCreativesLimit) {
          this.creativeOverviewDigitalCreativesOnScrollDisabled = true;
          this.creativeOverviewDigitalCreativesLimit = this.creativeOverviewDigitalCreativesCount
        } else {
          this.creativeOverviewDigitalCreativesOnScrollDisabled = false;
        }

        this.getCreatives2(this.creative_overview_campaigns.value?this.creative_overview_campaigns.value:'', this.creative_overview_channels.value?this.creative_overview_channels.value:'', false, this.creativeOverviewDigitalCreativesOffset, this.creativeOverviewDigitalCreativesLimit, true);
      });
    }

    // if(this.creative_overview_campaigns.value && this.creative_overview_channels.value) {
    //   this.getCreatives(this.creative_overview_campaigns.value?this.creative_overview_campaigns.value:'', this.creative_overview_channels.value?this.creative_overview_channels.value:'', false);
    // }
  }

  clearCreativeScoreStorage() {
    if(this.creative_overview_campaigns.value || this.creative_overview_channels.value) {
      this.creative_overview_campaigns.setValue('');
      this.creative_overview_channels.setValue('');

      this.storageService.removeFromStorage('mat-select-creative-overview-campaign');
      this.storageService.removeFromStorage('mat-select-creative-overview-channel');

      this.creative_overview_channels.disable();

      this.campaignDate = false;
      this.campaignStartDate = '';
      this.campaignEndDate = '';

      this.creativeOverviewDigitalCreativesCount = 0;
      this.creativeOverviewDigitalCreativesLimit = 6;
      this.creativeOverviewDigitalCreativesOffset = 0;
      this.creativeOverviewDigitalCreativesOnScrollDisabled = false;

      this.creativeOverviewDigitalCreativeScoreData = {
        creatives: []
      };
    } else {
      this.snackBar.open(`Filters are clear`, 'X', {
        horizontalPosition: spinner.horizontalPosition,
        verticalPosition: spinner.verticalPosition,
        duration: spinner.duration
      });
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

  getCreativeOverviewCampaigns() {
    this.appService.getCreativeOverviewCampaigns(this.brand).subscribe((response) => {
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

  getCreativeOverviewChannelsByCampaign(campaign: string) {
    this.channelList = [];
    this.channelListForSearch = [];

    this.appService.getCreativeOverviewChannelsByCampaign(this.brand, campaign).subscribe((response) => {
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

  getCreativesCount(campaign: string, channel: string, flag: boolean) {
    var promise = new Promise<void>((resolve, reject) => {
      if(!flag)
        channel = "'" + channel + "'";

      this.appService.getCreativesCount(this.brand, campaign, channel).subscribe((response) => {
        if(response.status == 200) {
          this.creativeOverviewDigitalCreativesCount = response.results[0].creativeCount;
          // console.log(this.creativeOverviewDigitalCreativesCount);
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

  getCreatives2(campaign: string, channel: string, flag: boolean, offset: number, limit: number, clear: boolean) {
    if(!flag)
      channel = "'" + channel + "'";

    this.appService.getCreatives2(this.brand, campaign, channel, offset, limit).subscribe((response) => {
      if(clear) {
        this.creativeOverviewDigitalCreativeScoreData = {
          creatives: []
        };
      }

      if(response.status == 200) {
        response.results[0].forEach((creative: any) => {
          let inViewTime = 0;
          let inViewRate = 0;

          let InViewTimeDisplay = 0;
          let InViewTimeVideo = 0;
          let InViewRateDisplay = 0;
          let InViewRateVideo = 0;

          if(creative.InViewImpressions) {
            InViewTimeDisplay = (creative.TotalExposureTime/creative.InViewImpressions)
          }

          if(creative.TwoSecInViewImpressions) {
            if(channel == "'Snapchat'" || channel == "'snapchat'") {
              InViewTimeVideo = (creative.TotalExposureTimeSec/creative.TwoSecInViewImpressions);
            } else {
              InViewTimeVideo = (creative.TotalExposureTime/creative.TwoSecInViewImpressions)
            }
          }

          if(creative.InViewMeasurableImpressions) {
            InViewRateDisplay = (creative.InViewImpressions/creative.InViewMeasurableImpressions)
          }

          if(creative.InViewMeasurableImpressions) {
            InViewRateVideo = (creative.TwoSecInViewImpressions/creative.InViewMeasurableImpressions)
          }

          if(creative.CreativeName.includes('Display') || creative.CreativeName.includes('display') || creative.CreativeName.includes('Video') || creative.CreativeName.includes('video')) {
            if(creative.CreativeName.includes('Display') || creative.CreativeName.includes('display')) {
              inViewTime = InViewTimeDisplay;
              inViewRate = InViewRateDisplay;
            }

            if(creative.CreativeName.includes('Video') || creative.CreativeName.includes('video')) {
              inViewTime = InViewTimeVideo
              inViewRate = InViewRateVideo
            }
          } else {
            if(InViewTimeDisplay > 0 && InViewTimeDisplay > InViewTimeVideo)
              inViewTime = InViewTimeDisplay;
            if(InViewTimeVideo > InViewTimeDisplay && InViewTimeVideo > 0)
              inViewTime = InViewTimeVideo

            if(InViewRateDisplay > 0 && InViewRateDisplay > InViewRateVideo)
              inViewRate = InViewRateDisplay;
            if(InViewRateVideo > InViewRateDisplay && InViewRateVideo > 0)
              inViewRate = InViewRateVideo
          }

          // console.log(creativeList.InViewTimeDisplay);
          // console.log(creativeList.InViewTimeVideo);
          // console.log(creativeList.InViewRateDisplay);
          // console.log(creativeList.InViewRateVideo);

          let spend = response.results[1].find((spend: any)=> spend.CreativeName == creative.CreativeName);

          let creativeArray = {
            name: creative.CreativeName,
            creativeScore: creative.creativeScore?(creative.creativeScore*100).toFixed(2):null,
            inViewTime: (inViewTime).toFixed(2),
            inViewRate: (inViewRate*100).toFixed(2),
            amountSpend: spend.amountSpend.toFixed(2),
            list: [] as any
          }

          this.appService.getCreativesList(this.brand, campaign, channel, creative.CreativeName).subscribe((list) => {
            if(list.status == 200) {
              list.results.forEach((creativeList: any) => {
                // let inViewTime = 0;
                // let inViewRate = 0;

                // let InViewTimeDisplay = 0;
                // let InViewTimeVideo = 0;
                // let InViewRateDisplay = 0;
                // let InViewRateVideo = 0;

                // if(creativeList.InViewImpressions) {
                //   InViewTimeDisplay = (creativeList.TotalExposureTime/creativeList.InViewImpressions)
                // }

                // if(creativeList.TwoSecInViewImpressions) {
                //   InViewTimeVideo = (creativeList.TotalExposureTime/creativeList.TwoSecInViewImpressions)
                // }

                // if(creativeList.InViewMeasurableImpressions) {
                //   InViewRateDisplay = (creativeList.InViewImpressions/creativeList.InViewMeasurableImpressions)
                // }

                // if(creativeList.InViewMeasurableImpressions) {
                //   InViewRateVideo = (creativeList.TwoSecInViewImpressions/creativeList.InViewMeasurableImpressions)
                // }

                // if(InViewTimeDisplay > 0 && InViewTimeDisplay > InViewTimeVideo)
                //   inViewTime = InViewTimeDisplay;
                // if(InViewTimeVideo > InViewTimeDisplay && InViewTimeVideo > 0)
                //   inViewTime = InViewTimeVideo

                // if(InViewRateDisplay > 0 && InViewRateDisplay > InViewRateVideo)
                //   inViewRate = InViewRateDisplay;
                // if(InViewRateVideo > InViewRateDisplay && InViewRateVideo > 0)
                //   inViewRate = InViewRateVideo

                // // console.log(creativeList.InViewTimeDisplay);
                // // console.log(creativeList.InViewTimeVideo);
                // // console.log(creativeList.InViewRateDisplay);
                // // console.log(creativeList.InViewRateVideo);

                let html = '<div class="d-flex justify-content-between"><span><b>NAME</b></span><span><b>STATUS</b></span></div>';

                if(creativeList.GuideLines) {
                  let guidelinesString = creativeList.GuideLines.replace(/'/g, '"');
                  let guidelinesArray = JSON.parse(guidelinesString);

                  guidelinesArray.forEach((element: any) => {
                    if(!element.guideline_name.includes("[Optional]")) {
                      if(element.value)
                        html += '<div class="d-flex justify-content-between border-top"><span>'+ element.guideline_name +'</span><span><img src="../../assets/images/checked-icon.png" style="width:12px;height:12px;" /></span></div>';
                      else
                        html += '<div class="d-flex justify-content-between border-top"><span>'+ element.guideline_name +'</span><span><img src="../../assets/images/remove-icon.png" style="width:12px;height:12px;" /></span></div>';
                    }
                  });
                } else {
                  html += '<div class="d-flex justify-content-between border-top"><span class="d-block w-100 text-center">No data</span></div>'
                }

                let creativeListArray = {
                  link: creativeList.CreativeLink,
                  assetType: creativeList.AssetType,
                  // creativeScore: creativeList.creativeScore?(creativeList.creativeScore*100).toFixed(0):null,
                  // inViewTime: (inViewTime).toFixed(2),
                  // inViewRate: (inViewRate*100).toFixed(0),
                  // amountSpend: creativeList.amountSpend.toFixed(2),
                  guidelines: html
                }

                creativeArray.list.push(creativeListArray);
              });
              // creativeArray.list.sort((a: any, b: any) => { return b.creativeScore - a.creativeScore });
            }
          });
          this.creativeOverviewDigitalCreativeScoreData.creatives.push(creativeArray);
        });
        this.creativeOverviewDigitalCreativeScoreData.creatives.sort((a: any, b: any) => { return b.creativeScore - a.creativeScore });
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

  onScrollDown(ev: any) {
    // console.log("scrolled down!!", ev);

    this.creativeOverviewDigitalCreativesOffset += 6;

    if(this.creativeOverviewDigitalCreativesOffset <= this.creativeOverviewDigitalCreativesCount) {
      if((this.creativeOverviewDigitalCreativesOffset + this.creativeOverviewDigitalCreativesLimit) > this.creativeOverviewDigitalCreativesCount) {
        this.creativeOverviewDigitalCreativesLimit = (this.creativeOverviewDigitalCreativesCount - this.creativeOverviewDigitalCreativesOffset);
      }
      this.getCreatives2(this.creative_overview_campaigns.value?this.creative_overview_campaigns.value:'', this.creative_overview_channels.value?this.creative_overview_channels.value:'', false, this.creativeOverviewDigitalCreativesOffset, this.creativeOverviewDigitalCreativesLimit, false);

      // console.log("count ",this.creativeOverviewDigitalCreativesCount);
      // console.log("limit ",this.creativeOverviewDigitalCreativesLimit);
      // console.log("offset ",this.creativeOverviewDigitalCreativesOffset);
    }

  }
}

@Component({
  selector: 'creative-overview-dialog-2',
  templateUrl: './creative-overview-dialog-image-2.html',
})
export class CreativeOverviewDialogImage2 {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}

@Component({
  selector: 'creative-overview-dialog-2',
  templateUrl: './creative-overview-dialog-video-2.html',
})
export class CreativeOverviewDialogVideo2 {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}

@Component({
  selector: 'creative-overview-dialog-guidelines-2',
  templateUrl: './creative-overview-dialog-guidelines-2.html',
})
export class CreativeOverviewDialogGuidelines2 {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogDataGuidelines) {}
}
