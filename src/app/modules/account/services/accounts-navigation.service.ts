import {Injectable} from '@angular/core';
import {ConfigsService} from '@smartstocktz/core-libs';

@Injectable({
  providedIn: 'root'
})
export class AccountsNavigationService {
  constructor(private readonly configs: ConfigsService) {
  }

  init(): void {
    this.configs.addMenu({
      name: 'Account',
      link: '/account',
      icon: 'supervisor_account',
      roles: ['*'],
      pages: [
        {
          name: 'profile',
          roles: ['*'],
          link: '/account/profile'
        },
        {
          name: 'users',
          roles: ['*'],
          link: '/account/users'
        },
        {
          name: 'shops',
          roles: ['*'],
          link: '/account/shops'
        },
        {
          name: 'payments',
          roles: ['*'],
          link: '/account/bill'
        }
      ]
    });
  }

  selected(): void {
    this.configs.selectedModuleName = 'Account';
  }
}
