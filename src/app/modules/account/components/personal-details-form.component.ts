import {Component, Input} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';

@Component({
  selector: 'app-personal-details-form',
  template: `
    <form [formGroup]="personalFormGroup">
      <div class="form-field">
        <p class="input-title">FirstName</p>
        <!--          <mat-icon matSuffix>face</mat-icon>-->
        <input class="inputs" type="text" formControlName="firstname">
        <p class="input-error" *ngIf="personalFormGroup.get('firstname').invalid && personalFormGroup.get('firstname').touched">
          FirstName required
        </p>
      </div>
      <div class="form-field">
        <p class="input-title">LastName</p>
        <input class="inputs" type="text" formControlName="lastname">
        <p class="input-error"
           *ngIf="personalFormGroup.get('lastname').invalid &&
           personalFormGroup.get('lastname').touched">
          LastName required
        </p>
      </div>
      <div class="form-field">
        <p class="input-title">Email</p>
        <input class="inputs" type="email" formControlName="email">
        <p class="input-error"
           *ngIf="personalFormGroup.get('email').invalid &&
           personalFormGroup.get('email').touched">
          Email required
        </p>
      </div>
      <div class="form-field">
        <p class="input-title">Mobile</p>
        <input class="inputs" type="number" formControlName="mobile" required>
        <p class="input-error"
           *ngIf="personalFormGroup.get('mobile').invalid &&
           personalFormGroup.get('mobile').touched">
          Mobile number required
        </p>
      </div>
    </form>
  `,
  styleUrls: ['../styles/register.style.scss']
})

export class PersonalDetailsFormComponent {
  @Input() personalFormGroup: UntypedFormGroup;

  constructor() {
  }

}
