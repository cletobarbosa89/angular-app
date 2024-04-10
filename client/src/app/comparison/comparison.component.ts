import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectChange, MatSelect } from '@angular/material/select';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { StorageService } from '../storage.service';
import { AppService } from '../app.service';

import { spinner } from '../spinner-config';

export interface Dropwdowns {
  value: string,
  text: string
}

const cpmCalc = (spend: number, impression: number) => { return (spend&&impression)?(spend/impression)*1000:0 }

const cpvmCalc = (spend: number, InViewImp: number, TwoSecInViewImp: number) => {
  if((InViewImp+TwoSecInViewImp) == 0) {
    return 0;
  } else {
    return (1000*spend/(InViewImp+TwoSecInViewImp));
  }
}

const inViewRateCalc = (InViewImp: number, InViewMeasurableImpressions: number) => {
  if(InViewMeasurableImpressions == 0) {
    return 0;
  } else {
    return (InViewImp/InViewMeasurableImpressions);
  }
}

const video2SecinViewRateCalc = (TwoSecInViewImp: number, InViewMeasurableImpressions: number) => {
  if(InViewMeasurableImpressions == 0) {
    return 0;
  } else {
    return (TwoSecInViewImp/InViewMeasurableImpressions);
  }
}

const inViewTimeDisplayCalc = (TotExposureTime: number, InViewImp: number) => {
  if(InViewImp == 0) {
    return 0;
  } else {
    return (TotExposureTime/InViewImp);
  }
}

const inViewTimeVideoCalc = (TotExposureTime: number, TwoSecInViewImp: number) => {
  if(TwoSecInViewImp == 0) {
    return 0;
  } else {
    return (TotExposureTime/TwoSecInViewImp);
  }
}

const percentageDifference = (value1: number, value2: number) => {
  let abs = Math.abs(value1 - value2);
  let avg = (value1 + value2)/2;

  return (abs/avg)*100;
}
@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.css']
})
export class ComparisonComponent implements OnInit {

  brand:any;

  campaignDate1: boolean = false;
  campaignStartDate1: string = '';
  campaignEndDate1: string = '';

  campaignDate2: boolean = false;
  campaignStartDate2: string = '';
  campaignEndDate2: string = '';

  chartIds: any[];

  comparison_campaign_1: String | null = '';
  comparison_campaign_2: String | null = '';
  comparison_targeting_1: String | null = '';
  comparison_targeting_2: String | null = '';
  comparison_audience_1: String | null = '';
  comparison_audience_2: String | null = '';
  comparison_metric: String | null = '';

  campaign1ListForSearch: Dropwdowns[] = [];
  campaign1List: Dropwdowns[] = [];
  targeting1ListForSearch: Dropwdowns[] = [];
  targeting1List: Dropwdowns[] = [];
  audience1ListForSearch: Dropwdowns[] = [];
  audience1List: Dropwdowns[] = [];
  campaign2ListForSearch: Dropwdowns[] = [];
  campaign2List: Dropwdowns[] = [];
  targeting2ListForSearch: Dropwdowns[] = [];
  targeting2List: Dropwdowns[] = [];
  audience2ListForSearch: Dropwdowns[] = [];
  audience2List: Dropwdowns[] = [];

  metricList: Dropwdowns[] = [{
    value: 'CPM',
    text: 'CPM',
  }, {
    value: 'CPVM',
    text: 'CPVM',
  }, {
    value: 'In-View Rate',
    text: 'In-View Rate',
  }, {
    value: '2 Sec Video In-View Rate',
    text: '2 Sec Video In-View Rate',
  }, {
    value: 'In-View Time (Display)',
    text: 'In-View Time (Display)',
  }, {
    value: 'In-View Time (Video)',
    text: 'In-View Time (Video)',
  // }, {
  //   value: 'BL',
  //   text: 'BL',
  // }, {
  //   value: 'SL',
  //   text: 'SL',
  }];

  comparison_campaigns_1 = new FormControl();
  comparison_targetings_1 = new FormControl();
  comparison_audiences_1 = new FormControl();
  comparison_campaigns_2 = new FormControl();
  comparison_targetings_2 = new FormControl();
  comparison_audiences_2 = new FormControl();
  comparison_metrics = new FormControl();

  comparisonClasses = ['widget-180'];

  comparisonCampaign1ImpressionsData = {
    value: 0 as number,
    chart: [] as any
  };

  comparisonCampaign1SpendData = {
    value: 0 as number,
    chart: [] as any
  };

  comparisonCampaign1MetricData = {
    type: '' as string,
    value: 0 as number,
    chart: [] as any
  };

  comparisonCampaign1MetricDataBL = {
    type: '' as string,
    comscoreChart: [] as any,
    facebookChart: [] as any,
    youTubeChart: [] as any
  };

  comparisonCampaign1MetricDataSL = {
    type: '' as string,
    brandChart: [] as any,
    prodChart: [] as any
  };

  comparisonCampaign2ImpressionsData = {
    value: 0 as number,
    chart: [] as any
  };

  comparisonCampaign2SpendData = {
    value: 0 as number,
    chart: [] as any
  };

  comparisonCampaign2MetricData = {
    type: '' as string,
    value: 0 as number,
    chart: [] as any
  };

  comparisonCampaign2MetricDataBL = {
    type: '' as string,
    comscoreChart: [] as any,
    facebookChart: [] as any,
    youTubeChart: [] as any
  };

  comparisonCampaign2MetricDataSL = {
    type: '' as string,
    brandChart: [] as any,
    prodChart: [] as any
  };

  comparisonDifferenceImpressionsData = {
    value: 0 as number,
    chart: [] as any,
    percentageDifference: 0 as number
  };

  comparisonDifferenceSpendData = {
    value: 0 as number,
    chart: [] as any,
    percentageDifference: 0 as number
  };

  comparisonDifferenceMetricData = {
    type: '' as string,
    value: 0 as number,
    chart: [] as any,
    percentageDifference: 0 as number
  };

  @ViewChild('campaign1') matSelectCampaign1: MatSelect;
  @ViewChild('targeting1') matSelectTargeting1: MatSelect;
  @ViewChild('audience1') matSelectAudience1: MatSelect;

  @ViewChild('campaign2') matSelectCampaign2: MatSelect;
  @ViewChild('targeting2') matSelectTargeting2: MatSelect;
  @ViewChild('audience2') matSelectAudience2: MatSelect;

  @ViewChild('metric') matSelectMetric: MatSelect;

  constructor(
    private storageService: StorageService,
    private appService: AppService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.chartIds = [];

    this.brand = this.route.snapshot.paramMap.get('brand');
    if(this.brand) {
      this.getComparisonCampaigns();
    }

    this.comparison_targetings_1.disable();
    this.comparison_audiences_1.disable();
    this.comparison_targetings_2.disable();
    this.comparison_audiences_2.disable();
    this.comparison_metrics.disable();
  }

  ngAfterViewInit() {
    this.matSelectCampaign1.openedChange.subscribe(opened => {
      if (opened) {
        this.matSelectCampaign1.panel.nativeElement.addEventListener('mouseleave', () => {
          this.matSelectCampaign1.close();
          this.campaign1List = this.campaign1ListForSearch;
        })
      }
    });

    this.matSelectTargeting1.openedChange.subscribe(opened => {
      if (opened) {
        this.matSelectTargeting1.panel.nativeElement.addEventListener('mouseleave', () => {
          this.matSelectTargeting1.close();
          this.targeting1List = this.targeting1ListForSearch;
        })
      }
    });

    this.matSelectAudience1.openedChange.subscribe(opened => {
      if (opened) {
        this.matSelectAudience1.panel.nativeElement.addEventListener('mouseleave', () => {
          this.matSelectAudience1.close();
          this.audience1List = this.audience1ListForSearch;
        })
      }
    });

    this.matSelectCampaign2.openedChange.subscribe(opened => {
      if (opened) {
        this.matSelectCampaign2.panel.nativeElement.addEventListener('mouseleave', () => {
          this.matSelectCampaign2.close();
          this.campaign2List = this.campaign2ListForSearch;
        })
      }
    });

    this.matSelectTargeting2.openedChange.subscribe(opened => {
      if (opened) {
        this.matSelectTargeting2.panel.nativeElement.addEventListener('mouseleave', () => {
          this.matSelectTargeting2.close();
          this.targeting2List = this.targeting2ListForSearch;
        })
      }
    });

    this.matSelectAudience2.openedChange.subscribe(opened => {
      if (opened) {
        this.matSelectAudience2.panel.nativeElement.addEventListener('mouseleave', () => {
          this.matSelectAudience2.close();
          this.audience2List = this.audience2ListForSearch;
        })
      }
    });

    this.matSelectMetric.openedChange.subscribe(opened => {
      if (opened) {
        this.matSelectMetric.panel.nativeElement.addEventListener('mouseleave', () => {
          this.matSelectMetric.close();
        })
      }
    });
  }

