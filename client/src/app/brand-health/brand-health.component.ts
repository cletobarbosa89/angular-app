import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectChange, MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectionList } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';

import { StorageService } from '../storage.service';
import { AppService } from '../app.service';

import { spinner } from '../spinner-config';

export interface Dropwdowns {
  value: string,
  text: string
}

@Component({
  selector: 'app-brand-health',
  templateUrl: './brand-health.component.html',
  styleUrls: ['./brand-health.component.css']
})
export class BrandHealthComponent implements OnInit {

  brand:any;

  campaignDate: boolean = false;
  campaignStartDate: string = '';
  campaignEndDate: string = '';

  chartIds: any[];

  selectedOptions: any[];

  comscoreResultList = [] as any[];
  comscoreResult: FormControl;
  comscoreResultSelected = [] as any[];

  comscoreResultsTypes = [
    {
      type: "competitorsData",
      display: "Competitor Results"
    },
    {
      type: "creativesStrategyData",
      display: "Digital Creative Strategy Results"
    },
    {
      type: "overallLiftData",
      display: "Overall Results"
    },
    {
      type: "placementsData",
      display: "Placement Results"
    },
    {
      type: "platformsData",
      display: "Platform Results"
    },
    {
      type: "targetsData",
      display: "Target Results"
    },
    {
      type: "tvInscapeCreativeStrategyData",
      display: "TV Creative Strategy Results"
    },
    {
      type: "tvNetworksData",
      display: "TV Network Results"
    },
  ]

  brand_health_campaign: String | null = '';

  brandHealthOverallSnapshotClasses = ['widget-320'];
  brandHealthPurchaseIntentClasses = ['widget-320'];
  brandHealthFacebookBrandLiftClasses = ['widget-298'];
  brandHealthYoutubeBrandLiftClasses = ['widget-298'];

  campaignListForSearch: Dropwdowns[] = [];
  campaignList: Dropwdowns[] = [];

  brand_health_campaigns = new FormControl();

  brandHealthOverallSnapshotData = {
    chart: [] as any[],
    chartIds: [] as any[]
  }

  brandHealthPurchaseIntentByDigitalCreativesData = {
    chart: [] as any[],
    chartIds: [] as any[]
  }

  brandHealthPurchaseIntentByTvCreativesData = {
    chart: [] as any[],
    chartIds: [] as any[]
  }

  brandHealthCellNameList = [] as any[];

  brandHealthFacebookBrandLiftData = {
    chart: [] as any[],
    chartIds: [] as any[],
    cellNames: [] as any[]
  };

  brandHealthYoutubeBrandLiftData = {
    chart: [] as any[],
    chartIds: [] as any[]
  };

