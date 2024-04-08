import { Component } from '@angular/core';
import { ActivatedRoute, Router, Scroll } from '@angular/router';
import { BasePageResponse } from 'src/app/model/base-page-response';
import { VendorJobOfferParam } from 'src/app/model/vendor-job-offer-param';
import { Job } from 'src/app/model/job';
import { JobService } from 'src/app/service/job.service';

@Component({
  selector: 'app-job-dashboard-category',
  templateUrl: './job-dashboard-category.component.html',
  styleUrls: ['./job-dashboard-category.component.css']
})
export class JobDashboardCategoryComponent {
  public isLoading = true;
  public jobs: Job[] = []
  private page!: number;
  private totalItems!: number;
  private searchParam: VendorJobOfferParam = {} as VendorJobOfferParam;

  constructor(private jobService: JobService, private router: Router, route: ActivatedRoute) {
    this.router.events.forEach((event) => {
      if (event instanceof Scroll) {
        const queryParams = route.snapshot.queryParams as VendorJobOfferParam;
        const isChangeParam = JSON.stringify(this.searchParam) !== JSON.stringify(queryParams);
        if (isChangeParam) {
          this.jobs = [];
          this.searchParam = queryParams;
          this.page = 0;
          this.totalItems = -1;
          this.isLoading = true;
          this.getJobs(true);
        }
      }
    })
  }

  public getJobs(isChangeParam: boolean) {
    if (this.jobs.length != this.totalItems) {
      this.isLoading = true;
      this.page++;
      this.jobService.getAllJob(this.searchParam, this.page).subscribe({
        next: (response: BasePageResponse) => {
          this.isLoading = false;

          if (isChangeParam) this.jobs = response.items;
          else this.jobs.push(...response.items);

          if (response.totalItems >= 0 && this.totalItems < 0) {
            this.totalItems = response.totalItems
            if (this.jobs.length != response.totalItems) {
              this.isLoading = true;
            }
          }
        }
      })
    }
  }

  public formatPrice(value: number) {
    return 'Rp' + value.toLocaleString('id-ID');
  }
}
