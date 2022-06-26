import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UntypedFormGroup} from '@angular/forms';
import {ShopService} from '../services/shop.service';

@Component({
  selector: 'app-create-shop-dialog',
  template: `
    <div mat-dialog-content>
      <app-secondary-shop-form (done)="dialogRef.close($event)" [data]="data"></app-secondary-shop-form>
    </div>
  `,
  styleUrls: ['../styles/create-shop-dialog.style.scss', '../styles/login.style.scss'],
  providers: [
    ShopService
  ]
})
export class CreateShopDialogComponent {

  createShopForm: UntypedFormGroup;
  createShopProgress = false;

  constructor(public dialogRef: MatDialogRef<CreateShopDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }
}
