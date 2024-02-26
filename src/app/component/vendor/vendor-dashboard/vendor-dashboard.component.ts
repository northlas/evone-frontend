import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/model/category';
import { CategoryService } from 'src/app/service/category.service';
import { VendorDashboardCategoryComponent } from '../vendor-dashboard-category/vendor-dashboard-category.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CategorySearchParam } from 'src/app/model/category-search-param';

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.css']
})
export class VendorDashboardComponent implements OnInit{
  public categories: Category[] = [];
  private searchParam = {} as CategorySearchParam;

  constructor(private categoryService: CategoryService, private router: Router, private route: ActivatedRoute) {}

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
    this.searchParam.category = slugName;
    this.navigate();
  }

  public search(param: string) {
    this.searchParam.name = param;
    this.navigate();
  }

  private navigate() {
    this.router.navigate(['./search'], {queryParams: this.searchParam, relativeTo: this.route})
  }
}
