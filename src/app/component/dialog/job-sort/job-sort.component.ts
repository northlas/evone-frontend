import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VendorJobOfferParam } from 'src/app/model/vendor-job-offer-param';

@Component({
  selector: 'app-job-sort',
  templateUrl: './job-sort.component.html',
  styleUrls: ['./job-sort.component.css']
})
export class JobSortComponent implements OnInit{
  public sortForm = new FormControl();

  constructor(@Inject(MAT_DIALOG_DATA) public data: VendorJobOfferParam, private dialogRef: MatDialogRef<JobSortComponent>) {}

  ngOnInit(): void {
    this.sortForm.setValue(this.data.sort == undefined ? null : this.data.sort);
    this.sortListener();
  }

  private sortListener() {
    this.sortForm.valueChanges.subscribe({
      next: (sort: string | null) => {
        if(sort) {
          this.data.sort = sort;
        }
        else {
          const {sort, ...param} = this.data;
          this.data = param as VendorJobOfferParam;
        }
        this.dialogRef.close(this.data);
      }
    })
  }
}
