import {Component, OnInit} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';

@Component({
  selector: 'smartstock-profile',
  template: `
    <mat-sidenav-container class="match-parent">
      <mat-sidenav class="match-parent-side"
                   [fixedInViewport]="true"
                   #sidenav
                   [mode]="enoughWidth()?'side':'over'"
                   [opened]="true">
        <smartstock-drawer></smartstock-drawer>
      </mat-sidenav>

      <mat-sidenav-content>
        <smartstock-toolbar [heading]="'Profile'"
                            [sidenav]="sidenav"
                            [showProgress]="false">
        </smartstock-toolbar>

        <div style="margin-bottom: 50px" class="container col-xl-9 col-lg-9 col-sm-11 col-md-10 my-profile-wrapper">
          <h2 style="margin-top: 8px">Personal Information</h2>
          <smartstock-profile-personal></smartstock-profile-personal>
          <h2 style="margin-top: 8px">Authentication</h2>
          <smartstock-profile-authentication></smartstock-profile-authentication>
        </div>

      </mat-sidenav-content>

    </mat-sidenav-container>
  `,
  styleUrls: ['../style/profile.style.scss']
})
export class ProfilePage extends DeviceInfoUtil implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
