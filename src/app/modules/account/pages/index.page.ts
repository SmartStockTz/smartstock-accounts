import {Component, OnDestroy, OnInit} from '@angular/core';
import {DeviceState} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-index-page',
  template: `

    <app-layout-sidenav
      [leftDrawerOpened]="(deviceState.enoughWidth | async )=== true"
      [leftDrawerMode]="(deviceState.enoughWidth | async )=== true?'side': 'over'"
      [heading]="'My Account'"
      [leftDrawer]="side"
      [body]="body">
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <div class="container col-xl-10 col-lg-10 col-sm-12  col-md-9 col-sm-12 col-12"
             style="padding: 16px 0; min-height: 100vh">
          <div *ngIf="(deviceState.isSmallScreen | async) === false" class="d-flex flex-wrap p-4">
            <app-libs-rbac [groups]="['admin','manager','user']" [component]="profile">
              <ng-template #profile>
                <div routerLink="/account/profile" style="margin: 5px; cursor: pointer">
                  <mat-card matRipple
                            style="width: 150px; height: 150px; display: flex; justify-content: center;
                         align-items: center; flex-direction: column">
                    <mat-icon color="primary" style="font-size: 60px; height: 60px; width: 60px">
                      face
                    </mat-icon>
                  </mat-card>
                  <p>
                    Profile
                  </p>
                </div>
              </ng-template>
            </app-libs-rbac>
            <app-libs-rbac [groups]="['admin','manager']" [component]="users">
              <ng-template #users>
                <div routerLink="/account/users" style="margin: 5px; cursor: pointer">
                  <mat-card matRipple
                            style="width: 150px; height: 150px; display: flex; justify-content: center;
                         align-items: center; flex-direction: column">
                    <mat-icon color="primary" style="font-size: 60px; height: 60px; width: 60px">
                      face
                    </mat-icon>
                  </mat-card>
                  <p>
                    Users
                  </p>
                </div>
              </ng-template>
            </app-libs-rbac>
            <app-libs-rbac [groups]="['admin']" [component]="shops">
              <ng-template #shops>
                <div routerLink="/account/shops" style="margin: 5px; cursor: pointer">
                  <mat-card matRipple
                            style="width: 150px; height: 150px; display: flex; justify-content: center;
                         align-items: center; flex-direction: column">
                    <mat-icon color="primary" style="font-size: 60px; height: 60px; width: 60px">
                      store
                    </mat-icon>
                  </mat-card>
                  <p>
                    Shops
                  </p>
                </div>
              </ng-template>
            </app-libs-rbac>
            <app-libs-rbac [groups]="['admin']" [component]="bills">
              <ng-template #bills>
                <div routerLink="/account/bill" style="margin: 5px; cursor: pointer">
                  <mat-card matRipple
                            style="width: 150px; height: 150px; display: flex; justify-content: center;
                         align-items: center; flex-direction: column">
                    <mat-icon color="primary" style="font-size: 60px; height: 60px; width: 60px">
                      payment
                    </mat-icon>
                  </mat-card>
                  <p>
                    Payments
                  </p>
                </div>
              </ng-template>
            </app-libs-rbac>
          </div>

          <mat-nav-list *ngIf="(deviceState.isSmallScreen | async) === true">
            <app-libs-rbac [groups]="['admin','manager','user']" [component]="profile">
              <ng-template #profile>
                <mat-list-item routerLink="/account/profile">
                  <mat-icon matListIcon>face</mat-icon>
                  <h1 matLine>Profile</h1>
                  <mat-card-subtitle matLine>Your details</mat-card-subtitle>
                </mat-list-item>
                <mat-divider></mat-divider>
              </ng-template>
            </app-libs-rbac>
            <app-libs-rbac [groups]="['admin','manager']" [component]="users">
              <ng-template #users>
                <mat-list-item routerLink="/account/users">
                  <mat-icon matListIcon>supervisor_account</mat-icon>
                  <h1 matLine>Users</h1>
                  <mat-card-subtitle matLine>Manage shop users</mat-card-subtitle>
                </mat-list-item>
                <mat-divider></mat-divider>
              </ng-template>
            </app-libs-rbac>
            <app-libs-rbac [groups]="['admin']" [component]="shops">
              <ng-template #shops>
                <mat-list-item routerLink="/account/shops">
                  <mat-icon matListIcon>store</mat-icon>
                  <h1 matLine>Shops</h1>
                  <mat-card-subtitle matLine>Manage your shops</mat-card-subtitle>
                </mat-list-item>
                <mat-divider></mat-divider>
              </ng-template>
            </app-libs-rbac>
            <app-libs-rbac [groups]="['admin']" [component]="bills">
              <ng-template #bills>
                <mat-list-item routerLink="/account/bill">
                  <mat-icon matListIcon>payment</mat-icon>
                  <h1 matLine>Payments</h1>
                  <mat-card-subtitle matLine>Bills and receipts</mat-card-subtitle>
                </mat-list-item>
                <mat-divider></mat-divider>
              </ng-template>
            </app-libs-rbac>
          </mat-nav-list>
        </div>
      </ng-template>
    </app-layout-sidenav>
  `
})

export class IndexPage implements OnInit, OnDestroy {

  constructor(public readonly deviceState: DeviceState) {
    document.title = 'SmartStock - My Account';
  }

  async ngOnDestroy(): Promise<void> {
  }

  async ngOnInit(): Promise<void> {
  }

}
