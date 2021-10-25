import {Injectable} from '@angular/core';
import {NavigationService, UserService} from '@smartstocktz/core-libs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountsNavigationService {
  constructor(private readonly navigationService: NavigationService,
              private readonly router: Router,
              private readonly userService: UserService) {
  }

  init(): void {
    this.navigationService.addMenu({
      name: 'Account',
      link: '/account',
      icon: 'supervisor_account',
      roles: ['*'],
      pages: [
        {
          name: 'profile',
          roles: ['*'],
          link: '/account/profile',
          click: null
        },
        {
          name: 'users',
          roles: ['manager', 'admin'],
          link: '/account/users',
          click: null
        },
        {
          name: 'shops',
          roles: ['manager', 'admin'],
          link: '/account/shops',
          click: null
        },
        {
          name: 'e-commerce',
          roles: ['manager', 'admin'],
          link: '/account/shops',
          click: () => {
            this.userService.getCurrentShop().then(shop => {
              return this.router.navigateByUrl(`/account/shops/${shop.projectId}/ecommerce`);
            }).catch(console.log);
          }
        },
        {
          name: 'settings',
          roles: ['manager', 'admin'],
          link: '/account/shops',
          click: () => {
            this.userService.getCurrentShop().then(shop => {
              return this.router.navigateByUrl(`/account/shops/${shop.projectId}/settings`);
            }).catch(console.log);
          }
        },
        {
          name: 'payments',
          roles: ['*'],
          link: '/account/bill',
          click: null
        }
      ]
    });
  }

  selected(): void {
    this.navigationService.selectedModuleName = 'Account';
  }
}
