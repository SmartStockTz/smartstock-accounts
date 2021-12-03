import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';

import {UserModel} from '../models/user.model';
import {ShopModel} from '../models/shop.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '@smartstocktz/core-libs';


@Component({
  selector: 'app-address',
  template: `
    <div class="profile-business-wrapper">
      <mat-card class="mat-elevation-z0">
        <form *ngIf="!getBusinessProgress && businessForm" [formGroup]="businessForm"
              (ngSubmit)="updatePersonalInformation()">
          <div class="row">
            <div class="col-12 col-sm-12 col-md-6 col-xl-6 col-lg-6">

              <mat-form-field appearance="outline" class="btn-block" matTooltip="read only field">
                <mat-label>Principal Shop</mat-label>
                <input style="color: gray" matInput [formControl]="businessFormControl" type="text" [readonly]="true">
              </mat-form-field>

              <mat-form-field appearance="outline" class="btn-block">
                <mat-label>Country</mat-label>
                <input matInput formControlName="country" type="text">
                <mat-error>country field required</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="btn-block">
                <mat-label>Region</mat-label>
                <input matInput formControlName="region" type="text">
                <mat-error>last name field required</mat-error>
              </mat-form-field>

            </div>

            <div class="col-12 col-sm-12 col-md-6 col-xl-6 col-lg-6">

              <mat-form-field appearance="outline" class="btn-block">
                <mat-label>street</mat-label>
                <textarea [rows]="3" matInput formControlName="street" type="text"></textarea>
                <mat-error>street field required</mat-error>
              </mat-form-field>

            </div>
          </div>
          <div class="row">
            <button [disabled]="updateBusinessProgress" class="ft-button" mat-flat-button color="primary">
              SAVE
              <mat-progress-spinner *ngIf="updateBusinessProgress"
                                    style="display: inline-block" [diameter]="30"
                                    mode="indeterminate"
                                    color="primary"></mat-progress-spinner>
            </button>
          </div>
        </form>

        <mat-progress-spinner *ngIf="getBusinessProgress" mode="indeterminate" color="primary" [diameter]="25">
        </mat-progress-spinner>

        <div *ngIf="!getBusinessProgress && !businessForm">
          <mat-card-subtitle>
            Failure when try to fetch your business information, try to refresh
          </mat-card-subtitle>
          <button (click)="getCurrentBusiness()" mat-icon-button>
            <mat-icon color="primary">
              refresh
            </mat-icon>
          </button>
        </div>
      </mat-card>
    </div>`,
  styleUrls: ['../styles/profile.style.scss']
})
export class AddressComponent implements OnInit, OnDestroy, AfterViewInit {

  businessForm: FormGroup;
  currentUser: UserModel;
  currentShop: ShopModel;
  getBusinessProgress = false;
  updateBusinessProgress = false;
  businessFormControl = new FormControl('', [Validators.nullValidator, Validators.required]);

  constructor(public readonly formBuilder: FormBuilder,
              public readonly matSnackBar: MatSnackBar,
              public readonly userService: UserService) {
  }

  async ngOnInit(): Promise<any> {
    await this.getCurrentBusiness();
  }

  async _initializeForm(user: UserModel): Promise<any> {
    this.businessFormControl.setValue(user.businessName);
    this.businessForm = this.formBuilder.group({
      country: [user.country, [Validators.nullValidator, Validators.required]],
      street: [user.street, [Validators.nullValidator, Validators.required]],
      region: [user.region, [Validators.nullValidator, Validators.required]],
    });
  }

  async getCurrentBusiness(): Promise<any> {
    this.getBusinessProgress = true;
    this.userService.currentUser().then((user: any) => {
      this.currentUser = user;
      this._initializeForm(this.currentUser);
      this.getBusinessProgress = false;
    }).catch(_ => {
      this.getBusinessProgress = false;
      this.matSnackBar.open('Error when trying to get shop details', 'Ok', {
        duration: 3000
      });
    });
  }

  async updatePersonalInformation(): Promise<any> {
    if (this.businessForm.valid) {
      this.updateBusinessProgress = true;
      this.userService.updateUser(this.currentUser as any, this.businessForm.value).then(async user => {
        this.updateBusinessProgress = false;
        this.matSnackBar.open('Your shop information is updated', 'Ok', {
          duration: 3000
        });
        await this.userService.updateCurrentUser(user);
        this.businessForm.reset({
          country: user.country,
          region: user.region,
          street: user.street
        });
      }).catch(reason => {
        console.log(reason);
        this.updateBusinessProgress = false;
        this.matSnackBar.open('Fails to update your shop information try again later', 'Ok', {
          duration: 3000
        });
        this.businessForm.reset({
          country: this.currentUser.country,
          region: this.currentUser.region,
          street: this.currentUser.street
        });
      });
    } else {
      this.matSnackBar.open('Please fill all required fields', 'Ok', {
        duration: 3000
      });
    }
  }

  async ngAfterViewInit(): Promise<any> {

  }

  async ngOnDestroy(): Promise<any> {

  }
}

