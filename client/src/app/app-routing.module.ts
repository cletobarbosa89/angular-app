import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { BrandHealthComponent } from './brand-health/brand-health.component';
import { ComparisonComponent } from './comparison/comparison.component';
import { CreativeOverviewComponent } from './creative-overview/creative-overview.component';
import { CreativeOverview2Component } from './creative-overview-2/creative-overview-2.component';
import { MediaDeliveryComponent } from './media-delivery/media-delivery.component';
import { NotauthorizedComponent } from './notauthorized/notauthorized.component';
import { OverviewComponent } from './overview/overview.component';
import { RfComponent } from './rf/rf.component';
import { SalesLiftComponent } from './sales-lift/sales-lift.component';
import { TargetingOverviewComponent } from './targeting-overview/targeting-overview.component';

const routes: Routes = [
  { path: 'overview/:brand', component: OverviewComponent, canActivate: [AuthGuard] },
  { path: 'targeting-overview/:brand', component: TargetingOverviewComponent, canActivate: [AuthGuard] },
  { path: 'brand-health/:brand', component: BrandHealthComponent, canActivate: [AuthGuard] },
  { path: 'sales-lift/:brand', component: SalesLiftComponent, canActivate: [AuthGuard] },
  { path: 'creative-overview/:brand', component: CreativeOverviewComponent, canActivate: [AuthGuard] },
  { path: 'creative-overview-2/:brand', component: CreativeOverview2Component, canActivate: [AuthGuard] },
  { path: 'comparison/:brand', component: ComparisonComponent, canActivate: [AuthGuard] },
  { path: 'notauthorized', component: NotauthorizedComponent },
  { path: '**', redirectTo: '/notauthorized' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
