import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Category } from 'src/app/model/category';
import { CategoryService } from 'src/app/service/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategorySearchParam } from 'src/app/model/category-search-param';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FilterComponent } from '../../dialog/filter/filter.component';

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.css']
})
export class VendorDashboardComponent implements OnInit{
  @ViewChild('input') searchField!: ElementRef;

  public categories: Category[] = [];
  private searchParam = {} as CategorySearchParam;

  constructor(private categoryService: CategoryService, private router: Router, private route: ActivatedRoute, private dialog: MatDialog) {}

  ngOnInit(): void {
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

  public filterCategory(slugName: string) {
    this.searchField.nativeElement.value = '';
    this.searchParam = {'category' : slugName} as CategorySearchParam;
    this.navigate();
  }

  public search(param: string) {
    if(param.length == 0) this.searchParam = {'category' : this.searchParam.category} as CategorySearchParam;
    else this.searchParam.name = param;
    this.navigate();
  }

  public openFilter() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    this.dialog.open(FilterComponent, dialogConfig);
  }

  private navigate() {
    this.router.navigate(['./search'], {queryParams: this.searchParam, relativeTo: this.route})
  }
}
