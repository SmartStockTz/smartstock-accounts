import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

// @dynamic
@Component({
  selector: 'app-shops-table-options',
  template: `
    <div style="margin-bottom: 24px">
      <app-shops-options (done)="dialogRef.dismiss($event)" [data]="data"></app-shops-options>
    </div>
  `
})
export class ShopsOptionsSheetComponent {
  constructor(public readonly dialogRef: MatBottomSheetRef<ShopsOptionsSheetComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public readonly data: any) {
  }
}
