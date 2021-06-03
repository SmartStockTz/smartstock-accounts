import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LogService, UserService} from '@smartstocktz/core-libs';
import {UserModel} from '../models/user.model';

@Component({
  selector: 'app-user-update-password',
  template: `
    <div style="min-width: 300px">
      <h4 mat-dialog-title>Password Update for : {{data.username}}</h4>
      <form [formGroup]="updatePasswordFormGroup" (ngSubmit)="updatePassword()">

        <mat-form-field appearance="outline" class="btn-block">
          <mat-label>Password</mat-label>
          <input autocomplete="false" type="text" formControlName="password" matInput>
          <mat-error>Password required</mat-error>
        </mat-form-field>

        <button [disabled]="updateProgress" class="btn-block" mat-flat-button color="primary">
          Update
          <mat-progress-spinner *ngIf="updateProgress" style="display: inline-block" [diameter]="20" mode="indeterminate"
                                color="primary">
          </mat-progress-spinner>
        </button>
      </form>
    </div>
  `,
  styleUrls: ['../style/users.style.scss']
})
export class UserUpdateDialogComponent implements OnInit {
  updatePasswordFormGroup: FormGroup;
  updateProgress = false;

  constructor(public dialogRef: MatDialogRef<UserUpdateDialogComponent>,
              private readonly formBuilder: FormBuilder,
              private readonly snackBar: MatSnackBar,
              private readonly logger: LogService,
              private readonly userService: UserService,
              @Inject(MAT_DIALOG_DATA) public data: UserModel) {
  }

  ngOnInit(): void {
    this.updatePasswordFormGroup = this.formBuilder.group({
      password: ['', [Validators.required, Validators.nullValidator]]
    });
  }


  updatePassword(): void {
    if (this.updatePasswordFormGroup.valid) {
      this.updateProgress = true;
      this.userService.updatePassword(this.data as any, this.updatePasswordFormGroup.value.password).then(value => {
        this.snackBar.open('Password updated successful', 'Ok', {
          duration: 3000
        });
        this.updateProgress = false;
        this.dialogRef.close();
      }).catch(reason => {
        this.logger.i(reason);
        this.snackBar.open('Failure when try to update password, try again', 'Ok', {
          duration: 3000
        });
        this.updateProgress = false;
      });
    } else {
      this.snackBar.open('Please enter new password', 'Ok', {
        duration: 3000
      });
    }
  }
}
