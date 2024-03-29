import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Observable, of } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  DeviceState,
  LogService,
  NavigationService,
  UserService
} from "smartstock-core";
import { Router } from "@angular/router";
import { UsersState } from "../states/users.state";

@Component({
  selector: "app-users-crete-form",
  template: `
    <div class="users-crete-container">
      <form
        *ngIf="newUserForm"
        class="users-create-form"
        [formGroup]="newUserForm"
        (ngSubmit)="createUser()"
      >
        <!--        <h1 class="heading">Details</h1>-->
        <mat-form-field class="d-block">
          <mat-label>Username</mat-label>
          <input matInput type="text" formControlName="username" />
          <mat-error>Username required</mat-error>
        </mat-form-field>
        <mat-form-field class="d-block">
          <mat-label>Firstname</mat-label>
          <input matInput type="text" formControlName="firstname" />
          <mat-error>Firstname required</mat-error>
        </mat-form-field>
        <mat-form-field class="d-block">
          <mat-label>Lastname</mat-label>
          <input matInput type="text" formControlName="lastname" />
          <mat-error>Lastname required</mat-error>
        </mat-form-field>
        <mat-form-field class="d-block">
          <mat-label>Password</mat-label>
          <input
            autocomplete="false"
            matInput
            type="text"
            formControlName="password"
          />
          <mat-error>Password required</mat-error>
        </mat-form-field>

        <mat-form-field class="d-block">
          <mat-label>Shop ( s )</mat-label>
          <mat-select
            [value]="activeShop"
            [multiple]="true"
            formControlName="shops"
          >
            <mat-option *ngFor="let shop of shops | async" [value]="shop">{{
              shop.businessName
            }}</mat-option>
          </mat-select>
          <mat-error>Shop ( s ) required</mat-error>
        </mat-form-field>

        <mat-form-field class="d-block">
          <mat-label>Group</mat-label>
          <mat-select formControlName="role">
            <mat-option value="manager">MANAGER</mat-option>
            <mat-option value="user">SELLER</mat-option>
          </mat-select>
          <mat-error>Group required</mat-error>
        </mat-form-field>

        <!--        <span class="heading-roles">Additional access ( optional )</span>-->
        <div *ngFor="let menu of configService.getMenu()">
          <div>
            <h1 class="heading">{{ menu.name }}</h1>
            <mat-card>
              <span *ngFor="let page of menu.pages">
                <mat-checkbox
                  class="pageTitle"
                  [checked]="acl[page.link]"
                  (change)="acl[page.link] = $event.checked"
                >
                  {{ page.name }}
                </mat-checkbox>
              </span>
            </mat-card>
          </div>
        </div>

        <button
          color="primary"
          [disabled]="createUserProgress"
          mat-flat-button
          class="buttonText"
        >
          Create User Account
          <mat-progress-spinner
            style="display: inline-block"
            *ngIf="createUserProgress"
            [diameter]="20"
            mode="indeterminate"
          >
          </mat-progress-spinner>
        </button>
      </form>
    </div>
  `,
  styleUrls: ["../styles/users-create.style.scss"]
})
export class UsersCreateFormComponent implements OnInit {
  newUserForm: UntypedFormGroup;
  createUserProgress = false;
  shops: Observable<any[]>;
  activeShop = {};
  acl = {};
  selectedUser = null;

  constructor(
    public readonly formBuilder: UntypedFormBuilder,
    public readonly snack: MatSnackBar,
    public readonly userService: UserService,
    public readonly logger: LogService,
    public readonly configService: NavigationService,
    public readonly router: Router,
    public readonly userState: UsersState,
    public readonly deviceState: DeviceState
  ) {}

  async ngOnInit(): Promise<void> {
    this.selectedUser = this.userState.selectedUser.value;
    this.configService.getMenu().forEach((x) => {
      x.pages.forEach((y) => {
        this.acl[y.link] = false;
      });
    });
    this.activeShop = await this.userService.getCurrentShop();
    await this.getShops();
    await this.initiateForm();
  }

  async initiateForm(): Promise<void> {
    this.newUserForm = this.formBuilder.group({
      username: [
        this.selectedUser && this.selectedUser.username
          ? this.selectedUser.username
          : "",
        [Validators.nullValidator, Validators.required]
      ],
      firstname: [
        this.selectedUser && this.selectedUser.firstname
          ? this.selectedUser.firstname
          : "",
        [Validators.nullValidator, Validators.required]
      ],
      lastname: [
        this.selectedUser && this.selectedUser.lastname
          ? this.selectedUser.lastname
          : "",
        [Validators.nullValidator, Validators.required]
      ],
      password: ["", [Validators.nullValidator, Validators.required]],
      shops: [
        this.selectedUser && this.selectedUser.shops
          ? this.selectedUser.shops
          : [],
        [Validators.nullValidator, Validators.required]
      ],
      role: [
        this.selectedUser && this.selectedUser.role
          ? this.selectedUser.role
          : "",
        [Validators.nullValidator, Validators.required]
      ]
    });
  }

  async createUser(): Promise<void> {
    if (!this.newUserForm.valid) {
      this.snack.open("Please fill all required fields", "Ok", {
        duration: 2000
      });
      return;
    }
    this.createUserProgress = true;
    this.newUserForm.value.username = this.newUserForm.value.username.trim();
    this.newUserForm.value.password = this.newUserForm.value.password.trim();
    this.newUserForm.value.acl = Object.keys(this.acl).reduce(
      (previousValue, currentValue) => {
        if (this.acl[currentValue] === true) {
          previousValue.push(currentValue);
        }
        return previousValue;
      },
      []
    );
    this.userService
      .addUser(this.newUserForm.value)
      .then((value) => {
        this.createUserProgress = false;
        value.username = this.newUserForm.value.username;
        value.role = this.newUserForm.value.role;
        value.acl = this.newUserForm.value.acl;
        this.snack.open("User created", "Ok", {
          duration: 2000
        });
        this.router.navigateByUrl("/account/users").catch(console.log);
      })
      .catch((reason) => {
        this.snack.open(
          reason ? reason.message : "User not created try different username",
          "Ok",
          {
            duration: 2000
          }
        );
      })
      .finally(() => {
        this.createUserProgress = false;
      });
  }

  async cancel($event: Event): Promise<void> {
    $event.preventDefault();
    this.router.navigateByUrl("/account/users").catch(console.log);
  }

  async getShops(): Promise<void> {
    this.userService
      .currentUser()
      .then((user: any) => {
        return this.userService.getShops(user as any);
      })
      .then((value) => {
        this.shops = of(value && Array.isArray(value) ? value : []);
      })
      .catch((_) => {
        this.shops = of([]);
      });
  }
}
