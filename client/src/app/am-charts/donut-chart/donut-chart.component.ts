import { Component, OnInit, Inject, Input, NgZone, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute, ParamMap, UrlSegment } from '@angular/router';

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.css']
})
export class DonutChartComponent implements OnInit {

  private chart: am4charts.PieChart;
  chartId: any;
  charts: am4core.Sprite[];
  creativeScoreLabel: am4core.Label;

  @Input() widgetData: any;
  @Input() widgetId: string;
  @Input() widgetCategory: string;
  @Input() classes: string[];
  @Input() creativeScore: number;

  constructor(@Inject(PLATFORM_ID) private platformId: any, private zone: NgZone, private route: ActivatedRoute) {}

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit() {
    if(this.widgetId)
      this.chartId = 'chartdiv-' + this.route.snapshot.url[0].toString()+'-'+this.widgetId;
    else
      this.chartId = 'chartdiv-' + this.route.snapshot.url[0].toString();
    // let charts = am4core.registry.baseSprites;
    // console.log(charts);
    // console.log(this.widgetData);
  }

  ngAfterViewInit() {
    // Chart code goes in here
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);
      // Themes end

      this.chart = am4core.create(this.chartId, am4charts.PieChart);
      this.chart.innerRadius = am4core.percent(50);

      // console.log(this.widgetData)

      if(this.widgetCategory == 'digitalCreativeScoreDonut')
        this.chart.data = this.widgetData;

      // this.chart.data = [
      //   { value: 10, category: "One" },
      //   { value: 9, category: "Two" },
      //   { value: 6, category: "Three" },
      //   { value: 5, category: "Four" },
      //   { value: 4, category: "Five" },
      //   { value: 3, category: "Six" },
      //   { value: 1, category: "Seven" },
      // ];

      // console.log(this.widgetData);

      // Create series
      // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
      let series = this.chart.series.push(new am4charts.PieSeries());
      series.dataFields.category = (this.widgetData.length)?Object.keys(this.widgetData[0])[0]:"";
      series.dataFields.value = (this.widgetData.length)?Object.keys(this.widgetData[0])[1]:"";
      series.alignLabels = false;
      series.labels.template.hidden = true;

      series.slices.template.tooltipText = '{category}: {value.value}%';

      this.creativeScoreLabel = this.chart.createChild(am4core.Label);
      this.creativeScoreLabel.text = this.creativeScore.toFixed(0).toString()+'%';
      this.creativeScoreLabel.fill = am4core.color('#fff');
      this.creativeScoreLabel.fontSize = 30;
      this.creativeScoreLabel.fontWeight = "bold";
      this.creativeScoreLabel.align = "center";
      this.creativeScoreLabel.isMeasured = false;
      this.creativeScoreLabel.x = am4core.percent(50);
      this.creativeScoreLabel.y = am4core.percent(50);
      this.creativeScoreLabel.horizontalCenter = "middle";
      this.creativeScoreLabel.verticalCenter = "middle";
    });
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {

      let charts = am4core.registry.baseSprites;

      for(let i = 0; i < charts.length; i++) {
        if (charts[i].htmlContainer?.id === this.chartId) {
          charts[i].dispose();
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(typeof this.chart != 'undefined') {
      if(changes.widgetData) {
        // console.log(changes);
        // console.log(this.chart);


        this.creativeScoreLabel.text = this.creativeScore.toFixed(0).toString()+'%';
        this.chart.data = this.widgetData
        this.chart.validateData();

        // console.log(this.chart.htmlContainer?.id);
        // console.log(this.widgetData);
        // console.log(this.creativeScore);
      }
    }
  }

}
