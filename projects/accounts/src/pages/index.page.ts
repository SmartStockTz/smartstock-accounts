import {Component} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-accounts-index',
  template: `
    <mat-sidenav-container>
      <mat-sidenav class="match-parent-side" #sidenav [mode]="enoughWidth()?'side': 'over'" [opened]="enoughWidth()">
        <app-drawer></app-drawer>
      </mat-sidenav>
      <mat-sidenav-content style="min-height: 100vh">
        <app-toolbar searchPlaceholder="Filter product" [heading]="'Profile'"
                            [sidenav]="sidenav"></app-toolbar>
        <div class="container col-xl-10 col-lg-10 col-sm-9 col-md-9 col-sm-12 col-10" style="padding: 16px 0">
          <h1>Go To</h1>
          <div class="d-flex">
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

<!--            <app-libs-rbac [groups]="['admin', 'manager']" [component]="settings">-->
<!--              <ng-template #settings>-->
<!--                <div routerLink="/account/settings" style="margin: 5px; cursor: pointer">-->
<!--                  <mat-card matRipple-->
<!--                            style="width: 150px; height: 150px; display: flex; justify-content: center;-->
<!--                         align-items: center; flex-direction: column">-->
<!--                    <mat-icon color="primary" style="font-size: 60px; height: 60px; width: 60px">-->
<!--                      settings-->
<!--                    </mat-icon>-->
<!--                  </mat-card>-->
<!--                  <p>-->
<!--                    Settings-->
<!--                  </p>-->
<!--                </div>-->
<!--              </ng-template>-->
<!--            </app-libs-rbac>-->

          </div>
          <!--          <h1>Summary</h1>-->
          <!--          <div class="row">-->
          <!--          </div>-->
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `
})

export class IndexPage extends DeviceInfoUtil {

  constructor() {
    super();
    document.title = 'SmartStock - My Account';
  }

}
