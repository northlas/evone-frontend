import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from "@angular/common";
import localeId from "@angular/common/locales/id";
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CURRENCY_MASK_CONFIG, CurrencyMaskConfig, CurrencyMaskModule } from "ng2-currency-mask";
import { ImagePipe } from './pipe/image.pipe';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { OverlayModule } from '@angular/cdk/overlay';
import { CarouselModule } from "primeng/carousel";
import { FileUploadModule } from 'primeng/fileupload';
import { VendorDashboardComponent } from './component/vendor/vendor-dashboard/vendor-dashboard.component';
import { JobDashboardComponent } from './component/job/job-dashboard/job-dashboard.component';
import { NavigationComponent } from './component/navigation/navigation.component';
import { VendorDashboardCategoryComponent } from './component/vendor/vendor-dashboard-category/vendor-dashboard-category.component';
import { JobDashboardCategoryComponent } from './component/job/job-dashboard-category/job-dashboard-category.component';
import { VendorDetailComponent } from './component/vendor/vendor-detail/vendor-detail.component';
import { VendorServiceComponent } from './component/vendor/vendor-service/vendor-service.component';
import { VendorDashboardMainComponent } from './component/vendor/vendor-dashboard-main/vendor-dashboard-main.component';
import { JobDashboardMainComponent } from './component/job/job-dashboard-main/job-dashboard-main.component';
import { LoginComponent } from './component/dialog/login/login.component';
import { SortComponent } from './component/dialog/sort/sort.component';
import { JobSortComponent } from './component/dialog/jobSort/jobSort.component';
import { FilterComponent } from './component/dialog/filter/filter.component';
import { JobFilterComponent } from './component/dialog/jobFilter/jobFilter.component';
import { AuthenticationService } from './service/authentication.service';
import { NotificationService } from './service/notification.service';
import { RegisterMainComponent } from './component/dialog/register/register-main/register-main.component';
import { RegisterUserComponent } from './component/dialog/register/register-user/register-user.component';
import { RegisterVendorComponent } from './component/dialog/register/register-vendor/register-vendor.component';
import { ChatComponent } from './component/toolbar/chat/chat.component';
import { WishlistComponent } from './component/toolbar/wishlist/wishlist.component';
import { VendorProductComponent } from './component/vendor/vendor-product/vendor-product.component';
import { VendorProductServiceComponent } from './component/vendor/vendor-product-service/vendor-product-service.component';
import { VendorProductJobComponent } from './component/vendor/vendor-product-job/vendor-product-job.component';
import { AddServiceComponent } from './component/dialog/add-service/add-service.component';
import { AddJobComponent } from './component/dialog/add-job/add-job.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { LoadingComponent } from './component/dialog/loading/loading.component';

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
  declarations: [AppComponent, VendorDashboardComponent, NavigationComponent, VendorDashboardCategoryComponent,JobDashboardCategoryComponent, VendorDetailComponent, VendorServiceComponent, LoginComponent, VendorDashboardMainComponent,JobDashboardMainComponent, SortComponent, JobSortComponent, FilterComponent, JobFilterComponent,RegisterMainComponent, RegisterUserComponent, RegisterVendorComponent, ImagePipe, JobDashboardComponent, ChatComponent, WishlistComponent, VendorProductComponent, VendorProductServiceComponent, VendorProductJobComponent, AddServiceComponent, AddJobComponent, LoadingComponent],
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
    CarouselModule,
    FileUploadModule,
  ],
  providers: [AuthenticationService, NotificationService, {provide: LOCALE_ID, useValue: 'id-ID'}, {provide: CURRENCY_MASK_CONFIG, useValue: currencyMaskConfig}, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent],
})
export class AppModule {}
