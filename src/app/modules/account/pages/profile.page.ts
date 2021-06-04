import {Component, OnDestroy, OnInit} from '@angular/core';
import {DeviceState} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-profile-page',
  template: `
    <mat-sidenav-container class="match-parent">
      <mat-sidenav class="match-parent-side"
                   [fixedInViewport]="true"
                   #sidenav
                   [mode]="(deviceState.isSmallScreen | async)===false?'side':'over'"
                   [opened]="(deviceState.isSmallScreen | async)===false">
        <app-drawer></app-drawer>
      </mat-sidenav>

      <mat-sidenav-content>
        <app-toolbar [heading]="'Profile'"
                     [sidenav]="sidenav"
                     [showProgress]="false">
        </app-toolbar>

        <div style="margin-bottom: 50px" class="container col-xl-9 col-lg-9 col-sm-11 col-md-10 my-profile-wrapper">
          <h2 style="margin-top: 8px">Personal Information</h2>
          <ap-personal></ap-personal>
          <h2 style="margin-top: 8px">Authentication</h2>
          <app-credentials></app-credentials>
        </div>

      </mat-sidenav-content>

    </mat-sidenav-container>
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
