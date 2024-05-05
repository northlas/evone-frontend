import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { JobOffer } from 'src/app/model/job-offer';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { JobService } from 'src/app/service/job.service';
import { AddJobComponent } from '../../dialog/add-job/add-job.component';
import { ActivatedRoute, Router, Scroll } from '@angular/router';
import { assignQueryParams, VendorJobOfferParam } from 'src/app/model/vendor-job-offer-param';


@Component({
  selector: 'app-vendor-product-job',
  templateUrl: './vendor-product-job.component.html',
  styleUrls: ['./vendor-product-job.component.css']
})
export class VendorProductJobComponent {
 @Input() params!: HttpParams;

  public searchParam = {} as VendorJobOfferParam;
  public jobOffers: JobOffer[] = [];
  public isLoading: boolean = true;
  public isInitiated = false;

  constructor(private jobService: JobService, private authService: AuthenticationService, private dialog: MatDialog, private router: Router, private route: ActivatedRoute) {
    this.router.events.forEach(event => {
      if (event instanceof Scroll) {
        const queryParams = assignQueryParams(route.snapshot.queryParams);
        const isEmpty = (Object.keys(queryParams).length + Object.keys(this.searchParam).length) == 0;
        const isChangeParam = isEmpty || (JSON.stringify(this.searchParam) !== JSON.stringify(queryParams));
        if (isChangeParam && !this.isInitiated) {
          this.jobOffers = [];
          this.searchParam = queryParams;
          this.getJobOffers();
        }
      }
    })
  }

  ngOnInit(): void {
    this.isInitiated = true;
    this.getJobOffers();
  }

  private getJobOffers() {
    this.jobService.getAllJobEtalase(this.authService.getSlugName(), this.searchParam, 1).subscribe({
      next: response => {
        this.jobOffers = response.items;
        this.isLoading = false;
        this.isInitiated = false;
      }
    })
  }

  public addJob() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false
    this.dialog.open(AddJobComponent, dialogConfig).afterClosed().subscribe({
      next: (value: boolean | undefined) => {
        if(value) this.getJobOffers();
      }
    });
  }

  public editJob(data: JobOffer) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false
    dialogConfig.data = data;
    this.dialog.open(AddJobComponent, dialogConfig).afterClosed().subscribe({
      next: (value: boolean | undefined) => {
        if(value) this.getJobOffers();
      }
    });
  }
}
