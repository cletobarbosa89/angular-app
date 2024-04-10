import { Component, OnInit, Inject, Input, NgZone, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute, ParamMap, UrlSegment } from '@angular/router';

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})

export class BarChartComponent implements OnInit {
  private chart: am4charts.XYChart;
  chartId: any;
  charts: am4core.Sprite[];

  @Input() widgetData: any;
  @Input() widgetId: string;
  @Input() classes: string[];
  @Input() widgetType: string;
  @Input() widgetCategory: string;
  @Input() widgetSubCategory: string;
  @Input() widgetNoData: string;

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
      this.chart.paddingRight = 30;

      if(this.widgetCategory == 'saleLift' || this.widgetCategory == 'brandHealthBrandLift' || this.widgetCategory == 'overviewTargetingBreakdown' || this.widgetCategory == 'targetingBreakdown' || this.widgetCategory == 'comparison'  || this.widgetCategory == 'social')
        this.chart.data = this.widgetData;

      // this.chart.data = this.widgetData;
      // this.chart.height = 200;

      if(this.widgetCategory == 'overviewTargetingBreakdown') {
        this.chart.numberFormatter.numberFormat = '#.0a';
      } else {
        this.chart.numberFormatter.numberFormat = '#.####';
      }

      // this.chart.padding(40, 40, 40, 40);

      if(this.widgetCategory == 'targetingBreakdown') {
        let title = this.chart.titles.create();
        title.fill =  am4core.color("#FFF");
        if(Object.keys(this.widgetData[0])[0] == 'targeting')
          title.text = "Targeting Type" + (this.widgetSubCategory?' ('+this.widgetSubCategory+')':'');
          title.fontWeight = 'bold';
        if(Object.keys(this.widgetData[0])[0] == 'audience')
          title.text = "Audience Type" + (this.widgetSubCategory?' ('+this.widgetSubCategory+')':'');
          title.fontWeight = 'bold';
      }


      // Create axes

      let categoryAxis = this.chart.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = (this.widgetData.length)?Object.keys(this.widgetData[0])[0]:"";
      categoryAxis.renderer.minGridDistance = 0;
      // categoryAxis.renderer.inversed = true;
      categoryAxis.renderer.grid.template.disabled = true;
      categoryAxis.renderer.labels.template.fill = am4core.color("#FFF");
      categoryAxis.renderer.labels.template.fontSize = 12;

      // categoryAxis.renderer.labels.template.disabled = true;

      // categoryAxis.renderer.labels.template.adapter.add("dy", function(dy:any, target:any) {
        //   if (target.dataItem && target.dataItem.index && 2 == 2) {
          //     return dy + 25;
          //   }
          //   return dy;
          // });

      // if(this.route.snapshot.url[0].toString() == 'test') {
        categoryAxis.renderer.inside = false;
        let label = categoryAxis.renderer.labels.template;
        // label.truncate = true;
        // label.wrap = true;
        // label.maxWidth = 120;
        // label.tooltipText = "{category}";
      // } else {
      //   categoryAxis.renderer.inside = true;
      // }

      let valueAxis = this.chart.xAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.labels.template.fill = am4core.color("#FFF");
      // valueAxis.min = 0;
      // valueAxis.renderer.labels.template.disabled = false;

      // Create series
      let series = this.chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryY = (this.widgetData.length)?Object.keys(this.widgetData[0])[0]:"";
      series.dataFields.valueX = (this.widgetData.length)?Object.keys(this.widgetData[0])[1]:"";
      series.columns.template.propertyFields.fill = "color";
      series.columns.template.propertyFields.stroke = "color";
      series.columns.template.strokeOpacity = 0;
      series.columns.template.column.cornerRadiusBottomRight = 5;
      series.columns.template.column.cornerRadiusTopRight = 5;
      series.columns.template.maxHeight = 50;
      series.tooltip = new am4core.Tooltip();
      series.tooltip.label.wrap = true;
      if(this.widgetType && this.widgetType == '%')
        series.columns.template.tooltipText = "{categoryY}: {valueX.value}%";
      else if(this.widgetType && this.widgetType == '$')
        series.columns.template.tooltipText = "{categoryY}: ${valueX.value}";
      else
        series.columns.template.tooltipText = "{categoryY}: {valueX.value}";

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

