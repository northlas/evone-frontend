import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Filter } from 'src/app/model/filter';
import { FilterComponent } from '../filter/filter.component';
import { ServiceTransactionStatus } from 'src/app/enum/service-transaction-status';
import { Category } from 'src/app/model/category';
import { CategoryService } from 'src/app/service/category.service';
import { ServiceTransactionParam } from 'src/app/model/service-transaction-param ';

@Component({
  selector: 'app-order-filter',
  templateUrl: './order-filter.component.html',
  styleUrls: ['./order-filter.component.css']
})
export class OrderFilterComponent implements OnInit{
  private isFilterStatus = false;
  private isFilterCategory = false;
  private isFilterDate = false;
  public categories: Category[] = [];
  public form = this.formBuilder.group({
    category: new FormControl<string | null>(null),
    startDt: new FormControl<Date | null>(null),
    endDt: new FormControl<Date | null>(null),
    status: new FormControl<number | null>(null),
  })

  constructor(@Inject(MAT_DIALOG_DATA) public filter: Filter, private formBuilder: FormBuilder, private categoryService: CategoryService, private dialogRef: MatDialogRef<FilterComponent>) {}

  ngOnInit(): void {
    this.getCategories();
    this.categoryListener();
    this.dateListener();
    this.statusListener();
    this.assignFormValue();
  }

  private assignFormValue() {
    this.form.controls.category.setValue(this.filter.serviceTransactionParam.category);
    if (this.filter.serviceTransactionParam.startDt) {
      this.form.controls.startDt.setValue(new Date(this.filter.serviceTransactionParam.startDt));
    }
    if (this.filter.serviceTransactionParam.endDt) {
      this.form.controls.endDt.setValue(new Date(this.filter.serviceTransactionParam.endDt));
    }
    this.form.controls.status.setValue(this.filter.serviceTransactionParam.status);
  }

  private getCategories() {
    this.categoryService.getAllCategory(true).subscribe({
      next: (response: Category[]) => {
        this.categories = response;
      }
    })
  }

  private categoryListener() {
    this.form.controls.category.valueChanges.subscribe({
      next: (value: string | null) => {
        if(value == null || value.length == 0) {
          const {category, ...param} = this.filter.serviceTransactionParam;
          this.filter.serviceTransactionParam = param as ServiceTransactionParam;
          this.isFilterCategory = false;
        }
        else {
          this.filter.serviceTransactionParam.category = value;
          this.isFilterCategory = true;
        }
      }
    })
  }

  private dateListener() {
    this.form.controls.endDt.valueChanges.subscribe({
      next: (value: Date | null) => {
        if (value == null) {
          const {startDt, endDt, ...param} = this.filter.serviceTransactionParam;
          this.filter.serviceTransactionParam = param as ServiceTransactionParam;
          this.isFilterDate = false;
        }
        else {
          const startDateString = this.form.controls.startDt.value!.toLocaleDateString('en-CA');
          const endDateString = value.toLocaleDateString('en-CA');
          this.filter.serviceTransactionParam.startDt = startDateString + ' 00:00:00';
          this.filter.serviceTransactionParam.endDt = endDateString + ' 23:59:59';
          this.isFilterDate = true;
        }
      }
    })
  }

  private statusListener() {
    this.form.controls.status.valueChanges.subscribe({
      next: (value: number | null) => {
        if(value == null) {
          const {status, ...param} = this.filter.serviceTransactionParam;
          this.filter.serviceTransactionParam = param as ServiceTransactionParam;
          this.isFilterStatus = false;
        }
        else {
          this.filter.serviceTransactionParam.status = value;
          this.isFilterStatus = true;
        }
      }
    })
  }

  public checkEndDate() {
    if (this.form.controls.endDt.value == null) {
      this.form.controls.endDt.setValue(this.form.controls.startDt.value)
    }
  }

  public resetFilter() {
    this.form.controls.category.setValue(null);
    this.form.controls.startDt.setValue(null);
    this.form.controls.endDt.setValue(null);
    this.form.controls.status.setValue(null);
    this.saveFilter();
  }

  public isFiltering() {
    return this.isFilterCategory || this.isFilterDate || this.isFilterStatus;
  }

  public saveFilter() {
    this.dialogRef.close(this.filter.serviceTransactionParam);
  }
}