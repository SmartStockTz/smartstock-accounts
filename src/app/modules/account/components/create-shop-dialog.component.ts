import {AfterViewInit, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StorageService} from '@smartstocktz/core-libs';
import {ShopService} from '../services/shop.service';

export interface DialogData {
  customer?: string;
  name?: string;
  type: number;
}

@Component({
  selector: 'app-create-shop-dialog',
  template: `
    <div>
      <form [formGroup]="createShopForm" (ngSubmit)="createShop()" class="create-shop-form-container">
        <mat-form-field appearance="" class="full-width">
          <mat-label>Shop Name</mat-label>
          <input matInput formControlName="businessName" placeholder="Shop Name">
          <mat-error>Shop name required</mat-error>
        </mat-form-field>

        <mat-form-field class="full-width">
          <mat-label>Shop Category</mat-label>
          <mat-select formControlName="category" class="" required="">
            <mat-option value="artists_photographers_creative">Artists, Photographers &amp; Creative Types</mat-option>
            <mat-option value="consultants_professionals">Consultants &amp; Professionals</mat-option>
            <mat-option value="finance_insurance">Financial Services</mat-option>
            <mat-option value="product_provider">General: I make or sell a PRODUCT</mat-option>
            <mat-option value="service_provider">General: I provide a SERVICE</mat-option>
            <mat-option value="hair_spa_aesthetics">Hair, Spa &amp; Aesthetics</mat-option>
            <mat-option value="medical_dental_health_service">Medical, Dental, Health</mat-option>
            <mat-option value="nonprofit_associations_groups">Non-profits, Associations &amp; Groups</mat-option>
            <mat-option value="realestate_home">Real Estate, Construction &amp; Home Improvement</mat-option>
            <mat-option value="retailers_and_resellers">Retailers, Resellers &amp; Sales</mat-option>
            <mat-option value="web_media_freelancer">Web, Tech &amp; Media</mat-option>
          </mat-select>
          <mat-error>Choose category</mat-error>
        </mat-form-field>

        <mat-form-field appearance="" class="full-width">
          <mat-label>Country</mat-label>
          <input matInput formControlName="country" placeholder="Country">
          <mat-error>Country required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="" class="full-width">
          <mat-label>Region</mat-label>
          <input matInput formControlName="region" placeholder="Region">
          <mat-error>Region required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="" class="full-width">
          <mat-label>Street</mat-label>
          <input matInput formControlName="street" placeholder="Street/ Location">
          <mat-error>Street required</mat-error>
        </mat-form-field>

        <div class="">
          <button [disabled]="createShopProgress" class="ft-button btn-block" color="primary" mat-raised-button>
            Create Shop
            <mat-progress-spinner style="display: inline-block" *ngIf="createShopProgress" mode="indeterminate"
                                  color="primary" [diameter]="20"></mat-progress-spinner>
          </button>
        </div>
      </form>
    </div>

    <div style="margin-top: 6px">
      <button class="btn-block" mat-button color="primary" (click)="closeDialog($event)">
        Close
      </button>
    </div>
  `,
  styleUrls: ['../styles/create-shop-dialog.style.scss', '../styles/login.style.scss'],
  providers: [
    ShopService
  ]
})
export class CreateShopDialogComponent implements OnInit, OnDestroy, AfterViewInit {

  createShopForm: FormGroup;
  createShopProgress = false;

  constructor(public dialogRef: MatDialogRef<CreateShopDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              public readonly snack: MatSnackBar,
              public readonly storageService: StorageService,
              public readonly shopService: ShopService,
              public readonly formBuilder: FormBuilder) {
  }

  async createShop(): Promise<void> {
    if (this.createShopForm.valid) {
      this.createShopProgress = true;
      this.shopService.createShop(this.createShopForm.value).then(async (value: any) => {
        try {
          const user = await this.storageService.getActiveUser();
          user.shops.push(value as any);
          await this.storageService.saveActiveUser(user);
          this.dialogRef.close(value);
          this.snack.open('Shop created successful', 'Ok', {
            duration: 3000
          });
          this.createShopProgress = false;
        } catch (e) {

        }
      }).catch(reason => {
        // console.log(reason);
        this.snack.open(reason.message, 'Ok', {duration: 3000});
        this.createShopProgress = false;
      });
    } else {
      this.snack.open('Please fill all required fields', 'Ok', {
        duration: 3000
      });
    }
  }

  async ngOnInit(): Promise<void> {
    this.createShopForm = this.formBuilder.group({
      businessName: ['', [Validators.nullValidator, Validators.required]],
      country: ['', [Validators.nullValidator, Validators.required]],
      category: ['product_provider', [Validators.nullValidator, Validators.required]],
      region: ['', [Validators.nullValidator, Validators.required]],
      street: ['', [Validators.nullValidator, Validators.required]],
    });
  }

  async closeDialog($event: Event): Promise<void> {
    $event.preventDefault();
    this.dialogRef.close(null);
  }

  async ngAfterViewInit(): Promise<void> {
  }

  async ngOnDestroy(): Promise<void> {
  }
}
