import {AfterViewInit, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

// @dynamic
@Component({
  selector: 'app-register-dialog',
  template: `
    <div>
      <div mat-dialog-title>
        Hello
      </div>
      <p mat-dialog-content>
        {{data.message}}
      </p>
      <div mat-dialog-actions>
        <button (click)="dialogRef.close(data.goLogin)" mat-button>Close</button>
      </div>
    </div>
  `,
  styleUrls: ['../styles/register.style.scss']
})
export class RegisterDialogComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(public readonly dialogRef: MatDialogRef<RegisterDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public readonly data: any) {
  }

  async ngAfterViewInit(): Promise<void> {
  }

  async ngOnDestroy(): Promise<void> {
  }

  async ngOnInit(): Promise<void> {
  }
}
