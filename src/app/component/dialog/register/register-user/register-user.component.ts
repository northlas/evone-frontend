import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { HeaderType } from 'src/app/enum/header-type.enum';
import { BaseResponse } from 'src/app/model/base-response';
import { Customer } from 'src/app/model/customer';
import { Talent } from 'src/app/model/talent';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CustomerService } from 'src/app/service/customer.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent {
  public talents: Talent[] = [];
  public userFormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: this.matchPassword('password', 'confirmPassword')
  })

  constructor(private formBuilder: FormBuilder, private customerService: CustomerService, private authService: AuthenticationService) {} 

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

  public getTalents() {
    
  }

  public onRegister() {
    const customer = {} as Customer;
    customer.name = this.userFormGroup.controls.name.value!;
    customer.email = this.userFormGroup.controls.email.value!;
    customer.password = this.userFormGroup.controls.password.value!;
    customer.isFreelancer = false;
    customer.roleIds = ['ROLE_CUSTOMER'];
    this.customerService.addCustomer(customer).subscribe({
      next: (response: HttpResponse<BaseResponse>) => {
        const token = response.headers.get(HeaderType.JWT_TOKEN)!;
        this.authService.saveToken(token);
        window.location.reload();
      }
    })
  }
}
