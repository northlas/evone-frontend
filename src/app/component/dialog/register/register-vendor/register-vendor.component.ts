import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Validators, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FileSelectEvent } from 'primeng/fileupload';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Category } from 'src/app/model/category';
import { City } from 'src/app/model/city';
import { Platform } from 'src/app/model/platform';
import { Province } from 'src/app/model/province';
import { Vendor } from 'src/app/model/vendor';
import { VendorSocialMedia } from 'src/app/model/vendor-social-media';
import { CategoryService } from 'src/app/service/category.service';
import { CityService } from 'src/app/service/city.service';
import { NotificationService } from 'src/app/service/notification.service';
import { PlatformService } from 'src/app/service/platform.service';
import { ProvinceService } from 'src/app/service/province.service';
import { VendorService } from 'src/app/service/vendor.service';
import { RegisterMainComponent } from '../register-main/register-main.component';

@Component({
  selector: 'app-register-vendor',
  templateUrl: './register-vendor.component.html',
  styleUrls: ['./register-vendor.component.css']
})
export class RegisterVendorComponent implements OnInit{
  @ViewChildren('usernameInput') usernameInput!: QueryList<ElementRef>;

  public provinces: Province[] = [];
  public cities: City[] = [];
  public filteredCities: City[] = [];
  public categories: Category[] = [];
  public platforms: Platform[] = [];
  public usernames = new Map<number, string>();
  public profileImage?: File;
  public isProfileHovered = false;
  public borderColor = '#9e9e9e'
  public isProfileError = false;

  public vendorFormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: this.matchPassword('password', 'confirmPassword')
  })

  public companyFormGroup = this.formBuilder.group({
    province: [undefined, Validators.required],
    city: [{value: undefined, disabled: true}, Validators.required],
    address: ['', Validators.required],
    category: [[] as number[], Validators.required],
    platform: [[] as number[], Validators.required]
  })

  public profileFormGroup = this.formBuilder.group({
    image: [{} as File],
    profile: ['', Validators.required],
    description: ['', Validators.required],
  })

  constructor(
    private dialogRef: MatDialogRef<RegisterMainComponent>,
    private formBuilder: FormBuilder,
    private vendorService: VendorService,
    private notificationService: NotificationService,
    private provinceService: ProvinceService,
    private cityService: CityService,
    private categoryService: CategoryService,
    private platformService: PlatformService) {}

  ngOnInit(): void {
    this.getProvinces();
    this.getCities();
    this.getPlatforms();
    this.provinceListener();
    this.categories = this.categoryService.categories.value;
  }

  private matchPassword(password: string, confirmPassword: string): ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const control = abstractControl.get(password);
      const matchingControl = abstractControl.get(confirmPassword);

      if (matchingControl?.value.length == 0) {
        const error = { required: Validators.required};
        matchingControl?.setErrors(error);
        return error;
      }

      if (matchingControl?.errors && matchingControl.errors['confirmValidator']) {
        return null;
      }

      if (control?.value !== matchingControl?.value || matchingControl?.value.length == 0) {
        const error = { confirmValidator: 'Password does not match' };
        matchingControl?.setErrors(error);
        return error;
      }
      else {
        matchingControl?.setErrors(null);
        return null;
      }
    }
  }

  private getProvinces() {
    this.provinceService.getAllProvince().subscribe({
      next: response => {
        this.provinces= response;
      }
    })
  }

  private getCities() {
    this.cityService.getAllCity().subscribe({
      next: response => {
        this.cities = response;
      }
    })
  }

  private getPlatforms() {
    this.platformService.getAllPlatform().subscribe({
      next: response => {
        this.platforms = response;
      }
    })
  }

  private provinceListener() {
    this.companyFormGroup.controls.province.valueChanges.subscribe({
      next: value => {
        if (value !== null) {
          this.filteredCities = this.cities.filter(({provinceId}) => provinceId === value)
          this.companyFormGroup.controls.city.enable();
          this.companyFormGroup.controls.city.setValue(undefined);
        }
      }
    })
  }

  public profileStepListener() {
    if (this.profileFormGroup.controls.profile.invalid) {
      this.isProfileError = true;
      this.borderColor = '#f44336';
    }
  }

  public checkPlatformUsername() {
    const usernameArray = this.usernameInput.toArray();

    const required = usernameArray.find((input) => {
      const element = input.nativeElement as HTMLInputElement;
      return element.required;
    })

    if(required == undefined) return;

    const blank = usernameArray.find((input) => {
      const element = input.nativeElement as HTMLInputElement;
      return element.required && element.value.length == 0
    })

    if(blank != undefined) {
      this.companyFormGroup.controls.platform.setErrors({username: 'Username harus diisi'});
    }
    else {
      this.companyFormGroup.controls.platform.setErrors(null);
    }
  }

  public isProfileSelected() {
    return this.profileFormGroup.controls.profile.value!.length > 0;
  }

  public onHover() {
    if (!this.isProfileError) {
      this.isProfileHovered = true;
      this.borderColor = '#212121'
    }
  }

  public onBlur() {
    if (!this.isProfileError) {
      this.isProfileHovered = false;
      this.borderColor = '#9e9e9e'
    }
  }

  public onSelect(event: FileSelectEvent) {
    const file = event.currentFiles.pop()!;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.isProfileError = false;
      this.profileFormGroup.controls.image.setValue(file);
      this.profileFormGroup.controls.profile.setValue(reader.result!.toString());
    }
  }

  public onRegister() {
    const accountForm = this.vendorFormGroup.controls;
    const companyForm = this.companyFormGroup.controls;
    const profileForm = this.profileFormGroup.controls;

    const city = {} as City;
    city.id = companyForm.city.value!;

    const categories: Category[] = [];
    companyForm.category.value?.forEach(value => {
      const category = {} as Category;
      category.id = value;
      categories.push(category)
    })

    const socialMedia: VendorSocialMedia[] = [];
    companyForm.platform.value?.forEach(value => {
      socialMedia.push({
        platformId: value,
        username: this.usernames.get(value)!
      } as VendorSocialMedia)
    })

    const vendor = {} as Vendor;
    vendor.email = accountForm.email.value!;
    vendor.name = accountForm.name.value!;
    vendor.password = accountForm.confirmPassword.value!;
    vendor.address = companyForm.address.value!;
    vendor.phone = accountForm.phone.value!;
    vendor.description = profileForm.description.value!;
    vendor.accountNo = '123456789';
    vendor.city = city;
    vendor.categories = categories;
    vendor.socialMedia = socialMedia;

    this.vendorService.addVendor(vendor, profileForm.image.value!).subscribe({
      next: response => {
        this.notificationService.notify(NotificationType.SUCCESS, response.message);
        this.dialogRef.close(true);
      }
    })
  }
}