  ngOnInit(): void {
    this.comparison_campaign_1 = this.storageService.getFromStorage('mat-select-comparison-campaign-1');
    this.comparison_targeting_1 = this.storageService.getFromStorage('mat-select-comparison-targeting-1');
    this.comparison_audience_1 = this.storageService.getFromStorage('mat-select-comparison-audience-1');
    this.comparison_campaign_2 = this.storageService.getFromStorage('mat-select-comparison-campaign-2');
    this.comparison_targeting_2 = this.storageService.getFromStorage('mat-select-comparison-targeting-2');
    this.comparison_audience_2 = this.storageService.getFromStorage('mat-select-comparison-audience-2');
    this.comparison_metric = this.storageService.getFromStorage('mat-select-comparison-metric');

    this.comparison_campaigns_1.setValue(this.comparison_campaign_1);
    this.comparison_targetings_1.setValue(this.comparison_targeting_1);
    this.comparison_audiences_1.setValue(this.comparison_audience_1);
    this.comparison_campaigns_2.setValue(this.comparison_campaign_2);
    this.comparison_targetings_2.setValue(this.comparison_targeting_2);
    this.comparison_audiences_2.setValue(this.comparison_audience_2);
    this.comparison_metrics.setValue(this.comparison_metric);

    if(this.comparison_campaigns_1.value) {
      // this.testDataCampaign1();
      this.comparison_targetings_1.enable();
      this.comparison_metrics.enable();
      let campaign_1: any = this.comparison_campaigns_1.value?this.comparison_campaigns_1.value:'';

      this.getCampaignStartEndDates(campaign_1, 1);
      this.getComparisonTargetingByCampaign(campaign_1, 1).then(() => {
        if(this.comparison_targetings_1.value) {
          this.comparison_audiences_1.enable();
          let targeting_1: any = this.comparison_targetings_1.value?this.comparison_targetings_1.value:'';

          this.getComparisonAudienceByCampaign(campaign_1, targeting_1, 1);
        }
      });
    }

    if(this.comparison_campaigns_2.value) {
      // this.testDataCampaign2();
      this.comparison_targetings_2.enable();
      this.comparison_metrics.enable();
      let campaign_2: any = this.comparison_campaigns_2.value?this.comparison_campaigns_2.value:'';

      this.getCampaignStartEndDates(campaign_2, 2);
      this.getComparisonTargetingByCampaign(campaign_2, 2).then(() => {
        if(this.comparison_targetings_2.value) {
          this.comparison_audiences_2.enable();
          let targeting_2: any = this.comparison_targetings_2.value?this.comparison_targetings_2.value:'';

          this.getComparisonAudienceByCampaign(campaign_2, targeting_2, 2);
        }
      });
    }

    if(this.comparison_campaigns_1.value) {
      let campaign_1: any = this.comparison_campaigns_1.value?this.comparison_campaigns_1.value:'';
      let targeting_1: any = this.comparison_targetings_1.value?this.comparison_targetings_1.value:'';
      let audience_1: any = this.comparison_audiences_1.value?this.comparison_audiences_1.value:'';

      this.getComparisonImpressionsSpend(campaign_1, targeting_1, audience_1, 1).then(() => {
        if(this.comparisonCampaign1ImpressionsData.chart.length && this.comparisonCampaign2ImpressionsData.chart.length) {
          this.getComparisonImpressionsDifference();
        }

        if(this.comparisonCampaign1SpendData.chart.length && this.comparisonCampaign2SpendData.chart.length) {
          this.getComparisonSpendDifference();
        }

        if(this.comparison_metrics.value) {
          let metric: any = this.comparison_metrics.value?this.comparison_metrics.value:'';

          if(this.comparison_campaigns_1.value) {
            let campaign_1: any = this.comparison_campaigns_1.value?this.comparison_campaigns_1.value:'';
            let targeting_1: any = this.comparison_targetings_1.value?this.comparison_targetings_1.value:'';
            let audience_1: any = this.comparison_audiences_1.value?this.comparison_audiences_1.value:'';

            this.getComparisonMetric(campaign_1, targeting_1, audience_1, metric, 1).then(() => {
              // if(this.comparison_audiences_1.value && this.comparison_audiences_2.value) {
                this.getComparisonMetricDifference(metric);
              // }
            });
          }
        }
      });
    }

    if(this.comparison_campaigns_2.value) {
      let campaign_2: any = this.comparison_campaigns_2.value?this.comparison_campaigns_2.value:'';
      let targeting_2: any = this.comparison_targetings_2.value?this.comparison_targetings_2.value:'';
      let audience_2: any = this.comparison_audiences_2.value?this.comparison_audiences_2.value:'';

      this.getComparisonImpressionsSpend(campaign_2, targeting_2, audience_2, 2).then(() => {
        if(this.comparisonCampaign1ImpressionsData.chart.length && this.comparisonCampaign2ImpressionsData.chart.length) {
          this.getComparisonImpressionsDifference();
        }

        if(this.comparisonCampaign1SpendData.chart.length && this.comparisonCampaign2SpendData.chart.length) {
          this.getComparisonSpendDifference();
        }

        if(this.comparison_metrics.value) {
          let metric: any = this.comparison_metrics.value?this.comparison_metrics.value:'';

          if(this.comparison_campaigns_2.value) {
            let campaign_2: any = this.comparison_campaigns_2.value?this.comparison_campaigns_2.value:'';
            let targeting_2: any = this.comparison_targetings_2.value?this.comparison_targetings_2.value:'';
            let audience_2: any = this.comparison_audiences_2.value?this.comparison_audiences_2.value:'';

            this.getComparisonMetric(campaign_2, targeting_2, audience_2, metric, 2).then(() => {
              // if(this.comparison_audiences_1.value && this.comparison_audiences_2.value) {
                this.getComparisonMetricDifference(metric);
              // }
            });
          }
        }
      });
    }
  }

