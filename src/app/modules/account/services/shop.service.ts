import {functions} from 'bfast';
import {Injectable} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {StorageService, UserService} from '@smartstocktz/core-libs';
import {ShopModel} from '../models/shop.model';


@Injectable({
  providedIn: 'any'
})
export class ShopService {
  constructor(private readonly httpClient: HttpClient,
              private readonly userService: UserService,
              private readonly storageService: StorageService) {
  }


  async createShop(shop: ShopModel): Promise<any> {
    const user = await this.userService.currentUser();
    return functions().request(`/shop`).post({
      user_id: user.id,
      shop
    });
  }

  async deleteShop(shopProjectId: string): Promise<any> {
    const user = await this.userService.currentUser();
    return functions().request(`/shop`).delete({
      data: {
        user_id: user.id,
        project_id: shopProjectId
      }
    });
  }

  async users(): Promise<any> {
    const shop = await this.userService.currentUser();
    return functions().request(`/shop/${shop.projectId}/users`).get();
  }
}

