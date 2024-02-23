import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorDashboardComponent } from './component/vendor/vendor-dashboard/vendor-dashboard.component';
import { NavigationComponent } from './component/navigation/navigation.component';
import { VendorDashboardCategoryComponent } from './component/vendor/vendor-dashboard-category/vendor-dashboard-category.component';
import { VendorDetailComponent } from './component/vendor/vendor-detail/vendor-detail.component';
import { VendorServiceComponent } from './component/vendor/vendor-service/vendor-service.component';
import { VendorDashboardMainComponent } from './component/vendor/vendor-dashboard-main/vendor-dashboard-main.component';
import { categoryMenuGuard } from './guard/category-menu.guard';

const routes: Routes = [
  {path: '', redirectTo: 'vendor', pathMatch: 'full'},
  {path: '', title: 'Evone', component: NavigationComponent, children: [
    {path: 'vendor', title: 'Vendor', component: VendorDashboardComponent, children: [
      {path: '', component: VendorDashboardMainComponent},
      {path: 'category/:category', component: VendorDashboardCategoryComponent, canActivate: [categoryMenuGuard]},
      {path: 'profile/:vendorName', component: VendorDetailComponent},
      {path: 'service/:serviceName', component: VendorServiceComponent}
    ]}
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
