import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserModel} from '../models/user.model';
import {UserService} from '@smartstocktz/core-libs';

@Component({
  selector: 'smartstock-profile-authentication',
  template: `
    <div class="profile-auth-wrapper">
      <mat-card>
        <form *ngIf="!getUserProgress && authForm" [formGroup]="authForm"
              (ngSubmit)="changePassword()">
          <div>
            <!--            <div class="col-12 col-sm-12 col-md-6 col-xl-6 col-lg-6">-->
            <mat-form-field appearance="outline" style="width: 100%">
              <mat-label>Last Password</mat-label>
              <input matInput formControlName="lastPassword" [type]="showLastPassword?'text':'password'">
              <button (click)="toggleLastPasswordVisibility()" mat-icon-button matSuffix>
                <mat-icon *ngIf="showLastPassword">visibility_on</mat-icon>
                <mat-icon *ngIf="!showLastPassword">visibility_off</mat-icon>
              </button>
              <mat-error>last password required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" style="width: 100%">
              <mat-label>New Password</mat-label>
              <input matInput formControlName="password" type="text" [type]="showPassword?'text':'password'">
              <button (click)="togglePasswordVisibility()" mat-icon-button matSuffix>
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
  styleUrls: ['../style/profile.style.scss']
})
export class AuthenticationComponent implements OnInit {
  authForm: FormGroup;
  currentUser: UserModel;
  getUserProgress = false;
  updateUserProgress = false;
  showLastPassword = false;
  showPassword = false;

  constructor(private readonly formBuilder: FormBuilder,
              private readonly snackBar: MatSnackBar,
              private readonly userService: UserService) {
  }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  private _initializeForm(user: UserModel): void {
    this.authForm = this.formBuilder.group({
      lastPassword: [''],
      password: [''],
    });
  }

  getCurrentUser(): void {
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

  changePassword(): any {
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
        this.resetForm(true);
      }).catch(reason => {
        // console.log(reason);
        this.updateUserProgress = false;
        this.snackBar.open('Fails to change password, try again or contact support', 'Ok', {
          duration: 3000
        });
        this.resetForm(true);
      });
    } else {
      this.snackBar.open('Please fill all required fields', 'Ok', {
        duration: 3000
      });
    }
  }

  private resetForm(reset: boolean): void {
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

  toggleLastPasswordVisibility(): void {
    this.showLastPassword = !this.showLastPassword;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
