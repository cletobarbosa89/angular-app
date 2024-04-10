import { Component, OnInit, Inject, Input, NgZone, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-range-chart',
  templateUrl: './range-chart.component.html',
  styleUrls: ['./range-chart.component.css']
})
export class RangeChartComponent implements OnInit {
  private chart: am4charts.XYChart;
  chartId: any;
  charts: am4core.Sprite[];

  @Input() widgetData: any;
  @Input() widgetId: string;
  @Input() widgetCategory: string;
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

      if(this.widgetCategory == 'comparison') {
        this.chart.data = this.widgetData;
        // this.chart.data = [{ "date": "1947-12-31T18:30:00.000Z", "open": "4.20", "close": "3.50" }, { "date": "1948-01-31T18:30:00.000Z", "open": "4.70", "close": "4.80" }, { "date": "1948-02-29T18:30:00.000Z", "open": "4.50", "close": "4.40" }, { "date": "1948-03-31T18:30:00.000Z", "open": "4", "close": "4.10" }, { "date": "1948-04-30T18:30:00.000Z", "open": "3.30", "close": "3.40" }, { "date": "1948-05-31T18:30:00.000Z", "open": "3.40", "close": "5" }, { "date": "1948-06-30T18:30:00.000Z", "open": "3.50", "close": "4.80" }, { "date": "1948-07-31T18:30:00.000Z", "open": "3.30", "close": "4.50" }, { "date": "1948-08-31T18:30:00.000Z", "open": "3.10", "close": "4" }, { "date": "1948-09-30T18:30:00.000Z", "open": "2.60", "close": "3.40" }, { "date": "1948-10-31T18:30:00.000Z", "open": "3.10", "close": "3.80" }, { "date": "1948-11-30T18:30:00.000Z", "open": "3.60", "close": "3.70" }, { "date": "1948-12-31T18:30:00.000Z", "open": "5.20", "close": "4.60" }, { "date": "1949-01-31T18:30:00.000Z", "open": "6", "close": "5.20" }, { "date": "1949-02-28T18:30:00.000Z", "open": "6", "close": "4.70" }, { "date": "1949-03-31T18:30:00.000Z", "open": "5.50", "close": "5.30" }, { "date": "1949-04-30T18:30:00.000Z", "open": "5.80", "close": "5.70" }, { "date": "1949-05-31T18:30:00.000Z", "open": "6.20", "close": "6.90" }, { "date": "1949-06-30T18:30:00.000Z", "open": "6.80", "close": "7.50" }, { "date": "1949-07-31T18:30:00.000Z", "open": "6.10", "close": "6.90" }, { "date": "1949-08-31T18:30:00.000Z", "open": "5.50", "close": "6.70" }, { "date": "1949-09-30T18:30:00.000Z", "open": "6.20", "close": "5.90" }, { "date": "1949-10-31T18:30:00.000Z", "open": "5.50", "close": "6.20" }, { "date": "1949-11-30T18:30:00.000Z", "open": "6.10", "close": "5.90" }, { "date": "1949-12-31T18:30:00.000Z", "open": "7.80", "close": "7.30" }, { "date": "1950-01-31T18:30:00.000Z", "open": "8.10", "close": "7.40" }];
      }

      // chart.padding(40, 40, 40, 40);

      // Set input format for the dates
      // this.chart.dateFormatter.inputDateFormat = "mm-dd-yyyy";
      this.chart.dateFormatter.dateFormat = "dd MMM yyyy";

      // Create axes
      let xAxis = this.chart.xAxes.push(new am4charts.DateAxis());
      xAxis.renderer.minGridDistance = 40;
      xAxis.renderer.grid.template.location = 0;
      xAxis.dateFormats.setKey("day", "dd MMM yyyy");
      xAxis.renderer.labels.template.fill = am4core.color("#FFF");
      xAxis.renderer.labels.template.fontSize = 12;
      xAxis.dataFields.date = (this.widgetData.length)?Object.keys(this.widgetData[0])[0]:"";
      // xAxis.renderer.grid.template.strokeWidth = 0;
      xAxis.groupData = true;

      xAxis.start = 0.4;
      xAxis.end = 0.6;
      xAxis.keepSelection = true;

      // Create value axis
      let yAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
      yAxis.renderer.labels.template.fill = am4core.color("#FFF");
      yAxis.renderer.labels.template.fontSize = 12;
      // yAxis.renderer.grid.template.strokeWidth = 0;
      // yAxis.renderer.baseGrid.disabled = true;
      yAxis.cursorTooltipEnabled = false;

      // Create series
      // let series = this.chart.series.push(new am4charts.LineSeries());
      // series.dataFields.dateX = (this.widgetData.length)?Object.keys(this.widgetData[0])[0]:"";
      // series.dataFields.valueY = (this.widgetData.length)?Object.keys(this.widgetData[0])[1]:"";
      // series.strokeWidth = 2;
      // series.name = (this.widgetData.length)?Object.keys(this.widgetData[0])[1]:"";
      // // series.minBulletDistance = 10;
      // // series.tooltipText = "{name}: {valueY.value}";

