import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeviceState, LogService, StorageService, UserService} from '@smartstocktz/core-libs';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-user-create-dialog',
  template: `
    <div [style]="deviceState.isSmallScreen.value?{}: {width: '400px' }">
      <div mat-dialog-title>Create User</div>
      <div mat-dialog-content>
        <form *ngIf="newUserForm" class="d-flex flex-column" [formGroup]="newUserForm" (ngSubmit)="createUser()">

          <mat-form-field appearance="outline">
            <mat-label>Username</mat-label>
            <input matInput type="text" formControlName="username" required>
            <mat-error>Username required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input autocomplete="false" matInput type="text" formControlName="password" required>
            <mat-error>Password required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Roles</mat-label>
            <mat-select formControlName="role">
              <mat-option value="manager">MANAGER</mat-option>
              <mat-option value="user">SELLER</mat-option>
            </mat-select>
            <mat-error>Role required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Shop ( s )</mat-label>
            <mat-select [value]="activeShop" [multiple]="true" formControlName="shops">
              <mat-option *ngFor="let shop of shops | async" [value]="shop">{{shop.businessName}}</mat-option>
            </mat-select>
            <mat-error>Shop ( s ) required</mat-error>
          </mat-form-field>

          <button color="primary" [disabled]="createUserProgress" mat-flat-button class="ft-button">
            Save
            <mat-progress-spinner style="display: inline-block" *ngIf="createUserProgress" [diameter]="20"
                                  mode="indeterminate"></mat-progress-spinner>
          </button>
          <span style="margin-bottom: 8px"></span>
          <button color="warn" mat-button (click)="cancel($event)">
            Close
          </button>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['../styles/users.style.scss'],
})
export class UserCreateDialogComponent implements OnInit, OnDestroy, AfterViewInit {
  newUserForm: FormGroup;
  createUserProgress = false;
  shops: Observable<any[]>;
  activeShop = {};

  constructor(
    public readonly formBuilder: FormBuilder,
    public readonly snack: MatSnackBar,
    public readonly storageService: StorageService,
    public readonly userService: UserService,
    public readonly logger: LogService,
    public readonly deviceState: DeviceState,
    public readonly dialogRef: MatDialogRef<UserCreateDialogComponent>) {
  }

  async ngOnInit(): Promise<void> {
    this.activeShop = await this.storageService.getActiveShop();
    await this.getShops();
    await this.initiateForm();
  }

  async initiateForm(): Promise<void> {
    this.newUserForm = this.formBuilder.group({
      username: ['', [Validators.nullValidator, Validators.required]],
      password: ['', [Validators.nullValidator, Validators.required]],
      shops: [[], [Validators.nullValidator, Validators.required]],
      role: ['user', [Validators.nullValidator, Validators.required]],
    });
  }

  async createUser(): Promise<void> {
    if (!this.newUserForm.valid) {
      this.snack.open('Please fll all details', 'Ok', {
        duration: 3000
      });
      return;
    }
    this.createUserProgress = true;
    this.newUserForm.value.username = this.newUserForm.value.username.trim();
    this.newUserForm.value.password = this.newUserForm.value.password.trim();
    this.userService.addUser(this.newUserForm.value).then(value => {
      this.createUserProgress = false;
      value.username = this.newUserForm.value.username;
      value.role = this.newUserForm.value.role;
      this.dialogRef.close(value);
      this.snack.open('User created', 'Ok', {
        duration: 3000
      });
    }).catch(reason => {
      console.log(reason);
      this.createUserProgress = false;
      this.snack.open('User not created, try different username', 'Ok', {
        duration: 3000
      });
    }).finally(() => {
      this.createUserProgress = false;
    });
  }

  async cancel($event: Event): Promise<void> {
    $event.preventDefault();
    this.dialogRef.close(null);
  }

  async getShops(): Promise<void> {
    this.userService.currentUser().then((user: any) => {
      return this.userService.getShops(user as any);
    }).then(value => {
      this.shops = of(value && Array.isArray(value) ? value : []);
    }).catch(reason => {
      this.logger.e(reason, 'DialogUserNewComponent:203');
      this.shops = of([]);
    });
  }

  async ngAfterViewInit(): Promise<void> {
  }

  async ngOnDestroy(): Promise<void> {
  }
}
