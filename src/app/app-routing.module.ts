import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallcenterComponent } from './component/callcenter/callcenter.component';
import { HelpcenterComponent } from './component/helpcenter/helpcenter.component';
import { JobDashboardCategoryComponent } from './component/job/job-dashboard-category/job-dashboard-category.component';
import { JobDashboardMainComponent } from './component/job/job-dashboard-main/job-dashboard-main.component';
import { JobDashboardComponent } from './component/job/job-dashboard/job-dashboard.component';
import { JobDetailComponent } from './component/job/job-detail/job-detail.component';
import { NavigationComponent } from './component/navigation/navigation.component';
import { ChatComponent } from './component/personal/chat/chat.component';
import { JobOrderComponent } from './component/personal/job-order/job-order.component';
import { ProfileComponent } from './component/personal/profile/profile.component';
import { ServiceOrderComponent } from './component/personal/service-order/service-order.component';
import { SettingsComponent } from './component/personal/settings/settings.component';
import { WishlistDashboardComponent } from './component/personal/wishlist-dashboard/wishlist-dashboard.component';
import { WishlistJobComponent } from './component/personal/wishlist-job/wishlist-job.component';
import { WishlistServiceComponent } from './component/personal/wishlist-service/wishlist-service.component';
import { VendorDashboardCategoryComponent } from './component/vendor/vendor-dashboard-category/vendor-dashboard-category.component';
import { VendorDashboardMainComponent } from './component/vendor/vendor-dashboard-main/vendor-dashboard-main.component';
import { VendorDashboardComponent } from './component/vendor/vendor-dashboard/vendor-dashboard.component';
import { VendorDetailComponent } from './component/vendor/vendor-detail/vendor-detail.component';
import { VendorProductComponent } from './component/vendor/vendor-product/vendor-product.component';
import { VendorServiceComponent } from './component/vendor/vendor-service/vendor-service.component';
import { authenticationGuard } from './guard/authentication.guard';

const routes: Routes = [
  {path: '', title: 'Evone', component: NavigationComponent, children: [
    {path: 'vendor', title: 'Vendor', component: VendorDashboardComponent, children: [
      {path: '', component: VendorDashboardMainComponent},
      {path: 'search', component: VendorDashboardCategoryComponent},
      {path: ':vendorName', component: VendorDetailComponent},
      {path: ':vendorName/service/:serviceTitle', component: VendorServiceComponent},
      {path: '', redirectTo: 'vendor', pathMatch: 'full'}
    ]},
    {path: 'freelance', title: 'Freelance', component: JobDashboardComponent, children: [
      {path: '', component: JobDashboardMainComponent},
      {path: 'search', component: JobDashboardCategoryComponent},
      {path: ':vendorName/job/:jobTitle/:startDt/:endDt', component: JobDetailComponent},
      {path: '', redirectTo: 'vendor', pathMatch: 'full'}
    ]},
    {path: 'product', title: 'Product', canActivate: [authenticationGuard], component: VendorProductComponent},
    {path: 'settings', component: SettingsComponent, canActivate: [authenticationGuard], children: [
      {path: 'profile', component: ProfileComponent},
      {path: 'service-order', component: ServiceOrderComponent},
      {path: 'job-order', component: JobOrderComponent},
      {path: '', redirectTo: 'vendor', pathMatch: 'full'}
    ]},
    {path: 'wishlist', title: 'Wishlist', component: WishlistDashboardComponent, canActivate: [authenticationGuard], children: [
      {path: 'service', component: WishlistServiceComponent},
      {path: 'job', component: WishlistJobComponent},
      {path: '', redirectTo: 'service', pathMatch: 'full'},
    ]},
    {path: 'chat', title: 'Chat', component: ChatComponent, canActivate: [authenticationGuard]},
    {path: 'helpcenter', title: 'Pusat Bantuan', component: HelpcenterComponent},
    {path: 'callcenter', title: 'Kontak', component: CallcenterComponent},
    {path: '', redirectTo: 'vendor', pathMatch: 'full'}
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
