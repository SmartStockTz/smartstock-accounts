import {AfterViewInit, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

// @dynamic
@Component({
  selector: 'app-reset-password',
  styleUrls: ['../styles/login.style.scss'],
  template: `
    <div>
      <h5 mat-dialog-title>Password Reset</h5>
      <p mat-dialog-content [innerHTML]="message">
      </p>
      <div mat-dialog-actions>
        <button mat-dialog-close mat-button>Close</button>
      </div>
    </div>
  `
})

export class ResetPasswordComponent implements OnInit, OnDestroy, AfterViewInit {

  message = `Please enter your <b>username</b> to reset your password`;

  constructor(public readonly dialogRef: MatDialogRef<ResetPasswordComponent>,
              @Inject(MAT_DIALOG_DATA) public readonly data: any) {
  }

  async ngOnInit(): Promise<void> {
    if (this.data && this.data.message) {
      this.message = this.data.message;
    }
  }

  async ngAfterViewInit(): Promise<void> {
  }

  async ngOnDestroy(): Promise<void> {
  }

}
