import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { LogService, UserService } from "smartstock-core";
import { MatDialog } from "@angular/material/dialog";
import { BillingService } from "../services/billing.service";
import { ResetPasswordComponent } from "../components/reset-password.component";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-login-page",
  template: `
    <div class="login-wrapper">
      <div class="container login-sec">
        <!--        <div class="login-title text-center">-->
        <!--          Login-->
        <!--        </div>-->
        <div
          class="col-sm-12 col-12 col-md-6 col-xl-4 col-lg-6 offset-xl-4 offset-lg-3 offset-md-3"
        >
          <mat-progress-bar
            *ngIf="showProgress"
            class="full-width rounded-top"
            mode="indeterminate"
          >
          </mat-progress-bar>
          <form
            [formGroup]="loginForm"
            #formElement="ngForm"
            (ngSubmit)="login(formElement)"
          >
            <mat-card>
              <mat-card-content>
                <mat-form-field class="full-width" appearance="outline">
                  <mat-label>Username</mat-label>
                  <input
                    matInput
                    formControlName="username"
                    type="text"
                    required
                  />
                  <mat-error>Username required</mat-error>
                </mat-form-field>
                <mat-form-field class="full-width" appearance="outline">
                  <mat-label>Password</mat-label>
                  <input
                    (keypress)="handleEnterKey($event, formElement)"
                    matInput
                    [type]="showPasswordFlag ? 'text' : 'password'"
                    formControlName="password"
                    required
                  />
                  <button
                    matSuffix
                    (click)="showPassword($event)"
                    mat-icon-button
                  >
                    <mat-icon *ngIf="showPasswordFlag">visibility_on</mat-icon>
                    <mat-icon *ngIf="!showPasswordFlag"
                      >visibility_off</mat-icon
                    >
                  </button>
                  <mat-error>Password required</mat-error>
                </mat-form-field>
              </mat-card-content>
              <mat-card-actions>
                <button
                  mat-raised-button
                  [disabled]="showProgress"
                  color="primary"
                  class="btn-block ft-button"
                >
                  Login
                </button>
              </mat-card-actions>
              <mat-card-actions>
                <button
                  routerLink="/account/register"
                  [disabled]="showProgress"
                  (click)="$event.preventDefault()"
                  mat-raised-button
                  color="primary"
                  class="btn-block ft-button"
                >
                  Open Account For Free
                </button>
              </mat-card-actions>
            </mat-card>
          </form>
        </div>
      </div>
      <footer>
        <div
          style="display: flex; flex-direction: row; padding: 8px; align-items: center;"
        >
          <a *ngIf="isBrowser" style="padding: 8px" routerLink="/">
            Go Back Home
          </a>
          <a style=" padding: 8px" href="#" (click)="reset($event)">
            Reset Password
          </a>
        </div>
        <p class="text-center" style=" margin-top: 8px">
          SmartStock Company Ltd © 2021
        </p>
      </footer>
    </div>
  `,
  styleUrls: ["../styles/login.style.scss"]
})
export class LoginPage implements OnInit, OnDestroy {
  showProgress = false;
  loginForm: FormGroup;
  showPasswordFlag = false;
  isBrowser = true;

  constructor(
    public readonly snack: MatSnackBar,
    public readonly routes: Router,
    public readonly dialog: MatDialog,
    public readonly billing: BillingService,
    public readonly log: LogService,
    private readonly activatedRoute: ActivatedRoute,
    public readonly formBuilder: FormBuilder,
    public readonly userService: UserService
  ) {
    document.title = "SmartStock - Login";
  }

  async ngOnInit(): Promise<void> {
    await this.initializeForm();
  }

  async initializeForm(): Promise<void> {
    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required, Validators.nullValidator]],
      password: ["", [Validators.required, Validators.nullValidator]]
    });
  }

  async login(formElement: FormGroupDirective): Promise<void> {
    if (!this.loginForm.valid) {
      this.snack.open("Enter all required field", "Ok", { duration: 3000 });
    } else {
      this.showProgress = true;
      const username = this.loginForm.value.username.trim();
      const password = this.loginForm.value.password.trim();
      this.userService
        .login({ username, password })
        .then((user) => {
          if (user.role === "admin") {
            this.stopProgressAndCleanForm(formElement);
            this.showMainUi("admin", formElement);
          } else {
            this.stopProgressAndCleanForm(formElement);
            this.showMainUi("cashier", formElement);
          }
        })
        .catch((reason) => {
          this.showProgress = false;
          this.snack.open(reason.message, "Ok", {
            duration: 2000
          });
        })
        .finally(() => {
          this.billing.subscription().catch((_) => {});
        });
    }
  }

  async stopProgressAndCleanForm(
    formElement: FormGroupDirective
  ): Promise<void> {
    this.showProgress = false;
    this.loginForm.reset();
    formElement.resetForm();
  }

  async showMainUi(
    role: string,
    formElement: FormGroupDirective
  ): Promise<void> {
    const queryParams = await firstValueFrom(this.activatedRoute.queryParams);
    if (queryParams && queryParams.url) {
      const url = decodeURIComponent(queryParams.url);
      this.routes
        .navigateByUrl(url)
        .catch((reason) => this.log.i(reason))
        .then(() => {
          this.loginForm.reset();
          formElement.resetForm();
        });
      return;
    }
    if (role === "admin") {
      this.routes
        .navigateByUrl("/dashboard")
        .catch((reason) => this.log.i(reason))
        .then(() => {
          this.loginForm.reset();
          formElement.resetForm();
        });
      return;
    }
    if (role === "online") {
      this.routes
        .navigateByUrl("/")
        .catch((reason) => this.log.i(reason))
        .then(() => {
          this.loginForm.reset();
          formElement.resetForm();
        });
      return;
    }
    this.routes
      .navigateByUrl("/sale")
      .catch((reason) => this.log.i(reason))
      .then(() => {
        this.loginForm.reset();
        formElement.resetForm();
      });
  }

  async reset($event: Event): Promise<void> {
    $event.preventDefault();
    $event.stopPropagation();
    if (this.loginForm.value.username) {
      this.showProgress = true;
      this.userService
        .resetPassword(this.loginForm.value.username)
        .then((value) => {
          this.showProgress = false;
          this.dialog.open(ResetPasswordComponent, {
            data: {
              message: value && value.message ? value.message : null
            },
            closeOnNavigation: true
          });
        })
        .catch((reason) => {
          this.showProgress = false;
          this.snack.open(
            reason && reason.message ? reason.message : reason.toString(),
            "Ok",
            {
              duration: 3000
            }
          );
        });
    } else {
      this.dialog.open(ResetPasswordComponent, {
        closeOnNavigation: true
      });
    }
  }

  async showPassword($event: MouseEvent): Promise<void> {
    $event.preventDefault();
    this.showPasswordFlag = !this.showPasswordFlag;
  }

  async handleEnterKey($event: KeyboardEvent, formElement): Promise<void> {
    const keyCode = $event.code;
    if (keyCode === "Enter") {
      await this.login(formElement);
    }
  }

  async ngOnDestroy(): Promise<void> {}
}
