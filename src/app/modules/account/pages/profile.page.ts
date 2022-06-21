import { Component, OnDestroy, OnInit } from "@angular/core";
import { DeviceState } from "smartstock-core";

@Component({
  selector: "app-profile-page",
  template: `
    <app-layout-sidenav
      [leftDrawerOpened]="(deviceState.enoughWidth | async) === true"
      [leftDrawerMode]="
        (deviceState.enoughWidth | async) === true ? 'side' : 'over'
      "
      [hasBackRoute]="true"
      [backLink]="'/account'"
      [heading]="'Profile'"
      [leftDrawer]="side"
      [body]="body"
    >
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <app-personal></app-personal>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: []
})
export class ProfilePage {
  constructor(public readonly deviceState: DeviceState) {
    document.title = "SmartStock - Profile";
  }
}
