import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { FileSelectEvent } from 'primeng/fileupload';
import { HeaderType } from 'src/app/enum/header-type.enum';
import { BaseResponse } from 'src/app/model/base-response';
import { Customer } from 'src/app/model/customer';
import { Talent } from 'src/app/model/talent';
import { Wallet } from 'src/app/model/wallet';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CustomerService } from 'src/app/service/customer.service';
import { NotificationService } from 'src/app/service/notification.service';
import { TalentService } from 'src/app/service/talent.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit{
  public talents: Talent[] = [];
  public profileImage?: File;
  public isProfileHovered = false;
  public borderColor = '#9e9e9e'
  public isProfileError = false;
  public uploadedImage?: string;
  public userFormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: this.matchPassword('password', 'confirmPassword')
  })
  public freelancerFormGroup = this.formBuilder.group({
    gender: new FormControl<number | null>(null, Validators.required),
    phone: new FormControl<string | null>(null, [Validators.required, Validators.pattern('[0-9]+')]),
    accountNo: new FormControl<string | null>(null, [Validators.required, Validators.pattern('[0-9]+')]),
    talents: new FormControl<number[] | null>(null, Validators.required),
    image: new FormControl<File | null>(null, Validators.required),
    description: new FormControl<string | null>(null, Validators.required),
  })

  constructor(private formBuilder: FormBuilder, private customerService: CustomerService, private talentService: TalentService, private authService: AuthenticationService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.getTalents();
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

  public getTalents() {
    this.talentService.getAllTalent(true).subscribe({
      next: (response: Talent[]) => {
        this.talents = response;
      }
    })
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

  public profileStepListener() {
    if (this.freelancerFormGroup.controls.image.invalid) {
      this.isProfileError = true;
      this.borderColor = '#f44336';
    }
  }

  public onSelect(event: FileSelectEvent) {
    const file = event.currentFiles.pop()!;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.isProfileError = false;
      this.uploadedImage = reader.result?.toString();
      this.freelancerFormGroup.controls.image.setValue(file);
    }
  }

  public onRegister() {
    const customer = {} as Customer;
    customer.name = this.userFormGroup.controls.name.value!;
    customer.email = this.userFormGroup.controls.email.value!;
    customer.password = this.userFormGroup.controls.password.value!;
    customer.isFreelancer = false;

    if (this.freelancerFormGroup.valid) {
      customer.isFreelancer = true;
      customer.gender = this.freelancerFormGroup.controls.gender.value!;
      customer.phone = this.freelancerFormGroup.controls.phone.value!;
      customer.talents = this.freelancerFormGroup.controls.talents.value!.map((value) => ({id: value}) as Talent)
      customer.description = this.freelancerFormGroup.controls.description.value!;
      customer.wallet = {accountNo: this.freelancerFormGroup.controls.accountNo.value!} as Wallet;
    }

    this.customerService.addCustomer(customer, this.freelancerFormGroup.controls.image.value).subscribe({
      next: (response: HttpResponse<BaseResponse>) => {
        const token = response.headers.get(HeaderType.JWT_TOKEN)!;
        this.authService.saveToken(token);
        window.location.reload();
      }
    })
  }
}
