import {Injectable} from '@angular/core';
import {functions} from 'bfast';
import {UserService} from '@smartstocktz/core-libs';
import {ShopModel} from '../models/shop.model';

@Injectable({
  providedIn: 'root'
})

export class SettingsService {
  constructor(private readonly userService: UserService) {
  }

  async updateEcommerceDetails(ecommerce: any, shop: any): Promise<any> {
    return functions().request('/shop/' + shop.projectId + '/ecommerce').put(ecommerce, {
      headers: {}
    }).then((_: any) => {
      return ecommerce;
    });
  }

  async updateGeneralSettings(settings: any, shop: any): Promise<any> {
    return functions().request('/shop/' + shop.projectId + '/settings').put(settings, {
      headers: {}
    }).then((_: any) => {
      return settings;
    });
  }

  async updateSelectedShop(selectedShop: ShopModel): Promise<void> {
    this.userService.currentUser().then(user => {
      return this.userService.getShops(user);
    }).then(async shops => {
      return this.userService.updateShops(shops.map((x: any) => {
          if (x.projectId === selectedShop.projectId) {
            return selectedShop;
          } else {
            return x;
          }
        })
        , await this.userService.currentUser());
    }).catch(_ => {
    });
  }
}
