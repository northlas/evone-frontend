import { Component } from '@angular/core';
import { Validators, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { Province } from 'src/app/model/province';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { VendorService } from 'src/app/service/vendor.service';

@Component({
  selector: 'app-register-vendor',
  templateUrl: './register-vendor.component.html',
  styleUrls: ['./register-vendor.component.css']
})
export class RegisterVendorComponent {
  public userFormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: this.matchPassword('password', 'confirmPassword')
  })
  public provinces: Province[] = [
    {id: 1, name: 'Aceh'},
    {id: 2, name: 'Bali'},
    {id: 3, name: 'Banten'},
    {id: 4, name: 'Jakarta'},
    {id: 5, name: 'Kalimantan Barat'},
    {id: 6, name: 'Papua Barat'},
    {id: 7, name: 'Riau'},
    {id: 8, name: 'Sulawesi Utara'},
    {id: 9, name: 'Sumatra Selatan'},
    {id: 10, name: 'Yogyakarta'},
  ]

  constructor(private formBuilder: FormBuilder, private vendorService: VendorService, private authService: AuthenticationService) {} 

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

  public onRegister() {

  }
}