      var series = this.chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = (this.widgetData.length)?Object.keys(this.widgetData[0])[0]:"";
      series.dataFields.openValueY = (this.widgetData.length)?Object.keys(this.widgetData[0])[1]:"";
      series.dataFields.valueY = (this.widgetData.length)?Object.keys(this.widgetData[0])[2]:"";
      series.tooltipText = "[bold]{dateX}[/]\nCampaign 1: {openValueY.value}\nCampaign 2: {valueY.value}";
      series.tooltip = new am4core.Tooltip();
      series.tooltip.getFillFromObject = false;
      series.tooltip.background.fill = am4core.color("#FFF");
      series.tooltip.label.fill = am4core.color("#000");
      // series.sequencedInterpolation = true;
      series.strokeWidth = 2;
      // series.name = "District Metered Usage";
      series.stroke = this.chart.colors.getIndex(7);
      series.fill = series.stroke;
      series.fillOpacity = 0.8;

      var series2 = this.chart.series.push(new am4charts.LineSeries());
      series2.dataFields.dateX = (this.widgetData.length)?Object.keys(this.widgetData[0])[0]:"";
      series2.dataFields.valueY = (this.widgetData.length)?Object.keys(this.widgetData[0])[1]:"";
      // series2.sequencedInterpolation = true;
      series2.strokeWidth = 1;
      // series2.tooltip.getFillFromObject = false;
      // series2.tooltip.getStrokeFromObject = true;
      // series2.tooltip.label.fill = am4core.color("#000");
      // series2.name = "SP Aggregate usage";
      series2.stroke = this.chart.colors.getIndex(0);
      series2.fill = series2.stroke;

      this.chart.cursor = new am4charts.XYCursor();
      this.chart.cursor.snapToSeries = series;
      this.chart.cursor.xAxis = xAxis;

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

      let label = xAxis.renderer.labels.template;
      label.truncate = true;
      label.maxWidth = 80;
      label.tooltipText = "{date}";

      // Set up drill-down
      xAxis.renderer.labels.template.events.on("hit", function(event) {
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

      // create ranges
      var negativeRange: any;

      this.chart.events.on("beforedatavalidated", function (event) {
        // check if there's data
        if (event.target.data.length == 0) {
          showIndicator();
        }
        else if (indicator) {
          hideIndicator();
        }
      });

      this.chart.events.on("datavalidated", function (event) {
        series.dataItems.each(function(s1DataItem) {
          var s1PreviousDataItem;
          var s2PreviousDataItem;

          var s2DataItem = series2.dataItems.getIndex(s1DataItem.index) as am4charts.LineSeriesDataItem;

          if (s1DataItem.index > 0) {
            s1PreviousDataItem = series.dataItems.getIndex(s1DataItem.index - 1);
            s2PreviousDataItem = series2.dataItems.getIndex(s1DataItem.index - 1);
          }

          var startTime = am4core.time.round(new Date(s1DataItem.dateX.getTime()), xAxis.baseInterval.timeUnit, xAxis.baseInterval.count).getTime();

          // intersections
          if (s1PreviousDataItem && s2PreviousDataItem) {
            var x0 = am4core.time.round(new Date(s1PreviousDataItem.dateX.getTime()), xAxis.baseInterval.timeUnit, xAxis.baseInterval.count).getTime() + xAxis.baseDuration / 2;
            var y01 = s1PreviousDataItem.valueY;
            var y02 = s2PreviousDataItem.valueY;

            var x1 = startTime + xAxis.baseDuration / 2;
            var y11 = s1DataItem.valueY;
            var y12 = s2DataItem.valueY;

            var intersection = am4core.math.getLineIntersection({ x: x0, y: y01 }, { x: x1, y: y11 }, { x: x0, y: y02 }, { x: x1, y: y12 });

            startTime = Math.round(intersection.x);
          }

          // start range here
          if (s2DataItem.valueY > s1DataItem.valueY) {
            if (!negativeRange) {
              negativeRange = xAxis.createSeriesRange(series);
              negativeRange.date = new Date(startTime);
              negativeRange.contents.fill = series2.fill;
              negativeRange.contents.fillOpacity = 0.8;
            }
          }
          else {
            // if negative range started
            if (negativeRange) {
              negativeRange.endDate = new Date(startTime);
            }
            negativeRange = undefined;
          }
          // end if last
          if (s1DataItem.index == series.dataItems.length - 1) {
            if (negativeRange) {
              negativeRange.endDate = new Date(s1DataItem.dateX.getTime() + xAxis.baseDuration / 2);
              negativeRange = undefined;
            }
          }
        })
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
