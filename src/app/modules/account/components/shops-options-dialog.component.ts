import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

// @dynamic
@Component({
  selector: 'app-shops-table-options',
  template: `
    <div style="margin-bottom: 24px">
      <app-shops-options mat-dialog-content (done)="dialogRef.close($event)" [data]="data"></app-shops-options>
    </div>
  `
})
export class ShopsOptionsDialogComponent {
  constructor(public readonly dialogRef: MatDialogRef<ShopsOptionsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public readonly data: any) {
  }
}
