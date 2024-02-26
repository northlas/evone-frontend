import { Component } from '@angular/core';
import { ActivatedRoute, Router, Scroll } from '@angular/router';
import { BasePageResponse } from 'src/app/model/base-page-response';
import { CategorySearchParam } from 'src/app/model/category-search-param';
import { Vendor } from 'src/app/model/vendor';
import { VendorService } from 'src/app/service/vendor.service';

@Component({
  selector: 'app-vendor-dashboard-category',
  templateUrl: './vendor-dashboard-category.component.html',
  styleUrls: ['./vendor-dashboard-category.component.css']
})
export class VendorDashboardCategoryComponent{
  public showLoading!: boolean;
  public vendors: Vendor[] = []
  private page!: number;
  private totalItems!: number;
  private searchParam: CategorySearchParam = {} as CategorySearchParam;

  constructor(private vendorService: VendorService, private router: Router, route: ActivatedRoute) {
    this.router.events.forEach((event) => {
      if(event instanceof Scroll) {
        const queryParams = route.snapshot.queryParams as CategorySearchParam;
        const isChangeParam = JSON.stringify(this.searchParam) !== JSON.stringify(queryParams);
        if(isChangeParam) {
          this.searchParam = queryParams;
          this.page = 0;
          this.totalItems = -1;
          this.showLoading = true;
          this.getVendors(true);
        }
      }
    })
  }

  public getVendors(isChangeParam: boolean) {
    if(this.vendors.length != this.totalItems) {
      this.page++;
      this.vendorService.getAllVendor(this.searchParam, this.page).subscribe({
        next: (response: BasePageResponse) => {
          if (isChangeParam) this.vendors = response.items;
          else this.vendors.push(...response.items);

          if(response.totalItems >= 0) {
            this.totalItems = response.totalItems
            if(this.vendors.length == this.totalItems) {
              this.showLoading = false;
            }
          }
        }
      })
    }
  }
}