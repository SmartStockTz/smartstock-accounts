import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatMenuTrigger} from '@angular/material/menu';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder} from '@angular/forms';
import {DeviceState, LogService, UserService} from '@smartstocktz/core-libs';
import {UserModel} from '../models/user.model';
import {UserCreateDialogComponent} from '../components/user-create-dialog.component';
import {UserUpdateDialogComponent} from '../components/user-update-dialog.component';
import {UserDeleteDialogComponent} from '../components/user-delete-dialog.component';

@Component({
  selector: 'app-users',
  template: `
    <mat-sidenav-container *ngIf="!isMobile" class="match-parent">
      <mat-sidenav class="match-parent-side"
                   [fixedInViewport]="true"
                   #sidenav
                   [mode]="(deviceState.isSmallScreen | async)===false?'side':'over'"
                   [opened]="(deviceState.isSmallScreen | async)===false">
        <app-drawer></app-drawer>
      </mat-sidenav>

      <mat-sidenav-content>
        <app-toolbar [heading]="'Users'"
                     [sidenav]="sidenav"
                     [showProgress]="false">
        </app-toolbar>

        <div class="container col-xl-9 col-lg-9 col-sm-11 col-md-10 my-users-wrapper">
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
              <table style="margin-top: 16px" class="my-input"
                     *ngIf="!fetchUsersFlag && usersArray && usersArray.length > 0"
                     mat-table
                     [dataSource]="usersDatasource">
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
              <div *ngIf="fetchUsersFlag">
                <mat-progress-spinner matTooltip="fetch users"
                                      [diameter]="30" mode="indeterminate"
                                      color="primary">
                </mat-progress-spinner>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

      </mat-sidenav-content>

    </mat-sidenav-container>
  `,
  styleUrls: ['../styles/users.style.scss']
})
export class UsersPage implements OnInit, OnDestroy {

  usersDatasource: MatTableDataSource<UserModel>;
  usersTableColumns = ['name', 'role', 'shops', 'actions'];
  usersArray: UserModel[];
  fetchUsersFlag = false;
  isMobile = false;

  constructor(public readonly userService: UserService,
              public readonly formBuilder: FormBuilder,
              public readonly matDialog: MatDialog,
              public readonly logService: LogService,
              public readonly deviceState: DeviceState,
              public readonly matSnackBar: MatSnackBar) {
    document.title = 'SmartStock - Users';
  }

  async ngOnInit(): Promise<void> {
    await this.getUsers();
  }

  async getUsers(): Promise<void> {
    this.fetchUsersFlag = true;
    this.userService.getAllUser({size: 1000, skip: 0}).then(data => {
      this.fetchUsersFlag = false;
      this.usersArray = data;
      this.usersDatasource = new MatTableDataSource<UserModel>(this.usersArray);
    }).catch(reason => {
      this.fetchUsersFlag = false;
      this.logService.i(reason);
    }).finally(() => {
      this.fetchUsersFlag = false;
    });
  }

  async deleteUser(element: any): Promise<void> {
    this.matDialog.open(UserDeleteDialogComponent, {
      data: element,
      disableClose: true
    }).afterClosed().subscribe(_ => {
      if (_) {
        this.usersArray = this.usersArray.filter(value => value.id !== element.id);
        this.usersDatasource = new MatTableDataSource<UserModel>(this.usersArray);
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

  async updateUserName(user, matMenu: MatMenuTrigger): Promise<void> {
    // matMenu.toggleMenu();
    // if (user && user.value) {
    //   user.field = 'username';
    //   this.updateUser(user);
    // }
  }

  async updateUser(user: { id: string, value: string, field: string }): Promise<void> {
    // this.matSnackBar.open('Update in progress..', 'Ok');
    // this.userService.updateUser(user).then(data => {
    //   const editedObjectIndex = this.usersArray.findIndex(value => value.id === data.id);
    //   this.usersArray = this.usersArray.filter(value => value.id !== user.id);
    //   if (editedObjectIndex !== -1) {
    //     const updatedObject = this.usersArray[editedObjectIndex];
    //     updatedObject[user.field] = user.value;
    //     this.usersDatasource.data[editedObjectIndex] = updatedObject;
    //   } else {
    //     console.warn('fails to update user table');
    //   }
    //   this.matSnackBar.open('User updated', 'Ok', {
    //     duration: 3000
    //   });
    // }).catch(reason => {
    //   this.matSnackBar.open(reason && reason.message ? reason.message : 'Fail to update user', 'Ok', {
    //     duration: 3000
    //   });
    // });
  }

  async updateUserDescription(user, matMenu: MatMenuTrigger): Promise<void> {
    // matMenu.toggleMenu();
    // if (user && user.value) {
    //   user.field = 'description';
    //   this.updateUser(user);
    // }
  }

  async openAddUserDialog(): Promise<void> {
    this.matDialog.open(UserCreateDialogComponent, {
      closeOnNavigation: true,
      hasBackdrop: true
    }).afterClosed().subscribe(value => {
      if (value) {
        this.usersArray.push(value);
        this.usersDatasource.data = this.usersArray;
      }
    });
  }

  async updatePassword(element: any): Promise<void> {
    this.matDialog.open(UserUpdateDialogComponent, {
      data: element
    });
  }

  async ngOnDestroy(): Promise<void> {
  }
}

