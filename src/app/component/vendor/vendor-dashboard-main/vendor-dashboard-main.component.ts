import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { concatMap, from } from 'rxjs';
import { Category } from 'src/app/model/category';
import { Vendor } from 'src/app/model/vendor';
import { VendorServiceOfferParam } from 'src/app/model/vendor-service-offer-param';
import { CategoryService } from 'src/app/service/category.service';
import { VendorService } from 'src/app/service/vendor.service';

@Component({
  selector: 'app-vendor-dashboard-main',
  templateUrl: './vendor-dashboard-main.component.html',
  styleUrls: ['./vendor-dashboard-main.component.css']
})
export class VendorDashboardMainComponent implements OnInit{
  public categories: Category[] = [];
  public categoryVendors = new Map<string, Vendor[]>();
  public isLoading = true;
  
  constructor(private categoryService: CategoryService, private vendorService: VendorService) {}

  ngOnInit(): void {
    this.getCategories();
  }

  private getCategories() {
    setTimeout(() => {
      this.categoryService.categories$.subscribe({
        next: (categories: Category[]) => {
          if (categories.length > 0) {
            this.getVendors(structuredClone(categories));
          }
        }
      })
    }, 1000);
  }

  private getVendors(categories: Category[]) {
    from(categories)
      .pipe(concatMap(category => this.vendorService.getAllVendor({category: category.slugName} as VendorServiceOfferParam, 1)))
      .subscribe(response => {
        this.categoryVendors.set(categories.shift()!.name, response.items);
        if(categories.length == 0) this.isLoading = false;
      });
  }

  public disableSort() {
    return 0;
  }

  public formatPrice(value: number) {
    return 'Rp' + value.toLocaleString('id-ID');
  }
}
