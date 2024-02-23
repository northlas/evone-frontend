import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CategoryService } from '../service/category.service';
import { Category } from '../model/category';

export const categoryMenuGuard: CanActivateFn = (route, state) => {
  const categoryService = inject(CategoryService);
  const router = inject(Router)
  const categories = categoryService.categories.value;
  const path = route.url.pop()?.path!;

  if(categories.length == 0) {
    return new Promise(resolve => {
      categoryService.getAllCategory(true).subscribe({
        next: (response: Category[]) => {
          if(response.find(({slugName}) => slugName.localeCompare(path) == 0) != undefined) {
            resolve(true)
          }
          else {
            router.navigate(['/vendor'])
            resolve(false)
          }
        }
      });
    })
  }
  else {
    if(categories.find(({slugName}) => slugName.localeCompare(path) == 0) != undefined) {
      return true;
    }
    else {
      router.navigate(['/vendor'])
      return false;
    }
  }
};
