import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
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
  public provinces: Province[] = [];
  public cities: City[] = [];
  public filteredCities: City[] = [];
  public categories: Category[] = [];
  public platforms: Platform[] = [];

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
    description: ['', Validators.required],
    platform: [undefined]
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
        }
      }
    })
  }

  private platformListener() {
    this.companyFormGroup.controls.platform.valueChanges.subscribe({
      next: value => {
        console.log(value);
      }
    })
  }

  public onRegister() {

  }
}
