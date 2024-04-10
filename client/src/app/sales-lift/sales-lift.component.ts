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
  selector: 'app-sales-lift',
  templateUrl: './sales-lift.component.html',
  styleUrls: ['./sales-lift.component.css']
})
export class SalesLiftComponent implements OnInit {

  brand:any;

  campaignDate: boolean = false;
  campaignStartDate: string = '';
  campaignEndDate: string = '';

  chartIds: any[];

  sales_lift_campaign: String | null = '';

  campaignListForSearch: Dropwdowns[] = [];
  campaignList: Dropwdowns[] = [];

  sales_lift_campaigns = new FormControl();

  salesLiftSlClasses = ['widget-320'];

  salesLiftSlData = {
    chart: [] as any[],
    chartIds: [] as any[],
    chartPool: [] as any[],
    chartTitles: [
      'Audience',
      'Platform',
      'Placement',
      'New vs Existing Customers'
    ] as any[],
    roas: [{
        brandRoas: 0 as number,
        productRoas: 0 as number
      },
      {
        brandRoas: 0 as number,
        productRoas: 0 as number
      },
      {
        brandRoas: 0 as number,
        productRoas: 0 as number
      },
      {
        brandRoas: 0 as number,
        productRoas: 0 as number
      }
    ]
  }

  @ViewChild('campaign') matSelectCampaign: MatSelect;

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
      this.getSalesLiftCampaigns();
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

  ngOnInit(): void {
    if(this.storageService.getFromStorage('mat-select-sales-lift-campaign')) {
      this.sales_lift_campaign = this.storageService.getFromStorage('mat-select-sales-lift-campaign');
      // this.testData();
      this.sales_lift_campaigns.setValue(this.sales_lift_campaign?.split(','));
      let campaign: any = this.sales_lift_campaigns.value?this.sales_lift_campaigns.value:'';

      this.getCampaignStartEndDates(campaign);
      this.getSalesLiftSLData(campaign);
    } else {
      this.sales_lift_campaign = '';
    }
  }

  randomNumber() {
    return Math.floor(Math.random()*1000000);
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
    if(selected.source.id == 'mat-select-sales-lift-campaign') {
      if(this.sales_lift_campaigns.value.length) {
        this.storageService.addToStorage('mat-select-sales-lift-campaign', selected.value);

        let campaign: any = this.sales_lift_campaigns.value?this.sales_lift_campaigns.value:'';

        this.getCampaignStartEndDates(campaign);
        this.getSalesLiftSLData(campaign);
      } else {
        this.storageService.removeFromStorage('mat-select-sales-lift-campaign');

        this.campaignDate = false;
        this.campaignStartDate = '';
        this.campaignEndDate = '';

        this.salesLiftSlData = {
          chart: [],
          chartIds: [],
          chartPool: [],
          chartTitles: [
            'Audience',
            'Platform',
            'Placement',
            'New vs Existing Customers'
          ],
          roas: [{
              brandRoas: 0,
              productRoas: 0
            },
            {
              brandRoas: 0,
              productRoas: 0
            },
            {
              brandRoas: 0,
              productRoas: 0
            },
            {
              brandRoas: 0,
              productRoas: 0
            }
          ]
        };
      }
    }

  }

