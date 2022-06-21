import { Component, OnDestroy } from "@angular/core";
import { DeviceState } from "smartstock-core";

@Component({
  selector: "app-setting-general-page",
  template: `
    <app-layout-sidenav
      [leftDrawerOpened]="(deviceState.enoughWidth | async) === true"
      [leftDrawerMode]="
        (deviceState.enoughWidth | async) === true ? 'side' : 'over'
      "
      [hasBackRoute]="true"
      [backLink]="'/account/shops'"
      [heading]="'General settings'"
      [leftDrawer]="side"
      [body]="body"
    >
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <app-settings-general></app-settings-general>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ["../styles/setting.style.scss"]
})
export class SettingsGeneralPage implements OnDestroy {
  constructor(public readonly deviceState: DeviceState) {
    document.title = "SmartStock - Settings";
  }

  async ngOnDestroy(): Promise<void> {}
}
