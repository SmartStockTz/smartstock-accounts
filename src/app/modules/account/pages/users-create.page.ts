import {Component, OnDestroy, OnInit} from '@angular/core';
import {DeviceState} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-create-user-page',
  template: `
    <app-layout-sidenav
      [heading]="'Create User'"
      [leftDrawerMode]="(deviceState.enoughWidth | async) === true?'side': 'over'"
      [leftDrawerOpened]="(deviceState.enoughWidth | async) === true"
      [hasBackRoute]="true"
      backLink="/account/users"
      [body]="body"
      [leftDrawer]="side">
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <app-users-crete-form></app-users-crete-form>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: []
})

export class UsersCreatePage implements OnInit, OnDestroy {
  constructor(public readonly deviceState: DeviceState) {
  }

  async ngOnDestroy(): Promise<void> {
  }

  async ngOnInit(): Promise<void> {
  }
}
