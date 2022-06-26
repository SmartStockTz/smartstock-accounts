import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserModel } from "../models/user.model";
import { UserService } from "smartstock-core";

@Component({
  selector: "app-personal",
  template: `
    <div class="my-profile-wrapper bg-transparent">
      <div class="profile-personal-wrapper">
        <form
          *ngIf="!getUserProgress && personalForm"
          [formGroup]="personalForm"
          (ngSubmit)="updatePersonalInformation()"
        >
          <div>
            <mat-form-field class="btn-block" matTooltip="read only field">
              <mat-label>Username</mat-label>
              <input
                class="input"
                matInput
                [formControl]="usernameFormControl"
                type="text"
                [readonly]="true"
              />
            </mat-form-field>

            <mat-form-field class="btn-block">
              <mat-label>First Name</mat-label>
              <input matInput formControlName="firstname" type="text" />
              <mat-error>first name field required</mat-error>
            </mat-form-field>

            <mat-form-field class="btn-block">
              <mat-label>Last Name</mat-label>
              <input matInput formControlName="lastname" type="text" />
              <mat-error>last name field required</mat-error>
            </mat-form-field>

            <mat-form-field class="btn-block">
              <mat-label>Mobile</mat-label>
              <input matInput formControlName="mobile" type="number" />
              <mat-error>mobile field required</mat-error>
            </mat-form-field>

            <mat-form-field class="btn-block">
              <mat-label>Email</mat-label>
              <input
                class="input"
                [readonly]="true"
                matInput
                formControlName="email"
                type="email"
              />
              <mat-error>email field required</mat-error>
            </mat-form-field>

            <mat-form-field class="btn-block">
              <mat-label>Other emails</mat-label>
              <input
                placeholder="comma separated emails"
                matInput
                formControlName="emails"
                type="email"
              />
              <mat-hint>comma separated emails</mat-hint>
            </mat-form-field>
          </div>
          <button
            class="save-button"
            [disabled]="updateUserProgress"
            mat-flat-button
            color="primary"
          >
            SAVE DETAILS
            <mat-progress-spinner
              *ngIf="updateUserProgress"
              style="display: inline-block"
              [diameter]="30"
              mode="indeterminate"
              color="primary"
            >
            </mat-progress-spinner>
          </button>
        </form>
        <mat-progress-spinner
          *ngIf="getUserProgress"
          mode="indeterminate"
          color="primary"
          [diameter]="25"
        >
        </mat-progress-spinner>
        <div *ngIf="!getUserProgress && !personalForm">
          <mat-card-subtitle>
            Failure when try to fetch your personal information, try to refresh
          </mat-card-subtitle>
          <button (click)="getCurrentUser()" mat-icon-button>
            <mat-icon color="primary">
              refresh
            </mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["../styles/profile.style.scss"]
})
export class PersonalComponent implements OnInit {
  personalForm: UntypedFormGroup;
  currentUser: UserModel;
  getUserProgress = false;
  updateUserProgress = false;
  usernameFormControl = new UntypedFormControl("", [
    Validators.nullValidator,
    Validators.required
  ]);

  constructor(
    public readonly formBuilder: UntypedFormBuilder,
    public readonly snackBar: MatSnackBar,
    public readonly userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    this.getCurrentUser();
  }

  initializeForm(user: UserModel): void {
    this.usernameFormControl.setValue(user.username);
    this.personalForm = this.formBuilder.group({
      firstname: [
        user.firstname,
        [Validators.nullValidator, Validators.required]
      ],
      lastname: [
        user.lastname,
        [Validators.nullValidator, Validators.required]
      ],
      email: [user.email, [Validators.nullValidator, Validators.required]],
      emails: [user.emails, []],
      mobile: [user.mobile, [Validators.nullValidator, Validators.required]]
    });
  }

  getCurrentUser(): void {
    this.getUserProgress = true;
    this.userService
      .currentUser()
      .then((user) => {
        this.currentUser = user;
        this.initializeForm(this.currentUser);
        this.getUserProgress = false;
      })
      .catch((_) => {
        this.getUserProgress = false;
        this.snackBar.open("Error when trying get your details", "Ok", {
          duration: 2000
        });
      });
  }

  async updatePersonalInformation(): Promise<void> {
    if (this.personalForm.valid) {
      this.updateUserProgress = true;
      this.userService
        .updateUser(this.currentUser as any, this.personalForm.value)
        .then(async (user) => {
          this.updateUserProgress = false;
          this.snackBar.open("Your personal information is updated", "Ok", {
            duration: 3000
          });
          await this.userService.updateCurrentUser(user);
          this.personalForm.reset({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            // @ts-ignore
            emails: user.emails,
            mobile: user.mobile
          });
        })
        .catch((reason) => {
          console.log(reason);
          this.updateUserProgress = false;
          this.snackBar.open(
            "Fails to update your persona information try again later",
            "Ok",
            {
              duration: 3000
            }
          );
          this.personalForm.reset({
            firstname: this.currentUser.firstname,
            lastname: this.currentUser.lastname,
            email: this.currentUser.email,
            mobile: this.currentUser.mobile
          });
        });
    } else {
      this.snackBar.open("Please fill all required fields", "Ok", {
        duration: 2000
      });
    }
  }
}
