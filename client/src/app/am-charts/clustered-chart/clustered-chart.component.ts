import { Component, OnInit, Inject, Input, NgZone, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute, ParamMap, UrlSegment } from '@angular/router';

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-clustered-chart',
  templateUrl: './clustered-chart.component.html',
  styleUrls: ['./clustered-chart.component.css']
})
export class ClusteredChartComponent implements OnInit {

  private chart: am4charts.XYChart;
  chartId: any;
  charts: am4core.Sprite[];

  @Input() widgetData: any;
  @Input() widgetId: string;
  @Input() classes: string[];
  @Input() widgetType: string;
  @Input() widgetCategory: string;

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
      this.chart.colors.step = 2;

      if(this.widgetCategory == 'brandHealthPurchaseIntent' || this.widgetCategory == 'salesLiftSLData' || this.widgetCategory == 'brandHealthOverallSnapshot')
        this.chart.data = this.widgetData;
        this.chart.maskBullets = false;

      this.chart.numberFormatter.numberFormat = '#.####';

      // Create axes
      let categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.cellStartLocation = 0.1
      categoryAxis.renderer.cellEndLocation = 0.9
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = (this.widgetData.length)?Object.keys(this.widgetData[0])[0]:"";
      // categoryAxis.renderer.minGridDistance = 0;
      // categoryAxis.renderer.inversed = true;
      categoryAxis.renderer.grid.template.disabled = true;
      categoryAxis.renderer.labels.template.fill = am4core.color("#FFF");
      categoryAxis.renderer.labels.template.fontSize = 12;
      // categoryAxis.renderer.inside = false;

      let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.labels.template.fill = am4core.color("#FFF");

      // Create series
      // let series = this.chart.series.push(new am4charts.ColumnSeries());
      // series.dataFields.categoryX = (this.widgetData.length)?Object.keys(this.widgetData[0])[0]:"";
      // series.dataFields.valueY = (this.widgetData.length)?Object.keys(this.widgetData[0])[1]:"";
      // series.columns.template.propertyFields.fill = "color";
      // series.columns.template.propertyFields.stroke = "color";
      // series.columns.template.strokeOpacity = 0;
      // series.columns.template.column.cornerRadiusBottomRight = 5;
      // series.columns.template.column.cornerRadiusTopRight = 5;
      // if(this.widgetType)
      //   series.columns.template.tooltipText = "{categoryX}: {valueY.value}%";
      // else
      //   series.columns.template.tooltipText = "{categoryX}: {valueY.value}";

      // let valueLabel = series.bullets.push(new am4charts.LabelBullet());
      // valueLabel.label.fill = am4core.color("#fff");
      // if(this.widgetType)
      //   valueLabel.label.text = '{valueY}%';
      // else
      //   valueLabel.label.text = '{valueY}';
      // valueLabel.label.horizontalCenter  = 'middle';
      // valueLabel.label.verticalCenter  = 'bottom';
      // valueLabel.label.truncate = false;
      // valueLabel.label.hideOversized = false;

      const createClusteredSeries = (value: string, name: string) => {
        var series = this.chart.series.push(new am4charts.ColumnSeries())
        series.dataFields.valueY = value
        series.dataFields.categoryX = (this.widgetData.length)?Object.keys(this.widgetData[0])[0]:""
        series.name = name
        series.columns.template.propertyFields.fill = "color";
        series.columns.template.propertyFields.stroke = "color";
        series.columns.template.width = 40;

        // series.events.on("hidden", arrangeColumns);
        // series.events.on("shown", arrangeColumns);

        // series.columns.template.adapter.add('fill', (fill: any, column: any) => {
        //   var data = column.dataItem.dataContext;
        //   if(data.color == '#0079bc') {
        //     var columnGradient = new am4core.LinearGradient();
        //     columnGradient.addColor(am4core.color(data.color));
        //     columnGradient.addColor(am4core.color('#6ae5fb'));
        //     return columnGradient;
        //   } else {
        //     return fill;
        //   }
        // });

        if(this.widgetType)
          series.columns.template.tooltipText = "{categoryX}: {valueY.value}%";
        else
          series.columns.template.tooltipText = "{categoryX}: {valueY.value}";

        var bullet = series.bullets.push(new am4charts.LabelBullet());
        bullet.interactionsEnabled = false;
        // bullet.dy = 30;
        bullet.label.verticalCenter = 'bottom';
        bullet.label.text = '{valueY}';
        bullet.label.fill = am4core.color('#ffffff');
        bullet.label.fontSize = 12;

        return series;
      }

