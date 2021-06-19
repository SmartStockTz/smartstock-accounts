import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ShopState} from '../states/shop.state';

import {MatTableDataSource} from '@angular/material/table';
import {UserModel} from '../models/user.model';
import {UserDeleteDialogComponent} from './user-delete-dialog.component';
import {UserCreateDialogComponent} from './user-create-dialog.component';
import {UserUpdateDialogComponent} from './user-update-dialog.component';
import {FormBuilder} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeviceState} from '@smartstocktz/core-libs';
import {MatPaginator} from '@angular/material/paginator';


@Component({
  selector: 'app-users',
  template: `
    <div style="min-height: 100vh" class="container col-xl-9 col-lg-9 col-sm-12 col-12 col-md-10 my-users-wrapper">
      <mat-card-title class="d-flex flex-row">
        <button (click)="openAddUserDialog()" color="primary" class="ft-button" mat-flat-button>
          Add User
        </button>
        <span class="toolbar-spacer"></span>
        <button [matMenuTriggerFor]="menuUsers" mat-icon-button>
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #menuUsers>
          <button (click)="getUsers()" mat-menu-item>Reload Users</button>
        </mat-menu>
      </mat-card-title>
      <mat-card>
        <mat-card-content>
          <table *ngIf="deviceState.isSmallScreen.value === false" style="margin-top: 16px" class="my-input" mat-table [dataSource]="usersDatasource">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Username</th>
              <td class="" matRipple mat-cell
                  *matCellDef="let element">
                {{element.username}}
              </td>
            </ng-container>
            <ng-container matColumnDef="role">
              <th mat-header-cell *matHeaderCellDef>Role</th>
              <td class=""
                  matRipple mat-cell
                  *matCellDef="let element">{{element.role === 'user' ? 'SELLER' : 'MANAGER'}}
              </td>
            </ng-container>
            <ng-container matColumnDef="shops">
              <th mat-header-cell *matHeaderCellDef>Shops</th>
              <td class=""
                  matRipple mat-cell
                  *matCellDef="let element">{{element.shops | shopsPipe | async }}
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>
                <div class="d-flex justify-content-end align-items-end">
                  Actions
                </div>
              </th>
              <td mat-cell *matCellDef="let element">
                <div class="d-flex justify-content-end align-items-end">
                  <button [matMenuTriggerFor]="opts" color="primary" mat-icon-button>
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #opts>
                    <button (click)="deleteUser(element)" mat-menu-item>
                      Delete
                    </button>
                    <button mat-menu-item (click)="updatePassword(element)">
                      Update password
                    </button>
                  </mat-menu>
                </div>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="usersTableColumns"></tr>
            <tr mat-row class="table-data-row" *matRowDef="let row; columns: usersTableColumns;"></tr>
          </table>
          <mat-list *ngIf="deviceState.isSmallScreen.value === true">
            <div *ngFor="let item of usersDatasource.connect() | async">
              <mat-list-item>
                <h1 matLine>{{item.username}} | {{item.role}}</h1>
                <mat-card-subtitle class="text-truncate" matLine>{{item.shops | shopsPipe | async}}</mat-card-subtitle>
                <button matSuffix [matMenuTriggerFor]="opts" mat-icon-button>
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #opts>
                  <button (click)="deleteUser(item)" mat-menu-item>
                    Delete
                  </button>
                  <button mat-menu-item (click)="updatePassword(item)">
                    Update password
                  </button>
                </mat-menu>
              </mat-list-item>
              <mat-divider></mat-divider>
            </div>
          </mat-list>
          <div *ngIf="(shopState.loadUsers | async) === true">
            <mat-progress-spinner matTooltip="fetch users"
                                  [diameter]="30" mode="indeterminate"
                                  color="primary">
            </mat-progress-spinner>
          </div>
          <mat-paginator *ngIf="deviceState.isSmallScreen.value === false" #paginator [pageSize]="10" [pageSizeOptions]="[5,10,50,100]"></mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>`,
  styleUrls: ['../styles/users.style.scss']
})
export class UsersComponent implements OnInit, OnDestroy, AfterViewInit {

  usersDatasource: MatTableDataSource<UserModel> = new MatTableDataSource<UserModel>([]);
  usersTableColumns = ['name', 'role', 'shops', 'actions'];
  @ViewChild('paginator') matPaginator: MatPaginator;

  constructor(public readonly formBuilder: FormBuilder,
              public readonly matDialog: MatDialog,
              public readonly deviceState: DeviceState,
              public readonly matSnackBar: MatSnackBar,
              public readonly shopState: ShopState) {
  }

  async ngOnInit(): Promise<any> {
    await this.getUsers();
  }

  async getUsers(): Promise<any> {
    this.shopState.users().then(data => {
      this.usersDatasource.data = data;
    }).catch(reason => {
      console.log(reason);
    });
  }

  async deleteUser(element: any): Promise<any> {
    this.matDialog.open(UserDeleteDialogComponent, {
      data: element,
      disableClose: true
    }).afterClosed().subscribe(_ => {
      if (_) {
        this.usersDatasource.data = this.usersDatasource.data.filter(value => value.id !== element.id);
        this.matSnackBar.open('User deleted', 'Ok', {
          duration: 2000
        });
      } else {
        this.matSnackBar.open('User not deleted', 'Ok', {
          duration: 2000
        });
      }
    });
  }

  async openAddUserDialog(): Promise<any> {
    this.matDialog.open(UserCreateDialogComponent, {
      closeOnNavigation: true,
      hasBackdrop: true
    }).afterClosed().subscribe(value => {
      if (value) {
        this.usersDatasource.data = [...this.usersDatasource.data, value];
      }
    });
  }

  async updatePassword(element: any): Promise<any> {
    this.matDialog.open(UserUpdateDialogComponent, {
      data: element
    });
  }

  async ngOnDestroy(): Promise<any> {

  }

  async ngAfterViewInit(): Promise<any> {
    this.usersDatasource.paginator = this.matPaginator;
  }
}

