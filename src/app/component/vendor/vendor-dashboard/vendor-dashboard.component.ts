import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/model/category';
import { CategoryService } from 'src/app/service/category.service';
import { VendorDashboardCategoryComponent } from '../vendor-dashboard-category/vendor-dashboard-category.component';

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.css']
})
export class VendorDashboardComponent implements OnInit{
  public categories: Category[] = [];

  constructor(private categoryService: CategoryService) {}

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

  public search(param: string) {
    console.log(param);
  }

  public slugify(str: string) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space
    str = str.toLowerCase(); // convert string to lowercase
    str = str.replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
             .replace(/\s+/g, '-') // replace spaces with hyphens
             .replace(/-+/g, '-'); // remove consecutive hyphens
    return str;
  }
}
