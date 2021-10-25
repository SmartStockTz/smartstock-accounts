import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserModel} from '../models/user.model';
import {UserService} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-credentials',
  template: `
    <div class="profile-auth-wrapper">
      <mat-card class="mat-elevation-z0 bg-transparent">
        <form *ngIf="!getUserProgress && authForm" [formGroup]="authForm"
              (ngSubmit)="changePassword()">
          <div>
            <!--            <div class="col-12 col-sm-12 col-md-6 col-xl-6 col-lg-6">-->
            <mat-form-field appearance="outline" style="width: 100%">
              <mat-label>Last Password</mat-label>
              <input matInput formControlName="lastPassword" [type]="showLastPassword?'text':'password'">
              <button (click)="toggleLastPasswordVisibility($event)" mat-icon-button matSuffix>
                <mat-icon *ngIf="showLastPassword">visibility_on</mat-icon>
                <mat-icon *ngIf="!showLastPassword">visibility_off</mat-icon>
              </button>
              <mat-error>last password required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" style="width: 100%">
              <mat-label>New Password</mat-label>
              <input matInput formControlName="password" type="text" [type]="showPassword?'text':'password'">
              <button (click)="togglePasswordVisibility($event)" mat-icon-button matSuffix>
                <mat-icon *ngIf="showPassword">visibility_on</mat-icon>
                <mat-icon *ngIf="!showPassword">visibility_off</mat-icon>
              </button>
              <mat-error>new password required, and must be at least 6 characters</mat-error>
            </mat-form-field>

            <!--            </div>-->
          </div>

          <div>
            <button [disabled]="updateUserProgress" class="" mat-flat-button color="primary">
              CHANGE
              <mat-progress-spinner *ngIf="updateUserProgress"
                                    style="display: inline-block" [diameter]="30"
                                    mode="indeterminate"
                                    color="primary"></mat-progress-spinner>
            </button>
          </div>

        </form>
        <mat-progress-spinner *ngIf="getUserProgress" mode="indeterminate" color="primary"
                              [diameter]="25"></mat-progress-spinner>
        <div *ngIf="!getUserProgress && !authForm">
          <mat-card-subtitle>
            Failure when try to fetch your personal information, try to refresh
          </mat-card-subtitle>
          <button (click)="getCurrentUser()" mat-icon-button>
            <mat-icon color="primary">
              refresh
            </mat-icon>
          </button>
        </div>
      </mat-card>
    </div>
  `,
  styleUrls: ['../styles/profile.style.scss']
})
export class CredentialsComponent implements OnInit, OnDestroy, AfterViewInit {
  authForm: FormGroup;
  currentUser: UserModel;
  getUserProgress = false;
  updateUserProgress = false;
  showLastPassword = false;
  showPassword = false;

  constructor(public readonly formBuilder: FormBuilder,
              public readonly snackBar: MatSnackBar,
              public readonly userService: UserService) {
  }

  async ngOnInit(): Promise<void> {
    await this.getCurrentUser();
  }

  async _initializeForm(user: UserModel): Promise<void> {
    this.authForm = this.formBuilder.group({
      lastPassword: [''],
      password: [''],
    });
  }

  async getCurrentUser(): Promise<void> {
    this.getUserProgress = true;
    this.userService.currentUser().then(user => {
      this.currentUser = user;
      this._initializeForm(this.currentUser);
      this.getUserProgress = false;
    }).catch(reason => {
      // console.log(reason);
      this.getUserProgress = false;
      this.snackBar.open('Error when trying to get user details', 'Ok', {
        duration: 3000
      });
    });
  }

  async changePassword(): Promise<any> {
    if (this.authForm.valid) {
      this.updateUserProgress = true;
      this.userService.changePasswordFromOld({
        lastPassword: this.authForm.value.lastPassword,
        password: this.authForm.value.password,
        user: this.currentUser as any
      }).then(async user => {
        this.updateUserProgress = false;
        this.snackBar.open('Your password changed successful', 'Ok', {
          duration: 3000
        });
        await this.userService.updateCurrentUser(user);
        await this.resetForm(true);
      }).catch(async reason => {
        // console.log(reason);
        this.updateUserProgress = false;
        this.snackBar.open('Fails to change password, try again or contact support', 'Ok', {
          duration: 3000
        });
        await this.resetForm(true);
      });
    } else {
      this.snackBar.open('Please fill all required fields', 'Ok', {
        duration: 3000
      });
    }
  }

  async resetForm(reset: boolean): Promise<void> {
    if (reset) {
      this.authForm.reset({
        lastPassword: '',
        password: ''
      });
    }
    Object.keys(this.authForm.controls).forEach(key => {
      this.authForm.get(key).markAsUntouched();
    });
  }

  async toggleLastPasswordVisibility($event): Promise<void> {
    $event.preventDefault();
    this.showLastPassword = !this.showLastPassword;
  }

  async togglePasswordVisibility($event): Promise<void> {
    $event.preventDefault();
    this.showPassword = !this.showPassword;
  }

  async ngAfterViewInit(): Promise<void> {
  }

  async ngOnDestroy(): Promise<void> {
  }
}