  onChange(selected: MatSelectChange) {
    if(selected.source.id == 'mat-select-comparison-campaign-1') {
      if(this.comparison_campaigns_1.value != undefined) {
        this.storageService.addToStorage('mat-select-comparison-campaign-1', selected.value);
        this.storageService.removeFromStorage('mat-select-comparison-targeting-1');
        this.storageService.removeFromStorage('mat-select-comparison-audience-1');
        this.comparison_targetings_1.setValue('');
        this.comparison_audiences_1.setValue('');
        this.comparison_targetings_1.enable();
        this.comparison_metrics.enable();

        this.comparisonCampaign1ImpressionsData = {
          value: 0,
          chart: []
        };

        this.comparisonCampaign1SpendData = {
          value: 0,
          chart: []
        };

        this.comparisonDifferenceImpressionsData = {
          value: 0,
          chart: [],
          percentageDifference: 0
        };

        this.comparisonDifferenceSpendData = {
          value: 0,
          chart: [],
          percentageDifference: 0
        };

        let audience_1: any = this.comparison_audiences_1.value?this.comparison_audiences_1.value:'';
        let targeting_1: any = this.comparison_targetings_1.value?this.comparison_targetings_1.value:'';

        this.getCampaignStartEndDates(selected.value, 1);
        this.getComparisonTargetingByCampaign(selected.value, 1);

        this.getComparisonImpressionsSpend(selected.value, targeting_1, audience_1, 1).then(() => {
          if(this.comparison_campaigns_1.value && this.comparison_campaigns_2.value) {
            this.getComparisonImpressionsDifference();
            this.getComparisonSpendDifference();
          }
        });
      } else {
        this.storageService.removeFromStorage('mat-select-comparison-campaign-1');
        this.storageService.removeFromStorage('mat-select-comparison-targeting-1');
        this.storageService.removeFromStorage('mat-select-comparison-audience-1');
        this.storageService.removeFromStorage('mat-select-comparison-metric');

        this.comparison_targetings_1.setValue('');
        this.comparison_audiences_1.setValue('');
        this.comparison_metrics.setValue('');

        this.comparison_targetings_1.disable();
        this.comparison_audiences_1.disable();
        this.comparison_metrics.disable();

        this.campaignDate1 = false;
        this.campaignStartDate1 = '';
        this.campaignEndDate1 = '';

        this.targeting1ListForSearch = [];
        this.targeting1List = [];
        this.audience1ListForSearch = [];
        this.audience1List = [];

        this.comparisonCampaign1ImpressionsData = {
          value: 0,
          chart: []
        };

        this.comparisonCampaign1SpendData = {
          value: 0,
          chart: []
        };

        this.comparisonCampaign1MetricData = {
          type: '',
          value: 0,
          chart: []
        };

        this.comparisonCampaign1MetricDataBL = {
          type: '',
          comscoreChart: [],
          facebookChart: [],
          youTubeChart: []
        };

        this.comparisonCampaign1MetricDataSL = {
          type: '',
          brandChart: [],
          prodChart: []
        };

        this.comparisonDifferenceImpressionsData = {
          value: 0,
          chart: [],
          percentageDifference: 0
        };

        this.comparisonDifferenceSpendData = {
          value: 0,
          chart: [],
          percentageDifference: 0
        };

        this.comparisonDifferenceMetricData = {
          type: '',
          value: 0,
          chart: [],
          percentageDifference: 0
        };
      }
    }

    if(selected.source.id == 'mat-select-comparison-targeting-1') {
      if(this.comparison_targetings_1.value != undefined) {
        this.storageService.addToStorage('mat-select-comparison-targeting-1', selected.value);

        this.storageService.removeFromStorage('mat-select-comparison-audience-1');
        this.comparison_audiences_1.setValue('');
        this.comparison_audiences_1.enable();

        this.comparisonCampaign1ImpressionsData = {
          value: 0,
          chart: []
        };

        this.comparisonCampaign1SpendData = {
          value: 0,
          chart: []
        };

        this.comparisonDifferenceImpressionsData = {
          value: 0,
          chart: [],
          percentageDifference: 0
        };

        this.comparisonDifferenceSpendData = {
          value: 0,
          chart: [],
          percentageDifference: 0
        };

        let campaign_1: any = this.comparison_campaigns_1.value?this.comparison_campaigns_1.value:'';
        let audience_1: any = this.comparison_audiences_1.value?this.comparison_audiences_1.value:'';

        this.getComparisonAudienceByCampaign(campaign_1, selected.value, 1);

        this.getComparisonImpressionsSpend(campaign_1, selected.value, audience_1, 1).then(() => {
          if(this.comparison_campaigns_1.value && this.comparison_campaigns_2.value) {
            this.getComparisonImpressionsDifference();
            this.getComparisonSpendDifference();
          }
        });
      } else {
        this.storageService.removeFromStorage('mat-select-comparison-targeting-1');
        this.storageService.removeFromStorage('mat-select-comparison-audience-1');

        this.comparison_audiences_1.setValue('');
        this.comparison_audiences_1.disable();

        let campaign_1: any = this.comparison_campaigns_1.value?this.comparison_campaigns_1.value:'';

        this.getComparisonImpressionsSpend(campaign_1, '', '', 1).then(() => {
          if(this.comparison_campaigns_1.value && this.comparison_campaigns_2.value) {
            this.getComparisonImpressionsDifference();
            this.getComparisonSpendDifference();
          }
        });
      }
    }

    if(selected.source.id == 'mat-select-comparison-audience-1') {
      if(this.comparison_audiences_1.value != undefined) {
        this.storageService.addToStorage('mat-select-comparison-audience-1', selected.value);

        let campaign_1: any = this.comparison_campaigns_1.value?this.comparison_campaigns_1.value:'';
        let targeting_1: any = this.comparison_targetings_1.value?this.comparison_targetings_1.value:'';

        this.getComparisonImpressionsSpend(campaign_1, targeting_1, selected.value, 1).then(() => {
          if(this.comparison_campaigns_1.value && this.comparison_campaigns_2.value) {
            this.getComparisonImpressionsDifference();
            this.getComparisonSpendDifference();
          }
        });
      } else {
        this.storageService.removeFromStorage('mat-select-comparison-audience-1');

        let campaign_1: any = this.comparison_campaigns_1.value?this.comparison_campaigns_1.value:'';
        let targeting_1: any = this.comparison_targetings_1.value?this.comparison_targetings_1.value:'';

        this.getComparisonImpressionsSpend(campaign_1, targeting_1, '', 1).then(() => {
          if(this.comparison_campaigns_1.value && this.comparison_campaigns_2.value) {
            this.getComparisonImpressionsDifference();
            this.getComparisonSpendDifference();
          }
        });
      }
    }

    if(selected.source.id == 'mat-select-comparison-campaign-2') {
      if(this.comparison_campaigns_2.value != undefined) {
        this.storageService.addToStorage('mat-select-comparison-campaign-2', selected.value);
        this.storageService.removeFromStorage('mat-select-comparison-targeting-2');
        this.storageService.removeFromStorage('mat-select-comparison-audience-2');
        this.comparison_targetings_2.setValue('');
        this.comparison_audiences_2.setValue('');
        this.comparison_targetings_2.enable();
        this.comparison_metrics.enable();

        this.comparisonCampaign2ImpressionsData = {
          value: 0,
          chart: []
        };

        this.comparisonCampaign2SpendData = {
          value: 0,
          chart: []
        };

        this.comparisonDifferenceImpressionsData = {
          value: 0,
          chart: [],
          percentageDifference: 0
        };

        this.comparisonDifferenceSpendData = {
          value: 0,
          chart: [],
          percentageDifference: 0
        };

        let targeting_2: any = this.comparison_targetings_2.value?this.comparison_targetings_2.value:'';
        let audience_2: any = this.comparison_audiences_2.value?this.comparison_audiences_2.value:'';

        this.getCampaignStartEndDates(selected.value, 2);
        this.getComparisonTargetingByCampaign(selected.value, 2);

        this.getComparisonImpressionsSpend(selected.value, targeting_2, audience_2, 2).then(() => {
          if(this.comparison_campaigns_1.value && this.comparison_campaigns_2.value) {
            this.getComparisonImpressionsDifference();
            this.getComparisonSpendDifference();
          }
        });
      } else {
        this.storageService.removeFromStorage('mat-select-comparison-campaign-2');
        this.storageService.removeFromStorage('mat-select-comparison-targeting-2');
        this.storageService.removeFromStorage('mat-select-comparison-audience-2');
        this.storageService.removeFromStorage('mat-select-comparison-metric');

        this.comparison_targetings_2.setValue('');
        this.comparison_audiences_2.setValue('');
        this.comparison_metrics.setValue('');

        this.comparison_targetings_2.disable();
        this.comparison_audiences_2.disable();
        this.comparison_metrics.disable();

        this.campaignDate2 = false;
        this.campaignStartDate2 = '';
        this.campaignEndDate2 = '';

        this.targeting2ListForSearch = [];
        this.targeting2List = [];
        this.audience2ListForSearch = [];
        this.audience2List = [];

        this.comparisonCampaign2ImpressionsData = {
          value: 0,
          chart: []
        };

        this.comparisonCampaign2SpendData = {
          value: 0,
          chart: []
        };

        this.comparisonCampaign2MetricData = {
          type: '',
          value: 0,
          chart: []
        };

        this.comparisonCampaign2MetricDataBL = {
          type: '',
          comscoreChart: [],
          facebookChart: [],
          youTubeChart: []
        };

        this.comparisonCampaign2MetricDataSL = {
          type: '',
          brandChart: [],
          prodChart: []
        };

        this.comparisonDifferenceImpressionsData = {
          value: 0,
          chart: [],
          percentageDifference: 0
        };

        this.comparisonDifferenceSpendData = {
          value: 0,
          chart: [],
          percentageDifference: 0
        };

        this.comparisonDifferenceMetricData = {
          type: '',
          value: 0,
          chart: [],
          percentageDifference: 0
        };
      }
    }

    if(selected.source.id == 'mat-select-comparison-targeting-2') {
      if(this.comparison_targetings_2.value != undefined) {
        this.storageService.addToStorage('mat-select-comparison-targeting-2', selected.value);

        this.storageService.removeFromStorage('mat-select-comparison-audience-2');
        this.comparison_audiences_2.setValue('');
        this.comparison_audiences_2.enable();

        this.comparisonCampaign2ImpressionsData = {
          value: 0,
          chart: []
        };

        this.comparisonCampaign2SpendData = {
          value: 0,
          chart: []
        };

        this.comparisonDifferenceImpressionsData = {
          value: 0,
          chart: [],
          percentageDifference: 0
        };

        this.comparisonDifferenceSpendData = {
          value: 0,
          chart: [],
          percentageDifference: 0
        };

        let campaign_2: any = this.comparison_campaigns_2.value?this.comparison_campaigns_2.value:'';
        let audience_2: any = this.comparison_audiences_2.value?this.comparison_audiences_2.value:'';

        this.getComparisonAudienceByCampaign(campaign_2, selected.value, 2);

        this.getComparisonImpressionsSpend(campaign_2, selected.value, audience_2, 2).then(() => {
          if(this.comparison_campaigns_1.value && this.comparison_campaigns_2.value) {
            this.getComparisonImpressionsDifference();
            this.getComparisonSpendDifference();
          }
        });
      } else {
        this.storageService.removeFromStorage('mat-select-comparison-targeting-2');
        this.storageService.removeFromStorage('mat-select-comparison-audience-2');

        this.comparison_audiences_2.setValue('');
        this.comparison_audiences_2.disable();

        let campaign_2: any = this.comparison_campaigns_2.value?this.comparison_campaigns_2.value:'';

        this.getComparisonImpressionsSpend(campaign_2, '', '', 2).then(() => {
          if(this.comparison_campaigns_1.value && this.comparison_campaigns_2.value) {
            this.getComparisonImpressionsDifference();
            this.getComparisonSpendDifference();
          }
        });
      }
    }

    if(selected.source.id == 'mat-select-comparison-audience-2') {
      if(this.comparison_audiences_2.value != undefined) {
        this.storageService.addToStorage('mat-select-comparison-audience-2', selected.value);

        let campaign_2: any = this.comparison_campaigns_2.value?this.comparison_campaigns_2.value:'';
        let targeting_2: any = this.comparison_targetings_2.value?this.comparison_targetings_2.value:'';

        this.getComparisonImpressionsSpend(campaign_2, targeting_2, selected.value, 2).then(() => {
          if(this.comparison_campaigns_1.value && this.comparison_campaigns_2.value) {
            this.getComparisonImpressionsDifference();
            this.getComparisonSpendDifference();
          }
        });
      } else {
        this.storageService.removeFromStorage('mat-select-comparison-audience-2');

        let campaign_2: any = this.comparison_campaigns_2.value?this.comparison_campaigns_2.value:'';
        let targeting_2: any = this.comparison_targetings_2.value?this.comparison_targetings_2.value:'';

        this.getComparisonImpressionsSpend(campaign_2, targeting_2, '', 2).then(() => {
          if(this.comparison_campaigns_1.value && this.comparison_campaigns_2.value) {
            this.getComparisonImpressionsDifference();
            this.getComparisonSpendDifference();
          }
        });
      }
    }

    if(selected.source.id == 'mat-select-comparison-metric') {
      this.storageService.addToStorage('mat-select-comparison-metric', selected.value);

      // reset data
      this.comparisonDifferenceMetricData = {
        type: '',
        value: 0,
        chart: [],
        percentageDifference: 0
      };

      if(this.comparison_campaigns_1.value) {
        let campaign_1: any = this.comparison_campaigns_1.value?this.comparison_campaigns_1.value:'';
        let targeting_1: any = this.comparison_targetings_1.value?this.comparison_targetings_1.value:'';
        let audience_1: any = this.comparison_audiences_1.value?this.comparison_audiences_1.value:'';

        this.getComparisonMetric(campaign_1, targeting_1, audience_1, selected.value, 1).then(() => {
          if(this.comparison_campaigns_1.value && this.comparison_campaigns_2.value) {
            this.getComparisonMetricDifference(selected.value);
          }
        });
      }

      if(this.comparison_campaigns_2.value) {
        let campaign_2: any = this.comparison_campaigns_2.value?this.comparison_campaigns_2.value:'';
        let targeting_2: any = this.comparison_targetings_2.value?this.comparison_targetings_2.value:'';
        let audience_2: any = this.comparison_audiences_2.value?this.comparison_audiences_2.value:'';

        this.getComparisonMetric(campaign_2, targeting_2, audience_2, selected.value, 2).then(() => {
          if(this.comparison_campaigns_1.value && this.comparison_campaigns_2.value) {
            this.getComparisonMetricDifference(selected.value);
          }
        });
      }

      // if(this.comparison_metrics.value == "SL" || this.comparison_metrics.value == "BL") {
      //   this.comparisonDifferenceMetricData = {
      //     type: '',
      //     value: 0,
      //     chart: []
      //   };
      // } else {
      //   // this.testDataDifferenceMetric();
      // }
    } else {
      let metric: any = this.comparison_metrics.value?this.comparison_metrics.value:'';

      if(this.comparison_campaigns_1.value && this.comparison_metrics.value && selected.source.id != 'mat-select-comparison-campaign-2' && selected.source.id != 'mat-select-comparison-targeting-2' && selected.source.id != 'mat-select-comparison-audience-2') {
        let campaign_1: any = this.comparison_campaigns_1.value?this.comparison_campaigns_1.value:'';
        let targeting_1: any = this.comparison_targetings_1.value?this.comparison_targetings_1.value:'';
        let audience_1: any = this.comparison_audiences_1.value?this.comparison_audiences_1.value:'';

        this.getComparisonMetric(campaign_1, targeting_1, audience_1, metric, 1).then(() => {
          if(this.comparison_campaigns_1.value && this.comparison_campaigns_2.value) {
            this.getComparisonMetricDifference(metric);
          }
        });
      }

      if(this.comparison_campaigns_2.value && this.comparison_metrics.value && selected.source.id != 'mat-select-comparison-campaign-1' && selected.source.id != 'mat-select-comparison-targeting-1' && selected.source.id != 'mat-select-comparison-audience-1') {
        let campaign_2: any = this.comparison_campaigns_2.value?this.comparison_campaigns_2.value:'';
        let targeting_2: any = this.comparison_targetings_2.value?this.comparison_targetings_2.value:'';
        let audience_2: any = this.comparison_audiences_2.value?this.comparison_audiences_2.value:'';

        this.getComparisonMetric(campaign_2, targeting_2, audience_2, metric, 2).then(() => {
          if(this.comparison_campaigns_1.value && this.comparison_campaigns_2.value) {
            this.getComparisonMetricDifference(metric);
          }
        });
      }
    }
  }

