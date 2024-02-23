import { Component, OnInit } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { Vendor } from 'src/app/model/vendor';
import { VendorService } from 'src/app/service/vendor.service';

@Component({
  selector: 'app-vendor-dashboard-category',
  templateUrl: './vendor-dashboard-category.component.html',
  styleUrls: ['./vendor-dashboard-category.component.css']
})
export class VendorDashboardCategoryComponent implements OnInit{
  public vendors: Vendor[] = []
  public category!: string;

  constructor(private vendorService: VendorService, private router: Router) {
    this.router.events.forEach((event) => {
      if(event instanceof Scroll) {
        const pathCategory = event.routerEvent.url.split('/').pop()!;
        if(!this.category || this.category.localeCompare(pathCategory) != 0) {
          this.category = pathCategory;
          this.getVendors();
        }
      }
    })
  }

  ngOnInit(): void {
  }

  private getVendors() {
    this.vendorService.getAllVendor(this.category).subscribe({
      next: (response: Vendor[]) => {
        this.vendors = response;
      }
    })
  }
}