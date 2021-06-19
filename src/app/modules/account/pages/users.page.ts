import {Component, OnDestroy, OnInit} from '@angular/core';
import {DeviceState} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-users-page',
  template: `
    <app-layout-sidenav
      [leftDrawerOpened]="(deviceState.enoughWidth | async )=== true"
      [leftDrawerMode]="(deviceState.enoughWidth | async )=== true?'side': 'over'"
      [hasBackRoute]="true"
      [backLink]="'/account'"
      [heading]="'Users'"
      [leftDrawer]="side"
      [body]="body">
      <ng-template #side>
          <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <app-users></app-users>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ['../styles/users.style.scss']
})
export class UsersPage implements OnInit, OnDestroy {

  constructor(public readonly deviceState: DeviceState) {
    document.title = 'SmartStock - Users';
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }


}

