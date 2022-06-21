import { Component, OnInit } from "@angular/core";
import { DeviceState } from "smartstock-core";
import { MatTableDataSource } from "@angular/material/table";
import { UserModel } from "../models/user.model";
import { MatDialog } from "@angular/material/dialog";
import { UserUpdateDialogComponent } from "./user-update-dialog.component";
import { ShopState } from "../states/shop.state";
import { UsersState } from "../states/users.state";

@Component({
  selector: "users-mobile",
  template: `
    <mat-progress-bar
      *ngIf="(shopState.loadUsers | async) === true"
      mode="indeterminate"
      color="primary"
    >
    </mat-progress-bar>
    <mat-list class="users-mobile-container">
      <div *ngFor="let item of usersDatasource.connect() | async">
        <mat-list-item>
          <h1 matLine>{{ item.username }} | {{ item.role }}</h1>
          <mat-card-subtitle class="text-truncate" matLine>{{
            usersState.getShops(item)
          }}</mat-card-subtitle>
          <mat-card-subtitle class="text-truncate" matLine>{{
            item.acl | json
          }}</mat-card-subtitle>
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
  `,
  styleUrls: ["../styles/users.style.scss"]
})
export class UsersMobileComponent implements OnInit {
  usersDatasource: MatTableDataSource<UserModel> = new MatTableDataSource<
    UserModel
  >([]);

  constructor(
    public readonly deviceState: DeviceState,
    private readonly matDialog: MatDialog,
    public readonly shopState: ShopState,
    public readonly usersState: UsersState
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.shopState
      .users()
      .then((data) => {
        this.usersDatasource.data = data;
      })
      .catch((reason) => {
        console.log(reason);
      });
  }

  updatePassword(element: any): void {
    this.matDialog.open(UserUpdateDialogComponent, {
      data: element
    });
  }

  deleteUser(element: any): void {
    this.usersState.deleteUsers(element).then((v) => {
      this.usersDatasource.data = this.usersDatasource.data.filter(
        (value) => value.id !== v.id
      );
    });
  }
}
