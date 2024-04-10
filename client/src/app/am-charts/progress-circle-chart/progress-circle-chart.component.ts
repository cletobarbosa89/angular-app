import { Component, OnInit, Inject, Input, NgZone, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute, ParamMap, UrlSegment } from '@angular/router';

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-progress-circle-chart',
  templateUrl: './progress-circle-chart.component.html',
  styleUrls: ['./progress-circle-chart.component.css']
})
export class ProgressCircleChartComponent implements OnInit {
  private chart: am4charts.RadarChart;
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

      this.chart = am4core.create(this.chartId, am4charts.RadarChart);
      this.chart.startAngle = 270;
      this.chart.endAngle = 630;
      this.chart.innerRadius = am4core.percent(80);
      this.chart.numberFormatter.numberFormat = "";
      this.chart.padding(0, 0, 0, 0);

      // console.log(this.widgetData)

      if(this.widgetCategory == 'digitalCreativeScoreDonut')
        this.chart.data = this.widgetData;

      // Create axes
      var categoryAxis = this.chart.yAxes.push(new am4charts.CategoryAxis<am4charts.AxisRendererRadial>());
      categoryAxis.dataFields.category = "category";
      categoryAxis.renderer.grid.template.strokeOpacity = 0;
      categoryAxis.renderer.minGridDistance = 100;
      categoryAxis.renderer.grid.push(new am4charts.Grid()).disabled = true;

      var valueAxis = this.chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
      valueAxis.renderer.grid.template.strokeOpacity = 0;
      valueAxis.min = 0;
      valueAxis.max = 100;
      // valueAxis.renderer.grid.push(new am4charts.Grid<am4charts.GridCircular>()).disabled = true;

      // Create series
      var series1 = this.chart.series.push(new am4charts.RadarColumnSeries());
      series1.dataFields.valueX = "full";
      series1.dataFields.categoryY = "category";
      series1.clustered = false;
      series1.columns.template.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
      series1.columns.template.fillOpacity = 0.08;
      // series1.columns.template.cornerRadiusTopLeft = 100;
      series1.columns.template.strokeWidth = 0;
      series1.columns.template.radarColumn.cornerRadius = 100;

      var series2 = this.chart.series.push(new am4charts.RadarColumnSeries());
      series2.dataFields.valueX = "value";
      series2.dataFields.categoryY = "category";
      series2.clustered = false;
      series2.columns.template.strokeWidth = 0;
      series2.columns.template.radarColumn.cornerRadius = 100;

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
        this.chart.appear();

        // console.log(this.chart.htmlContainer?.id);
        // console.log(this.widgetData);
        // console.log(this.creativeScore);
      }
    }
  }

}
