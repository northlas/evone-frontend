import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Role } from 'src/app/enum/role.enum';
import { BaseResponse } from 'src/app/model/base-response';
import { Category } from 'src/app/model/category';
import { Customer } from 'src/app/model/customer';
import { Talent } from 'src/app/model/talent';
import { User } from 'src/app/model/user';
import { Vendor } from 'src/app/model/vendor';
import { Wallet } from 'src/app/model/wallet';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CustomerService } from 'src/app/service/customer.service';
import { FreelancerService } from 'src/app/service/freelancer.service';
import { UserService } from 'src/app/service/user.service';
import { VendorService } from 'src/app/service/vendor.service';
import { WithdrawComponent } from '../../dialog/withdraw/withdraw.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  public user!: User;
  public customer?: Customer;
  public vendor?: Vendor;
  public isVendor = false;
  public isCustomer = false;
  public isFreelancer = false;
  public responsiveOptions = [
    {
      breakpoint: '1280px',
      numVisible: 4,
      numScroll: 4
    },
    {
      breakpoint: '720px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '480px',
      numVisible: 1,
      numScroll: 1
    }
  ]

  constructor(private authSerivce: AuthenticationService, private userService: UserService, private vendorService: VendorService, private customerService: CustomerService, private freelancerService: FreelancerService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getProfile();
  }

  private getProfile() {
    this.userService.getProfile().subscribe({
      next: (response: User) => {
        this.user = response;

        if (this.authSerivce.hasAuthority(Role.ROLE_VENDOR)) {
          this.isVendor = true;
          this.getVendor();
        }
        else if(this.authSerivce.hasAuthority(Role.ROLE_FREELANCER)) {
          this.isFreelancer = true;
          this.getFreelancer();
        }
        else if(this.authSerivce.hasAuthority(Role.ROLE_CUSTOMER)) {
          this.isCustomer = true
          this.getCustomer();
        }
      }
    })
  }

  private getVendor() {
    this.vendorService.getProfile().subscribe({
      next: (response: Vendor) => {
        this.vendor = response;
        this.vendor.wallet = this.user.wallet;
      }
    })
  }

  private getCustomer() {
    this.customerService.getProfile().subscribe({
      next: (response: Customer) => {
        this.customer = response;
        this.customer.wallet = this.user.wallet;
      }
    })
  }

  private getFreelancer() {
    this.freelancerService.getProfile().subscribe({
      next: (response: Customer) => {
        this.customer = response;
        this.customer.wallet = this.user.wallet;
      }
    })
  }

  public onWithdraw() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.minWidth = '450px'
    this.dialog.open(WithdrawComponent, dialogConfig).afterClosed().subscribe({
      next: (amount: number | null) => {
        if (amount) {
          this.user.wallet.balance -= amount;
        }
      }
    });
  }

  public joinName(categories: Category[] | Talent[]) {
    return categories.map(({name}) => name).join(', ');
  }

  public ceiling(rating: number) {
    return Math.ceil(rating);
  }
}
