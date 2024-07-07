import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Role } from 'src/app/enum/role.enum';
import { Category } from 'src/app/model/category';
import { Customer } from 'src/app/model/customer';
import { Talent } from 'src/app/model/talent';
import { User } from 'src/app/model/user';
import { Vendor } from 'src/app/model/vendor';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CustomerService } from 'src/app/service/customer.service';
import { FreelancerService } from 'src/app/service/freelancer.service';
import { UserService } from 'src/app/service/user.service';
import { VendorService } from 'src/app/service/vendor.service';
import { WithdrawComponent } from '../../dialog/withdraw/withdraw.component';
import { EditProfileVendorComponent } from '../../dialog/edit-profile-vendor/edit-profile-vendor.component';
import { EditProfileCustomerComponent } from '../../dialog/edit-profile-customer/edit-profile-customer.component';
import { S3Service } from 'src/app/service/s3.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  public user!: User;
  public customer?: Customer;
  public vendor?: Vendor;
  public profile?: SafeResourceUrl;
  public profileImage?: File;
  public isVendor = false;
  public isCustomer = false;
  public isFreelancer = false;
  public isFetchingImage = true;
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

  constructor(private authSerivce: AuthenticationService, private userService: UserService, private vendorService: VendorService, private customerService: CustomerService, private freelancerService: FreelancerService, private dialog: MatDialog, private s3Service: S3Service, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.getProfile();
  }

  private getProfile() {
    this.userService.getProfile().subscribe({
      next: (response: User) => {
        this.user = response;
        this.getProfileImage(response.email);

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

  private getProfileImage(email: string) {
    this.s3Service.getImage('profile/' + email)
      .then(response => {
        response.Body?.transformToByteArray().then(body => {
          let binary = '';
          for (let i = 0; i < body.length; i++) {
            binary += String.fromCharCode(body[i]);
          }
          this.profileImage = new File([body], email, {type: 'image/jpeg'})
          this.profile = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + btoa(binary));
        })
      })
      .finally(() => {
        this.isFetchingImage = false;
      })
  }

  public onEditProfile() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;

    if (this.isVendor) {
      dialogConfig.data = {existing: this.vendor, profile: this.profile};
      this.dialog.open(EditProfileVendorComponent, dialogConfig);
    }
    else {
      dialogConfig.data = {existing: this.customer, profile: this.profile};
      this.dialog.open(EditProfileCustomerComponent, dialogConfig);
    }
  }

  public onWithdraw() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.data = this.isVendor ? this.vendor?.wallet.accountNo : this.customer?.wallet?.accountNo;
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
