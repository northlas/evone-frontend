import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FileRemoveEvent,
  FileSelectEvent,
  FileUpload,
} from 'primeng/fileupload';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Talent } from 'src/app/model/talent';
import { Occasion } from 'src/app/model/occasion';
import { JobOffer } from 'src/app/model/job-offer';
import { TalentService } from 'src/app/service/talent.service';
import { NotificationService } from 'src/app/service/notification.service';
import { OccasionService } from 'src/app/service/occasion.service';
import { S3Service } from 'src/app/service/s3.service';
import { JobService } from 'src/app/service/job.service';


@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.css']
})
export class AddJobComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  private min = 0;
  private max = 999_999_999;

  public today = new Date();

  public totalDays = 0;
  public talents: Talent[] = [];
  public occasions: Occasion[] = [];
  public pictures: File[] = [];
  public isActive = true;
  public isFetchingImage = true;
  public form = this.formBuilder.group({
    title: new FormControl<string | null>(null, [Validators.required]),
    price: new FormControl<number | null>(null, [Validators.required]),
    talent: new FormControl<number | null>(null, [Validators.required]),
    occasion: new FormControl<number | null>(null, [Validators.required]),
    description: new FormControl<string | null>(null, [Validators.required]),
    startDt: new FormControl<Date | null>(null, [Validators.required]),
    endDt: new FormControl<Date | null>(null, [Validators.required])
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public existing: JobOffer,
    private talentService: TalentService,
    private occasionService: OccasionService,
    private jobService: JobService,
    private s3Service: S3Service,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<AddJobComponent>
  ) {}

  get priceForm() {
    return this.form.controls.price;
  }

  ngOnInit(): void {
    this.getCategories();
    this.getOccasions();
    this.priceListener();
    if (this.existing) {
      this.assignExistingData();
      }
  }

  private assignExistingData() {
    this.form.controls.title.setValue(this.existing.title);
    this.form.controls.price.setValue(this.existing.price);
    this.form.controls.talent.setValue(this.existing.talentId);
    this.form.controls.occasion.setValue(this.existing.occasionId);
    this.form.controls.description.setValue(this.existing.description);
    this.existing.pictures.forEach(value => {
      this.s3Service.getImage('job offer/' + value.id).then(response => {
        response.Body?.transformToByteArray().then(bytea => {
          this.pictures.push(new File([bytea], value.id, {type: 'image/jpeg'}));
          this.isFetchingImage = this.pictures.length !== this.existing.pictures.length;
        })
      })
    })
  }

  private getCategories() {
    this.talentService.getAllTalent(true).subscribe({
      next: (response: Talent[]) => {
        this.talents = response;
      },
    });
  }

  private getOccasions() {
    this.occasionService.getAllOccasion().subscribe({
      next: (response: Occasion[]) => {
        this.occasions = response;
      },
    });
  }

  private priceListener() {
    this.priceForm.valueChanges.subscribe({
      next: (value: number | null) => {
        if (value == null) {
          this.priceForm.setValue(0);
        }
      },
    });
  }

  public checkPrice() {
    if (this.priceForm.value! < this.min || this.priceForm.value == null) {
      this.priceForm.setValue(this.min);
    } else if (this.priceForm.value >= this.max) {
      this.priceForm.setValue(this.max);
    }
  }

  public onAddPicture(event: FileSelectEvent) {
    for (let file of event.files) {
      this.pictures.push(file);
    }
  }

  public onRemovePicture(event: FileRemoveEvent) {
    this.pictures.forEach((value, index) => {
      if (value.name == event.file.name) {
        this.pictures.splice(index, 1);
        return;
      }
    });
  }

  public onSubmit() {
    const model = {} as JobOffer;
    model.talentId = this.form.controls.talent.value!;
    model.title = this.form.controls.title.value!;
    model.description = this.form.controls.description.value!;
    model.price = this.form.controls.price.value!;
    model.occasionId = this.form.controls.occasion.value!;


    if (this.existing) {
      model.slugTitle = this.existing.slugTitle;
      this.jobService.editJobOffer(model, this.pictures).subscribe({
        next: () => {
          this.notificationService.notify(
            NotificationType.SUCCESS,
            'Berhasil memperbarui produk jasa'
          );
          this.dialogRef.close();
          window.location.reload()
        },
      });
    }
    else {
      this.jobService.addJobOffer(model, this.pictures).subscribe({
        next: () => {
          this.notificationService.notify(
            NotificationType.SUCCESS,
            'Berhasil menambahkan produk jasa baru'
          );
          this.dialogRef.close();
          window.location.reload();
        },
      });
    }

  }

  public checkEndDate() {
    if (this.form.controls.endDt.value == null) {
      this.form.controls.endDt.setValue(this.form.controls.startDt.value)
    }
  }

}
