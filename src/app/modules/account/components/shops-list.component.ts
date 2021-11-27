import {Component, OnInit} from '@angular/core';
import {ShopState} from '../states/shop.state';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {firstValueFrom} from 'rxjs';
import {ShopsOptionsSheetComponent} from './shops-options-sheet.component';

@Component({
  selector: 'app-shops-list',
  template: `
    <mat-nav-list>
      <div *ngFor="let item of shopState.shops | async">
        <mat-list-item matRipple (click)="options(item)">
          <h1 matLine>{{item.businessName}}</h1>
          <mat-card-subtitle matLine>{{item.street}}</mat-card-subtitle>
          <!--              <mat-icon matListIcon>-->
          <!--                {{currentShop && currentShop.projectId === item.projectId ? 'done' : 'store'}}-->
          <!--              </mat-icon>-->
          <mat-icon matSuffix>more_vert</mat-icon>
        </mat-list-item>
        <mat-divider></mat-divider>
      </div>
    </mat-nav-list>
  `,
  styleUrls: []
})
export class ShopsListComponent implements OnInit {
  constructor(public readonly shopState: ShopState,
              private sheet: MatBottomSheet) {
  }

  ngOnInit(): void {
    this.shopState.fetchShops();
  }

  options(item: any): void {
    const obs = this.sheet.open(ShopsOptionsSheetComponent, {
      data: {
        shop: item
      }
    }).afterDismissed();
    firstValueFrom(obs).then(value1 => {
      if (value1 === true) {
        const s = this.shopState.shops.value.filter(value => value.projectId !== item.projectId);
        this.shopState.shops.next(s);
      }
    });
  }
}
