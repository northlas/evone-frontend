import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {
  private min = 0;
  private max = 999_999_999;
  private isFilterPrice = false;
  private filterCount = 0;
  public minPriceForm = new FormControl(this.min);
  public maxPriceForm = new FormControl(this.max);

  constructor(private dialogRef: MatDialogRef<FilterComponent>) {}

  public checkMaxPrice() {
    if(this.maxPriceForm.value! > this.max || this.maxPriceForm.value == undefined) {
      this.maxPriceForm.setValue(this.max);
      this.isFilterPrice = false;
    }
  }

  public checkMinPrice() {
    if(this.minPriceForm.value! < this.min || this.minPriceForm.value == undefined) {
      this.minPriceForm.setValue(this.min);
      this.isFilterPrice = false;
    }
    else if(this.minPriceForm.value >= this.max) {
      this.minPriceForm.setValue(this.max)
    }
  }

  public resetFilter() {
    this.minPriceForm.setValue(this.min);
    this.maxPriceForm.setValue(this.max);
    this.isFilterPrice = false;
    this.isFilterPrice = false;
  }

  public doFilterMinPrice() {
    if(this.minPriceForm.value == undefined) {
      this.minPriceForm.setValue(this.min);
      this.isFilterPrice = false;
    }
    else if(this.minPriceForm.value! == 0) {
      this.isFilterPrice = false;
    }
    else {
      this.isFilterPrice = true;
    }
  }

  public doFilterMaxPrice() {
    this.isFilterPrice = true;
  }

  public isFiltering() {
    return this.isFilterPrice;
  }

  public saveFilter() {
    let filterCount = 0;
    if(this.isFilterPrice) filterCount++; 
    this.dialogRef.close(filterCount);
  }
}
