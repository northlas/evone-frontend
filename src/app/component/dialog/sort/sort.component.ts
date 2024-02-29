import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VendorServiceOfferParam } from 'src/app/model/vendor-service-offer-param';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.css']
})
export class SortComponent implements OnInit{
  public sortForm = new FormControl();

  constructor(@Inject(MAT_DIALOG_DATA) public data: VendorServiceOfferParam, private dialogRef: MatDialogRef<SortComponent>) {}
  
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
          this.data = param as VendorServiceOfferParam;
        }
        this.dialogRef.close(this.data);
      }
    })
  }
}
