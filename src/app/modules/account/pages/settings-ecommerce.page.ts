import { Component, OnDestroy, OnInit } from "@angular/core";
import { DeviceState } from "smartstock-core";

@Component({
  selector: "app-settings-ecommerce-page",
  template: `
    <app-layout-sidenav
      [leftDrawerOpened]="(deviceState.enoughWidth | async) === true"
      [leftDrawerMode]="
        (deviceState.enoughWidth | async) === true ? 'side' : 'over'
      "
      [hasBackRoute]="true"
      [heading]="'E-Commerce'"
      backLink="/account/shops"
      [body]="body"
      [leftDrawer]="leftDrawer"
    >
      <ng-template #leftDrawer>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <app-settings-ecommerce></app-settings-ecommerce>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ["../styles/setting.style.scss"]
})
export class SettingsEcommercePage implements OnInit, OnDestroy {
  constructor(public readonly deviceState: DeviceState) {
    document.title = "SmartStock - E-Commerce Settings";
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {}
}
