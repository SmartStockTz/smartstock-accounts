import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatMenuTrigger} from '@angular/material/menu';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder} from '@angular/forms';
import {DeviceInfoUtil, LogService, MessageService, UserService} from '@smartstocktz/core-libs';
import {ShopModel} from '../models/shop.model';
import {CreateShopDialogComponent} from '../components/create-shop-dialog.component';

@Component({
  selector: 'smartstock-users',
  template: `
    <mat-sidenav-container *ngIf="!isMobile" class="match-parent">
      <mat-sidenav class="match-parent-side"
                   [fixedInViewport]="true"
                   #sidenav
                   [mode]="enoughWidth()?'side':'over'"
                   [opened]="true">
        <smartstock-drawer></smartstock-drawer>
      </mat-sidenav>

      <mat-sidenav-content>
        <smartstock-toolbar [heading]="'Shops'"
                            [sidenav]="sidenav"
                            [showProgress]="false">
        </smartstock-toolbar>

        <div class="container col-xl-9 col-lg-10 col-sm-11 col-md-10 my-users-wrapper">

          <mat-card-title class="d-flex flex-row">
            <button (click)="openAddShop()" color="primary" class="ft-button" mat-flat-button>
              Add Shop
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
              <table style="margin-top: 16px" class="my-input"
                     *ngIf="!fetchShopsFlag && shops && shops.length > 0"
                     mat-table
                     [dataSource]="shopsDatasource">

                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Name</th>
                  <td mat-cell *matCellDef="let element">
                    {{element.businessName}}
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
                      <!--                      <button [matMenuTriggerFor]="opts" color="primary" mat-icon-button>-->
                      <!--                        <mat-icon>more_vert</mat-icon>-->
                      <!--                      </button>-->
                      <!--                      <mat-menu #opts>-->
                      <!--                        <button (click)="deleteUser(element)" mat-menu-item>-->
                      <!--                          Delete-->
                      <!--                        </button>-->
                      <!--                        <button mat-menu-item (click)="updatePassword(element)">-->
                      <!--                          Update password-->
                      <!--                        </button>-->
                      <!--                      </mat-menu>-->
                    </div>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="shopsTableColumns"></tr>
                <tr mat-row class="table-data-row" *matRowDef="let row; columns: shopsTableColumns;"></tr>

              </table>
              <div *ngIf="fetchShopsFlag">
                <mat-progress-spinner matTooltip="fetch shops" [diameter]="30" mode="indeterminate"
                                      color="primary"></mat-progress-spinner>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

      </mat-sidenav-content>

    </mat-sidenav-container>
  `,
  styleUrls: ['../style/users.style.scss']
})
export class ShopsPage extends DeviceInfoUtil implements OnInit {

  shopsDatasource: MatTableDataSource<ShopModel>;
  shopsTableColumns = ['name', 'appId', 'projectId', 'address', 'action'];
  shops: ShopModel[];
  fetchShopsFlag = false;

  isMobile = false;

  constructor(private readonly userService: UserService,
              private readonly formBuilder: FormBuilder,
              private readonly dialog: MatDialog,
              private readonly logService: LogService,
              private readonly messageService: MessageService) {
    super();
  }

  ngOnInit(): void {
    this.getShops();
  }

  getShops(): void {
    this.fetchShopsFlag = true;
    this.userService.getShops().then(data => {
      this.fetchShopsFlag = false;
      this.shops = data;
      this.shopsDatasource = new MatTableDataSource<ShopModel>(this.shops);
    }).catch(reason => {
      this.fetchShopsFlag = false;
      this.logService.i(reason);
      this.messageService.showMobileInfoMessage(reason && reason.message ?
        reason.message : reason.toString(), 2000, 'bottom');
    }).finally(() => {
      this.fetchShopsFlag = false;
    });
  }

  deleteShop(shop: ShopModel): void {
    // this.dialog.open(UserDeleteDialogComponent, {
    //   data: shop,
    //   disableClose: true
    // }).afterClosed().subscribe(_ => {
    //   if (_) {
    //     this.shops = this.shops.filter(value => value.projectId !== shop.projectId);
    //     this.shopsDatasource = new MatTableDataSource<ShopModel>(this.shops);
    //     this.snack.open('User deleted', 'Ok', {
    //       duration: 2000
    //     });
    //   } else {
    //     this.snack.open('User not deleted', 'Ok', {
    //       duration: 2000
    //     });
    //   }
    // });
  }

  updateUserName(user, matMenu: MatMenuTrigger): void {
    // matMenu.toggleMenu();
    // if (user && user.value) {
    //   user.field = 'username';
    //   this.updateUser(user);
    // }
  }

  updateUser(user: { id: string, value: string, field: string }): void {
    // this.snack.open('Update in progress..', 'Ok');
    // this.userDatabase.updateUser(user).then(data => {
    //   const editedObjectIndex = this.usersArray.findIndex(value => value.id === data.id);
    //   this.usersArray = this.usersArray.filter(value => value.id !== user.id);
    //   if (editedObjectIndex !== -1) {
    //     const updatedObject = this.usersArray[editedObjectIndex];
    //     updatedObject[user.field] = user.value;
    //     this.usersDatasource.data[editedObjectIndex] = updatedObject;
    //   } else {
    //     console.warn('fails to update user table');
    //   }
    //   this.snack.open('User updated', 'Ok', {
    //     duration: 3000
    //   });
    // }).catch(reason => {
    //   this.snack.open(reason && reason.message ? reason.message : 'Fail to update user', 'Ok', {
    //     duration: 3000
    //   });
    // });
  }

  openAddShop(): void {
    this.dialog.open(CreateShopDialogComponent);
  }
}

