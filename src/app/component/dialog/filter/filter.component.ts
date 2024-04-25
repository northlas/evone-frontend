import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from 'src/app/model/category';
import { Filter } from 'src/app/model/filter';
import { Occasion } from 'src/app/model/occasion';
import { Province } from 'src/app/model/province';
import { VendorServiceOfferParam } from 'src/app/model/vendor-service-offer-param';
import { CategoryService } from 'src/app/service/category.service';
import { OccasionService } from 'src/app/service/occasion.service';
import { ProvinceService } from 'src/app/service/province.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit{
  private min = 0;
  private max = 999_999_999;
  private isFilterMinPrice = false;
  private isFilterMaxPrice = false;
  private isFilterActive = false;
  private isFilterCategory = false;
  private isFilterOccasion = false;
  private isFilterProvince = false;
  public categories: Category[] = [];
  public occasions: Occasion[] = [];
  public provinces: Province[] = [];
  public form = this.formBuilder.group({
    category: new FormControl<string[] | null>(null),
    occasion: new FormControl<string[] | null>(null),
    province: new FormControl<string | null>(null),
    minPrice: new FormControl<number | null>(null),
    maxPrice: new FormControl<number | null>(null),
    active: new FormControl<boolean | null>(null),
  })

  constructor(@Inject(MAT_DIALOG_DATA) public filter: Filter, private formBuilder: FormBuilder, private dialogRef: MatDialogRef<FilterComponent>, private categoryService: CategoryService, private occasionService: OccasionService, private provinceService: ProvinceService) {}

  ngOnInit(): void {
    if (this.filter.type === 'dashboard') {
      this.getProvinces();
      this.provinceListener();
    } else if (this.filter.type === 'product') {
      this.getCategories();
      this.categoryListener();
      this.activeListener();
    }
    this.getOccasions();
    this.occasionListener();
    this.minPriceListener();
    this.maxPriceListener();
    this.assignFormValue();
  }

  private assignFormValue() {
    if (this.filter.type === 'dashboard') {
      this.form.controls.province.setValue(this.filter.serviceParam.location);
    } else {
      this.form.controls.active.setValue(this.filter.serviceParam.active);
      this.form.controls.category.setValue(this.filter.serviceParam.category);
    }
    this.form.controls.occasion.setValue(this.filter.serviceParam.occasions);
    this.form.controls.minPrice.setValue(this.filter.serviceParam.minPrice == undefined ? this.min : this.filter.serviceParam.minPrice);
    this.form.controls.maxPrice.setValue(this.filter.serviceParam.maxPrice == undefined ? this.max : this.filter.serviceParam.maxPrice);
  }

  private getCategories() {
    this.categoryService.getAllCategory(true).subscribe({
      next: (response: Category[]) => {
        this.categories = response;
      }
    })
  }

  private getOccasions() {
    this.occasionService.getAllOccasion().subscribe({
      next: (response: Occasion[]) => {
        this.occasions = response;
      }
    })
  }

  private getProvinces() {
    this.provinceService.getAllProvince().subscribe({
      next: (response: Province[]) => {
        this.provinces = response;
      }
    })
  }

  private activeListener() {
    this.form.controls.active.valueChanges.subscribe({
      next: (value: boolean | null) => {
        if(value == null) {
          this.isFilterActive = false;
          const {active, ...param} = this.filter.serviceParam;
          this.filter.serviceParam = param as VendorServiceOfferParam;
        }
        else {
          this.filter.serviceParam.active = value;
          this.isFilterActive = true;
        }
      }
    })
  }

  private categoryListener() {
    this.form.controls.category.valueChanges.subscribe({
      next: (value: string[] | null) => {
        if(value == null || value.length == 0) {
          this.isFilterCategory = false;
          const {category, ...param} = this.filter.serviceParam;
          this.filter.serviceParam = param as VendorServiceOfferParam;
        }
        else {
          this.filter.serviceParam.category = value;
          this.isFilterCategory = true;
        }
      }
    })
  }

  private occasionListener() {
    this.form.controls.occasion.valueChanges.subscribe({
      next: (value: string[] | null) => {
        if(value == null || value.length == 0) {
          this.isFilterOccasion = false;
          const {occasions, ...param} = this.filter.serviceParam;
          this.filter.serviceParam = param as VendorServiceOfferParam;
        }
        else {
          this.filter.serviceParam.occasions = value;
          this.isFilterOccasion = true;
        }
      }
    })
  }

  private provinceListener() {
    this.form.controls.province.valueChanges.subscribe({
      next: (value: string | null) => {
        if(value == null || value.length == 0) {
          this.isFilterProvince = false;
          const {location: province, ...param} = this.filter.serviceParam;
          this.filter.serviceParam = param as VendorServiceOfferParam;
        }
        else {
          this.filter.serviceParam.location = value;
          this.isFilterProvince = true;
        }
      }
    })
  }

  private minPriceListener() {
    this.form.controls.minPrice.valueChanges.subscribe({
      next: (value: number | null) => {
        if(value == null) {
          this.form.controls.minPrice.setValue(this.min);
          this.isFilterMinPrice = false;
          const {minPrice, ...param} = this.filter.serviceParam;
          this.filter.serviceParam = param as VendorServiceOfferParam;
        }
        else if(value == this.min) {
          this.isFilterMinPrice = false;
          const {minPrice, ...param} = this.filter.serviceParam;
          this.filter.serviceParam = param as VendorServiceOfferParam;
        }
        else {
          this.filter.serviceParam.minPrice = value;
          this.isFilterMinPrice = true;
        }
      }
    })
  }

  private maxPriceListener() {
    this.form.controls.maxPrice.valueChanges.subscribe({
      next: (value: number | null) => {
        if(value == null) {
          this.form.controls.maxPrice.setValue(this.min);
          this.filter.serviceParam.maxPrice = this.min;
          this.isFilterMaxPrice = true;
        }
        else if(value == this.max) {
          this.isFilterMaxPrice = false;
          const {maxPrice, ...param} = this.filter.serviceParam;
          this.filter.serviceParam = param as VendorServiceOfferParam;
        }
        else {
          this.filter.serviceParam.maxPrice = value;
          this.isFilterMaxPrice = true;
        }
      }
    })
  }

  public checkMinPrice() {
    if(this.form.controls.minPrice.value! < this.min || this.form.controls.minPrice.value == null) {
      this.form.controls.minPrice.setValue(this.min);
    }
    else if(this.form.controls.minPrice.value >= this.max) {
      this.form.controls.minPrice.setValue(this.max)
    }
  }

  public checkMaxPrice() {
    if(this.form.controls.maxPrice.value! > this.max || this.form.controls.maxPrice.value == null) {
      this.form.controls.maxPrice.setValue(this.max);
    }
  }

  public resetFilter() {
    this.form.controls.active.setValue(null);
    this.form.controls.category.setValue(null);
    this.form.controls.occasion.setValue(null);
    this.form.controls.province.setValue(null);
    this.form.controls.minPrice.setValue(this.min);
    this.form.controls.maxPrice.setValue(this.max);
    this.saveFilter();
  }

  public isFiltering() {
    return this.isFilterActive || this.isFilterCategory || this.isFilterOccasion || this.isFilterProvince || this.isFilterMinPrice || this.isFilterMaxPrice;
  }

  public saveFilter() {
    this.dialogRef.close(this.filter.serviceParam);
  }
}
