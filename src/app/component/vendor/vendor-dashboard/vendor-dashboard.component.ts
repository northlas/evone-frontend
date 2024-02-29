import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Category } from 'src/app/model/category';
import { CategoryService } from 'src/app/service/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorServiceOfferParam } from 'src/app/model/vendor-service-offer-param';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FilterComponent } from '../../dialog/filter/filter.component';
import { SortComponent } from '../../dialog/sort/sort.component';

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.css']
})
export class VendorDashboardComponent implements OnInit{
  @ViewChild('input') searchField!: ElementRef;

  private searchParam = {} as VendorServiceOfferParam;
  public categories: Category[] = [];
  public filterCount = 0;
  public isSorting = false;

  constructor(private categoryService: CategoryService, private router: Router, private route: ActivatedRoute, private dialog: MatDialog) {}

  ngOnInit(): void {
    Object.assign(this.searchParam, this.route.snapshot.queryParams);
    this.countFilter();
    this.getCategories();
  }

  private getCategories() {
    const categories = this.categoryService.categories.value;
    if(categories.length == 0) {
      this.categoryService.getAllCategory(true).subscribe({
        next: (response: Category[]) => {
          this.categories = response;
        }
      })
    }
    else {
      this.categories = categories;
    }
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
    this.searchParam = {'category' : slugName} as VendorServiceOfferParam;
    this.searchField.nativeElement.value = '';
    this.filterCount = 0;
    this.navigate();
  }

  public search(param: string) {
    if(param.length == 0) {
      const {name, ...param} = this.searchParam;
      this.searchParam = param as VendorServiceOfferParam;
    }
    else this.searchParam.name = param;
    this.navigate();
  }

  public openFilter() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.data = this.searchParam;
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