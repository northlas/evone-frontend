import { OverlayModule } from '@angular/cdk/overlay';
import { TextFieldModule } from '@angular/cdk/text-field';
import { registerLocaleData } from "@angular/common";
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localeId from "@angular/common/locales/id";
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { CURRENCY_MASK_CONFIG, CurrencyMaskConfig, CurrencyMaskModule } from "ng2-currency-mask";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CarouselModule } from "primeng/carousel";
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { RatingModule } from 'primeng/rating';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddJobComponent } from './component/dialog/add-job/add-job.component';
import { AddServiceComponent } from './component/dialog/add-service/add-service.component';
import { FilterComponent } from './component/dialog/filter/filter.component';
import { JobFilterComponent } from './component/dialog/job-filter/job-filter.component';
import { JobOrderFilterComponent } from './component/dialog/job-order-filter/job-order-filter.component';
import { JobSortComponent } from './component/dialog/job-sort/job-sort.component';
import { LoadingComponent } from './component/dialog/loading/loading.component';
import { LoginComponent } from './component/dialog/login/login.component';
import { OrderFilterComponent } from './component/dialog/order-filter/order-filter.component';
import { OrderJobDetailComponent } from './component/dialog/order-job-detail/order-job-detail.component';
import { OrderJobComponent } from './component/dialog/order-job/order-job.component';
import { OrderServiceDetailComponent } from './component/dialog/order-service-detail/order-service-detail.component';
import { OrderServiceComponent } from './component/dialog/order-service/order-service.component';
import { RegisterMainComponent } from './component/dialog/register/register-main/register-main.component';
import { RegisterUserComponent } from './component/dialog/register/register-user/register-user.component';
import { RegisterVendorComponent } from './component/dialog/register/register-vendor/register-vendor.component';
import { ReviewComponent } from './component/dialog/review/review.component';
import { SortComponent } from './component/dialog/sort/sort.component';
import { WithdrawComponent } from './component/dialog/withdraw/withdraw.component';
import { JobDashboardCategoryComponent } from './component/job/job-dashboard-category/job-dashboard-category.component';
import { JobDashboardMainComponent } from './component/job/job-dashboard-main/job-dashboard-main.component';
import { JobDashboardComponent } from './component/job/job-dashboard/job-dashboard.component';
import { JobDetailComponent } from './component/job/job-detail/job-detail.component';
import { NavigationComponent } from './component/navigation/navigation.component';
import { ChatComponent } from "./component/personal/chat/chat.component";
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
import { VendorProductJobComponent } from './component/vendor/vendor-product-job/vendor-product-job.component';
import { VendorProductServiceComponent } from './component/vendor/vendor-product-service/vendor-product-service.component';
import { VendorProductComponent } from './component/vendor/vendor-product/vendor-product.component';
import { VendorServiceComponent } from './component/vendor/vendor-service/vendor-service.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { ImagePipe } from './pipe/image.pipe';
import { StatusPipe } from './pipe/status.pipe';
import { AuthenticationService } from './service/authentication.service';
import { NotificationService } from './service/notification.service';

const notifierCustomOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12,
    },
    vertical: {
      position: 'top',
      distance: 5,
      gap: 10,
    },
  },
  theme: 'material',
  behaviour: {
    autoHide: 2500,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4,
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease',
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50,
    },
    shift: {
      speed: 300,
      easing: 'ease',
    },
    overlap: 150,
  },
};

const currencyMaskConfig: CurrencyMaskConfig = {
  align: 'center',
  allowNegative: false,
  decimal: ',',
  precision: 0,
  prefix: 'Rp',
  suffix: '',
  thousands: '.'
}

registerLocaleData(localeId)
@NgModule({
  declarations: [AppComponent, VendorDashboardComponent, NavigationComponent, VendorDashboardCategoryComponent, JobDashboardCategoryComponent, VendorDetailComponent, JobDetailComponent, VendorServiceComponent, LoginComponent, VendorDashboardMainComponent, JobDashboardMainComponent, SortComponent, JobSortComponent, FilterComponent, JobFilterComponent,RegisterMainComponent, RegisterUserComponent, RegisterVendorComponent, ImagePipe, JobDashboardComponent, VendorProductComponent, VendorProductServiceComponent, VendorProductJobComponent, AddServiceComponent, AddJobComponent, LoadingComponent, OrderServiceComponent, SettingsComponent, ServiceOrderComponent, JobOrderComponent, ProfileComponent, OrderServiceDetailComponent, StatusPipe, OrderFilterComponent, WishlistDashboardComponent, WishlistServiceComponent, WishlistJobComponent, ReviewComponent, ChatComponent, OrderJobComponent, OrderJobDetailComponent, JobOrderFilterComponent, WithdrawComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NotifierModule.withConfig(notifierCustomOptions),
    InfiniteScrollModule,
    CurrencyMaskModule,
    TextFieldModule,
    OverlayModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSelectModule,
    MatRadioModule,
    MatMenuModule,
    MatStepperModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatNativeDateModule,
    MatRippleModule,
    MatChipsModule,
    MatTooltipModule,
    CarouselModule,
    FileUploadModule,
    GalleriaModule,
    RatingModule,
    ImageModule
  ],
  providers: [AuthenticationService, NotificationService, {provide: LOCALE_ID, useValue: 'id-ID'}, {provide: CURRENCY_MASK_CONFIG, useValue: currencyMaskConfig}, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent],
})
export class AppModule {}
