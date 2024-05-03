import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Occasion } from 'src/app/model/occasion';
import { Province } from 'src/app/model/province';
import { VendorJobOfferParam } from 'src/app/model/vendor-job-offer-param';
import { OccasionService } from 'src/app/service/occasion.service';
import { ProvinceService } from 'src/app/service/province.service';

@Component({
  selector: 'app-job-filter',
  templateUrl: './job-filter.component.html',
  styleUrls: ['./job-filter.component.css']
})
export class JobFilterComponent implements OnInit{
  private min = 0;
  private max = 999_999_999;
  private isFilterOccasion = false;
  private isFilterProvince = false;
  public occasions: Occasion[] = [];
  public provinces: Province[] = [];
  public occasionForm = new FormControl();
  public provinceForm = new FormControl();

  constructor(@Inject(MAT_DIALOG_DATA) public data: VendorJobOfferParam,private dialogRef: MatDialogRef<JobFilterComponent>, private occasionService: OccasionService, private provinceService: ProvinceService) {}

  ngOnInit(): void {
    this.getOccasions();
    this.getProvinces();
    this.occasionListener();
    this.provinceListener();
    this.assignFormValue();
  }

  private assignFormValue() {
    this.occasionForm.setValue(this.data.occasions);
    this.provinceForm.setValue(this.data.location);
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
          this.data = param as VendorJobOfferParam;
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
          this.data = param as VendorJobOfferParam;
        }
        else {
          this.data.location = value;
          this.isFilterProvince = true;
        }
      }
    })
  }

  public resetFilter() {
    this.occasionForm.setValue(null);
    this.provinceForm.setValue(null);
  }

  public isFiltering() {
    return this.isFilterOccasion || this.isFilterProvince;
  }

  public saveFilter() {
    this.dialogRef.close(this.data);
  }
}
