import {Component, OnDestroy, OnInit} from '@angular/core';
import {DeviceState} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-profile-page',
  template: `
    <app-layout-sidenav
      [leftDrawerOpened]="(deviceState.enoughWidth | async )=== true"
      [leftDrawerMode]="(deviceState.enoughWidth | async )=== true?'side': 'over'"
      [hasBackRoute]="true"
      [backLink]="'/account'"
      [heading]="'Profile'"
      [leftDrawer]="side"
      [body]="body">
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <div style="margin-bottom: 50px; min-height: 100vh"
             class="container col-xl-9 col-lg-9 col-sm-11 col-md-10 my-profile-wrapper">
          <h3 style="margin-top: 8px">Personal Information</h3>
          <app-personal></app-personal>
          <h3 style="margin-top: 8px">Authentication</h3>
          <app-credentials></app-credentials>
        </div>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ['../styles/profile.style.scss']
})
export class ProfilePage implements OnInit, OnDestroy {

  constructor(public readonly deviceState: DeviceState) {
    document.title = 'SmartStock - Profile';
  }

  async ngOnInit(): Promise<void> {
  }

  async ngOnDestroy(): Promise<void> {
  }

}
