import {AfterViewInit, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

// @dynamic
@Component({
  selector: 'app-shops-table-options',
  template: `
    <div style="margin-bottom: 24px">
      <mat-nav-list>
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
              @Inject(MAT_BOTTOM_SHEET_DATA) public readonly data: any) {
  }

  async ngAfterViewInit(): Promise<void> {
  }

  async ngOnDestroy(): Promise<void> {
  }

  async ngOnInit(): Promise<void> {
  }

}
