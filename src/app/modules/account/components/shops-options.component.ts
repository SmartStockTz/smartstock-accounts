import {AfterViewInit, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {ShopModel} from '../models/shop.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {ShopDeleteConfirmDialogComponent} from './shop-delete-confirm-dialog.component';
import {firstValueFrom} from 'rxjs';
import {UserService} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-shops-options',
  template: `
    <mat-nav-list>
      <mat-list-item (click)="deleteShop(this.data.shop)">
        <h1 matLine>Delete</h1>
        <p matLine>Permanent Delete Shop</p>
        <mat-icon matListIcon>delete</mat-icon>
      </mat-list-item>
      <mat-list-item (click)="done.emit(false)" routerLink="/account/shops/{{data.shop.projectId}}/ecommerce">
        <h1 matLine>E-Commerce</h1>
        <p matLine>E-commerce settings for this shop</p>
        <mat-icon matListIcon>shopping_cart</mat-icon>
      </mat-list-item>
      <mat-list-item (click)="done.emit(false)" routerLink="/account/shops/{{data.shop.projectId}}/settings">
        <h1 matLine>Settings</h1>
        <p matLine>General shop settings</p>
        <mat-icon matListIcon>settings</mat-icon>
      </mat-list-item>
    </mat-nav-list>
  `
})
export class ShopsOptionsComponent {
  @Input() data: {shop: ShopModel};
  @Output() done = new EventEmitter();
  constructor(public readonly snack: MatSnackBar,
              private readonly userService: UserService,
              public readonly dialog: MatDialog) {
  }

  async deleteShop(shop: ShopModel): Promise<void> {
    const delObs = this.dialog.open(ShopDeleteConfirmDialogComponent, {
      data: {
        name: shop.businessName,
        user_id: (await this.userService.currentUser()).id,
        project_id: shop.projectId
      },
      disableClose: true
    }).afterClosed();
    firstValueFrom(delObs).then(_ => {
      if (_) {
        this.done.emit(true);
        this.snack.open('Shop deleted', 'Ok', {
          duration: 2000
        });
      } else {
        this.done.emit(false);
        this.snack.open('Shop not deleted', 'Ok', {
          duration: 2000
        });
      }
    });
  }

}
