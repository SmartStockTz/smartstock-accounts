import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-verify-dialog',
  template: `
    <div>
      <div mat-dialog-title>Account Verification</div>
      <div mat-dialog-content>
        <p>
          Your email is not verified we send a link to the email
          <br>
          you use when open account for you to verify your account
        </p>
      </div>
      <div mat-dialog-actions>
        <button mat-dialog-close mat-button color="primary">Close</button>
      </div>
    </div>
  `,
  styleUrls: ['../styles/login.style.scss']
})
export class VerifyDialogComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor() {
  }

  async ngAfterViewInit(): Promise<void> {
  }

  async ngOnDestroy(): Promise<void> {
  }

  async ngOnInit(): Promise<void> {
  }
}
