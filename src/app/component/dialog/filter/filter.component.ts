import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Filter } from 'src/app/model/filter';
import { Occasion } from 'src/app/model/occasion';
import { Province } from 'src/app/model/province';
import { VendorServiceOfferParam } from 'src/app/model/vendor-service-offer-param';
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
  private isFilterOccasion = false;
  private isFilterProvince = false;
  public occasions: Occasion[] = [];
  public provinces: Province[] = [];
  public occasionForm = new FormControl<string[] | null>(null);
  public provinceForm = new FormControl<string | null>(null);
  public minPriceForm = new FormControl<number | null>(null);
  public maxPriceForm = new FormControl<number | null>(null);
  public statusForm = new FormControl<boolean | null>(null);

  constructor(@Inject(MAT_DIALOG_DATA) public filter: Filter, private dialogRef: MatDialogRef<FilterComponent>, private occasionService: OccasionService, private provinceService: ProvinceService) {}

  ngOnInit(): void {
    if (this.filter.type === 'dashboard') {
      this.getProvinces();
      this.provinceListener();
    }
    this.getOccasions();
    this.occasionListener();
    this.minPriceListener();
    this.maxPriceListener();
    this.assignFormValue();
  }

  private assignFormValue() {
    if (this.filter.type === 'dashboard') {
      this.provinceForm.setValue(this.filter.serviceParam.location);
    } else {
      this.statusForm.setValue(this.filter.serviceParam.status);
    }
    this.occasionForm.setValue(this.filter.serviceParam.occasions);
    this.minPriceForm.setValue(this.filter.serviceParam.minPrice == undefined ? this.min : this.filter.serviceParam.minPrice);
    this.maxPriceForm.setValue(this.filter.serviceParam.maxPrice == undefined ? this.max : this.filter.serviceParam.maxPrice);
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

  private occasionListener() {
    this.occasionForm.valueChanges.subscribe({
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
    this.provinceForm.valueChanges.subscribe({
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
    this.minPriceForm.valueChanges.subscribe({
      next: (value: number | null) => {
        if(value == null) {
          this.minPriceForm.setValue(this.min);
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
    this.maxPriceForm.valueChanges.subscribe({
      next: (value: number | null) => {
        if(value == null) {
          this.maxPriceForm.setValue(this.min);
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
    if(this.minPriceForm.value! < this.min || this.minPriceForm.value == null) {
      this.minPriceForm.setValue(this.min);
    }
    else if(this.minPriceForm.value >= this.max) {
      this.minPriceForm.setValue(this.max)
    }
  }

  public checkMaxPrice() {
    if(this.maxPriceForm.value! > this.max || this.maxPriceForm.value == null) {
      this.maxPriceForm.setValue(this.max);
    }
  }

  public resetFilter() {
    this.occasionForm.setValue(null);
    this.provinceForm.setValue(null);
    this.minPriceForm.setValue(this.min);
    this.maxPriceForm.setValue(this.max);
    this.saveFilter();
  }

  public isFiltering() {
    return this.isFilterOccasion || this.isFilterProvince || this.isFilterMinPrice || this.isFilterMaxPrice;
  }

  public saveFilter() {
    this.dialogRef.close(this.filter.serviceParam);
  }
}