  @ViewChild('campaign') matSelectCampaign: MatSelect;
  @ViewChild('comscoreResultSelected') matSelectcomscoreResultSelected: MatSelectionList;

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
      this.getBrandHealthCampaigns();
    }
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
  }

  randomNumber() {
    return Math.floor(Math.random()*1000000);
  }

  compare(c1: {value: string}, c2: {value: string}) {
    return c1 && c2 && c1.value === c2.value;
  }

  ngOnInit(): void {
    if(this.storageService.getFromStorage('mat-select-brand-health-campaign')) {
      this.comscoreResultList = [];
      this.brand_health_campaign = this.storageService.getFromStorage('mat-select-brand-health-campaign');
      // this.storageService.removeFromStorage('mat-select-brand-health-comscore-result');

      this.brand_health_campaigns.setValue(this.brand_health_campaign?.split(','));
      // this.testData();

      let campaign: any = this.brand_health_campaigns.value?this.brand_health_campaigns.value:'';
      let comscoreResult: any = this.comscoreResult?this.comscoreResult:'';
      let comscoreResult_new: any = this.storageService.getFromStorage('mat-select-brand-health-comscore-result');
      if(!comscoreResult_new) {
        comscoreResult_new = '';
      }

      this.getCampaignStartEndDates(campaign);
      this.getBrandHealthComscoreResults(campaign);
      this.getBrandHealthOverallSnapshot(campaign, comscoreResult_new);
      this.getBrandHealthPurchaseIntent(campaign, 'Purchase Intent (Top-2 Box)', 'creativesStrategyData', true);
      this.getBrandHealthPurchaseIntent(campaign, 'Purchase Intent (Top-2 Box)', 'tvInscapeCreativeStrategyData', true);

      this.getBrandHealthGetCellNames(campaign).then(() => {
        if(this.brandHealthCellNameList.length) {
          this.brandHealthCellNameList.forEach((item) => {
            this.getBrandHealthFacebookBrandLiftByCellName(campaign, item);
          });

          // console.log(this.brandHealthFacebookBrandLiftData);
          // console.log(this.brandHealthYoutubeBrandLiftData);
        }
      });
      this.getBrandHealthYouTubeBrandLift(campaign);
    } else
      this.brand_health_campaign = '';

      this.brand_health_campaigns.setValue(this.brand_health_campaign?.split(','));

      if(this.storageService.getFromStorage('mat-select-brand-health-comscore-result')) {
        this.getSelectedOptions(this.storageService.getFromStorage('mat-select-brand-health-comscore-result'))
      }

      this.comscoreResult = new FormControl(this.comscoreResultSelected);
      setTimeout(() => {
        setTimeout(() => {
          this.comscoreResult.setValue(this.comscoreResult.value);
        })
      }, 0);
  }

  getSelectedOptions(result: any) {
    let data = result.split(",");
    data.forEach((item:any) => {
      let option = {
        text: item,
        value: item
      }
      this.comscoreResultSelected.push(option);
    });
  }

  // test function
  getRandomIds(brandHealth: any) {
    let random: number;
    do {
      random = this.randomNumber();
    } while(this.chartIds.includes(random));

    this.chartIds.push(random);
    brandHealth.chartIds.push(random);
  }

  onChange(selected: MatSelectChange) {
    if(selected.source.id == 'mat-select-brand-health-campaign') {
      if(this.brand_health_campaigns.value.length) {
        this.brandHealthCellNameList = [];
        this.brandHealthFacebookBrandLiftData = {
          chart: [],
          chartIds: [],
          cellNames: []
        };

        this.brandHealthYoutubeBrandLiftData = {
          chart: [],
          chartIds: []
        };
        this.comscoreResult.setValue('');
        this.comscoreResultList = []
        this.storageService.addToStorage('mat-select-brand-health-campaign', selected.value);
        this.storageService.removeFromStorage('mat-select-brand-health-comscore-result');
        // this.testData();

        let campaign: any = this.brand_health_campaigns.value?this.brand_health_campaigns.value:'';
        let comscoreResult: any = this.comscoreResult.value?this.comscoreResult.value:'';

        this.getCampaignStartEndDates(campaign);
        this.getBrandHealthComscoreResults(campaign);
        this.getBrandHealthOverallSnapshot(campaign, comscoreResult);
        this.getBrandHealthPurchaseIntent(campaign, 'Purchase Intent (Top-2 Box)', 'creativesStrategyData', true);
        this.getBrandHealthPurchaseIntent(campaign, 'Purchase Intent (Top-2 Box)', 'tvInscapeCreativeStrategyData', true);

        this.getBrandHealthGetCellNames(campaign).then(() => {
          if(this.brandHealthCellNameList.length) {
            this.brandHealthCellNameList.forEach((item) => {
              this.getBrandHealthFacebookBrandLiftByCellName(campaign, item);
            });

            // console.log(this.brandHealthFacebookBrandLiftData);
            // console.log(this.brandHealthYoutubeBrandLiftData);
          }
        });
        this.getBrandHealthYouTubeBrandLift(campaign);

        this.comscoreResult = new FormControl(this.comscoreResultSelected);
        setTimeout(() => {
          setTimeout(() => {
            this.comscoreResult.setValue('');
          })
        }, 0);
      } else {
        this.comscoreResult.setValue('');
        this.comscoreResultList = []

        this.storageService.removeFromStorage('mat-select-brand-health-campaign');
        this.storageService.removeFromStorage('mat-select-brand-health-comscore-result');

        this.campaignDate = false;
      this.campaignStartDate = '';
      this.campaignEndDate = '';

      this.brandHealthOverallSnapshotData = {
        chart: [],
        chartIds: []
      }

      this.brandHealthPurchaseIntentByDigitalCreativesData = {
        chart: [],
        chartIds: []
      }

      this.brandHealthPurchaseIntentByTvCreativesData = {
        chart: [],
        chartIds: []
      }

      this.brandHealthFacebookBrandLiftData = {
        chart: [],
        chartIds: [],
        cellNames: []
      };

      this.brandHealthYoutubeBrandLiftData = {
        chart: [],
        chartIds: []
      };
      }
    }
  }

  onSelectionChange(event: any) {
    let result = [] as any[];

    this.matSelectcomscoreResultSelected.selectedOptions.selected.forEach(item => {
      result.push(item.value.value);
      let campaign: any = this.brand_health_campaigns.value?this.brand_health_campaigns.value:'';
      this.getBrandHealthOverallSnapshot(campaign, item.value.value);
    })

    if(result.length) {
      this.storageService.addToStorage('mat-select-brand-health-comscore-result', result.join(','));
    } else {
      this.storageService.removeFromStorage('mat-select-brand-health-comscore-result');
    }
  }

  clearBrandHealthStorage() {
    if(this.brand_health_campaigns.value || this.comscoreResult.value) {
      this.brand_health_campaigns.setValue('');
      this.comscoreResult.setValue('');

      this.comscoreResultList = []

      this.storageService.removeFromStorage('mat-select-brand-health-campaign');
      this.storageService.removeFromStorage('mat-select-brand-health-comscore-result');

      this.campaignDate = false;
      this.campaignStartDate = '';
      this.campaignEndDate = '';

      this.brandHealthOverallSnapshotData = {
        chart: [],
        chartIds: []
      }

      this.brandHealthPurchaseIntentByDigitalCreativesData = {
        chart: [],
        chartIds: []
      }

      this.brandHealthPurchaseIntentByTvCreativesData = {
        chart: [],
        chartIds: []
      }

      this.brandHealthFacebookBrandLiftData = {
        chart: [],
        chartIds: [],
        cellNames: []
      };

      this.brandHealthYoutubeBrandLiftData = {
        chart: [],
        chartIds: []
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

  getBrandHealthCampaigns() {
    this.appService.getBrandHealthCampaigns(this.brand).subscribe((response) => {
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

  getBrandHealthComscoreResults(campaign: string) {
    this.appService.getBrandHealthComscoreResults(this.brand, campaign).subscribe((response) => {
      if(response.status == 200) {
        response.results.forEach((type: any) => {
          // console.log(campaign);
          let typeArray = {};

          this.comscoreResultsTypes.forEach((store) => {
            if(store.type == type.type && type.type != '')
              typeArray = {
                value: type.type,
                text: store.display
              }
          });

          if(Object.keys(typeArray).length)
            this.comscoreResultList.push(typeArray);
        });

        this.comscoreResultList.sort((a, b) => a.value.localeCompare(b.value));
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

  getBrandHealthOverallSnapshot(campaign: string, type: string) {
    this.appService.getBrandHealthOverallSnapshot(this.brand, campaign, type).subscribe((response) => {
      if(response.status == 200) {
        let overallSnapshotArrays = [] as any;

        this.brandHealthOverallSnapshotData = {
          chart: [],
          chartIds: []
        }

        response.results.forEach((overallSnapshot: any) => {
          // console.log(overallSnapshot);
          let overallSnapshotArray = {
            category: overallSnapshot.category,
            totalControlComplete: overallSnapshot.totalControlComplete.toFixed(2),
            totalTestComplete: overallSnapshot.totalTestComplete.toFixed(2),
            pointLift: overallSnapshot.pointLift.toFixed(2),
            color: overallSnapshot.isSignificant?'#0079bc':'#b7e4fd'
          }
          overallSnapshotArrays.push(overallSnapshotArray)
        });

        this.brandHealthOverallSnapshotData.chart.push(overallSnapshotArrays);

          let random: number;
          do {
            random = this.randomNumber();
          } while(this.brandHealthOverallSnapshotData.chartIds.includes(random));
          this.brandHealthOverallSnapshotData.chartIds.push(random);
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

  getBrandHealthPurchaseIntent(campaign: string, category: string, type: string, flag: boolean) {
    if(flag && type == 'creativesStrategyData') {
      this.appService.getBrandHealthPurchaseIntent(this.brand, campaign, category, type).subscribe((response) => {
        if(response.status == 200) {
          let purchaseIntentArrays = [] as any;

          this.brandHealthPurchaseIntentByDigitalCreativesData = {
            chart: [],
            chartIds: []
          }

          response.results.forEach((purchaseIntent: any) => {
            let purchaseIntentArray = {
              name: purchaseIntent.name,
              pointLift: purchaseIntent.pointLift,
              color: purchaseIntent.isSignificant==1?'#0079bc':'#b7e4fd'
            }
            purchaseIntentArrays.push(purchaseIntentArray)
          });

          this.brandHealthPurchaseIntentByDigitalCreativesData.chart.push(purchaseIntentArrays);

          let random: number;
          do {
            random = this.randomNumber();
          } while(this.brandHealthPurchaseIntentByDigitalCreativesData.chartIds.includes(random));
          this.brandHealthPurchaseIntentByDigitalCreativesData.chartIds.push(random);

          // console.log(this.brandHealthPurchaseIntentByDigitalCreativesData);
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

    if(flag && type == 'tvInscapeCreativeStrategyData') {
      this.appService.getBrandHealthPurchaseIntent(this.brand, campaign, category, type).subscribe((response) => {
        if(response.status == 200) {
          let purchaseIntentArrays = [] as any;

          this.brandHealthPurchaseIntentByTvCreativesData = {
            chart: [],
            chartIds: []
          }

          response.results.forEach((purchaseIntent: any) => {
            let purchaseIntentArray = {
              name: purchaseIntent.name,
              pointLift: purchaseIntent.pointLift,
              color: purchaseIntent.isSignificant==1?'#0079bc':'#b7e4fd'
            }
            purchaseIntentArrays.push(purchaseIntentArray)
          });

          this.brandHealthPurchaseIntentByTvCreativesData.chart.push(purchaseIntentArrays);

          let random: number;
          do {
            random = this.randomNumber();
          } while(this.brandHealthPurchaseIntentByTvCreativesData.chartIds.includes(random));
          this.brandHealthPurchaseIntentByTvCreativesData.chartIds.push(random);

          // console.log(this.brandHealthPurchaseIntentByTvCreativesData);
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

  getBrandHealthGetCellNames(campaign: string) {
    var promise = new Promise<void>((resolve, reject) => {
      this.appService.getBrandHealthGetCellNames(this.brand, campaign).subscribe((response) => {
        if(response.status == 200) {

          this.brandHealthFacebookBrandLiftData = {
            chart: [],
            chartIds: [],
            cellNames: []
          };

          response.results.forEach((cellNames: any) => {
            this.brandHealthCellNameList.push(cellNames.CellName);
          });

          this.brandHealthCellNameList.sort((a, b) => a.localeCompare(b));
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

  getBrandHealthFacebookBrandLiftByCellName(campaign: string, cellName: string) {
    this.appService.getBrandHealthFacebookBrandLiftByCellName(this.brand, campaign, cellName).subscribe((response) => {
      if(response.status == 200) {
        let cellNameArray = [] as any[];

        response.results.forEach((facebookBL: any) => {
          // console.log(facebookBL);
          let facebookArray: any;

          if(facebookBL.QuestionType) {
            facebookArray = {
              type: facebookBL.QuestionType,
              BL: facebookBL.FB_BL,
              color: facebookBL.isSignificant==1?'#0079bc':'#b7e4fd'
            };

            cellNameArray.push(facebookArray);
          }
        });
        cellNameArray.sort((a, b) => {return a.BL - b.BL});
        this.brandHealthFacebookBrandLiftData.chart.push(cellNameArray);
        if(response.results.length) {
          this.brandHealthFacebookBrandLiftData.cellNames.push(cellName);
        }

        let random: number;
        do {
          random = this.randomNumber();
        } while(this.brandHealthFacebookBrandLiftData.chartIds.includes(random));
        this.brandHealthFacebookBrandLiftData.chartIds.push(random);
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

  getBrandHealthYouTubeBrandLift(campaign: string) {
    this.appService.getBrandHealthYouTubeBrandLift(this.brand, campaign).subscribe((response) => {
      if(response.status == 200) {
        let targetingArray = [] as any[];

        response.results[0].forEach((youtubeBL: any) => {
          // console.log(facebookBL);
          let youtubeArray: any;

          if(youtubeBL.Targeting) {
            youtubeArray = {
              type: youtubeBL.Targeting,
              BL: youtubeBL.YT_BL,
              color: youtubeBL.isSignificant==1?'#0079bc':'#b7e4fd'
            };

            targetingArray.push(youtubeArray);
          }
        });
        targetingArray.sort((a, b) => {return a.BL - b.BL});
        this.brandHealthYoutubeBrandLiftData.chart.push(targetingArray);

        let adgroupArray = [] as any[];

        response.results[1].forEach((youtubeBL: any) => {
          // console.log(facebookBL);
          let youtubeArray: any;

          if(youtubeBL.AdGroup) {
            youtubeArray = {
              type: youtubeBL.AdGroup,
              BL: youtubeBL.YT_BL,
              color: youtubeBL.isSignificant==1?'#0079bc':'#b7e4fd'
            };

            adgroupArray.push(youtubeArray);
          }
        });
        adgroupArray.sort((a, b) => {return a.BL - b.BL});
        this.brandHealthYoutubeBrandLiftData.chart.push(adgroupArray);

        let random: number;
        do {
          random = this.randomNumber();
        } while(this.brandHealthYoutubeBrandLiftData.chartIds.includes(random));
        this.brandHealthYoutubeBrandLiftData.chartIds.push(random);
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
