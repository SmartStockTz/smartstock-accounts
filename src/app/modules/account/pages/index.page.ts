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
            <div *ngFor="let p of pages">
              <app-libs-rbac [groups]="p.roles" [pagePath]="p.link">
                <ng-template>
                  <div routerLink="{{p.link}}" style="margin: 5px; cursor: pointer">
                    <mat-card matRipple
                              style="width: 150px; height: 150px; display: flex; justify-content: center;
                         align-items: center; flex-direction: column">
                      <mat-icon color="primary" style="font-size: 60px; height: 60px; width: 60px">
                        {{p.icon}}
                      </mat-icon>
                    </mat-card>
                    <p>
                      {{p.name}}
                    </p>
                  </div>
                </ng-template>
              </app-libs-rbac>
            </div>
          </div>

          <mat-nav-list *ngIf="(deviceState.isSmallScreen | async) === true">
            <app-libs-rbac *ngFor="let page of pages" [groups]="page.roles" [pagePath]="page.link">
              <ng-template>
                <mat-list-item routerLink="{{page.link}}">
                  <mat-icon matListIcon>{{page.icon}}</mat-icon>
                  <h1 matLine>{{page.name}}</h1>
                  <mat-card-subtitle matLine>{{page.detail}}</mat-card-subtitle>
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
  pages = [
    {
      name: 'profile',
      roles: ['*'],
      icon: 'face',
      detail: 'Your information',
      link: '/account/profile'
    },
    {
      name: 'users',
      roles: ['manager', 'admin'],
      detail: 'Create shop users',
      icon: 'supervisor_account',
      link: '/account/users'
    },
    {
      name: 'shops',
      roles: ['manager', 'admin'],
      detail: 'Manage your shops',
      icon: 'store',
      link: '/account/shops'
    },
    {
      name: 'payments',
      detail: 'Manage bills and payments',
      roles: ['*'],
      icon: 'payments',
      link: '/account/bill'
    }
  ];

  constructor(public readonly deviceState: DeviceState) {
    document.title = 'SmartStock - My Account';
  }

  async ngOnDestroy(): Promise<void> {
  }

  async ngOnInit(): Promise<void> {
  }

}