      const createLineSeries = (value: string, name: string) => {
        var series1 = this.chart.series.push(new am4charts.LineSeries());
        series1.dataFields.valueY = value;
        series1.dataFields.categoryX = (this.widgetData.length)?Object.keys(this.widgetData[0])[0]:"";
        series1.name = name;
        series1.stroke = am4core.color("#67b7dc");
        series1.tooltipText = "{categoryX}: {valueY}";
        series1.strokeWidth = 2;

        var bullet = series1.bullets.push(new am4charts.CircleBullet());
        bullet.circle.stroke = am4core.color("#67b7dc");
        bullet.circle.strokeWidth = 2;
        bullet.fill = am4core.color("#67b7dc");
        bullet.tooltipText = "{categoryX}: {valueY}";

        return series1;
      }

      if(this.widgetData.length) {
        createClusteredSeries(Object.keys(this.widgetData[0])[1], '1');
        createClusteredSeries(Object.keys(this.widgetData[0])[2], '2');
        createLineSeries(Object.keys(this.widgetData[0])[3], '3');

        if(this.widgetCategory == 'brandHealthOverallSnapshot') {
          this.chart.legend = new am4charts.Legend();
          // this.chart.legend.parent = this.chart.chartContainer;
          this.chart.legend.useDefaultMarker = true;
          // this.chart.legend.maxHeight = 10;
          // this.chart.legend.background.fill = am4core.color("#000");
          // this.chart.legend.background.fillOpacity = 0.05;
          this.chart.legend.labels.template.fill = am4core.color('#fff');
          this.chart.legend.labels.template.fontSize = '12px';
          this.chart.legend.markers.template.width = 10;
          this.chart.legend.markers.template.height = 10;
          this.chart.legend.position = "top";
          this.chart.legend.dx = 0;
          this.chart.legend.dy = -10;
          this.chart.legend.layout = "horizontal";
          this.chart.legend.contentAlign = "center";
          this.chart.legend.data = [{
            "name": "Significant",
            "fill": "#0079bc"
          }, {
            "name": "Non-significant",
            "fill": "#b7e4fd"
          }];
          this.chart.legend.itemContainers.template.clickable = false;
          this.chart.legend.itemContainers.template.focusable = false;
          this.chart.legend.itemContainers.template.cursorOverStyle = am4core.MouseCursorStyle.default;
        }
      }

      if(this.widgetCategory == 'brandHealthPurchaseIntent' || this.widgetCategory == 'salesLiftSLData' || this.widgetCategory == 'brandHealthOverallSnapshot') {
        categoryAxis.renderer.labels.template.truncate = true;
        categoryAxis.renderer.labels.template.maxWidth = 120;
        categoryAxis.renderer.labels.template.rotation = -45;
        categoryAxis.renderer.labels.template.horizontalCenter = "right";
        categoryAxis.renderer.labels.template.verticalCenter = "middle";

        // series.columns.template.column.cornerRadiusBottomRight = 0;
        // series.columns.template.column.cornerRadiusTopRight = 0;
      }

      // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
      // series.columns.template.adapter.add("fill", (fill:any, target:any) => {
      //   return this.chart.colors.getIndex(target.dataItem.index);
      // });

      let indicator:any;
      const showIndicator = () => {
        if (indicator) {
          indicator.show();
        }
        else {
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

      function hideIndicator() {
        indicator.hide();
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
