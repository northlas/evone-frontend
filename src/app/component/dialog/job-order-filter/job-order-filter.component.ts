import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { JobFilter } from 'src/app/model/job-filter';
import { JobFilterComponent } from '../job-filter/job-filter.component';
import { TalentService } from 'src/app/service/talent.service';
import { JobTransactionParam } from 'src/app/model/job-transaction-param';
import { Talent } from 'src/app/model/talent';

@Component({
  selector: 'app-job-order-filter',
  templateUrl: './job-order-filter.component.html',
  styleUrls: ['./job-order-filter.component.css']
})
export class JobOrderFilterComponent implements OnInit{
  private isFilterStatus = false;
  private isFilterTalent = false;
  private isFilterDate = false;
  public talents: Talent[] = [];
  public form = this.formBuilder.group({
    talent: new FormControl<string | null>(null),
    startDt: new FormControl<Date | null>(null),
    endDt: new FormControl<Date | null>(null),
    status: new FormControl<number | null>(null),
  })

  constructor(@Inject(MAT_DIALOG_DATA) public filter: JobFilter, private formBuilder: FormBuilder, private talentService: TalentService, private dialogRef: MatDialogRef<JobFilterComponent>) {}

  ngOnInit(): void {
    this.getTalents();
    this.talentListener();
    this.dateListener();
    this.statusListener();
    this.assignFormValue();
  }

  private assignFormValue() {
    this.form.controls.talent.setValue(this.filter.jobTransactionParam.talent);
    if (this.filter.jobTransactionParam.startDt) {
      this.form.controls.startDt.setValue(new Date(this.filter.jobTransactionParam.startDt));
    }
    if (this.filter.jobTransactionParam.endDt) {
      this.form.controls.endDt.setValue(new Date(this.filter.jobTransactionParam.endDt));
    }
    this.form.controls.status.setValue(this.filter.jobTransactionParam.status);
  }

  private getTalents() {
    this.talentService.getAllTalent(true).subscribe({
      next: (response: Talent[]) => {
        this.talents = response;
      }
    })
  }

  private talentListener() {
    this.form.controls.talent.valueChanges.subscribe({
      next: (value: string | null) => {
        if(value == null || value.length == 0) {
          const {talent, ...param} = this.filter.jobTransactionParam;
          this.filter.jobTransactionParam = param as JobTransactionParam;
          this.isFilterTalent = false;
        }
        else {
          this.filter.jobTransactionParam.talent = value;
          this.isFilterTalent = true;
        }
      }
    })
  }

  private dateListener() {
    this.form.controls.endDt.valueChanges.subscribe({
      next: (value: Date | null) => {
        if (value == null) {
          const {startDt, endDt, ...param} = this.filter.jobTransactionParam;
          this.filter.jobTransactionParam = param as JobTransactionParam;
          this.isFilterDate = false;
        }
        else {
          const startDateString = this.form.controls.startDt.value!.toLocaleDateString('en-CA');
          const endDateString = value.toLocaleDateString('en-CA');
          this.filter.jobTransactionParam.startDt = startDateString + ' 00:00:00';
          this.filter.jobTransactionParam.endDt = endDateString + ' 23:59:59';
          this.isFilterDate = true;
        }
      }
    })
  }

  private statusListener() {
    this.form.controls.status.valueChanges.subscribe({
      next: (value: number | null) => {
        if(value == null) {
          const {status, ...param} = this.filter.jobTransactionParam;
          this.filter.jobTransactionParam = param as JobTransactionParam;
          this.isFilterStatus = false;
        }
        else {
          this.filter.jobTransactionParam.status = value;
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
    this.form.controls.talent.setValue(null);
    this.form.controls.startDt.setValue(null);
    this.form.controls.endDt.setValue(null);
    this.form.controls.status.setValue(null);
    this.saveFilter();
  }

  public isFiltering() {
    return this.isFilterTalent || this.isFilterDate || this.isFilterStatus;
  }

  public saveFilter() {
    this.dialogRef.close(this.filter.jobTransactionParam);
  }
}
