import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Talent } from 'src/app/model/talent';
import { VendorJobOfferParam } from 'src/app/model/vendor-job-offer-param';
import { TalentService } from 'src/app/service/talent.service';
import { JobFilterComponent } from '../../dialog/job-filter/job-filter.component';
import { JobSortComponent } from '../../dialog/job-sort/job-sort.component';

@Component({
  selector: 'app-job-dashboard',
  templateUrl: './job-dashboard.component.html',
  styleUrls: ['./job-dashboard.component.css']
})
export class JobDashboardComponent implements OnInit{
  @ViewChild('input') searchField!: ElementRef;

  public talents: Talent[] = [];
  private searchParam = {} as VendorJobOfferParam;
  public filterCount = 0;
  public isSorting = false;

  constructor(private talentService: TalentService, private router: Router, private route: ActivatedRoute, private dialog: MatDialog) {}

  ngOnInit(): void {
    Object.assign(this.searchParam, this.route.snapshot.queryParams);
    this.countFilter();
    this.countSort();
    this.getTalents();
  }

  private getTalents() {
      this.talentService.getAllTalent(true).subscribe({
        next: (response: Talent[]) => {
          this.talents = response;
        }
      })
  }

  public filterTalent(slugName: string) {
    this.searchParam = {'talent' : slugName} as VendorJobOfferParam;
    this.searchField.nativeElement.value = '';
    this.filterCount = 0;
    this.isSorting = false;
    this.navigate();
  }
  private navigate() {
    this.router.navigate(['./search'], {queryParams: this.searchParam, relativeTo: this.route})
  }

  public search(param: string) {
    if(param.length == 0) {
      const {title, ...param} = this.searchParam;
      this.searchParam = param as VendorJobOfferParam;
    }
    else this.searchParam.title = param;
    this.navigate();
  }


  private countFilter() {
    let count = 0;
    if(this.searchParam.location) count++;
    if(this.searchParam.occasions) count++;
    this.filterCount = count;
  }

  private countSort() {
    this.isSorting = this.searchParam.sort != undefined;
  }


  public openFilter() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.data = this.searchParam;
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(JobFilterComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: (param: VendorJobOfferParam) => {
        if(param) {
          this.searchParam = param;
          this.countFilter();
          this.navigate();
        }
      }
    })
  }

  public openSort() {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '500px';
      dialogConfig.data = this.searchParam;
      dialogConfig.autoFocus = false;
      const dialogRef = this.dialog.open(JobSortComponent, dialogConfig);
      dialogRef.afterClosed().subscribe({
        next: (param: VendorJobOfferParam) => {
          if(param) {
            this.searchParam = param;
            this.countSort();
            this.navigate();
          }
        }
      })
    }



}
