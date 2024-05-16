import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router, Scroll } from '@angular/router';
import { Category } from 'src/app/model/category';
import { VendorServiceOfferParam } from 'src/app/model/vendor-service-offer-param';
import { CategoryService } from 'src/app/service/category.service';
import { FilterComponent } from '../../dialog/filter/filter.component';
import { SortComponent } from '../../dialog/sort/sort.component';

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.css']
})
export class VendorDashboardComponent implements OnInit{
  @ViewChild('input') searchField!: ElementRef;

  public searchParam = {} as VendorServiceOfferParam;
  public categories: Category[] = [];
  public filterCount = 0;
  public isSorting = false;

  constructor(private categoryService: CategoryService, private router: Router, private route: ActivatedRoute, private dialog: MatDialog) {
    this.router.events.forEach((event) => {
      if (event instanceof Scroll) {
        if (route.snapshot.queryParamMap.keys.length == 0) {
          this.searchParam = {} as VendorServiceOfferParam;
        } else {
          Object.assign(this.searchParam, this.route.snapshot.queryParams);
        }
      }
    })
  }

  ngOnInit(): void {
    Object.assign(this.searchParam, this.route.snapshot.queryParams);
    this.countFilter();
    this.countSort();
    this.getCategories();
  }

  private getCategories() {
    this.categoryService.getAllCategory(true).subscribe({
      next: (response: Category[]) => {
        this.categories = response;
      }
    })
  }

  private countFilter() {
    let count = 0;
    if(this.searchParam.occasions) count++;
    if(this.searchParam.location) count++;
    if(this.searchParam.minPrice || this.searchParam.maxPrice) count++;
    this.filterCount = count;
  }

  private countSort() {
    this.isSorting = this.searchParam.sort != undefined;
  }

  private navigate() {
    this.router.navigate(['./search'], {queryParams: this.searchParam, relativeTo: this.route})
  }

  public filterCategory(slugName: string) {
    this.searchParam = {'category' : [slugName]} as VendorServiceOfferParam;
    this.searchField.nativeElement.value = '';
    this.filterCount = 0;
    this.isSorting = false;
    this.navigate();
  }

  public search(param: string) {
    if(param.length == 0) {
      const {vendor: name, ...param} = this.searchParam;
      this.searchParam = param as VendorServiceOfferParam;
    }
    else this.searchParam.vendor = param;
    this.navigate();
  }

  public openFilter() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.data = ({'type': 'dashboard', 'serviceParam': this.searchParam});
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
