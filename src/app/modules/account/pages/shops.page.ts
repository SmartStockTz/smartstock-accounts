import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder} from '@angular/forms';
import {DeviceState, LogService, MessageService, UserService} from '@smartstocktz/core-libs';
import {ShopModel} from '../models/shop.model';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {ShopsTableOptionsComponent} from '../components/shops-table-options.component';

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
        <div class="container col-xl-9 col-lg-9 col-md-10 col-sm-11 col-12 my-users-wrapper" style="min-height: 100vh;">

          <mat-card-title class="d-flex flex-row">
            <!--            <button (click)="openAddShop()" color="primary" class="ft-button" mat-flat-button>-->
            <!--              Add Shop-->
            <!--            </button>-->
            <button routerLink="/account/shop" color="primary" class="ft-button" mat-flat-button>
              Change Current Shop
            </button>
            <span class="toolbar-spacer"></span>
            <button [matMenuTriggerFor]="menuUsers" mat-icon-button>
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menuUsers>
              <button (click)="getShops()" mat-menu-item>Reload Shops</button>
            </mat-menu>
          </mat-card-title>

          <div style="height: 20px; width: 100%"></div>

          <mat-card>
            <mat-card-content>
              <table class="my-input"
                     *ngIf="!fetchShopsFlag && shopsDatasource.data && shopsDatasource.data.length > 0 && deviceState.isSmallScreen.value === false"
                     mat-table
                     [dataSource]="shopsDatasource">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Name</th>
                  <td mat-cell *matCellDef="let element">
                    {{element.businessName}}
                    <mat-chip-list *ngIf="currentShop?.projectId===element.projectId" style="display: inline-block">
                      <mat-chip color="primary" selected>Selected</mat-chip>
                    </mat-chip-list>
                  </td>
                </ng-container>
                <ng-container matColumnDef="appId">
                  <th mat-header-cell *matHeaderCellDef>AppId</th>
                  <td mat-cell *matCellDef="let element">
                    {{element.applicationId}}
                  </td>
                </ng-container>
                <ng-container matColumnDef="projectId">
                  <th mat-header-cell *matHeaderCellDef>ProjectId</th>
                  <td mat-cell *matCellDef="let element">
                    {{element.projectId}}
                  </td>
                </ng-container>
                <ng-container matColumnDef="address">
                  <th mat-header-cell *matHeaderCellDef>Address</th>
                  <td mat-cell *matCellDef="let element">
                    {{element.country}} <br> {{element.region}} <br> {{element.street}}
                  </td>
                </ng-container>
                <ng-container matColumnDef="action">
                  <th mat-header-cell *matHeaderCellDef>
                    <div class="d-flex justify-content-end align-items-end">
                      Actions
                    </div>
                  </th>
                  <td mat-cell *matCellDef="let element">
                    <div class="d-flex justify-content-end align-items-end">
                      <button color="primary" mat-icon-button>
                        <mat-icon>more_vert</mat-icon>
                      </button>
                    </div>
                  </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="shopsTableColumns"></tr>
                <tr mat-row (click)="rowClicked(row)" class="table-data-row" *matRowDef="let row; columns: shopsTableColumns;"></tr>
              </table>
              <div *ngIf="fetchShopsFlag && deviceState.isSmallScreen.value === false">
                <mat-progress-spinner matTooltip="fetch shops" [diameter]="30" mode="indeterminate"
                                      color="primary"></mat-progress-spinner>
              </div>

              <mat-nav-list *ngIf="deviceState.isSmallScreen.value === true">
                <div *ngFor="let item of shopsDatasource.connect() | async">
                  <mat-list-item (click)="rowClicked(item)">
                    <h1 matLine>{{item.businessName}}</h1>
                    <mat-card-subtitle matLine>{{item.street}}</mat-card-subtitle>
                    <mat-icon matListIcon>
                      {{currentShop && currentShop.projectId === item.projectId?'done': 'store'}}
                    </mat-icon>
                    <mat-icon matSuffix>more_vert</mat-icon>
                  </mat-list-item>
                  <mat-divider></mat-divider>
                </div>
              </mat-nav-list>

            </mat-card-content>
          </mat-card>
        </div>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ['../styles/users.style.scss']
})
export class ShopsPage implements OnInit, OnDestroy {

  shopsDatasource: MatTableDataSource<ShopModel> = new MatTableDataSource<ShopModel>([]);
  shopsTableColumns = ['name', 'appId', 'projectId', 'address', 'action'];
  currentShop: ShopModel = {applicationId: '', businessName: '', projectId: '', projectUrlId: ''};
  fetchShopsFlag = false;

  constructor(public readonly userService: UserService,
              public readonly formBuilder: FormBuilder,
              public readonly matBottomSheet: MatBottomSheet,
              public readonly logService: LogService,
              public readonly deviceState: DeviceState,
              public readonly messageService: MessageService) {
    document.title = 'SmartStock - My Shops';
  }

  async ngOnInit(): Promise<void> {
    await this.getShops();
  }

  async getShops(): Promise<void> {
    this.fetchShopsFlag = true;
    this.userService.getCurrentShop().then(cShop => {
      if (cShop) {
        this.currentShop = cShop as any;
      }
    }).catch(_ => {
    });
    // @ts-ignore
    this.userService.currentUser().then(user => {
      // @ts-ignore
      return this.userService.getShops(user as any);
    }).then((data: any) => {
      this.fetchShopsFlag = false;
      this.shopsDatasource.data = data;
    }).catch(reason => {
      this.fetchShopsFlag = false;
      this.logService.i(reason);
      this.messageService.showMobileInfoMessage(reason && reason.message ?
        reason.message : reason.toString(), 2000, 'bottom');
    }).finally(() => {
      this.fetchShopsFlag = false;
    });
  }

  async deleteShop(shop: ShopModel): Promise<void> {
    // this.matDialog.open(UserDeleteDialogComponent, {
    //   data: shop,
    //   disableClose: true
    // }).afterClosed().subscribe(_ => {
    //   if (_) {
    //     this.shops = this.shops.filter(value => value.projectId !== shop.projectId);
    //     this.shopsDatasource = new MatTableDataSource<ShopModel>(this.shops);
    //     this.matSnackBar.open('User deleted', 'Ok', {
    //       duration: 2000
    //     });
    //   } else {
    //     this.matSnackBar.open('User not deleted', 'Ok', {
    //       duration: 2000
    //     });
    //   }
    // });
  }

  async rowClicked(row: ShopModel): Promise<void> {
    this.matBottomSheet.open(ShopsTableOptionsComponent, {
      data: {
        shop: row
      }
    });
  }

  async ngOnDestroy(): Promise<void> {
  }
}

