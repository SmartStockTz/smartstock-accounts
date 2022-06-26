import {Component, Inject} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {ShopService} from '../services/shop.service';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-create-shop-sheet',
  template: `
    <div style="margin-bottom: 50px">
      <app-secondary-shop-form [data]="data" (done)="dialogRef.dismiss($event)"></app-secondary-shop-form>
    </div>
  `,
  styleUrls: ['../styles/create-shop-dialog.style.scss', '../styles/login.style.scss'],
  providers: [
    ShopService
  ]
})
export class CreateShopSheetComponent {
  createShopForm: UntypedFormGroup;
  createShopProgress = false;

  constructor(public dialogRef: MatBottomSheetRef<CreateShopSheetComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
  }
}
