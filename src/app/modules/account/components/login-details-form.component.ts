import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';

@Component({
  selector: 'app-login-details-form',
  template: `
    <form [formGroup]="loginFormGroup">
      <mat-form-field class="form-field" appearance="outline">
        <mat-label class="input-title">Username</mat-label>
        <input matInput type="text" autocomplete="off" formControlName="username">
        <mat-error class="input-error">Username required</mat-error>
      </mat-form-field>
      <mat-form-field class="form-field" appearance="outline">
        <mat-label>Password</mat-label>
        <input matInput [type]="showPasswordFlag?'text':'password'"
               autocomplete="off"
               formControlName="password" placeholder="Password" required>
        <mat-error>Password required, and must be at least 8 character long</mat-error>
        <button matSuffix (click)="showPassword($event)" mat-icon-button>
          <mat-icon *ngIf="showPasswordFlag">visibility_on</mat-icon>
          <mat-icon *ngIf="!showPasswordFlag">visibility_off</mat-icon>
        </button>
      </mat-form-field>
    </form>
  `,
  styleUrls: ['../styles/register.style.scss']
})
export class LoginDetailsFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() loginFormGroup: UntypedFormGroup;
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
