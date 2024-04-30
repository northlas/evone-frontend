import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobOffer } from 'src/app/model/job-offer';
import { Vendor } from 'src/app/model/vendor';
import { JobService } from 'src/app/service/job.service';
import { VendorService } from 'src/app/service/vendor.service';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
})
export class JobDetailComponent implements OnInit{
  private slugTitle!: string;
  public job!: JobOffer;
  public isLoading = true;

  constructor(private route: ActivatedRoute, private vendorService: VendorService, private jobService: JobService) {}

  ngOnInit(): void {
    this.slugTitle = this.route.snapshot.params['jobTitle'];
    this.getJob();
  }

  private getJob() {
      this.jobService.getJobDetail(this.slugTitle).subscribe({
        next: response => {
          this.job = response;
        }
      })
  }

}
