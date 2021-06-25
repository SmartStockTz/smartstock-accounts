import {AfterViewInit, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {ShopModel} from '../models/shop.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {ShopDeleteConfirmDialogComponent} from './shop-delete-confirm-dialog.component';

// @dynamic
@Component({
  selector: 'app-shops-table-options',
  template: `
    <div style="margin-bottom: 24px">
      <mat-nav-list>
        <mat-list-item (click)="deleteShop(this.data.shop)">
          <h1 matLine>Delete</h1>
          <p matLine>Permanent Delete Shop</p>
          <mat-icon matListIcon>delete</mat-icon>
        </mat-list-item>
        <mat-list-item (click)="dialogRef.dismiss()" routerLink="/account/shops/{{data.shop.projectId}}/ecommerce">
          <h1 matLine>E-Commerce</h1>
          <p matLine>E-commerce settings for this shop</p>
          <mat-icon matListIcon>shopping_cart</mat-icon>
        </mat-list-item>
        <mat-list-item (click)="dialogRef.dismiss()" routerLink="/account/shops/{{data.shop.projectId}}/settings">
          <h1 matLine>Settings</h1>
          <p matLine>General shop settings</p>
          <mat-icon matListIcon>settings</mat-icon>
        </mat-list-item>
      </mat-nav-list>
    </div>
  `
})
export class ShopsTableOptionsComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(public readonly dialogRef: MatBottomSheetRef<ShopsTableOptionsComponent>,
              public readonly snack: MatSnackBar,
              public readonly dialog: MatDialog,
              @Inject(MAT_BOTTOM_SHEET_DATA) public readonly data: any) {
  }

  async deleteShop(shop: ShopModel): Promise<void> {
    this.dialog.open(ShopDeleteConfirmDialogComponent, {
      data: {
        name: shop.businessName,
        project_id: shop.projectId
      },
      disableClose: true
    }).afterClosed().subscribe(_ => {
      if (_) {
        this.dialogRef.dismiss(true);
        this.snack.open('Shop deleted', 'Ok', {
          duration: 2000
        });
      } else {
        this.dialogRef.dismiss(false);
        this.snack.open('Shop not deleted', 'Ok', {
          duration: 2000
        });
      }
    });
  }

  async ngAfterViewInit(): Promise<void> {
  }

  async ngOnDestroy(): Promise<void> {
  }

  async ngOnInit(): Promise<void> {
  }

}
