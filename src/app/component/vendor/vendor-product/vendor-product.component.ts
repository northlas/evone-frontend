import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { assignQueryParams, VendorServiceOfferParam } from 'src/app/model/vendor-service-offer-param';
import { FilterComponent } from '../../dialog/filter/filter.component';
import { SortComponent } from '../../dialog/sort/sort.component';

@Component({
  selector: 'app-vendor-product',
  templateUrl: './vendor-product.component.html',
  styleUrls: ['./vendor-product.component.css']
})
export class VendorProductComponent {
  @ViewChild('input') searchField!: ElementRef;

  private searchParam = {} as VendorServiceOfferParam;
  public submenu = 'service';
  public filterCount = 0;
  public isSorting = false;

  constructor(private router: Router, private route: ActivatedRoute, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.searchParam = assignQueryParams(this.route.snapshot.queryParams);
    this.countFilter();
    this.countSort();
  }

  private countFilter() {
    let count = 0;
    if(this.searchParam.active) count++;
    if(this.searchParam.category) count++;
    if(this.searchParam.occasions) count++;
    if(this.searchParam.location) count++;
    if(this.searchParam.minPrice || this.searchParam.maxPrice) count++;
    this.filterCount = count;
  }

  private countSort() {
    this.isSorting = this.searchParam.sort != undefined;
  }

  public filterProduct(product: string) {
    this.submenu = product;
  }

  public search(param: string) {
    if(param.length == 0) {
      const {title: serviceName, ...param} = this.searchParam;
      this.searchParam = param as VendorServiceOfferParam;
    }
    else this.searchParam.title = param;
    this.navigate();
  }

  private navigate() {
    this.router.navigate(['.'], {queryParams: this.searchParam, relativeTo: this.route})
  }

  public openFilter() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.data = ({'type': 'product', 'serviceParam': this.searchParam});
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(FilterComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: (param: VendorServiceOfferParam) => {
        if(param) {
          this.searchParam = param;
          this.countFilter();
          this.navigate();
        }
      }
    })
  }

  public openSort() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.data = this.searchParam;
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(SortComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: (param: VendorServiceOfferParam) => {
        if(param) {
          this.searchParam = param;
          this.countSort();
          this.navigate();
        }
      }
    })
  }
}
