import {Component, OnInit} from '@angular/core';
import {DeviceState} from '@smartstocktz/core-libs';
import {ShopModel} from '../models/shop.model';
import {ShopState} from '../states/shop.state';

@Component({
  selector: 'app-shops-page',
  template: `
    <app-layout-sidenav
      [leftDrawerOpened]="(deviceState.enoughWidth | async )=== true"
      [leftDrawerMode]="(deviceState.enoughWidth | async )=== true?'side': 'over'"
      [hasBackRoute]="true"
      [backLink]="'/account'"
      [heading]="'Shops'"
      [visibleMenu]="vOptions"
      [leftDrawer]="side"
      [body]="body">
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #vOptions>
        <button *ngIf="(deviceState.isSmallScreen | async)===true" (click)="addShop()" mat-icon-button>
          <mat-icon>add</mat-icon>
        </button>
        <button *ngIf="(deviceState.isSmallScreen | async)===true" (click)="shopState.fetchShops()" mat-icon-button>
          <mat-icon>refresh</mat-icon>
        </button>
      </ng-template>
      <ng-template #body>
        <app-shops-table *ngIf="(deviceState.isSmallScreen | async)===false"></app-shops-table>
        <app-shops-list *ngIf="(deviceState.isSmallScreen | async)===true"></app-shops-list>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ['../styles/users.style.scss']
})
export class ShopsPage implements OnInit {
  currentShop: ShopModel = {applicationId: '', businessName: '', projectId: '', projectUrlId: ''};
  fetchShopsFlag = false;

  constructor(public readonly deviceState: DeviceState,
              public readonly shopState: ShopState) {
    document.title = 'SmartStock - My Shops';
  }

  addShop(): void {
    this.shopState.addShoPopup(this.deviceState.isSmallScreen.value, {}).then(value => {
      if (value) {
        this.shopState.fetchShops();
      }
    });
  }

  async ngOnInit(): Promise<void> {
  }
}

