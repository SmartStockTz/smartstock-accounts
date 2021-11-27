import {Component, OnDestroy, OnInit} from '@angular/core';
import {DeviceState} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-payment-page',
  template: `
    <app-layout-sidenav
      [leftDrawerOpened]="(deviceState.enoughWidth | async )=== true"
      [leftDrawerMode]="(deviceState.enoughWidth | async )=== true?'side': 'over'"
      [hasBackRoute]="true"
      [backLink]="'/account'"
      [heading]="'Payments'"
      [leftDrawer]="side"
      [body]="body">
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <app-payment></app-payment>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ['../styles/billing.style.scss']
})
export class PaymentPage implements OnInit, OnDestroy {

  constructor(public readonly deviceState: DeviceState) {
    document.title = 'SmartStock - Bills';
  }

  async ngOnInit(): Promise<void> {
  }

  async ngOnDestroy(): Promise<void> {
  }
}
