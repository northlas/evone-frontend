import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { concatMap, from } from 'rxjs';
import { Talent } from 'src/app/model/talent';
import { Category } from 'src/app/model/category';
import { Vendor } from 'src/app/model/vendor';
import { JobOffer } from 'src/app/model/job-offer';
import { VendorJobOfferParam } from 'src/app/model/vendor-job-offer-param';
import { TalentService } from 'src/app/service/talent.service';
import { JobService } from 'src/app/service/job.service';

@Component({
  selector: 'app-job-dashboard-main',
  templateUrl: './job-dashboard-main.component.html',
  styleUrls: ['./job-dashboard-main.component.css']
})
export class JobDashboardMainComponent implements OnInit{
  public talents: Category[] = [];
  public talentJobs = new Map<string, JobOffer[]>();
  public isLoading = true;
  private searchParam = {} as VendorJobOfferParam;
  public responsiveOptions = [
    {
      breakpoint: '1860px',
      numVisible: 5,
      numScroll:5
    },
    {
      breakpoint: '1560px',
      numVisible: 4,
      numScroll:4
    },
    {
      breakpoint: '1260px',
      numVisible: 3,
      numScroll:3
    }
  ]

  constructor(private talentService: TalentService, private jobService: JobService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.getTalents();
  }

  private getTalents() {
    this.talentService.talents$.subscribe({
      next: (talents: Talent[]) => {
        if (talents.length > 0) {
          this.getJobs(structuredClone(talents));
        }
      }
    })
  }

  private getJobs(talents: Talent[]) {
    from(talents)
      .pipe(concatMap(talent => this.jobService.getAllJob({talent: talent.slugName} as VendorJobOfferParam, 1)))
      .subscribe(response => {
        this.talentJobs.set(talents.shift()!.name, response.items);
        if(talents.length == 0) this.isLoading = false;
      });
  }

  public disableSort() {
    return 0;
  }

  public formatPrice(value: number) {
    return 'Rp' + value.toLocaleString('id-ID');
  }
}