  clearSalesLiftStorage() {
    if(this.sales_lift_campaigns.value) {
      this.sales_lift_campaigns.setValue('');

      this.storageService.removeFromStorage('mat-select-sales-lift-campaign');

      this.campaignDate = false;
      this.campaignStartDate = '';
      this.campaignEndDate = '';

      this.salesLiftSlData = {
        chart: [],
        chartIds: [],
        chartPool: [],
        chartTitles: [
          'Audience',
          'Platform',
          'Placement',
          'New vs Existing Customers'
        ],
        roas: [{
            brandRoas: 0,
            productRoas: 0
          },
          {
            brandRoas: 0,
            productRoas: 0
          },
          {
            brandRoas: 0,
            productRoas: 0
          },
          {
            brandRoas: 0,
            productRoas: 0
          }
        ]
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

  getSalesLiftCampaigns() {
    this.appService.getSalesLiftCampaigns(this.brand).subscribe((response) => {
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

  getSalesLiftSLData(campaign: string) {
    this.appService.getSalesLiftSLData(this.brand, campaign).subscribe((response) => {
      if(response.status == 200) {
        // console.log(response);

        // reset data
        this.salesLiftSlData = {
          chart: [],
          chartIds: [],
          chartPool: [],
          chartTitles: [
            'Audience',
            'Platform',
            'Placement',
            'New vs Existing Customers'
          ],
          roas: [{
              brandRoas: 0,
              productRoas: 0
            },
            {
              brandRoas: 0,
              productRoas: 0
            },
            {
              brandRoas: 0,
              productRoas: 0
            },
            {
              brandRoas: 0,
              productRoas: 0
            }
          ]
        };

        let audienceBrandArray: any[] = [];
        let audienceProdArray: any[] = [];
        let platformBrandArray: any[] = [];
        let platformProdArray: any[] = [];
        let placementBrandArray: any[] = [];
        let placementProdArray: any[] = [];
        let newExistingBrandArray: any[] = [];
        let newExistingProdArray: any[] = [];

        if(response.results[0].length) {
          response.results[0].forEach((salesLift: any) => {
            let salesLiftBrandArray = {
              adTactic: salesLift.adTactic,
              Prod_ODC_SL: salesLift.Brand_ODC_SL.toFixed(4),
              color: salesLift.isSignificant=='True'?'#0079bc':'#b7e4fd'
            }

            let salesLiftProdArray = {
              adTactic: salesLift.adTactic,
              Prod_ODC_SL: salesLift.Prod_ODC_SL.toFixed(4),
              color: salesLift.isSignificant=='True'?'#0079bc':'#b7e4fd'
            }

            audienceBrandArray.push(salesLiftBrandArray)
            audienceProdArray.push(salesLiftProdArray)
          });

          if(audienceBrandArray.length && audienceProdArray.length) {
            audienceBrandArray.sort((a, b) => a.adTactic.localeCompare(b.adTactic));
            audienceProdArray.sort((a, b) => a.adTactic.localeCompare(b.adTactic));
            this.salesLiftSlData.chart.push([audienceBrandArray, audienceProdArray]);
          }

          if(audienceBrandArray.length && !audienceProdArray.length) {
            this.salesLiftSlData.chart.push([audienceBrandArray, []]);
          }

          if(!audienceBrandArray.length && audienceProdArray.length) {
            this.salesLiftSlData.chart.push([[], audienceProdArray]);
          }

        } else {
          this.salesLiftSlData.chart.push([[], []]);
        }

        let random1: number;
        let random2: number;
        do {
          random1 = this.randomNumber();
        } while(this.salesLiftSlData.chartPool.includes(random1));
        do {
          random2 = this.randomNumber();
        } while(this.salesLiftSlData.chartPool.includes(random2));
        this.salesLiftSlData.chartIds.push([random1, random2]);
        this.salesLiftSlData.chartPool.push(random1);
        this.salesLiftSlData.chartPool.push(random2);

        // console.log(audienceBrandArray);
        // console.log(audienceProdArray);

        if(response.results[1].length) {
          response.results[1].forEach((salesLift: any) => {
            let salesLiftBrandArray = {
              adTactic: salesLift.adTactic,
              Prod_ODC_SL: salesLift.Brand_ODC_SL.toFixed(4),
              color: salesLift.isSignificant=='True'?'#0079bc':'#b7e4fd'
            }

            let salesLiftProdArray = {
              adTactic: salesLift.adTactic,
              Prod_ODC_SL: salesLift.Prod_ODC_SL.toFixed(4),
              color: salesLift.isSignificant=='True'?'#0079bc':'#b7e4fd'
            }

            platformBrandArray.push(salesLiftBrandArray)
            platformProdArray.push(salesLiftProdArray)
          });

          if(platformBrandArray.length && platformProdArray.length) {
            platformBrandArray.sort((a, b) => a.adTactic.localeCompare(b.adTactic));
            platformProdArray.sort((a, b) => a.adTactic.localeCompare(b.adTactic));
            this.salesLiftSlData.chart.push([platformBrandArray, platformProdArray]);
          }

          if(platformBrandArray.length && !platformProdArray.length) {
            this.salesLiftSlData.chart.push([platformBrandArray, []]);
          }

          if(!platformBrandArray.length && platformProdArray.length) {
            this.salesLiftSlData.chart.push([[], platformProdArray]);
          }
        } else {
          this.salesLiftSlData.chart.push([[], []]);
        }

        do {
          random1 = this.randomNumber();
        } while(this.salesLiftSlData.chartPool.includes(random1));
        do {
          random2 = this.randomNumber();
        } while(this.salesLiftSlData.chartPool.includes(random2));
        this.salesLiftSlData.chartIds.push([random1, random2]);
        this.salesLiftSlData.chartPool.push(random1);
        this.salesLiftSlData.chartPool.push(random2);

        // console.log(platformBrandArray);
        // console.log(platformProdArray);

        if(response.results[2].length) {
          response.results[2].forEach((salesLift: any) => {
            let salesLiftBrandArray = {
              adTactic: salesLift.adTactic,
              Prod_ODC_SL: salesLift.Brand_ODC_SL.toFixed(4),
              color: salesLift.isSignificant=='True'?'#0079bc':'#b7e4fd'
            }

            let salesLiftProdArray = {
              adTactic: salesLift.adTactic,
              Prod_ODC_SL: salesLift.Prod_ODC_SL.toFixed(4),
              color: salesLift.isSignificant=='True'?'#0079bc':'#b7e4fd'
            }

            placementBrandArray.push(salesLiftBrandArray)
            placementProdArray.push(salesLiftProdArray)
          });

          if(placementBrandArray.length && placementProdArray.length) {
            placementBrandArray.sort((a, b) => a.adTactic.localeCompare(b.adTactic));
            placementProdArray.sort((a, b) => a.adTactic.localeCompare(b.adTactic));
            this.salesLiftSlData.chart.push([placementBrandArray, placementProdArray]);
          }

          if(placementBrandArray.length && !placementProdArray.length) {
            this.salesLiftSlData.chart.push([placementBrandArray, []]);
          }

          if(!placementBrandArray.length && placementProdArray.length) {
            this.salesLiftSlData.chart.push([[], placementProdArray]);
          }
        } else {
          this.salesLiftSlData.chart.push([[], []]);
        }

        do {
          random1 = this.randomNumber();
        } while(this.salesLiftSlData.chartPool.includes(random1));
        do {
          random2 = this.randomNumber();
        } while(this.salesLiftSlData.chartPool.includes(random2));
        this.salesLiftSlData.chartIds.push([random1, random2]);
        this.salesLiftSlData.chartPool.push(random1);
        this.salesLiftSlData.chartPool.push(random2);

        // console.log(placementBrandArray);
        // console.log(placementProdArray);

        if(response.results[3].length) {
          response.results[3].forEach((salesLift: any) => {
            let salesLiftBrandArray = {
              adTactic: salesLift.adTactic,
              Prod_ODC_SL: salesLift.Brand_ODC_SL.toFixed(4),
              color: salesLift.isSignificant=='True'?'#0079bc':'#b7e4fd'
            }

            let salesLiftProdArray = {
              adTactic: salesLift.adTactic,
              Prod_ODC_SL: salesLift.Prod_ODC_SL.toFixed(4),
              color: salesLift.isSignificant=='True'?'#0079bc':'#b7e4fd'
            }

            newExistingBrandArray.push(salesLiftBrandArray)
            newExistingProdArray.push(salesLiftProdArray)
          });

          if(newExistingBrandArray.length && newExistingProdArray.length) {
            newExistingBrandArray.sort((a, b) => a.adTactic.localeCompare(b.adTactic));
            newExistingProdArray.sort((a, b) => a.adTactic.localeCompare(b.adTactic));
            this.salesLiftSlData.chart.push([newExistingBrandArray, newExistingProdArray]);
          }

          if(newExistingBrandArray.length && !newExistingProdArray.length) {
            this.salesLiftSlData.chart.push([newExistingBrandArray, []]);
          }

          if(!newExistingBrandArray.length && newExistingProdArray.length) {
            this.salesLiftSlData.chart.push([[], newExistingProdArray]);
          }
        } else {
          this.salesLiftSlData.chart.push([[], []]);
        }

        // Audience ROAS
        if(response.results[4].length) {
          this.salesLiftSlData.roas[0].brandRoas = response.results[4][0].SL_ROAS.toFixed(3);
        }

        if(response.results[5].length) {
          this.salesLiftSlData.roas[0].productRoas = response.results[5][0].SL_ROAS.toFixed(3);
        }

        // Platform ROAS
        if(response.results[6].length) {
          this.salesLiftSlData.roas[1].productRoas = response.results[6][0].SL_ROAS.toFixed(3);
        }

        if(response.results[7].length) {
          this.salesLiftSlData.roas[1].productRoas = response.results[7][0].SL_ROAS.toFixed(3);
        }

        // Placement ROAS
        if(response.results[8].length) {
          this.salesLiftSlData.roas[2].productRoas = response.results[8][0].SL_ROAS.toFixed(3);
        }

        if(response.results[9].length) {
          this.salesLiftSlData.roas[2].productRoas = response.results[9][0].SL_ROAS.toFixed(3);
        }

        // New/Existing ROAS
        if(response.results[10].length) {
          this.salesLiftSlData.roas[3].productRoas = response.results[10][0].SL_ROAS.toFixed(3);
        }

        if(response.results[11].length) {
          this.salesLiftSlData.roas[3].productRoas = response.results[11][0].SL_ROAS.toFixed(3);
        }

        do {
          random1 = this.randomNumber();
        } while(this.salesLiftSlData.chartPool.includes(random1));
        do {
          random2 = this.randomNumber();
        } while(this.salesLiftSlData.chartPool.includes(random2));
        this.salesLiftSlData.chartIds.push([random1, random2]);
        this.salesLiftSlData.chartPool.push(random1);
        this.salesLiftSlData.chartPool.push(random2);
        // console.log(newExistingBrandArray);
        // console.log(newExistingProdArray);
      }
      // console.log(this.salesLiftSlData);
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
