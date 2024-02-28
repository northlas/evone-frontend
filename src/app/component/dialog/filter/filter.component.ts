import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  public occasionForm = new FormControl();
  public provinceForm = new FormControl();
  public minPriceForm = new FormControl();
  public maxPriceForm = new FormControl();

  constructor(@Inject(MAT_DIALOG_DATA) public data: VendorServiceOfferParam,private dialogRef: MatDialogRef<FilterComponent>, private occasionService: OccasionService, private provinceService: ProvinceService) {}

  ngOnInit(): void {
    this.getOccasions();
    this.getProvinces();
    this.occasionListener();
    this.provinceListener();
    this.minPriceListener();
    this.maxPriceListener();
    this.assignFormValue();
  }

  private assignFormValue() {
    this.occasionForm.setValue(this.data.occasions);
    this.provinceForm.setValue(this.data.location);
    this.minPriceForm.setValue(this.data.minPrice == undefined ? this.min : this.data.minPrice);
    this.maxPriceForm.setValue(this.data.maxPrice == undefined ? this.max : this.data.maxPrice);
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
          const {occasions, ...param} = this.data;
          this.data = param as VendorServiceOfferParam;
        }
        else {
          this.data.occasions = value;
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
          const {location: province, ...param} = this.data;
          this.data = param as VendorServiceOfferParam;
        }
        else {
          this.data.location = value;
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
          const {minPrice, ...param} = this.data;
          this.data = param as VendorServiceOfferParam;
        }
        else if(value == this.min) {
          this.isFilterMinPrice = false;
          const {minPrice, ...param} = this.data;
          this.data = param as VendorServiceOfferParam;
        }
        else {
          this.data.minPrice = value;
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
          this.data.maxPrice = this.min;
          this.isFilterMaxPrice = true;
        }
        else if(value == this.max) {
          this.isFilterMaxPrice = false;
          const {maxPrice, ...param} = this.data;
          this.data = param as VendorServiceOfferParam;
        }
        else {
          this.data.maxPrice = value;
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
  }

  public isFiltering() {
    return this.isFilterOccasion || this.isFilterProvince || this.isFilterMinPrice || this.isFilterMaxPrice;
  }

  public saveFilter() {
    this.dialogRef.close(this.data);
  }
}