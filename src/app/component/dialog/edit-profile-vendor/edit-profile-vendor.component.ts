import { Component, ElementRef, Inject, QueryList, ViewChildren } from '@angular/core';
import { Validators, FormControl, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileSelectEvent } from 'primeng/fileupload';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Category } from 'src/app/model/category';
import { City } from 'src/app/model/city';
import { Province } from 'src/app/model/province';
import { Vendor } from 'src/app/model/vendor';
import { VendorSocialMedia } from 'src/app/model/vendor-social-media';
import { Wallet } from 'src/app/model/wallet';
import { CategoryService } from 'src/app/service/category.service';
import { CityService } from 'src/app/service/city.service';
import { NotificationService } from 'src/app/service/notification.service';
import { PlatformService } from 'src/app/service/platform.service';
import { ProvinceService } from 'src/app/service/province.service';
import { VendorService } from 'src/app/service/vendor.service';
import { RegisterMainComponent } from '../register/register-main/register-main.component';
import { Platform } from 'src/app/model/platform';
import { BaseEditVendor } from 'src/app/model/base-edit-vendor';

@Component({
  selector: 'app-edit-profile-vendor',
  templateUrl: './edit-profile-vendor.component.html',
  styleUrls: ['./edit-profile-vendor.component.css']
})
export class EditProfileVendorComponent {
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
  public uploadedImage?: string;

  public vendorFormGroup = this.formBuilder.group({
    name: [this.data.existing.name, Validators.required],
    email: [this.data.existing.email, [Validators.required, Validators.email]],
    phone: [this.data.existing.phone, [Validators.required, Validators.pattern('[0-9]+')]],
    oldPassword: new FormControl<string | null>(null),
    password: new FormControl<string | null>({value: null, disabled: true}, Validators.minLength(8)),
    confirmPassword: new FormControl<string | null>({value: null, disabled: true}, Validators.minLength(8))
  }, {
    validators: this.matchPassword('oldPassword', 'password', 'confirmPassword')
  })

  public companyFormGroup = this.formBuilder.group({
    province: new FormControl<number | null>(this.data.existing.province.id, Validators.required),
    city: new FormControl<number | null>({value: this.data.existing.city.id, disabled: true}, Validators.required),
    address: new FormControl<string | null>(this.data.existing.address, Validators.required),
    accountNo: new FormControl<string | null>(this.data.existing.wallet.accountNo, [Validators.required, Validators.pattern('[0-9]+')]),
    category: new FormControl<number[]>({value: this.data.existing.categories.map(({id}) => id), disabled: true}, Validators.required),
    platform: new FormControl<number[]>(this.data.existing.socialMedia.map(({platformId}) => platformId), Validators.required),
  })

  public profileFormGroup = this.formBuilder.group({
    image: new FormControl<File | null>(null),
    description: ['', Validators.required],
  })

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: BaseEditVendor, 
    private dialogRef: MatDialogRef<RegisterMainComponent>,
    private formBuilder: FormBuilder,
    private vendorService: VendorService,
    private notificationService: NotificationService,
    private provinceService: ProvinceService,
    private cityService: CityService,
    private categoryService: CategoryService,
    private platformService: PlatformService) {}

  ngOnInit(): void {
    this.getCategories();
    this.getProvinces();
    this.getCities();
    this.getPlatforms();
    this.provinceListener();
    this.changePasswordListener();
    this.categories = this.categoryService.categories.value;
    this.data.existing.socialMedia.forEach((value) => {
      this.usernames.set(value.platformId, value.username);
    })
  }

  private matchPassword(oldPassword: string, password: string, confirmPassword: string): ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const pre = abstractControl.get(oldPassword);
      const control = abstractControl.get(password);
      const matchingControl = abstractControl.get(confirmPassword);

      if (pre?.value == null || pre.value.length == 0) {
        return null;
      }

      if (matchingControl?.value == null || matchingControl?.value.length == 0) {
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

  private getCategories() {
    if (this.categoryService.categories.value) {
      this.categories = this.categoryService.categories.value;
    }
    else {
      this.categoryService.getAllCategory(true).subscribe({
        next: response => {
          this.categories = response;
        }
      })
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
        console.log(value)
        if (value !== null) {
          this.filteredCities = this.cities.filter(({provinceId}) => provinceId === value)
          this.companyFormGroup.controls.city.enable();
        }
      }
    })
  }

  public profileStepListener() {
    if (this.profileFormGroup.controls.image.invalid) {
      this.isProfileError = true;
      this.borderColor = '#f44336';
    }
  }

  public changePasswordListener() {
    this.vendorFormGroup.controls.oldPassword.valueChanges.subscribe({
      next: (value: string | null) => {
        if (value) {
          this.vendorFormGroup.controls.password.enable();
          this.vendorFormGroup.controls.confirmPassword.enable();
          this.vendorFormGroup.controls.password.addValidators([Validators.required, Validators.minLength(8)]);
          this.vendorFormGroup.controls.confirmPassword.addValidators(Validators.required);
        }
        else {
          this.vendorFormGroup.controls.password.disable();
          this.vendorFormGroup.controls.confirmPassword.disable();
          this.vendorFormGroup.controls.password.clearValidators();
          this.vendorFormGroup.controls.confirmPassword.clearValidators();
        }
        this.vendorFormGroup.controls.password.updateValueAndValidity();
        this.vendorFormGroup.controls.confirmPassword.updateValueAndValidity();
      }
    })
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
    return this.uploadedImage;
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
      this.uploadedImage = reader.result?.toString();
      this.profileFormGroup.controls.image.setValue(file);
    }
  }

  public onRegister() {
    if (this.vendorFormGroup.invalid || this.companyFormGroup.invalid || this.profileFormGroup.invalid) {
      return
    }

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
    vendor.oldPassword = accountForm.oldPassword.value!;
    vendor.password = accountForm.confirmPassword.value!;
    vendor.address = companyForm.address.value!;
    vendor.phone = accountForm.phone.value!;
    vendor.description = profileForm.description.value!;
    vendor.wallet = {accountNo: companyForm.accountNo.value!} as Wallet;
    vendor.city = city;
    vendor.categories = categories;
    vendor.socialMedia = socialMedia;

    this.vendorService.editVendor(vendor, profileForm.image.value).subscribe({
      next: response => {
        this.notificationService.notify(NotificationType.SUCCESS, response.message);
        this.dialogRef.close(true);
      }
    })
  }
}
