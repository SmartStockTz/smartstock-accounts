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
import {UsersState} from '../states/users.state';


@Component({
  selector: 'app-users',
  template: `
    <div class="my-users-wrapper">
      <app-users-context></app-users-context>
      <div class="users-table-container">
        <table class="users-table" mat-table [dataSource]="usersDatasource">
          <ng-container matColumnDef="name">
            <th class="column-header" mat-header-cell *matHeaderCellDef>Username</th>
            <td class="" matRipple mat-cell
                *matCellDef="let element">
              {{element.username}}
            </td>
          </ng-container>
          <ng-container matColumnDef="role">
            <th class="column-header" mat-header-cell *matHeaderCellDef>Role</th>
            <td matRipple mat-cell *matCellDef="let element">
              {{element.role === 'user' ? 'SELLER' : 'MANAGER'}} <br>
              {{element.acl | json}}
            </td>
          </ng-container>
          <ng-container matColumnDef="shops">
            <th class="column-header" mat-header-cell *matHeaderCellDef>Shops</th>
            <td class=""
                matRipple mat-cell
                *matCellDef="let element">{{usersState.getShops(element)}}
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th class="column-header" mat-header-cell *matHeaderCellDef>
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
      </div>
      <mat-paginator #paginator [pageSize]="50"></mat-paginator>
    </div>`,
  styleUrls: ['../styles/users.style.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {

  usersDatasource: MatTableDataSource<UserModel> = new MatTableDataSource<UserModel>([]);
  usersTableColumns = ['name', 'role', 'shops', 'actions'];
  @ViewChild('paginator') matPaginator: MatPaginator;

  constructor(public readonly formBuilder: FormBuilder,
              public readonly matDialog: MatDialog,
              public readonly deviceState: DeviceState,
              public readonly matSnackBar: MatSnackBar,
              public readonly userState: UsersState,
              public readonly usersState: UsersState,
              public readonly shopState: ShopState) {
  }

  async ngOnInit(): Promise<any> {
    this.getUsers();
  }

  getUsers(): void {
    this.shopState.users().then(data => {
      this.usersDatasource.data = data;
    }).catch(reason => {
      console.log(reason);
    });
  }

  deleteUser(element: any): void {
    this.usersState.deleteUsers(element).then(v => {
      this.usersDatasource.data = this.usersDatasource.data.filter(value => value.id !== v.id);
    });
  }

  updatePassword(element: any): void {
    this.matDialog.open(UserUpdateDialogComponent, {
      data: element
    });
  }

  ngAfterViewInit(): void {
    this.usersDatasource.paginator = this.matPaginator;
  }
}

