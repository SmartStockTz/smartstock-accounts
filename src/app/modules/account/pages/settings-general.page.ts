import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeviceState, EventService, SsmEvents, UserService} from '@smartstocktz/core-libs';
import {ActivatedRoute, Router} from '@angular/router';
import {SettingsModel} from '../models/settings.model';
import {functions} from 'bfast';

@Component({
  selector: 'app-setting-general-page',
  template: `
    <app-layout-sidenav
      [leftDrawerOpened]="(deviceState.enoughWidth | async )=== true"
      [leftDrawerMode]="(deviceState.enoughWidth | async )=== true?'side': 'over'"
      [hasBackRoute]="true"
      [backLink]="'/account/shops'"
      [heading]="'General settings'"
      [leftDrawer]="side"
      [body]="body">
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <app-settings-general></app-settings-general>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ['../styles/setting.style.scss']
})
export class SettingsGeneralPage implements OnDestroy {

  constructor(public readonly deviceState: DeviceState) {
    document.title = 'SmartStock - Settings';
  }

  async ngOnDestroy(): Promise<void> {
  }
}