  clearComparisonStorage() {
    if(this.comparison_campaigns_1.value || this.comparison_campaigns_2.value || this.comparison_targetings_1.value || this.comparison_targetings_2.value || this.comparison_audiences_1.value || this.comparison_audiences_2.value || this.comparison_metrics.value) {
      this.comparison_campaigns_1.setValue('');
      this.comparison_targetings_1.setValue('');
      this.comparison_audiences_1.setValue('');
      this.comparison_campaigns_2.setValue('');
      this.comparison_targetings_2.setValue('');
      this.comparison_audiences_2.setValue('');
      this.comparison_metrics.setValue('');

      this.storageService.removeFromStorage('mat-select-comparison-campaign-1');
      this.storageService.removeFromStorage('mat-select-comparison-targeting-1');
      this.storageService.removeFromStorage('mat-select-comparison-audience-1');
      this.storageService.removeFromStorage('mat-select-comparison-campaign-2');
      this.storageService.removeFromStorage('mat-select-comparison-targeting-2');
      this.storageService.removeFromStorage('mat-select-comparison-audience-2');
      this.storageService.removeFromStorage('mat-select-comparison-metric');

      this.comparison_targetings_1.disable();
      this.comparison_audiences_1.disable();
      this.comparison_targetings_2.disable();
      this.comparison_audiences_2.disable();
      this.comparison_metrics.disable();

      this.campaignDate1 = false;
      this.campaignStartDate1 = '';
      this.campaignEndDate1 = '';

      this.campaignDate2 = false;
      this.campaignStartDate2 = '';
      this.campaignEndDate2 = '';


      this.targeting1ListForSearch = [];
      this.targeting1List = [];
      this.audience1ListForSearch = [];
      this.audience1List = [];

      this.targeting2ListForSearch = [];
      this.targeting2List = [];
      this.audience2ListForSearch = [];
      this.audience2List = [];

      this.comparisonCampaign1ImpressionsData = {
        value: 0,
        chart: []
      };

      this.comparisonCampaign1SpendData = {
        value: 0,
        chart: []
      };

      this.comparisonCampaign1MetricData = {
        type: '',
        value: 0,
        chart: []
      };

      this.comparisonCampaign1MetricDataBL = {
        type: '',
        comscoreChart: [],
        facebookChart: [],
        youTubeChart: []
      };

      this.comparisonCampaign1MetricDataSL = {
        type: '',
        brandChart: [],
        prodChart: []
      };

      this.comparisonCampaign2ImpressionsData = {
        value: 0,
        chart: []
      };

      this.comparisonCampaign2SpendData = {
        value: 0,
        chart: []
      };

      this.comparisonCampaign2MetricData = {
        type: '',
        value: 0,
        chart: []
      };

      this.comparisonCampaign2MetricDataBL = {
        type: '',
        comscoreChart: [],
        facebookChart: [],
        youTubeChart: []
      };

      this.comparisonCampaign2MetricDataSL = {
        type: '',
        brandChart: [],
        prodChart: []
      };

      this.comparisonDifferenceImpressionsData = {
        value: 0,
        chart: [],
        percentageDifference: 0
      };

      this.comparisonDifferenceSpendData = {
        value: 0,
        chart: [],
        percentageDifference: 0
      };

      this.comparisonDifferenceMetricData = {
        type: '',
        value: 0,
        chart: [],
        percentageDifference: 0
      };
    } else {
      this.snackBar.open(`Filters are clear`, 'X', {
        horizontalPosition: spinner.horizontalPosition,
        verticalPosition: spinner.verticalPosition,
        duration: spinner.duration
      });
    }
  }

