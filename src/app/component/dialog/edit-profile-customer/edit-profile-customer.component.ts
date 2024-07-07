import { HttpResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { Validators, FormControl, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileSelectEvent } from 'primeng/fileupload';
import { HeaderType } from 'src/app/enum/header-type.enum';
import { Role } from 'src/app/enum/role.enum';
import { BaseEditCustomer } from 'src/app/model/base-edit-customer';
import { BaseResponse } from 'src/app/model/base-response';
import { Customer } from 'src/app/model/customer';
import { Talent } from 'src/app/model/talent';
import { Wallet } from 'src/app/model/wallet';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CustomerService } from 'src/app/service/customer.service';
import { NotificationService } from 'src/app/service/notification.service';
import { TalentService } from 'src/app/service/talent.service';

@Component({
  selector: 'app-edit-profile-customer',
  templateUrl: './edit-profile-customer.component.html',
  styleUrls: ['./edit-profile-customer.component.css']
})
export class EditProfileCustomerComponent {
  public talents: Talent[] = [];
  public profileImage?: File;
  public isFreelancer!: boolean;
  public isProfileHovered = false;
  public borderColor = '#9e9e9e'
  public isProfileError = false;
  public uploadedImage?: string;
  public userFormGroup = this.formBuilder.group({
    name: new FormControl<string>(this.data.existing.name, Validators.required),
    email: new FormControl<string>(this.data.existing.email, [Validators.required, Validators.email]),
    oldPassword: new FormControl<string | null>(null),
    password: new FormControl<string | null>({value: null, disabled: true}, Validators.minLength(8)),
    confirmPassword: new FormControl<string | null>({value: null, disabled: true}, Validators.minLength(8))
  }, {
    validators: this.matchPassword('oldPassword', 'password', 'confirmPassword')
  })
  public freelancerFormGroup = this.formBuilder.group({
    gender: new FormControl<number | null>(this.data.existing.gender, Validators.required),
    phone: new FormControl<string | null>(this.data.existing.phone, [Validators.required, Validators.pattern('[0-9]+')]),
    accountNo: new FormControl<string | null>(this.data.existing.wallet?.accountNo, [Validators.required, Validators.pattern('[0-9]+')]),
    talents: new FormControl<number[] | null>(this.data.existing.talents.map(({id}) => id), Validators.required),
    image: new FormControl<File | null>(null),
    description: new FormControl<string | null>(this.data.existing.description, Validators.required),
  })

  constructor(@Inject(MAT_DIALOG_DATA) public data: BaseEditCustomer, private formBuilder: FormBuilder, private customerService: CustomerService, private talentService: TalentService, private authService: AuthenticationService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    if (!this.data.profile) {
      this.freelancerFormGroup.controls.image.addValidators(Validators.required);
    }
    this.getTalents();
    this.changePasswordListener();
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

  public getTalents() {
    this.talentService.getAllTalent(true).subscribe({
      next: (response: Talent[]) => {
        this.talents = response;
      }
    })
  }

  public changePasswordListener() {
    this.userFormGroup.controls.oldPassword.valueChanges.subscribe({
      next: (value: string | null) => {
        if (value) {
          this.userFormGroup.controls.password.enable();
          this.userFormGroup.controls.confirmPassword.enable();
          this.userFormGroup.controls.password.addValidators([Validators.required, Validators.minLength(8)]);
          this.userFormGroup.controls.confirmPassword.addValidators(Validators.required);
        }
        else {
          this.userFormGroup.controls.password.disable();
          this.userFormGroup.controls.confirmPassword.disable();
          this.userFormGroup.controls.password.clearValidators();
          this.userFormGroup.controls.confirmPassword.clearValidators();
        }
        this.userFormGroup.controls.password.updateValueAndValidity();
        this.userFormGroup.controls.confirmPassword.updateValueAndValidity();
      }
    })
  }

  public isProfileSelected() {
    return this.uploadedImage || this.data.profile;
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
    customer.oldPassword = this.userFormGroup.controls.oldPassword.value!;
    customer.password = this.userFormGroup.controls.password.value!;
    customer.isFreelancer = false;

    let image: File | null = null;
    if (this.freelancerFormGroup.valid) {
      customer.isFreelancer = true;
      customer.gender = this.freelancerFormGroup.controls.gender.value!;
      customer.phone = this.freelancerFormGroup.controls.phone.value!;
      customer.talents = this.freelancerFormGroup.controls.talents.value!.map((value) => ({id: value}) as Talent)
      customer.description = this.freelancerFormGroup.controls.description.value!;
      customer.wallet = {accountNo: this.freelancerFormGroup.controls.accountNo.value!} as Wallet;
      image = this.freelancerFormGroup.controls.image.value;
    }

    this.customerService.editCustomer(customer, image).subscribe({
      next: (response: HttpResponse<BaseResponse>) => {
        const token = response.headers.get(HeaderType.JWT_TOKEN)!;
        this.authService.saveToken(token);
        window.location.reload();
      }
    })
  }
}
