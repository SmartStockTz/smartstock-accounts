import {auth, init} from 'bfast';
import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {StorageService, UserService} from '@smartstocktz/core-libs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';


@Component({
  selector: 'app-login',
  template: `
    <div style="height: 100vh; display: flex; justify-content: center; align-items: center; flex-direction: column">
      <mat-card>
        <mat-card-content>
          <form [formGroup]="loginForm" (submit)="login()" style="display: flex; flex-direction: column">
            <mat-form-field style="width: 300px">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username">
              <mat-error>Field required</mat-error>
            </mat-form-field>
            <mat-form-field style="width: 300px">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password">
              <mat-error>Field required</mat-error>
            </mat-form-field>
            <button *ngIf="!isLogin" mat-flat-button color="primary">Login</button>
            <mat-progress-spinner color="primary" mode="indeterminate" diameter="30" *ngIf="isLogin"></mat-progress-spinner>
          </form>
        </mat-card-content>
      </mat-card>
    </div>`,
  styleUrls: []
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {

  loginForm: FormGroup;
  isLogin = false;

  constructor(public readonly formBuilder: FormBuilder,
              public readonly router: Router,
              public readonly storageService: StorageService,
              public readonly userService: UserService,
              public readonly snack: MatSnackBar) {
  }

  async login(): Promise<any> {
    if (!this.loginForm.valid) {
      this.snack.open('Please fill all required fields', 'Ok', {duration: 3000});
    } else {
      this.isLogin = true;
      auth().logIn(this.loginForm.value.username, this.loginForm.value.password)
        .then(async user => {
          this.router.navigateByUrl('/account').catch(console.log);
          init({
            applicationId: user.applicationId,
            projectId: user.projectId,
            databaseURL: `${environment.localBaseUrl}/shop/${user.projectId}/${user.applicationId}`,
            functionsURL: `${environment.localBaseUrl}`,
            adapters: {
              http: 'DEFAULT',
              cache: 'DEFAULT',
              auth: 'DEFAULT',
            }
          }, user.projectId);
          await this.storageService.saveCurrentProjectId('0UTYLQKeifrk');
          await this.userService.saveCurrentShop(user as any);
        })
        .catch(reason => {
          this.snack.open(reason && reason.message ? reason.message : reason, 'Ok');
        }).finally(() => {
        this.isLogin = false;
      });
    }
  }

  async ngOnInit(): Promise<any> {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.nullValidator, Validators.required]],
      password: ['', [Validators.nullValidator, Validators.required]],
    });
  }

  async ngAfterViewInit(): Promise<any> {

  }

  async ngOnDestroy(): Promise<any> {

  }
}

