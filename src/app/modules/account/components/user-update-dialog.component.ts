import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit
} from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DeviceState, LogService, UserService } from "smartstock-core";
import { UserModel } from "../models/user.model";

@Component({
  selector: "app-user-update-dialog",
  template: `
    <div [style]="deviceState.isSmallScreen.value ? {} : { width: '400px' }">
      <h4 mat-dialog-title>Password Update for : {{ data.username }}</h4>
      <form [formGroup]="updatePasswordFormGroup" (ngSubmit)="updatePassword()">
        <mat-form-field appearance="outline" class="btn-block">
          <mat-label>Password</mat-label>
          <input
            autocomplete="false"
            type="text"
            formControlName="password"
            matInput
          />
          <mat-error>Password required</mat-error>
        </mat-form-field>

        <button
          [disabled]="updateProgress"
          class="btn-block"
          mat-flat-button
          color="primary"
        >
          Update
          <mat-progress-spinner
            *ngIf="updateProgress"
            style="display: inline-block"
            [diameter]="20"
            mode="indeterminate"
            color="primary"
          >
          </mat-progress-spinner>
        </button>
      </form>
    </div>
  `,
  styleUrls: ["../styles/users.style.scss"]
})
export class UserUpdateDialogComponent
  implements OnInit, OnDestroy, AfterViewInit {
  updatePasswordFormGroup: UntypedFormGroup;
  updateProgress = false;

  constructor(
    public dialogRef: MatDialogRef<UserUpdateDialogComponent>,
    public readonly formBuilder: UntypedFormBuilder,
    public readonly snackBar: MatSnackBar,
    public readonly logger: LogService,
    public readonly userService: UserService,
    public readonly deviceState: DeviceState,
    @Inject(MAT_DIALOG_DATA) public data: UserModel
  ) {}

  async ngOnInit(): Promise<void> {
    this.updatePasswordFormGroup = this.formBuilder.group({
      password: ["", [Validators.required, Validators.nullValidator]]
    });
  }

  async updatePassword(): Promise<void> {
    if (this.updatePasswordFormGroup.valid) {
      this.updateProgress = true;
      this.userService
        .updatePassword(
          this.data as any,
          this.updatePasswordFormGroup.value.password
        )
        .then((value) => {
          this.snackBar.open("Password updated successful", "Ok", {
            duration: 3000
          });
          this.updateProgress = false;
          this.dialogRef.close();
        })
        .catch((reason) => {
          this.logger.i(reason);
          this.snackBar.open(
            "Failure when try to update password, try again",
            "Ok",
            {
              duration: 3000
            }
          );
          this.updateProgress = false;
        });
    } else {
      this.snackBar.open("Please enter new password", "Ok", {
        duration: 3000
      });
    }
  }

  async ngAfterViewInit(): Promise<void> {}

  async ngOnDestroy(): Promise<void> {}
}
