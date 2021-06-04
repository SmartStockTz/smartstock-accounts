import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-personal-details-form',
  template: `
    <form [formGroup]="personalFormGroup">
      <div class="stepper-inputs">
        <mat-form-field appearance="fill">
          <mat-label>FirstName</mat-label>
          <mat-icon matSuffix>face</mat-icon>
          <input matInput class="inputs" type="text" formControlName="firstname" required>
          <mat-error>FirstName required</mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>LastName</mat-label>
          <mat-icon matSuffix>face</mat-icon>
          <input matInput class="inputs" type="text" formControlName="lastname" required>
          <mat-error>LastName required</mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Email</mat-label>
          <mat-icon matSuffix>email</mat-icon>
          <input matInput class="inputs" type="email" formControlName="email" required>
          <mat-error>Email required</mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Mobile number</mat-label>
          <span matPrefix>+</span>
          <mat-icon matSuffix>phone</mat-icon>
          <input matInput class="inputs" type="number" formControlName="mobile" required>
          <mat-error>Mobile number required</mat-error>
        </mat-form-field>

      </div>
      <div>
        <button mat-button class="stepper-btn" matStepperNext>Next</button>
      </div>
    </form>
  `,
  styleUrls: ['../styles/register.style.scss']
})

export class PersonalDetailsFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() personalFormGroup: FormGroup;

  constructor() {
  }

  async ngOnInit(): Promise<void> {
  }

  async ngAfterViewInit(): Promise<void> {
  }

  async ngOnDestroy(): Promise<void> {
  }


}