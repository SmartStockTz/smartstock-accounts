import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-login-details-form',
  template: `
    <form [formGroup]="loginFormGroup">
      <div class="stepper-inputs">
        <mat-form-field appearance="fill">
          <mat-label>Username</mat-label>
          <mat-icon matSuffix>face</mat-icon>
          <input matInput class="inputs" type="text"
                 formControlName="username" required>
          <mat-error>Username required, and must be a valid email</mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Password</mat-label>
          <input matInput class="inputs" [type]="showPasswordFlag?'text':'password'"
                 formControlName="password" placeholder="Password" required>
          <mat-error>Password required, and must be at least 8 character long</mat-error>
          <button matSuffix (click)="showPassword($event)" mat-icon-button>
            <mat-icon *ngIf="showPasswordFlag">visibility_on</mat-icon>
            <mat-icon *ngIf="!showPasswordFlag">visibility_off</mat-icon>
          </button>
        </mat-form-field>

      </div>
    </form>
  `,
  styleUrls: ['../styles/register.style.scss']
})
export class LoginDetailsFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() loginFormGroup: FormGroup;
  showPasswordFlag = false;

  constructor() {
  }

  async ngOnInit(): Promise<void> {
  }

  async showPassword($event: MouseEvent): Promise<void> {
    $event.preventDefault();
    this.showPasswordFlag = !this.showPasswordFlag;
  }

  async ngAfterViewInit(): Promise<void> {
  }

  async ngOnDestroy(): Promise<void> {
  }
}
