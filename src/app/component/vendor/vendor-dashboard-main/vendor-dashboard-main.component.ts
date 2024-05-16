import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  public responsiveOptions = [
    {
      breakpoint: '1280px',
      numVisible: 4,
      numScroll: 4
    },
    {
      breakpoint: '720px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '480px',
      numVisible: 1,
      numScroll: 1
    }
  ]

  constructor(private categoryService: CategoryService, private vendorService: VendorService, private router: Router) {}

  ngOnInit(): void {
    this.getCategories();
  }

  private getCategories() {
    this.categoryService.categories$.subscribe({
      next: (response: Category[]) => {
        if (response.length > 0) {
          this.categories = response;
          this.getVendors(structuredClone(response));
        }
      }
    })
  }

  private getVendors(categories: Category[]) {
    from(categories)
      .pipe(concatMap(category => this.vendorService.getAllVendor({category: [category.slugName]} as VendorServiceOfferParam, 1)))
      .subscribe(response => {
        this.categoryVendors.set(categories.shift()!.name, response.items);
        if(categories.length == 0) this.isLoading = false;
      });
  }

  public findCategorySlugName(category: string) {
    return this.categories.find(({name}) => category === name)?.slugName;
  }

  public disableSort() {
    return 0;
  }

  public formatPrice(value: number) {
    return 'Rp' + value.toLocaleString('id-ID');
  }
}
