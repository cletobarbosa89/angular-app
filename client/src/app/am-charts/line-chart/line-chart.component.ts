import { Component, OnInit, Inject, Input, NgZone, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute, ParamMap, UrlSegment } from '@angular/router';

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4plugins_regression from "@amcharts/amcharts4/plugins/regression";
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  private chart: am4charts.XYChart;
  chartId: any;
  charts: am4core.Sprite[];

  @Input() widgetData: any;
  @Input() widgetId: string;
  @Input() widgetCategory: string;
  @Input() widgetColor: string;
  @Input() classes: string[];

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

      this.chart = am4core.create(this.chartId, am4charts.XYChart);

      // this.chart.data = [];

      let xAxis: any;

      if(this.widgetCategory == 'comparison') {
        this.chart.data = this.widgetData;

        // Create axes
        xAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
        xAxis.dataFields.category = (this.widgetData.length)?Object.keys(this.widgetData[0])[0]:"";
      } else {

        // chart.padding(40, 40, 40, 40);

        // Set input format for the dates
        // this.chart.dateFormatter.inputDateFormat = "mm-dd-yyyy";
        // this.chart.dateFormatter.dateFormat = "dd MMM yyyy";

        // Create axes
        xAxis = this.chart.xAxes.push(new am4charts.DateAxis());
        xAxis.renderer.minGridDistance = 40;
        xAxis.renderer.grid.template.location = 0;
        xAxis.dateFormats.setKey("day", "dd MMM yyyy");
        xAxis.renderer.labels.template.fill = am4core.color("#FFF");
        xAxis.renderer.labels.template.fontSize = 12;
        xAxis.dataFields.date = (this.widgetData.length)?Object.keys(this.widgetData[0])[0]:"";
        // xAxis.renderer.grid.template.strokeWidth = 0;
        xAxis.groupData = true;
      }

      // Create value axis
      let yAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
      yAxis.renderer.labels.template.fill = am4core.color("#FFF");
      yAxis.renderer.labels.template.fontSize = 12;
      // yAxis.renderer.grid.template.strokeWidth = 0;
      // yAxis.renderer.baseGrid.disabled = true;

      // Create series
      let series = this.chart.series.push(new am4charts.LineSeries());
      if(this.widgetCategory == 'comparison')
        series.dataFields.categoryX = (this.widgetData.length)?Object.keys(this.widgetData[0])[0]:"";
      else
        series.dataFields.dateX = (this.widgetData.length)?Object.keys(this.widgetData[0])[0]:"";
      series.dataFields.valueY = (this.widgetData.length)?Object.keys(this.widgetData[0])[1]:"";
      series.strokeWidth = 2;
      series.name = (this.widgetData.length)?Object.keys(this.widgetData[0])[1]:"";
      // series.minBulletDistance = 10;
      // series.tooltipText = "{name}: {valueY.value}";

      if(this.widgetCategory == 'comparison') {
        series.stroke = am4core.color(this.widgetColor);

        this.chart.paddingBottom = 50;

        xAxis.renderer.labels.template.disabled = true;
        // xAxis.renderer.labels.template.fill = am4core.color("rgba(0, 0, 0, 0)");
        yAxis.min = 0;
        yAxis.strictMinMax = true;

        // let tooltip = new am4core.Tooltip;
        // tooltip.label.fill = am4core.color("#000");
        // tooltip.getFillFromObject = false;

        let bullet = series.bullets.push(new am4charts.LabelBullet);
        bullet.label.text = "{counter}";
        bullet.label.fontSize = 12;
        bullet.label.fill = am4core.color("#FFF");
        bullet.label.rotation = -45;
        bullet.label.truncate = false;
        bullet.label.hideOversized = false;
        bullet.label.horizontalCenter = "middle";
        bullet.locationY = 1;
        bullet.dy = 10;
        this.chart.maskBullets = false;

        bullet.adapter.add("dy", function(dy: any, target) {
          if (target.dataItem && target.dataItem.index%2==0) {
            return dy + 20;
          }
          return dy;
        })
      }

      this.chart.cursor = new am4charts.XYCursor();
      this.chart.cursor.snapToSeries = series;
      this.chart.cursor.xAxis = xAxis;
      this.chart.numberFormatter.numberFormat = '#.00a';

      if(this.widgetCategory != 'comparison') {
        this.chart.scrollbarX = new am4core.Scrollbar();
        this.chart.scrollbarX.minHeight = 2;
        this.chart.scrollbarX.startGrip.icon.disabled = true;
        this.chart.scrollbarX.endGrip.icon.disabled = true;
        this.chart.scrollbarX.startGrip.background.disabled = true;
        this.chart.scrollbarX.endGrip.background.disabled = true;
        this.chart.scrollbarX.startGrip.icon.scale = 0.1;
        this.chart.scrollbarX.endGrip.icon.scale = 0.1;
        this.chart.numberFormatter.numberFormat = '#.00a';

        let startGrip = this.chart.scrollbarX.startGrip.createChild(am4core.Circle);
        startGrip.width = 15;
        startGrip.height = 15;
        startGrip.fill = am4core.color("#d9d9d9");
        startGrip.rotation = 45;
        startGrip.align = "center";
        startGrip.valign = "middle";

        let endGrip = this.chart.scrollbarX.endGrip.createChild(am4core.Circle);
        endGrip.width = 15;
        endGrip.height = 15;
        endGrip.fill = am4core.color("#d9d9d9");
        endGrip.rotation = 45;
        endGrip.align = "center";
        endGrip.valign = "middle";
      }

      let label = xAxis.renderer.labels.template;
      label.truncate = true;
      label.maxWidth = 80;
      label.tooltipText = "{date}";

      // Set up drill-down
      xAxis.renderer.labels.template.events.on("hit", function(event:any) {
        var start = event.target.dataItem.dates.date;
        var end = new Date(start);
        end.setMonth(end.getMonth() + 1);
        xAxis.zoomToDates(start, end);
      })

      // let bullet = series.bullets.push(new am4charts.CircleBullet());
      // bullet.circle.radius = 5;
      // series.heatRules.push({
      //   target: bullet.circle,
      //   min: 5,
      //   max: 5,
      //   property: "radius"
      // });

      // bullet.tooltipText = "{name}: {valueY.value}";

      // var regseries = this.chart.series.push(new am4charts.LineSeries());
      // regseries.dataFields.dateX = (this.widgetData.length)?Object.keys(this.widgetData[0])[0]:"";
      // regseries.dataFields.valueY = (this.widgetData.length)?Object.keys(this.widgetData[0])[1]:"";
      // regseries.strokeWidth = 2;
      // regseries.stroke = am4core.color("#eb4c46");
      // regseries.name = "Linear Regression";

      // regseries.plugins.push(new am4plugins_regression.Regression());

      let indicator:any;
      const showIndicator = () => {
        this.chart.cursor.disabled = true;
        xAxis.renderer.labels.template.disabled = true;
        //disable horizontal lines
        xAxis.renderer.grid.template.strokeWidth = 0;

        //disable vertical lines
        yAxis.renderer.grid.template.strokeWidth = 0;
        this.chart.scrollbarX.disabled = true;
        // bullet.disabled = true;

        if (indicator) {
          indicator.show();
        } else {
          indicator = this.chart.tooltipContainer?.createChild(am4core.Container);
          indicator.background.fill = am4core.color("rgba(255,255,255,0)");
          indicator.background.fillOpacity = 0.8;
          indicator.width = am4core.percent(100);
          indicator.height = am4core.percent(100);

          var indicatorLabel = indicator.createChild(am4core.Label);
          indicatorLabel.text = "Data Not Available";
          indicatorLabel.align = "center";
          indicatorLabel.valign = "middle";
          indicatorLabel.fontSize = 14;
          indicatorLabel.fill = am4core.color("#fff");
        }
      }

      const hideIndicator = () => {
        indicator.hide();
        this.chart.cursor.disabled = false;
        xAxis.renderer.labels.template.disabled = false;
        //disable horizontal lines
        xAxis.renderer.grid.template.strokeWidth = 1;

        //disable vertical lines
        yAxis.renderer.grid.template.strokeWidth = 1;
        this.chart.scrollbarX.disabled = false;
        // bullet.disabled = false;
      }

      this.chart.events.on("beforedatavalidated", function (event) {
        // check if there's data
        if (event.target.data.length == 0) {
          showIndicator();
        }
        else if (indicator) {
          hideIndicator();
        }
      });
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

      // console.log(charts);

      // if (this.chart) {
      //   this.chart.dispose();
      // }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(typeof this.chart != 'undefined') {
      if(changes.widgetData) {
        // console.log(changes);
        // console.log(this.chart);

        this.chart.data = this.widgetData
        this.chart.validateData();

        // console.log(this.chart.htmlContainer?.id);
        // console.log(JSON.stringify(this.widgetData));
      }
    }
  }
}
