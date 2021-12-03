import {Component, OnDestroy} from '@angular/core';
import {DeviceState} from '@smartstocktz/core-libs';
import {ShopState} from '../states/shop.state';
import {UsersState} from '../states/users.state';

@Component({
  selector: 'app-users-page',
  template: `
    <app-layout-sidenav
      [leftDrawerOpened]="(deviceState.enoughWidth | async )=== true"
      [leftDrawerMode]="(deviceState.enoughWidth | async )=== true?'side': 'over'"
      [hasBackRoute]="true"
      [backLink]="'/account'"
      [heading]="'Users'"
      [visibleMenu]="vOptions"
      [leftDrawer]="side"
      [body]="body">
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #vOptions>
        <button *ngIf="deviceState.isSmallScreen.value === true" routerLink="/account/users/create" mat-icon-button>
          <mat-icon>add</mat-icon>
        </button>
        <button *ngIf="deviceState.isSmallScreen.value === true" (click)="shopState.users()" mat-icon-button>
          <mat-icon>refresh</mat-icon>
        </button>
      </ng-template>
      <ng-template #body>
        <app-users *ngIf="deviceState.isSmallScreen.value === false"></app-users>
        <users-mobile *ngIf="deviceState.isSmallScreen.value === true"></users-mobile>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ['../styles/users.style.scss']
})
export class UsersPage implements OnDestroy {

  constructor(public readonly deviceState: DeviceState,
              private readonly usersState: UsersState,
              public readonly shopState: ShopState) {
    document.title = 'SmartStock - Users';
  }

  ngOnDestroy(): void {
    this.shopState.dispose();
    this.usersState.dispose();
  }

}