      if(this.widgetCategory == 'overviewTargetingBreakdown') {
        let title = this.chart.titles.create();
        title.fill =  am4core.color("#FFF");
        title.text = "Targeting Breakdown";
        title.fontWeight = 'bold';
      }

      if(this.widgetData.length && (this.widgetCategory == 'saleLift' || this.widgetCategory == 'brandLift' || this.widgetCategory == 'brandHealthBrandLift')) {
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

      let valueLabel = series.bullets.push(new am4charts.LabelBullet());
      valueLabel.label.fill = am4core.color("#fff");
      valueLabel.label.fontSize = 12;
      if(this.widgetType && this.widgetType == '%')
        valueLabel.label.text = '{valueX}%';
      else if(this.widgetType && this.widgetType == '$')
        valueLabel.label.text = '${valueX}';
      else
        valueLabel.label.text = '{valueX}';
      valueLabel.label.horizontalCenter  = 'left';
      valueLabel.label.truncate = false;
      valueLabel.label.hideOversized = false;

      // var bulletLabel = series.bullets.push(new am4charts.LabelBullet());
      // bulletLabel.label.background = new am4core.RoundedRectangle();
      // bulletLabel.label.background.fill = am4core.color("#fff");
      // bulletLabel.label.background.stroke = am4core.color("#555");
      // bulletLabel.label.background.strokeOpacity = 0.5;
      // bulletLabel.label.padding(5, 5, 5, 5);
      // bulletLabel.locationY = 0;
      // bulletLabel.locationX = 0;
      // bulletLabel.label.text = "{categoryY}";
      // bulletLabel.label.align = "right";

      // series.tooltip = new am4core.Tooltip();
      // series.tooltip.pointerOrientation = "left";
      // series.tooltip.getStrokeFromObject = false;
      // series.columns.template.showTooltipOn = "always";

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
          if(this.widgetNoData) {
            indicatorLabel.text = this.widgetNoData;
          } else {
            indicatorLabel.text = "Data Not Available";
          }
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

      if(this.widgetCategory == 'saleLift') {
        //   this.chart.data = this.widgetData;
        // this.chart.height = 400;
        this.chart.maskBullets = false
        // this.chart.paddingLeft = 30;
        series.columns.template.height = 40;
        categoryAxis.renderer.cellStartLocation = 0.2;
        categoryAxis.renderer.cellEndLocation = 0.8;

        let valueLabel = series.bullets.push(new am4charts.LabelBullet());
        valueLabel.label.text = '{date.startDateSL} - {date.endDateSL}';
        valueLabel.label.fill = am4core.color("#fff");
        valueLabel.fontSize = 12;
        valueLabel.label.horizontalCenter = "right";
        // valueLabel.label.dx = 100;
        valueLabel.label.dy = -20;
        valueLabel.label.truncate = false;
        valueLabel.label.hideOversized = false;

        // Set cell size in pixels
        let cellSize = 100;
        this.chart.events.on("datavalidated", function(ev) {
          // Get objects of interest
          let chart = ev.target;
          let categoryAxis = chart.yAxes.getIndex(0);

          // Calculate how we need to adjust chart height
          let adjustHeight = chart.data.length * cellSize - categoryAxis!.pixelHeight;

          // get current chart height
          let targetHeight = chart.pixelHeight + adjustHeight;

          if(targetHeight > 0 && ev.target.data.length > 1) {
            // Set it on chart's container
            chart.svgContainer!.htmlElement.style.height = targetHeight + "px";
            chart.height = targetHeight;
          } else {
            chart.svgContainer!.htmlElement.style.height = 130 + 'px';
            chart.height = 130;
          }
        });
      }

      if(this.widgetCategory == 'overviewTargetingBreakdown' || this.widgetCategory == 'targetingBreakdown' || this.widgetCategory == 'comparison' || this.widgetCategory == 'brandHealthBrandLift') {
        //   this.chart.data = this.widgetData;
        // this.chart.height = 400;
        this.chart.maskBullets = false
        // this.chart.paddingLeft = 30;
        series.columns.template.height = 20;
        categoryAxis.renderer.cellStartLocation = 0.2;
        categoryAxis.renderer.cellEndLocation = 0.8;
        categoryAxis.renderer.labels.template.truncate = true;
        categoryAxis.renderer.labels.template.maxWidth = 250;
        // categoryAxis.renderer.labels.template.tooltipText = "{category}";

        // let valueLabel = series.bullets.push(new am4charts.LabelBullet());
        // valueLabel.label.text = '{date.startDateSL} - {date.endDateSL}';
        // valueLabel.label.fill = am4core.color("#fff");
        // valueLabel.fontSize = 12;
        // valueLabel.label.horizontalCenter = "right";
        // // valueLabel.label.dx = 100;
        // valueLabel.label.dy = -30;
        // valueLabel.label.truncate = false;
        // valueLabel.label.hideOversized = false;

        // Set cell size in pixels
        let cellSize = 40;
        this.chart.events.on("datavalidated", function(ev) {
          // Get objects of interest
          let chart = ev.target;
          let categoryAxis = chart.yAxes.getIndex(0);

          // Calculate how we need to adjust chart height
          let adjustHeight = chart.data.length * cellSize - categoryAxis!.pixelHeight;

          // get current chart height
          let targetHeight = chart.pixelHeight + adjustHeight;

          if(targetHeight > 0 && ev.target.data.length > 9) {
            // Set it on chart's container
            chart.svgContainer!.htmlElement.style.height = targetHeight + "px";
            chart.height = targetHeight;
          } else {
            chart.svgContainer!.htmlElement.style.height = 280 + 'px';
            chart.height = 280;
          }
        });
      }

      if(this.widgetCategory == 'overviewTargetingBreakdown') {
        //   this.chart.data = this.widgetData;
        // this.chart.height = 400;
        this.chart.maskBullets = false
        // this.chart.paddingLeft = 30;
        series.columns.template.height = 20;
        categoryAxis.renderer.cellStartLocation = 0.2;
        categoryAxis.renderer.cellEndLocation = 0.8;
        categoryAxis.renderer.labels.template.truncate = true;
        categoryAxis.renderer.labels.template.maxWidth = 250;
        // categoryAxis.renderer.labels.template.tooltipText = "{category}";

        // let valueLabel = series.bullets.push(new am4charts.LabelBullet());
        // valueLabel.label.text = '{date.startDateSL} - {date.endDateSL}';
        // valueLabel.label.fill = am4core.color("#fff");
        // valueLabel.fontSize = 12;
        // valueLabel.label.horizontalCenter = "right";
        // // valueLabel.label.dx = 100;
        // valueLabel.label.dy = -30;
        // valueLabel.label.truncate = false;
        // valueLabel.label.hideOversized = false;

        // Set cell size in pixels
        let cellSize = 40;
        this.chart.events.on("datavalidated", function(ev) {
          // Get objects of interest
          let chart = ev.target;
          let categoryAxis = chart.yAxes.getIndex(0);

          // Calculate how we need to adjust chart height
          let adjustHeight = chart.data.length * cellSize - categoryAxis!.pixelHeight;

          // get current chart height
          let targetHeight = chart.pixelHeight + adjustHeight;

          if(targetHeight > 0 && ev.target.data.length > 6) {
            // Set it on chart's container
            chart.svgContainer!.htmlElement.style.height = targetHeight + "px";
            chart.height = targetHeight;
          } else {
            chart.svgContainer!.htmlElement.style.height = 233 + 'px';
            chart.height = 233;
          }
        });
      }
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
