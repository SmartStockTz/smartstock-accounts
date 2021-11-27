import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder} from '@angular/forms';
import {DeviceState, LogService, MessageService, UserService} from '@smartstocktz/core-libs';
import {ShopModel} from '../models/shop.model';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {ShopsOptionsSheetComponent} from '../components/shops-options-sheet.component';
import {UserDeleteDialogComponent} from '../components/user-delete-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-shops-page',
  template: `
    <app-layout-sidenav
      [leftDrawerOpened]="(deviceState.enoughWidth | async )=== true"
      [leftDrawerMode]="(deviceState.enoughWidth | async )=== true?'side': 'over'"
      [hasBackRoute]="true"
      [backLink]="'/account'"
      [heading]="'Shops'"
      [leftDrawer]="side"
      [body]="body">
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <app-shops-table *ngIf="(deviceState.isSmallScreen | async)===false"></app-shops-table>
        <app-shops-list *ngIf="(deviceState.isSmallScreen | async)===true"></app-shops-list>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ['../styles/users.style.scss']
})
export class ShopsPage implements OnInit {
  currentShop: ShopModel = {applicationId: '', businessName: '', projectId: '', projectUrlId: ''};
  fetchShopsFlag = false;

  constructor(public readonly deviceState: DeviceState) {
    document.title = 'SmartStock - My Shops';
  }

  async ngOnInit(): Promise<void> {
  }
}

