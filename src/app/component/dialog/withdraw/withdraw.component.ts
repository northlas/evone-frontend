import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { BaseResponse } from 'src/app/model/base-response';
import { Wallet } from 'src/app/model/wallet';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit{
  public amountForm = new FormControl<number>(0, [Validators.required, Validators.min(10000)]);

  constructor(private userService: UserService, private dialogRef: MatDialogRef<WithdrawComponent>, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.amountListener();
  }

  private amountListener() {
    this.amountForm.valueChanges.subscribe({
      next: (value: number | null) => {
        if(value == null) {
          this.amountForm.setValue(0);
        }
      }
    })
  }

  public withdrawBalance() {
    this.userService.withdrawBalance({balance: this.amountForm.value} as Wallet).subscribe({
      next: (response: BaseResponse) => {
        this.notificationService.notify(NotificationType.SUCCESS, response.message);
        this.dialogRef.close(this.amountForm.value);
      }
    })
  }
}
