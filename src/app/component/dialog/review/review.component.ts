import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiceTransactionParam } from 'src/app/model/service-transaction-param ';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent{
  constructor(@Inject(MAT_DIALOG_DATA) public param: ServiceTransactionParam, private dialogRef: MatDialogRef<ReviewComponent>) {}
}