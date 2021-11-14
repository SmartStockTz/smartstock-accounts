import {Component, AfterViewInit, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ProfileState} from '../states/profile.state';

import {FormGroup} from '@angular/forms';


@Component({
  selector: 'app-business-details-form',
  template: `
    <form [formGroup]="businessFormGroup">
      <div class="form-field">
        <p class="input-title">Business Name</p>
        <input class="inputs" type="text" formControlName="businessName">
        <p class="input-error"
           *ngIf="businessFormGroup.get('businessName').invalid &&
           businessFormGroup.get('businessName').touched">
          Business name required
        </p>
      </div>
      <mat-form-field class="form-field" appearance="outline">
        <mat-label>Business Category</mat-label>
        <mat-select formControlName="category">
          <mat-option *ngFor="let category of profileState.categories | async"
                      value="{{category.value}}">
            {{category.name}}
          </mat-option>
        </mat-select>
        <mat-error>Shop category required</mat-error>
      </mat-form-field>
      <mat-form-field class="form-field" appearance="outline">
        <mat-label>Country</mat-label>
        <!--          <input matInput class="inputs" type="text" formControlName="country" required>-->
        <mat-select formControlName="country" class="" required>
          <mat-option *ngFor="let country of profileState.countries | async"
                      value="{{country.name}} - {{country.code}}">
            {{country.name}}</mat-option>
        </mat-select>
        <mat-error>Country required</mat-error>
      </mat-form-field>

      <div class="form-field">
        <p class="input-title">State / Region</p>
        <input class="inputs" type="text" formControlName="region" required>
        <p class="input-error"
           *ngIf="businessFormGroup.get('region').invalid &&
           businessFormGroup.get('region').touched">
          Region required
        </p>
      </div>
      <div class="form-field">
        <p class="input-title">Street</p>
        <textarea rows="3"  class="inputs" formControlName="street"></textarea>
        <p class="input-error"
           *ngIf="businessFormGroup.get('street').invalid &&
           businessFormGroup.get('street').touched">
          Street address required
        </p>
      </div>

    </form>`,
  styleUrls: ['../styles/register.style.scss']
})
export class BusinessDetailsFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() businessFormGroup: FormGroup;

  constructor(public readonly profileState: ProfileState) {
  }

  async ngOnInit(): Promise<any> {
    this.profileState.getCountries();
    this.profileState.getShopCategories();
  }

  async ngAfterViewInit(): Promise<any> {

  }

  async ngOnDestroy(): Promise<any> {

  }
}

