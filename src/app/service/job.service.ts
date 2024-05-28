import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JobOffer } from 'src/app/model/job-offer';
import { environment } from 'src/environments/environment';
import { BasePageResponse } from '../model/base-page-response';
import { VendorJobOfferParam } from '../model/vendor-job-offer-param';
import { end } from '@popperjs/core';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private host = environment.apiUrl;

  constructor(private http:HttpClient) { }

  public getAllJob(param: VendorJobOfferParam, page: number): Observable<BasePageResponse<JobOffer>> {
      const params = new HttpParams({fromObject: param}).append('page', page);
      return this.http.get<BasePageResponse<JobOffer>>(`${this.host}/api/job-offers`, {params: params});
    }

  public getAllJobEtalase(vendorSlugName: string, param: VendorJobOfferParam | undefined, page: number): Observable<BasePageResponse<JobOffer>> {
    const params = new HttpParams({fromObject: param}).append('vendor', vendorSlugName).append('page', page);
    return this.http.get<BasePageResponse<JobOffer>>(`${this.host}/api/job-offers/etalase`, {params: params})
  }

  public getJobDetail(slugName: string, slugTitle: string, startDt: string, endDt: string): Observable<JobOffer> {
    return this.http.get<JobOffer>(`${this.host}/api/vendors/${slugName}/job-offers/${slugTitle}/${startDt}/${endDt}`);
  }

  public getAllJobOfferByTalent(jobSlugTitle: string): Observable<any> {
    return this.http.get<any>(`${this.host}/api/job-offers/byTalentId/${jobSlugTitle}`)
  }

  public addJobOffer(model: JobOffer, pictures: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('model', new Blob([JSON.stringify(model)], {type: 'application/json'}))
    pictures.forEach((value) => {
      formData.append('pictures', value);
    })

    return this.http.post<any>(`${this.host}/api/job-offers`, formData);
  }

  public editJobOffer(model: JobOffer, pictures: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('model', new Blob([JSON.stringify(model)], {type: 'application/json'}))
    pictures.forEach((value) => {
      formData.append('pictures', value);
    })

    return this.http.put<any>(`${this.host}/api/job-offers`, formData);
  }


}
