import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Validators, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { FileSelectEvent, UploadEvent } from 'primeng/fileupload';
import { Category } from 'src/app/model/category';
import { City } from 'src/app/model/city';
import { Platform } from 'src/app/model/platform';
import { Province } from 'src/app/model/province';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CategoryService } from 'src/app/service/category.service';
import { CityService } from 'src/app/service/city.service';
import { PlatformService } from 'src/app/service/platform.service';
import { ProvinceService } from 'src/app/service/province.service';
import { VendorService } from 'src/app/service/vendor.service';

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
  public isProfileHovered = false;
  public borderColor = '#9e9e9e'
  public isProfileError = false;

  public vendorFormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: this.matchPassword('password', 'confirmPassword')
  })

  public companyFormGroup = this.formBuilder.group({
    province: [undefined, Validators.required],
    city: [{value: undefined, disabled: true}, Validators.required],
    category: [undefined, Validators.required],
    platform: [[] as number[], Validators.required]
  })

  public profileFormGroup = this.formBuilder.group({
    profile: ['', Validators.required],
    description: ['', Validators.required],
  })

  constructor(
    private formBuilder: FormBuilder,
    private vendorService: VendorService,
    private authService: AuthenticationService,
    private provinceService: ProvinceService,
    private cityService: CityService,
    private categoryService: CategoryService,
    private platformService: PlatformService) {}

  ngOnInit(): void {
    this.getProvinces();
    this.getCities();
    this.getPlatforms();
    this.provinceListener();
    this.platformListener();
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

  private platformListener() {
    this.companyFormGroup.controls.platform.valueChanges.subscribe({
      next: value => {

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
      this.profileFormGroup.controls.profile.setValue(reader.result!.toString());
    }
  }

  public onRegister() {
    for (let key of this.usernames.keys()) {
      console.log(key)
    }
  }
}
