import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorDashboardComponent } from './component/vendor/vendor-dashboard/vendor-dashboard.component';
import { JobDashboardComponent } from './component/job/job-dashboard/job-dashboard.component';
import { NavigationComponent } from './component/navigation/navigation.component';
import { VendorDashboardCategoryComponent } from './component/vendor/vendor-dashboard-category/vendor-dashboard-category.component';
import { JobDashboardCategoryComponent } from './component/job/job-dashboard-category/job-dashboard-category.component';
import { VendorDetailComponent } from './component/vendor/vendor-detail/vendor-detail.component';
import { VendorServiceComponent } from './component/vendor/vendor-service/vendor-service.component';
import { VendorDashboardMainComponent } from './component/vendor/vendor-dashboard-main/vendor-dashboard-main.component';
import { JobDashboardMainComponent } from './component/job/job-dashboard-main/job-dashboard-main.component';

const routes: Routes = [
  {path: '', redirectTo: 'vendor', pathMatch: 'full'},
  {path: '', title: 'Evone', component: NavigationComponent, children: [
    {path: 'vendor', title: 'Vendor', component: VendorDashboardComponent, children: [
      {path: '', component: VendorDashboardMainComponent},
      {path: 'search', component: VendorDashboardCategoryComponent},
      {path: ':vendorName', component: VendorDetailComponent},
      {path: ':vendorName/service/:serviceName', component: VendorServiceComponent}
    ]},
    {path: 'freelance', title: 'Freelance', component: JobDashboardComponent, children: [
          {path: '', component: JobDashboardMainComponent},
          {path: 'search', component: JobDashboardCategoryComponent},
          {path: ':vendorName', component: VendorDetailComponent},
          {path: ':vendorName/service/:serviceName', component: VendorServiceComponent}
        ]}
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
