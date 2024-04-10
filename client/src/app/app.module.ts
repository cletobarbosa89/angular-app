import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

// Page components
import { HeaderComponent } from './header/header.component';
import { OverviewComponent } from './overview/overview.component';
import { FooterComponent } from './footer/footer.component';
import { BrandHealthComponent } from './brand-health/brand-health.component';
import { SalesLiftComponent } from './sales-lift/sales-lift.component';
import { CreativeOverviewComponent, CreativeOverviewDialogImage, CreativeOverviewDialogVideo, CreativeOverviewDialogGuidelines } from './creative-overview/creative-overview.component';
import { CreativeOverview2Component, CreativeOverviewDialogImage2, CreativeOverviewDialogVideo2, CreativeOverviewDialogGuidelines2 } from './creative-overview-2/creative-overview-2.component';
import { MediaDeliveryComponent } from './media-delivery/media-delivery.component';
import { RfComponent } from './rf/rf.component';
import { ComparisonComponent } from './comparison/comparison.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SlidePanelComponent } from './overview/slide-panel/slide-panel.component';
import { TargetingOverviewComponent } from './targeting-overview/targeting-overview.component';

// Chart components
import { LineChartComponent } from './am-charts/line-chart/line-chart.component';
import { BarChartComponent } from './am-charts/bar-chart/bar-chart.component';
import { ColumnChartComponent } from './am-charts/column-chart/column-chart.component';
import { DonutChartComponent } from './am-charts/donut-chart/donut-chart.component';
import { ProgressCircleChartComponent } from './am-charts/progress-circle-chart/progress-circle-chart.component';
import { RangeChartComponent } from './am-charts/range-chart/range-chart.component';

// Bootstrap carousel
import { CarouselModule, WavesModule } from 'angular-bootstrap-md';

// Pipes
import { ShortNumberPipe } from './pipes/short-number.pipe';

import { CustomSpinnerComponent } from './custom-spinner/custom-spinner.component';
import { NotauthorizedComponent } from './notauthorized/notauthorized.component';
import { ClusteredChartComponent } from './am-charts/clustered-chart/clustered-chart.component';

// Infinite scroll
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    OverviewComponent,
    FooterComponent,
    BrandHealthComponent,
    SalesLiftComponent,
    CreativeOverviewComponent,
    CreativeOverviewDialogImage,
    CreativeOverviewDialogVideo,
    CreativeOverviewDialogGuidelines,
    CreativeOverview2Component,
    CreativeOverviewDialogImage2,
    CreativeOverviewDialogVideo2,
    CreativeOverviewDialogGuidelines2,
    MediaDeliveryComponent,
    RfComponent,
    ComparisonComponent,
    SlidePanelComponent,
    TargetingOverviewComponent,
    LineChartComponent,
    ColumnChartComponent,
    BarChartComponent,
    DonutChartComponent,
    ProgressCircleChartComponent,
    RangeChartComponent,
    ShortNumberPipe,
    NotauthorizedComponent,
    ClusteredChartComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    MaterialModule,
    CarouselModule.forRoot(),
    WavesModule,
    HttpClientModule,
    NgHttpLoaderModule.forRoot(),
    InfiniteScrollModule
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent],
  entryComponents: [
    CustomSpinnerComponent,
  ],
})
export class AppModule { }
