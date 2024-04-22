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
import { Category } from 'src/app/model/category';
import { Occasion } from 'src/app/model/occasion';
import { ServiceOffer } from 'src/app/model/service-offer';
import { CategoryService } from 'src/app/service/category.service';
import { NotificationService } from 'src/app/service/notification.service';
import { OccasionService } from 'src/app/service/occasion.service';
import { S3Service } from 'src/app/service/s3.service';
import { ServiceOfferService } from 'src/app/service/service-offer.service';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css'],
})
export class AddServiceComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  private min = 0;
  private max = 999_999_999;
  public categories: Category[] = [];
  public occasions: Occasion[] = [];
  public pictures: File[] = [];
  public isActive = true;
  public isFetchingImage = true;
  public form = this.formBuilder.group({
    title: new FormControl<string | null>(null, [Validators.required]),
    price: new FormControl<number | null>(null, [Validators.required]),
    category: new FormControl<number | null>(null, [Validators.required]),
    occasions: new FormControl<number[] | null>(null, [Validators.required]),
    description: new FormControl<string | null>(null, [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public existing: ServiceOffer,
    private categoryService: CategoryService,
    private occasionService: OccasionService,
    private serviceOfferService: ServiceOfferService,
    private s3Service: S3Service,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<AddServiceComponent>
  ) {}

  get priceForm() {
    return this.form.controls.price;
  }

  ngOnInit(): void {
    this.getCategories();
    this.getOccasions();
    this.priceListener();
    if (this.existing) this.assignExistingData();
  }

  private assignExistingData() {
    this.form.controls.title.setValue(this.existing.title);
    this.form.controls.price.setValue(this.existing.price);
    this.form.controls.category.setValue(this.existing.categoryId);
    this.form.controls.occasions.setValue(
      this.existing.occasions.map(({ id }) => id)
    );
    this.form.controls.description.setValue(this.existing.description);
    this.existing.pictures.forEach(value => {
      this.s3Service.getImage('service offer/' + value.id).then(response => {
        response.Body?.transformToByteArray().then(bytea => {
          this.pictures.push(new File([bytea], value.id, {type: 'image/jpeg'}));
          this.isFetchingImage = this.pictures.length !== this.existing.pictures.length;
        })
      })
    })
  }

  private getCategories() {
    this.categoryService.getAllCategory(true).subscribe({
      next: (response: Category[]) => {
        this.categories = response;
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
    const model = {} as ServiceOffer;
    model.categoryId = this.form.controls.category.value!;
    model.title = this.form.controls.title.value!;
    model.description = this.form.controls.description.value!;
    model.price = this.form.controls.price.value!;
    model.occasions = this.occasions.filter(({ id }) =>
      this.form.controls.occasions.value?.includes(id)
    );

    if (this.existing) {
      model.slugTitle = this.existing.slugTitle;
      this.serviceOfferService.editServiceOffer(model, this.pictures).subscribe({
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
      this.serviceOfferService.addServiceOffer(model, this.pictures).subscribe({
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
}