  getCampaignStartEndDates(campaign: string, flag: number) {
    this.appService.getCampaignStartEndDates(this.brand, campaign).subscribe((response) => {
      if(response.status == 200) {
        if(flag == 1) {
          this.campaignDate1 = true;
          this.campaignStartDate1 = '';
          this.campaignEndDate1 = '';

          if(response.results[0].startDate) {
            this.campaignStartDate1 = response.results[0].startDate
          }

          if(response.results[0].endDate) {
            this.campaignEndDate1 = response.results[0].endDate
          }
        }

        if(flag == 2) {
          this.campaignDate2 = true;
          this.campaignStartDate2 = '';
          this.campaignEndDate2 = '';

          if(response.results[0].startDate) {
            this.campaignStartDate2 = response.results[0].startDate
          }

          if(response.results[0].endDate) {
            this.campaignEndDate2 = response.results[0].endDate
          }
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

  getComparisonCampaigns() {
    this.appService.getComparisonCampaigns(this.brand).subscribe((response) => {
      if(response.status == 200) {
        response.results.forEach((campaign: any) => {
          // console.log(campaign);
          let campaignArray = {
            value: campaign.MktCampaign,
            text: campaign.MktCampaign
          }

          this.campaign1List.push(campaignArray);
          this.campaign1ListForSearch.push(campaignArray);

          this.campaign2List.push(campaignArray);
          this.campaign2ListForSearch.push(campaignArray);
        });

        this.campaign1List.sort((a, b) => a.value.localeCompare(b.value));
        this.campaign1ListForSearch.sort((a, b) => a.value.localeCompare(b.value));

        this.campaign2List.sort((a, b) => a.value.localeCompare(b.value));
        this.campaign2ListForSearch.sort((a, b) => a.value.localeCompare(b.value));
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

  getComparisonTargetingByCampaign(campaign: string, flag: number) {
    var promise = new Promise<void>((resolve, reject) => {

      this.appService.getComparisonTargetingByCampaign(this.brand, campaign).subscribe((response) => {
        // reset data
        if(flag == 1) {
          this.targeting1List = [];
          this.targeting1ListForSearch = [];
        }

        if(flag == 2) {
          this.targeting2List = [];
          this.targeting2ListForSearch = [];
        }

        if(response.status == 200) {
          response.results.forEach((targeting: any) => {
            // console.log(channel);
            let targetingArray = {
              value: targeting.Targeting,
              text: targeting.Targeting
            }

            if(flag == 1) {
              if(this.targeting1List.find(targeting => targeting.value == targetingArray.value) == null)
                this.targeting1List.push(targetingArray);
              if(this.targeting1ListForSearch.find(targeting => targeting.value == targetingArray.value) == null)
                this.targeting1ListForSearch.push(targetingArray);
            }

            if(flag == 2) {
              if(this.targeting2List.find(targeting => targeting.value == targetingArray.value) == null)
                this.targeting2List.push(targetingArray);
              if(this.targeting2ListForSearch.find(targeting => targeting.value == targetingArray.value) == null)
                this.targeting2ListForSearch.push(targetingArray);
            }
          });

          this.targeting1List.sort((a, b) => a.value.localeCompare(b.value));
          this.targeting1ListForSearch.sort((a, b) => a.value.localeCompare(b.value));

          this.targeting2List.sort((a, b) => a.value.localeCompare(b.value));
          this.targeting2ListForSearch.sort((a, b) => a.value.localeCompare(b.value));
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

  getComparisonAudienceByCampaign(campaign: string, targeting: string, flag: number) {
    var promise = new Promise<void>((resolve, reject) => {

      this.appService.getComparisonAudienceByCampaign(this.brand, campaign, targeting).subscribe((response) => {
        // reset data
        if(flag == 1) {
          this.audience1ListForSearch = [];
          this.audience1List = [];
        }

        if(flag == 2) {
          this.audience2ListForSearch = [];
          this.audience2List = [];
        }

        if(response.status == 200) {
          response.results.forEach((audience: any) => {
            // console.log(channel);
            let audienceArray = {
              value: audience.Audience,
              text: audience.Audience
            }

            if(flag == 1) {
              if(this.audience1List.find(audience => audience.value == audienceArray.value) == null)
              this.audience1List.push(audienceArray);
              if(this.audience1ListForSearch.find(audience => audience.value == audienceArray.value) == null)
              this.audience1ListForSearch.push(audienceArray);
            }

            if(flag == 2) {
              if(this.audience2List.find(audience => audience.value == audienceArray.value) == null)
              this.audience2List.push(audienceArray);
              if(this.audience2ListForSearch.find(audience => audience.value == audienceArray.value) == null)
              this.audience2ListForSearch.push(audienceArray);
            }
          });

          this.audience1List.sort((a, b) => a.value.localeCompare(b.value));
          this.audience1ListForSearch.sort((a, b) => a.value.localeCompare(b.value));

          this.audience2List.sort((a, b) => a.value.localeCompare(b.value));
          this.audience2ListForSearch.sort((a, b) => a.value.localeCompare(b.value));
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

  getComparisonImpressionsSpend(campaign: string, targeting: string, audience: string, flag: number) {
    var promise = new Promise<void>((resolve, reject) => {
      this.appService.getComparisonImpressionsSpend(this.brand, campaign, targeting, audience).subscribe((response) => {

        // Reset data
        if(flag == 1) {
          this.comparisonCampaign1ImpressionsData = {
            value: 0,
            chart: []
          };

          this.comparisonCampaign1SpendData = {
            value: 0,
            chart: []
          };
        }

        if(flag == 2) {
          this.comparisonCampaign2ImpressionsData = {
            value: 0,
            chart: []
          };

          this.comparisonCampaign2SpendData = {
            value: 0,
            chart: []
          };
        }

        if(response.status == 200) {
          let impressions: any[] = [];
          let spends:any[] = [];

          // console.log(response.results)
          if(response.results[0].length) {
            let total = 0;

            response.results[0].forEach((impression: any, index: number) => {
              // console.log(impression);
              let impressionArray: any;

              if(impression.Imp) {
                impressionArray = {
                  week: `${impression.Date}`,
                  impression: impression.Imp,
                  counter: 'w'+(index+1)
                }
                total += impression.Imp;
              } else {
                impressionArray = {
                  week: `${impression.Date}`,
                  impression: 0,
                  counter: 'w'+(index+1)
                }
              }

              if(flag == 1) {
                this.comparisonCampaign1ImpressionsData.chart.push(impressionArray);
              }

              if(flag == 2) {
                this.comparisonCampaign2ImpressionsData.chart.push(impressionArray);
              }
            });

            if(flag == 1) {
              this.comparisonCampaign1ImpressionsData.value = total;
            }

            if(flag == 2) {
              this.comparisonCampaign2ImpressionsData.value = total;
            }
          }

          if(response.results[1].length) {
            let total = 0;

            response.results[1].forEach((spend: any, index: number) => {
              // console.log(spend);
              let spendArray: any;

              if(spend.Spend) {
                spendArray = {
                  week: `${spend.Date}`,
                  spend: spend.Spend,
                  counter: 'w'+(index+1)
                }
                total += spend.Spend;
              } else {
                spendArray ={
                  week: `${spend.Date}`,
                  spend: 0,
                  counter: 'w'+(index+1)
                }
              }

              if(flag == 1) {
                this.comparisonCampaign1SpendData.chart.push(spendArray);
              }

              if(flag == 2) {
                this.comparisonCampaign2SpendData.chart.push(spendArray);
              }
            });

            if(flag == 1) {
              this.comparisonCampaign1SpendData.value = total;
            }

            if(flag == 2) {
              this.comparisonCampaign2SpendData.value = total;
            }
          }

          // console.log(this.comparisonCampaign1ImpressionsData);
          // console.log(this.comparisonCampaign1SpendData);
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

  getComparisonImpressionsDifference() {
    let impressionDifference: any[] = [];

    // Reset data
    this.comparisonDifferenceImpressionsData = {
      value: 0,
      chart: [],
      percentageDifference: 0
    };

    // console.log(this.comparisonCampaign1ImpressionsData);
    // console.log(this.comparisonCampaign2ImpressionsData);

    if(this.comparisonCampaign1ImpressionsData.chart.length && this.comparisonCampaign2ImpressionsData.chart.length) {
      // console.log('both');
      let impressionArray: any;

      this.comparisonCampaign1ImpressionsData.chart.forEach((impression_1: any) => {
        impressionArray = {
          week: impression_1.week,
          impression1: impression_1.impression,
          impression2: 0
        }

        impressionDifference.push(impressionArray);
      });

      this.comparisonCampaign2ImpressionsData.chart.forEach((impression_2: any) => {
        let flag = true;

        impressionDifference.forEach((impression_1: any, index: number) => {
          if(impression_2.week == impression_1.week) {
            flag = false;

            impressionDifference[index]['impression1'] = impression_1.impression1;
            impressionDifference[index]['impression2'] = impression_2.impression;
          }
        });

        if(flag) {
          impressionArray = {
            week: impression_2.week,
            impression1: 0,
            impression2: impression_2.impression
          }

          impressionDifference.push(impressionArray);
        }
      });

      impressionDifference.sort((a,b) => {
        return new Date(a.week).getTime() - new Date(b.week).getTime();
      });

      // console.log('difference');
      // console.log(impressionDifference);

      this.comparisonDifferenceImpressionsData.chart = impressionDifference;
      this.comparisonDifferenceImpressionsData.value = Math.abs(this.comparisonCampaign1ImpressionsData.value - this.comparisonCampaign2ImpressionsData.value);
      this.comparisonDifferenceImpressionsData.percentageDifference = percentageDifference(this.comparisonCampaign1ImpressionsData.value, this.comparisonCampaign2ImpressionsData.value);
    } else if(this.comparisonCampaign1ImpressionsData.chart.length && !this.comparisonCampaign2ImpressionsData.chart.length) {
      // console.log('imp 1')
      let impressionArray: any;

      this.comparisonCampaign1ImpressionsData.chart.forEach((impression_1: any) => {
        impressionArray = {
          week: impression_1.week,
          impression1: impression_1.impression,
          impression2: 0
        }

        impressionDifference.push(impressionArray);
      });
      this.comparisonDifferenceImpressionsData.chart = impressionDifference;
      this.comparisonDifferenceImpressionsData.value = this.comparisonCampaign1ImpressionsData.value;
      this.comparisonDifferenceImpressionsData.percentageDifference = percentageDifference(this.comparisonCampaign1ImpressionsData.value, this.comparisonCampaign2ImpressionsData.value);
    } else if(!this.comparisonCampaign1ImpressionsData.chart.length && this.comparisonCampaign2ImpressionsData.chart.length) {
      // console.log('imp 2')
      let impressionArray: any;

      this.comparisonCampaign2ImpressionsData.chart.forEach((impression_2: any) => {
        impressionArray = {
          week: impression_2.week,
          impression1: 0,
          impression2: impression_2.impression
        }

        impressionDifference.push(impressionArray);
      });
      this.comparisonDifferenceImpressionsData.chart = impressionDifference;
      this.comparisonDifferenceImpressionsData.value = this.comparisonCampaign2ImpressionsData.value;
      this.comparisonDifferenceImpressionsData.percentageDifference = percentageDifference(this.comparisonCampaign1ImpressionsData.value, this.comparisonCampaign2ImpressionsData.value);
    }

    // console.log(this.comparisonDifferenceImpressionsData);
  }

  getComparisonSpendDifference() {
    let spendDifference: any[] = [];

    // Reset data
    this.comparisonDifferenceSpendData = {
      value: 0,
      chart: [],
      percentageDifference: 0
    };

    if(this.comparisonCampaign1SpendData.chart.length && this.comparisonCampaign2SpendData.chart.length) {
      // console.log('both');
      let spendArray: any;

      this.comparisonCampaign1SpendData.chart.forEach((spend_1: any) => {
        spendArray = {
          week: spend_1.week,
          spend1: spend_1.spend,
          spend2: 0
        }

        spendDifference.push(spendArray);
      });

      this.comparisonCampaign2SpendData.chart.forEach((spend_2: any) => {
        let flag = true;

        spendDifference.forEach((spend_1: any, index: number) => {
          if(spend_2.week == spend_1.week) {
            flag = false;

            spendDifference[index]['spend1'] = spend_1.spend1;
            spendDifference[index]['spend2'] = spend_2.spend;
          }
        });

        if(flag) {
          spendArray = {
            week: spend_2.week,
            spend1: 0,
            spend2: spend_2.spend
          }

          spendDifference.push(spendArray);
        }
      });

      spendDifference.sort((a,b) => {
        return new Date(a.week).getTime() - new Date(b.week).getTime();
      });

      // console.log('difference');
      // console.log(spendDifference);

      this.comparisonDifferenceSpendData.chart = spendDifference;
      this.comparisonDifferenceSpendData.value = Math.abs(this.comparisonCampaign1SpendData.value - this.comparisonCampaign2SpendData.value);
      this.comparisonDifferenceSpendData.percentageDifference = percentageDifference(this.comparisonCampaign1SpendData.value, this.comparisonCampaign2SpendData.value);
    } else if(this.comparisonCampaign1SpendData.chart.length && !this.comparisonCampaign2SpendData.chart.length) {
      // console.log('imp 1')
      let spendArray: any;

      this.comparisonCampaign1SpendData.chart.forEach((spend_1: any) => {
        spendArray = {
          week: spend_1.week,
          spend1: spend_1.spend,
          spend2: 0
        }

        spendDifference.push(spendArray);
      });
      this.comparisonDifferenceSpendData.chart = spendDifference;
      this.comparisonDifferenceSpendData.value = this.comparisonCampaign1SpendData.value;
      this.comparisonDifferenceSpendData.percentageDifference = percentageDifference(this.comparisonCampaign1SpendData.value, this.comparisonCampaign2SpendData.value);
    } else if(!this.comparisonCampaign1SpendData.chart.length && this.comparisonCampaign2SpendData.chart.length) {
      // console.log('imp 2')
      let spendArray: any;

      this.comparisonCampaign2SpendData.chart.forEach((spend_2: any) => {
        spendArray = {
          week: spend_2.week,
          spend1: 0,
          spend2: spend_2.spend
        }

        spendDifference.push(spendArray);
      });
      this.comparisonDifferenceSpendData.chart = spendDifference;
      this.comparisonDifferenceSpendData.value = this.comparisonCampaign2SpendData.value;
      this.comparisonDifferenceSpendData.percentageDifference = percentageDifference(this.comparisonCampaign1SpendData.value, this.comparisonCampaign2SpendData.value);
    }

    // console.log(this.comparisonDifferenceSpendData);
  }

  getComparisonMetric(campaign: string, targeting: string, audience: string, metric: string, flag: number) {
    var promise = new Promise<void>((resolve, reject) => {
      if(metric == 'CPM') {
        if(flag == 1) {
          // reset data
          this.comparisonCampaign1MetricData = {
            type: '',
            value: 0,
            chart: []
          };

          this.comparisonCampaign1MetricData.type = metric;

          this.appService.getComparisonImpressionsSpend(this.brand, campaign, targeting, audience).subscribe((response) => {
            if(this.comparisonCampaign1ImpressionsData.chart.length && this.comparisonCampaign1SpendData.chart.length) {
              let cpmArray: any;
              // let total = 0 as number;

              this.comparisonCampaign1ImpressionsData.chart.forEach((impression: any, index: number) => {
                this.comparisonCampaign1SpendData.chart.forEach((spend: any) => {
                  if(impression.week == spend.week) {
                    cpmArray ={
                      week: `${spend.week}`,
                      cpm: cpmCalc(spend.spend, impression.impression),
                      counter: 'w'+(index+1)
                    }

                    // total += parseFloat((cpmCalc(spend.spend, impression.impression).toFixed(2)));
                    this.comparisonCampaign1MetricData.chart.push(cpmArray);
                  }
                });
              });

              this.comparisonCampaign1MetricData.value = parseFloat(cpmCalc(this.comparisonCampaign1SpendData.value, this.comparisonCampaign1ImpressionsData.value).toFixed(2));

              // console.log(this.comparisonCampaign1MetricData);
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
        }

        if(flag == 2) {
          // reset data
          this.comparisonCampaign2MetricData = {
            type: '',
            value: 0,
            chart: []
          };

          this.comparisonCampaign2MetricData.type = metric;

          this.appService.getComparisonImpressionsSpend(this.brand, campaign, targeting, audience).subscribe((response) => {
            if(this.comparisonCampaign2ImpressionsData.chart.length && this.comparisonCampaign2SpendData.chart.length) {
              let cpmArray: any;
              // let total = 0 as number;

              this.comparisonCampaign2ImpressionsData.chart.forEach((impression: any, index: number) => {
                this.comparisonCampaign2SpendData.chart.forEach((spend: any) => {
                  if(impression.week == spend.week) {
                    cpmArray ={
                      week: `${spend.week}`,
                      cpm: cpmCalc(spend.spend, impression.impression),
                      counter: 'w'+(index+1)
                    }

                    // total += parseFloat((cpmCalc(spend.spend, impression.impression).toFixed(2)));
                    this.comparisonCampaign2MetricData.chart.push(cpmArray);
                  }
                });
              });

              this.comparisonCampaign2MetricData.value = parseFloat(cpmCalc(this.comparisonCampaign2SpendData.value, this.comparisonCampaign2ImpressionsData.value).toFixed(2));

              // console.log(this.comparisonCampaign2MetricData);
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
        }
      }

      if(metric == 'CPVM') {
        if(flag == 1) {
          // reset data
          this.comparisonCampaign1MetricData = {
            type: '',
            value: 0,
            chart: []
          };

          this.comparisonCampaign1MetricData.type = metric;

          this.appService.getComparisonCPVM(this.brand, campaign, targeting, audience).subscribe((response) => {
            if(response.status == 200) {
              let cpvmArray: any;
              // let total = 0 as number;
              let InViewImp = 0 as number;
              let TwoSecInViewImp = 0 as number;
              // console.log(response.results);

              response.results.forEach((cpvm: any, index: number) => {
                cpvmArray = {
                  week: `${cpvm.Date}`,
                  cpvm: cpvmCalc(cpvm.Spend, cpvm.InViewImp, cpvm.TwoSecInViewImp).toFixed(2),
                  counter: 'w'+(index+1)
                }

                // total += parseFloat((cpvmCalc(cpvm.Spend, cpvm.InViewImp, cpvm.TwoSecInViewImp).toFixed(2)));
                InViewImp += cpvm.InViewImp;
                TwoSecInViewImp += cpvm.TwoSecInViewImp;
                this.comparisonCampaign1MetricData.chart.push(cpvmArray);
              });

              this.comparisonCampaign1MetricData.value = parseFloat((cpvmCalc(this.comparisonCampaign1SpendData.value, InViewImp, TwoSecInViewImp).toFixed(2)));
            }

            // console.log(this.comparisonCampaign1MetricData);
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
        }

        if(flag == 2) {
          // reset data
          this.comparisonCampaign2MetricData = {
            type: '',
            value: 0,
            chart: []
          };

          this.comparisonCampaign2MetricData.type = metric;

          this.appService.getComparisonCPVM(this.brand, campaign, targeting, audience).subscribe((response) => {
            if(response.status == 200) {
              let cpvmArray: any;
              // let total = 0 as number;
              let InViewImp = 0 as number;
              let TwoSecInViewImp = 0 as number;
              // console.log(response.results);

              response.results.forEach((cpvm: any, index: number) => {
                cpvmArray = {
                  week: `${cpvm.Date}`,
                  cpvm: cpvmCalc(cpvm.Spend, cpvm.InViewImp, cpvm.TwoSecInViewImp).toFixed(2),
                  counter: 'w'+(index+1)
                }

                // total += parseFloat(cpvmCalc(cpvm.Spend, cpvm.InViewImp, cpvm.TwoSecInViewImp).toFixed(2));
                InViewImp += cpvm.InViewImp;
                TwoSecInViewImp += cpvm.TwoSecInViewImp;
                this.comparisonCampaign2MetricData.chart.push(cpvmArray);
              });

              this.comparisonCampaign2MetricData.value = parseFloat((cpvmCalc(this.comparisonCampaign2SpendData.value, InViewImp, TwoSecInViewImp).toFixed(2)));
            }

            // console.log(this.comparisonCampaign2MetricData);
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
        }
      }

      if(metric == 'In-View Rate') {
        if(flag == 1) {
          // reset data
          this.comparisonCampaign1MetricData = {
            type: '',
            value: 0,
            chart: []
          };

          this.comparisonCampaign1MetricData.type = metric;

          this.appService.getComparisonInViewRate(this.brand, campaign, targeting, audience).subscribe((response) => {
            if(response.status == 200) {
              let inViewRateArray: any;
              // let total = 0 as number;
              let InViewImp = 0 as number;
              let InViewMeasurableImpressions = 0 as number;
              // console.log(response.results);

              response.results.forEach((inViewRate: any, index: number) => {
                inViewRateArray = {
                  week: `${inViewRate.Date}`,
                  cpvm: inViewRateCalc(inViewRate.InViewImp, inViewRate.InViewMeasurableImpressions).toFixed(2),
                  counter: 'w'+(index+1)
                }

                InViewImp += inViewRate.InViewImp;
                InViewMeasurableImpressions += inViewRate.InViewMeasurableImpressions;

                // total += parseFloat((inViewRateCalc(inViewRate.InViewImp, inViewRate.InViewMeasurableImpressions).toFixed(2)));
                this.comparisonCampaign1MetricData.chart.push(inViewRateArray);
              });

              this.comparisonCampaign1MetricData.value = parseFloat((inViewRateCalc(InViewImp, InViewMeasurableImpressions).toFixed(2)));
            }

            // console.log(this.comparisonCampaign1MetricData);
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
        }

        if(flag == 2) {
          // reset data
          this.comparisonCampaign2MetricData = {
            type: '',
            value: 0,
            chart: []
          };

          this.comparisonCampaign2MetricData.type = metric;

          this.appService.getComparisonInViewRate(this.brand, campaign, targeting, audience).subscribe((response) => {
            if(response.status == 200) {
              let inViewRateArray: any;
              // let total = 0 as number;
              let InViewImp = 0 as number;
              let InViewMeasurableImpressions = 0 as number;
              // console.log(response.results);

              response.results.forEach((inViewRate: any, index: number) => {
                inViewRateArray = {
                  week: `${inViewRate.Date}`,
                  cpvm: inViewRateCalc(inViewRate.InViewImp, inViewRate.InViewMeasurableImpressions).toFixed(2),
                  counter: 'w'+(index+1)
                }

                InViewImp += inViewRate.InViewImp;
                InViewMeasurableImpressions += inViewRate.InViewMeasurableImpressions;

                // total += parseFloat(inViewRateCalc(inViewRate.InViewImp, inViewRate.InViewMeasurableImpressions).toFixed(2));
                this.comparisonCampaign2MetricData.chart.push(inViewRateArray);
              });

              this.comparisonCampaign2MetricData.value = parseFloat((inViewRateCalc(InViewImp, InViewMeasurableImpressions).toFixed(2)));
            }

            // console.log(this.comparisonCampaign2MetricData);
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
        }
      }

      if(metric == '2 Sec Video In-View Rate') {
        if(flag == 1) {
          // reset data
          this.comparisonCampaign1MetricData = {
            type: '',
            value: 0,
            chart: []
          };

          this.comparisonCampaign1MetricData.type = metric;

          this.appService.getComparison2SecVideoInViewRate(this.brand, campaign, targeting, audience).subscribe((response) => {
            if(response.status == 200) {
              let video2SecinViewRateArray: any;
              // let total = 0 as number;
              let TwoSecInViewImp = 0 as number;
              let InViewMeasurableImpressions = 0 as number;
              // console.log(response.results);

              response.results.forEach((video2SecinViewRate: any, index: number) => {
                video2SecinViewRateArray = {
                  week: `${video2SecinViewRate.Date}`,
                  cpvm: video2SecinViewRateCalc(video2SecinViewRate.TwoSecInViewImp, video2SecinViewRate.InViewMeasurableImpressions).toFixed(2),
                  counter: 'w'+(index+1)
                }

                TwoSecInViewImp += video2SecinViewRate.TwoSecInViewImp;
                InViewMeasurableImpressions += video2SecinViewRate.InViewMeasurableImpressions;

                // total += parseFloat((video2SecinViewRateCalc(video2SecinViewRate.TwoSecInViewImp, video2SecinViewRate.InViewMeasurableImpressions).toFixed(2)));
                this.comparisonCampaign1MetricData.chart.push(video2SecinViewRateArray);
              });

              this.comparisonCampaign1MetricData.value = parseFloat((video2SecinViewRateCalc(TwoSecInViewImp, InViewMeasurableImpressions).toFixed(2)));
            }

            // console.log(this.comparisonCampaign1MetricData);
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
        }

        if(flag == 2) {
          // reset data
          this.comparisonCampaign2MetricData = {
            type: '',
            value: 0,
            chart: []
          };

          this.comparisonCampaign2MetricData.type = metric;

          this.appService.getComparison2SecVideoInViewRate(this.brand, campaign, targeting, audience).subscribe((response) => {
            if(response.status == 200) {
              let video2SecinViewRateArray: any;
              // let total = 0 as number;
              let TwoSecInViewImp = 0 as number;
              let InViewMeasurableImpressions = 0 as number;
              // console.log(response.results);

              response.results.forEach((video2SecinViewRate: any, index: number) => {
                video2SecinViewRateArray = {
                  week: `${video2SecinViewRate.Date}`,
                  cpvm: video2SecinViewRateCalc(video2SecinViewRate.TwoSecInViewImp, video2SecinViewRate.InViewMeasurableImpressions).toFixed(2),
                  counter: 'w'+(index+1)
                }

                TwoSecInViewImp += video2SecinViewRate.TwoSecInViewImp;
                InViewMeasurableImpressions += video2SecinViewRate.InViewMeasurableImpressions;

                // total += parseFloat(video2SecinViewRateCalc(video2SecinViewRate.TwoSecInViewImp, video2SecinViewRate.InViewMeasurableImpressions).toFixed(2));
                this.comparisonCampaign2MetricData.chart.push(video2SecinViewRateArray);
              });

              this.comparisonCampaign2MetricData.value = parseFloat((video2SecinViewRateCalc(TwoSecInViewImp, InViewMeasurableImpressions).toFixed(2)));
            }

            // console.log(this.comparisonCampaign2MetricData);
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
        }
      }

      if(metric == 'In-View Time (Display)') {
        if(flag == 1) {
          // reset data
          this.comparisonCampaign1MetricData = {
            type: '',
            value: 0,
            chart: []
          };

          this.comparisonCampaign1MetricData.type = metric;

          this.appService.getComparisonInViewTimeDisplay(this.brand, campaign, targeting, audience).subscribe((response) => {
            if(response.status == 200) {
              let inViewTimeDisplayArray: any;
              // let total = 0 as number;
              let TotExposureTime = 0 as number;
              let InViewImp = 0 as number;
              // console.log(response.results);

              response.results.forEach((inViewTimeDisplay: any, index: number) => {
                inViewTimeDisplayArray = {
                  week: `${inViewTimeDisplay.Date}`,
                  cpvm: inViewTimeDisplayCalc(inViewTimeDisplay.TotExposureTime, inViewTimeDisplay.InViewImp).toFixed(2),
                  counter: 'w'+(index+1)
                }

                TotExposureTime += inViewTimeDisplay.TotExposureTime;
                InViewImp += inViewTimeDisplay.InViewImp;

                // total += parseFloat((inViewTimeDisplayCalc(inViewTimeDisplay.TotExposureTime, inViewTimeDisplay.InViewImp).toFixed(2)));
                this.comparisonCampaign1MetricData.chart.push(inViewTimeDisplayArray);
              });

              this.comparisonCampaign1MetricData.value = parseFloat((inViewTimeDisplayCalc(TotExposureTime, InViewImp).toFixed(2)));
            }

            // console.log(this.comparisonCampaign1MetricData);
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
        }

        if(flag == 2) {
          // reset data
          this.comparisonCampaign2MetricData = {
            type: '',
            value: 0,
            chart: []
          };

          this.comparisonCampaign2MetricData.type = metric;

          this.appService.getComparisonInViewTimeDisplay(this.brand, campaign, targeting, audience).subscribe((response) => {
            if(response.status == 200) {
              let inViewTimeDisplayArray: any;
              // let total = 0 as number;
              let TotExposureTime = 0 as number;
              let InViewImp = 0 as number;
              // console.log(response.results);

              response.results.forEach((inViewTimeDisplay: any, index: number) => {
                inViewTimeDisplayArray = {
                  week: `${inViewTimeDisplay.Date}`,
                  cpvm: inViewTimeDisplayCalc(inViewTimeDisplay.TotExposureTime, inViewTimeDisplay.InViewImp).toFixed(2),
                  counter: 'w'+(index+1)
                }

                TotExposureTime += inViewTimeDisplay.TotExposureTime;
                InViewImp += inViewTimeDisplay.InViewImp;

                // total += parseFloat(inViewTimeDisplayCalc(inViewTimeDisplay.TotExposureTime, inViewTimeDisplay.InViewImp).toFixed(2));
                this.comparisonCampaign2MetricData.chart.push(inViewTimeDisplayArray);
              });

              this.comparisonCampaign2MetricData.value = parseFloat((inViewTimeDisplayCalc(TotExposureTime, InViewImp).toFixed(2)));
            }

            // console.log(this.comparisonCampaign2MetricData);
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
        }
      }

      if(metric == 'In-View Time (Video)') {
        if(flag == 1) {
          // reset data
          this.comparisonCampaign1MetricData = {
            type: '',
            value: 0,
            chart: []
          };

          this.comparisonCampaign1MetricData.type = metric;

          this.appService.getComparisonInViewTimeVideo(this.brand, campaign, targeting, audience).subscribe((response) => {
            if(response.status == 200) {
              let inViewTimeVideoArray: any;
              // let total = 0 as number;
              let TotExposureTime = 0 as number;
              let TwoSecInViewImp = 0 as number;
              // console.log(response.results);

              response.results.forEach((inViewTimeVideo: any, index: number) => {
                inViewTimeVideoArray = {
                  week: `${inViewTimeVideo.Date}`,
                  cpvm: inViewTimeVideoCalc(inViewTimeVideo.TotExposureTime, inViewTimeVideo.TwoSecInViewImp).toFixed(2),
                  counter: 'w'+(index+1)
                }

                TotExposureTime += inViewTimeVideo.TotExposureTime;
                TwoSecInViewImp += inViewTimeVideo.TwoSecInViewImp;

                // total += parseFloat((inViewTimeVideoCalc(inViewTimeVideo.TotExposureTime, inViewTimeVideo.TwoSecInViewImp).toFixed(2)));
                this.comparisonCampaign1MetricData.chart.push(inViewTimeVideoArray);
              });

              this.comparisonCampaign1MetricData.value = parseFloat((inViewTimeDisplayCalc(TotExposureTime, TwoSecInViewImp).toFixed(2)));
            }

            // console.log(this.comparisonCampaign1MetricData);
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
        }

        if(flag == 2) {
          // reset data
          this.comparisonCampaign2MetricData = {
            type: '',
            value: 0,
            chart: []
          };

          this.comparisonCampaign2MetricData.type = metric;

          this.appService.getComparisonInViewTimeVideo(this.brand, campaign, targeting, audience).subscribe((response) => {
            if(response.status == 200) {
              let inViewTimeVideoArray: any;
              // let total = 0 as number;
              let TotExposureTime = 0 as number;
              let TwoSecInViewImp = 0 as number;
              // console.log(response.results);

              response.results.forEach((inViewTimeVideo: any, index: number) => {
                inViewTimeVideoArray = {
                  week: `${inViewTimeVideo.Date}`,
                  cpvm: inViewTimeVideoCalc(inViewTimeVideo.TotExposureTime, inViewTimeVideo.TwoSecInViewImp).toFixed(2),
                  counter: 'w'+(index+1)
                }

                TotExposureTime += inViewTimeVideo.TotExposureTime;
                TwoSecInViewImp += inViewTimeVideo.TwoSecInViewImp;

                // total += parseFloat(inViewTimeVideoCalc(inViewTimeVideo.TotExposureTime, inViewTimeVideo.TwoSecInViewImp).toFixed(2));
                this.comparisonCampaign2MetricData.chart.push(inViewTimeVideoArray);
              });

              this.comparisonCampaign2MetricData.value = parseFloat((inViewTimeDisplayCalc(TotExposureTime, TwoSecInViewImp).toFixed(2)));
            }

            // console.log(this.comparisonCampaign2MetricData);
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
        }
      }

      if(metric == 'BL') {
        if(flag == 1) {
          // reset data
          this.comparisonCampaign1MetricData = {
            type: '',
            value: 0,
            chart: []
          };

          this.comparisonCampaign1MetricDataBL = {
            type: '',
            comscoreChart: [],
            facebookChart: [],
            youTubeChart: []
          };

          this.comparisonCampaign1MetricDataBL.type = metric;

          this.appService.getComparisonBL(this.brand, campaign, targeting, audience).subscribe((response) => {
            if(response.status == 200) {
              if(response.results[0].length) {
                let comscoreArray: any;
                response.results[0].forEach((brandLift: any) => {
                  comscoreArray = {
                    audience: brandLift.AdGroup,
                    bl: (brandLift.Comscore_BL*100).toFixed(2)
                  }

                  this.comparisonCampaign1MetricDataBL.comscoreChart.push(comscoreArray);
                });
              }

              if(response.results[1].length) {
                let facebookArray: any;
                response.results[1].forEach((brandLift: any) => {
                  facebookArray = {
                    audience: brandLift.AdGroup,
                    bl: (brandLift.FB_BL*100).toFixed(2)
                  }

                  this.comparisonCampaign1MetricDataBL.facebookChart.push(facebookArray);
                });
              }

              if(response.results[2].length) {
                let youTubeArray: any;
                response.results[2].forEach((brandLift: any) => {
                  youTubeArray = {
                    audience: brandLift.AdGroup,
                    bl: (brandLift.YT_BL*100).toFixed(2)
                  }

                  this.comparisonCampaign1MetricDataBL.youTubeChart.push(youTubeArray);
                });
              }

              // console.log(this.comparisonCampaign1MetricDataBL)
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
        }

        if(flag == 2) {
          // reset data
          this.comparisonCampaign2MetricData = {
            type: '',
            value: 0,
            chart: []
          };

          this.comparisonCampaign2MetricDataBL = {
            type: '',
            comscoreChart: [],
            facebookChart: [],
            youTubeChart: []
          };

          this.comparisonCampaign2MetricDataBL.type = metric;

          this.appService.getComparisonBL(this.brand, campaign, targeting, audience).subscribe((response) => {
            if(response.status == 200) {
              if(response.results[0].length) {
                let comscoreArray: any;
                response.results[0].forEach((brandLift: any) => {
                  comscoreArray = {
                    audience: brandLift.AdGroup,
                    bl: (brandLift.Comscore_BL*100).toFixed(2)
                  }

                  this.comparisonCampaign2MetricDataBL.comscoreChart.push(comscoreArray);
                });
              }

              if(response.results[1].length) {
                let facebookArray: any;
                response.results[1].forEach((brandLift: any) => {
                  facebookArray = {
                    audience: brandLift.AdGroup,
                    bl: (brandLift.FB_BL*100).toFixed(2)
                  }

                  this.comparisonCampaign2MetricDataBL.facebookChart.push(facebookArray);
                });
              }

              if(response.results[2].length) {
                let youTubeArray: any;
                response.results[2].forEach((brandLift: any) => {
                  youTubeArray = {
                    audience: brandLift.AdGroup,
                    bl: (brandLift.YT_BL*100).toFixed(2)
                  }

                  this.comparisonCampaign2MetricDataBL.youTubeChart.push(youTubeArray);
                });
              }

              // console.log(this.comparisonCampaign2MetricDataBL)
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
        }
      }

      if(metric == 'SL') {
        if(flag == 1) {
          // reset data
          this.comparisonCampaign1MetricData = {
            type: '',
            value: 0,
            chart: []
          };

          this.comparisonCampaign1MetricDataSL = {
            type: '',
            brandChart: [],
            prodChart: []
          };

          this.comparisonCampaign1MetricDataSL.type = metric;

          this.appService.getComparisonSL(this.brand, campaign, targeting, audience).subscribe((response) => {
            if(response.status == 200) {
              // console.log(response.results);
              if(response.results[0].length) {
                let brandArray: any;
                response.results[0].forEach((salesLift: any) => {
                  brandArray = {
                    audience: salesLift.AdGroup,
                    sl: (salesLift.Brand_ODC_SL*100).toFixed(2)
                  }

                  this.comparisonCampaign1MetricDataSL.brandChart.push(brandArray);
                });
              }

              if(response.results[1].length) {
                let prodArray: any;
                response.results[1].forEach((salesLift: any) => {
                  prodArray = {
                    audience: salesLift.AdGroup,
                    sl: (salesLift.Prod_ODC_SL*100).toFixed(2)
                  }

                  this.comparisonCampaign1MetricDataSL.prodChart.push(prodArray);
                });
              }

              // console.log(this.comparisonCampaign1MetricDataSL)
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
        }

        if(flag == 2) {
          // reset data
          this.comparisonCampaign2MetricData = {
            type: '',
            value: 0,
            chart: []
          };

          this.comparisonCampaign2MetricDataSL = {
            type: '',
            brandChart: [],
            prodChart: []
          };

          this.comparisonCampaign2MetricDataSL.type = metric;

          this.appService.getComparisonSL(this.brand, campaign, targeting, audience).subscribe((response) => {
            if(response.status == 200) {
              // console.log(response.results);
              if(response.results[0].length) {
                let brandArray: any;
                response.results[0].forEach((salesLift: any) => {
                  brandArray = {
                    audience: salesLift.AdGroup,
                    sl: (salesLift.Brand_ODC_SL*100).toFixed(2)
                  }

                  this.comparisonCampaign2MetricDataSL.brandChart.push(brandArray);
                });
              }

              if(response.results[1].length) {
                let prodArray: any;
                response.results[1].forEach((salesLift: any) => {
                  prodArray = {
                    audience: salesLift.AdGroup,
                    sl: (salesLift.Prod_ODC_SL*100).toFixed(2)
                  }

                  this.comparisonCampaign2MetricDataSL.prodChart.push(prodArray);
                });
              }

              // console.log(this.comparisonCampaign2MetricDataSL)
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
        }
      }
    });

    return promise;
  }

  getComparisonMetricDifference(metric: string) {
    // Reset data
    this.comparisonDifferenceMetricData = {
      type: '',
      value: 0,
      chart: [],
      percentageDifference: 0
    };

    if(metric == 'CPM') {
      let metricDifference: any[] = [];


      // console.log(this.comparisonCampaign1MetricData);
      // console.log(this.comparisonCampaign2MetricData);

      this.comparisonDifferenceMetricData.type = metric;

      if(this.comparisonCampaign1MetricData.chart.length && this.comparisonCampaign2MetricData.chart.length) {
        // console.log('both');
        let metricArray: any;

        this.comparisonCampaign1MetricData.chart.forEach((metric_1: any) => {
          metricArray = {
            week: metric_1.week,
            cpm1: metric_1.cpm,
            cpm2: 0
          }

          metricDifference.push(metricArray);
        });

        this.comparisonCampaign2MetricData.chart.forEach((metric_2: any) => {
          let flag = true;

          metricDifference.forEach((metric_1: any, index: number) => {
            if(metric_2.week == metric_1.week) {
              flag = false;

              metricDifference[index]['cpm1'] = metric_1.cpm1;
              metricDifference[index]['cpm2'] = metric_2.cpm;
            }
          });

          if(flag) {
            metricArray = {
              week: metric_2.week,
              cpm1: 0,
              cpm2: metric_2.cpm
            }

            metricDifference.push(metricArray);
          }
        });

        metricDifference.sort((a,b) => {
          return new Date(a.week).getTime() - new Date(b.week).getTime();
        });

        // console.log('difference');
        // console.log(impressionDifference);

        this.comparisonDifferenceMetricData.chart = metricDifference;
        this.comparisonDifferenceMetricData.value = Math.abs(this.comparisonCampaign1MetricData.value - this.comparisonCampaign2MetricData.value);
        this.comparisonDifferenceMetricData.percentageDifference = percentageDifference(this.comparisonCampaign1MetricData.value, this.comparisonCampaign2MetricData.value);
      } else if(this.comparisonCampaign1MetricData.chart.length && !this.comparisonCampaign2MetricData.chart.length) {
        // console.log('imp 1')
        let metricArray: any;

        this.comparisonCampaign1MetricData.chart.forEach((metric_1: any) => {
          metricArray = {
            week: metric_1.week,
            cpm1: metric_1.cpm,
            cpm2: 0
          }

          metricDifference.push(metricArray);
        });
        this.comparisonDifferenceMetricData.chart = metricDifference;
        this.comparisonDifferenceMetricData.value = this.comparisonCampaign1MetricData.value;
        this.comparisonDifferenceMetricData.percentageDifference = percentageDifference(this.comparisonCampaign1MetricData.value, this.comparisonCampaign2MetricData.value);
      } else if(!this.comparisonCampaign1MetricData.chart.length && this.comparisonCampaign2MetricData.chart.length) {
        // console.log('imp 2')
        let metricArray: any;

        this.comparisonCampaign2MetricData.chart.forEach((metric_2: any) => {
          metricArray = {
            week: metric_2.week,
            cpm1: 0,
            cpm2: metric_2.cpm
          }

          metricDifference.push(metricArray);
        });
        this.comparisonDifferenceMetricData.chart = metricDifference;
        this.comparisonDifferenceMetricData.value = this.comparisonCampaign2MetricData.value;
        this.comparisonDifferenceMetricData.percentageDifference = percentageDifference(this.comparisonCampaign1MetricData.value, this.comparisonCampaign2MetricData.value);
      }
    }

    if(metric == 'CPVM') {
      let metricDifference: any[] = [];


      // console.log(this.comparisonCampaign1MetricData);
      // console.log(this.comparisonCampaign2MetricData);

      this.comparisonDifferenceMetricData.type = metric;

      if(this.comparisonCampaign1MetricData.chart.length && this.comparisonCampaign2MetricData.chart.length) {
        // console.log('both');
        let metricArray: any;

        this.comparisonCampaign1MetricData.chart.forEach((metric_1: any) => {
          metricArray = {
            week: metric_1.week,
            cpvm1: metric_1.cpvm,
            cpvm2: 0
          }

          metricDifference.push(metricArray);
        });

        this.comparisonCampaign2MetricData.chart.forEach((metric_2: any) => {
          let flag = true;

          metricDifference.forEach((metric_1: any, index: number) => {
            if(metric_2.week == metric_1.week) {
              flag = false;

              metricDifference[index]['cpvm1'] = metric_1.cpvm1;
              metricDifference[index]['cpvm2'] = metric_2.cpvm;
            }
          });

          if(flag) {
            metricArray = {
              week: metric_2.week,
              cpvm1: 0,
              cpvm2: metric_2.cpvm
            }

            metricDifference.push(metricArray);
          }
        });

        metricDifference.sort((a,b) => {
          return new Date(a.week).getTime() - new Date(b.week).getTime();
        });

        // console.log('difference');
        // console.log(impressionDifference);

        this.comparisonDifferenceMetricData.chart = metricDifference;
        this.comparisonDifferenceMetricData.value = Math.abs(this.comparisonCampaign1MetricData.value - this.comparisonCampaign2MetricData.value);
        this.comparisonDifferenceMetricData.percentageDifference = percentageDifference(this.comparisonCampaign1MetricData.value, this.comparisonCampaign2MetricData.value);
      } else if(this.comparisonCampaign1MetricData.chart.length && !this.comparisonCampaign2MetricData.chart.length) {
        // console.log('imp 1')
        let metricArray: any;

        this.comparisonCampaign1MetricData.chart.forEach((metric_1: any) => {
          metricArray = {
            week: metric_1.week,
            cpvm1: metric_1.cpvm,
            cpvm2: 0
          }

          metricDifference.push(metricArray);
        });
        this.comparisonDifferenceMetricData.chart = metricDifference;
        this.comparisonDifferenceMetricData.value = this.comparisonCampaign1MetricData.value;
        this.comparisonDifferenceMetricData.percentageDifference = percentageDifference(this.comparisonCampaign1MetricData.value, this.comparisonCampaign2MetricData.value);
      } else if(!this.comparisonCampaign1MetricData.chart.length && this.comparisonCampaign2MetricData.chart.length) {
        // console.log('imp 2')
        let metricArray: any;

        this.comparisonCampaign2MetricData.chart.forEach((metric_2: any) => {
          metricArray = {
            week: metric_2.week,
            cpvm1: 0,
            cpvm2: metric_2.cpvm
          }

          metricDifference.push(metricArray);
        });
        this.comparisonDifferenceMetricData.chart = metricDifference;
        this.comparisonDifferenceMetricData.value = this.comparisonCampaign2MetricData.value;
        this.comparisonDifferenceMetricData.percentageDifference = percentageDifference(this.comparisonCampaign1MetricData.value, this.comparisonCampaign2MetricData.value);
      }
    }

    if(metric == 'In-View Rate' || metric == '2 Sec Video In-View Rate' || metric == 'In-View Time (Display)' || metric == 'In-View Time (Video)') {
      // let metricDifference: any[] = [];


      // console.log(this.comparisonCampaign1MetricData);
      // console.log(this.comparisonCampaign2MetricData);

      this.comparisonDifferenceMetricData.type = metric;

      if(this.comparisonCampaign1MetricData.chart.length && this.comparisonCampaign2MetricData.chart.length) {
        // console.log('both');
        // let metricArray: any;

        // this.comparisonCampaign1MetricData.chart.forEach((metric_1: any) => {
        //   metricArray = {
        //     week: metric_1.week,
        //     cpvm1: metric_1.cpvm,
        //     cpvm2: 0
        //   }

        //   metricDifference.push(metricArray);
        // });

        // this.comparisonCampaign2MetricData.chart.forEach((metric_2: any) => {
        //   let flag = true;

        //   metricDifference.forEach((metric_1: any, index: number) => {
        //     if(metric_2.week == metric_1.week) {
        //       flag = false;

        //       metricDifference[index]['cpvm1'] = metric_1.cpvm1;
        //       metricDifference[index]['cpvm2'] = metric_2.cpvm;
        //     }
        //   });

        //   if(flag) {
        //     metricArray = {
        //       week: metric_2.week,
        //       cpvm1: 0,
        //       cpvm2: metric_2.cpvm
        //     }

        //     metricDifference.push(metricArray);
        //   }
        // });

        // metricDifference.sort((a,b) => {
        //   return new Date(a.week).getTime() - new Date(b.week).getTime();
        // });

        // console.log('difference');
        // console.log(impressionDifference);

        // this.comparisonDifferenceMetricData.chart = metricDifference;
        this.comparisonDifferenceMetricData.value = Math.abs(this.comparisonCampaign1MetricData.value - this.comparisonCampaign2MetricData.value);
        this.comparisonDifferenceMetricData.percentageDifference = percentageDifference(this.comparisonCampaign1MetricData.value, this.comparisonCampaign2MetricData.value);
      } else if(this.comparisonCampaign1MetricData.chart.length && !this.comparisonCampaign2MetricData.chart.length) {
        // console.log('imp 1')
        // let metricArray: any;

        // this.comparisonCampaign1MetricData.chart.forEach((metric_1: any) => {
        //   metricArray = {
        //     week: metric_1.week,
        //     cpvm1: metric_1.cpvm,
        //     cpvm2: 0
        //   }

        //   metricDifference.push(metricArray);
        // });
        // this.comparisonDifferenceMetricData.chart = metricDifference;
        this.comparisonDifferenceMetricData.value = this.comparisonCampaign1MetricData.value;
        this.comparisonDifferenceMetricData.percentageDifference = percentageDifference(this.comparisonCampaign1MetricData.value, this.comparisonCampaign2MetricData.value);
      } else if(!this.comparisonCampaign1MetricData.chart.length && this.comparisonCampaign2MetricData.chart.length) {
        // console.log('imp 2')
        // let metricArray: any;

        // this.comparisonCampaign2MetricData.chart.forEach((metric_2: any) => {
        //   metricArray = {
        //     week: metric_2.week,
        //     cpvm1: 0,
        //     cpvm2: metric_2.cpvm
        //   }

        //   metricDifference.push(metricArray);
        // });
        // this.comparisonDifferenceMetricData.chart = metricDifference;
        this.comparisonDifferenceMetricData.value = this.comparisonCampaign2MetricData.value;
        this.comparisonDifferenceMetricData.percentageDifference = percentageDifference(this.comparisonCampaign1MetricData.value, this.comparisonCampaign2MetricData.value);
      }
    }

    // console.log(this.comparisonDifferenceMetricData);
  }
}
