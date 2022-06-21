import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { RegisterDialogComponent } from "../components/register-dialog.component";
import { LogService, MessageService, UserService } from "smartstock-core";
import { firstValueFrom } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-register-page",
  template: `
    <app-layout-sidenav
      heading="Register"
      backLink="/"
      [hasBackRoute]="true"
      [showSearch]="false"
      [showBottomBar]="false"
      [body]="body"
    >
      <ng-template #body>
        <div class="main-container">
          <app-personal-details-form
            class="main-container-element "
            [personalFormGroup]="personalFormGroup"
          >
          </app-personal-details-form>
          <div class="main-container-element" style="margin-top: 5px">
            <mat-form-field class="form-field" appearance="outline">
              <mat-label>Do you have business?</mat-label>
              <mat-select [formControl]="roleControl">
                <mat-option value="online">NO</mat-option>
                <mat-option value="admin">YES</mat-option>
              </mat-select>
              <mat-hint>Choose "YES" if you open account for business</mat-hint>
            </mat-form-field>
          </div>
          <app-business-details-form
            class="main-container-element"
            *ngIf="roleControl.value === 'admin'"
            [businessFormGroup]="businessFormGroup"
          >
          </app-business-details-form>
          <app-login-details-form
            class="main-container-element"
            [loginFormGroup]="loginFormGroup"
          >
          </app-login-details-form>
          <button
            [disabled]="registerProgress"
            color="primary"
            mat-flat-button
            (click)="openAccount()"
            class="form-field"
          >
            CREATE ACCOUNT
            <mat-progress-spinner
              style="display: inline-block"
              *ngIf="registerProgress"
              [diameter]="25"
              mode="indeterminate"
              color="primary"
            >
            </mat-progress-spinner>
          </button>
          <div style="margin-top: 20px">
            <a routerLink="/account/login">Go To Login</a>
          </div>
        </div>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ["../styles/register.style.scss"]
})
export class RegisterPage implements OnInit, OnDestroy {
  personalFormGroup: FormGroup;
  businessFormGroup: FormGroup;
  loginFormGroup: FormGroup;
  registerProgress = false;
  roleControl = new FormControl("online");

  constructor(
    public readonly formBuilder: FormBuilder,
    public readonly router: Router,
    public readonly matDialog: MatDialog,
    public readonly logService: LogService,
    private readonly httpClient: HttpClient,
    public readonly userService: UserService,
    private readonly snack: MatSnackBar,
    public readonly messageService: MessageService
  ) {
    document.title = "SmartStock - Register";
  }

  async ngOnInit(): Promise<void> {
    await this.initializeForm();
  }

  async initializeForm(): Promise<void> {
    this.personalFormGroup = this.formBuilder.group({
      firstname: ["", [Validators.required, Validators.nullValidator]],
      lastname: ["", [Validators.required, Validators.nullValidator]],
      email: [
        "",
        [Validators.required, Validators.nullValidator, Validators.email]
      ],
      mobile: ["", [Validators.required, Validators.nullValidator]]
    });
    this.businessFormGroup = this.formBuilder.group({
      businessName: ["", [Validators.required, Validators.nullValidator]],
      category: ["", [Validators.required, Validators.nullValidator]],
      country: ["", [Validators.required, Validators.nullValidator]],
      region: ["", [Validators.required, Validators.nullValidator]],
      street: ["", [Validators.required, Validators.nullValidator]]
    });
    this.loginFormGroup = this.formBuilder.group({
      username: ["", [Validators.required, Validators.nullValidator]],
      password: [
        "",
        [Validators.required, Validators.nullValidator, Validators.minLength(8)]
      ]
    });
    this.personalFormGroup.get("email").valueChanges.subscribe((value) => {
      if (value) {
        this.loginFormGroup.get("username").setValue(value);
      }
    });
  }

  async openAccount(): Promise<void> {
    this.personalFormGroup.markAllAsTouched();
    this.businessFormGroup.markAllAsTouched();
    this.loginFormGroup.markAllAsTouched();
    const valid =
      (this.roleControl.value === "online" || this.businessFormGroup.valid) &&
      this.personalFormGroup.valid &&
      this.loginFormGroup.valid;
    if (valid) {
      const user: any = {};
      Object.assign(user, this.personalFormGroup.value);
      if (this.roleControl.value === "admin") {
        Object.assign(user, this.businessFormGroup.value);
      }
      Object.assign(user, this.loginFormGroup.value);
      user.role = this.roleControl.value;
      delete user.confPassword;
      user.mobile = user.mobile.toString();
      this.registerProgress = true;
      this.userService
        .register(user)
        .then((value) => {
          this.registerProgress = false;
          if (user.role === "admin") {
            const d = this.matDialog.open(RegisterDialogComponent, {
              closeOnNavigation: true,
              disableClose: true,
              maxWidth: "500px",
              data: {
                message: `Account verification email sent to this email: ${user.email}.
               Verify your account to be able to login`
              }
            });
            firstValueFrom(d.afterClosed()).then((_) => {
              this.router
                .navigateByUrl("/account/login")
                .catch((reason) => console.log(reason));
            });
          }
          if (user.role === "online") {
            this.userService
              .updateCurrentUser(value)
              .then((_1) => {
                this.router
                  .navigateByUrl("/")
                  .catch((reason) => console.log(reason));
              })
              .catch((reason) => {
                this.snack.open(
                  reason && reason.message ? reason.message : reason.toString(),
                  "Ok",
                  {
                    duration: 3000
                  }
                );
              });
          }
        })
        .catch((reason) => {
          reason = reason.error;
          console.log(reason);
          this.registerProgress = false;
          this.matDialog.open(RegisterDialogComponent, {
            closeOnNavigation: true,
            disableClose: true,
            data: {
              message:
                reason && reason.message
                  ? reason.message
                  : "Your request was not successful, try again"
            }
          });
        });
    } else {
      this.messageService.showMobileInfoMessage(
        "Enter all required information"
      );
    }
  }

  async ngOnDestroy(): Promise<void> {}
}
