import {bfast} from 'bfastjs';
import {Injectable} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {StorageService} from '@smartstocktz/core-libs';
import {ShopModel} from '../models/shop.model';


@Injectable({
  providedIn: 'any'
})
export class ShopService {
  constructor(private readonly httpClient: HttpClient,
              private readonly storageService: StorageService) {
  }


  async createShop(shop: ShopModel): Promise<any> {
    const user = await this.storageService.getActiveUser();
    return bfast.functions().request(`/shop`).post({
      user_id: user.id,
      shop
    });
  }

  async deleteShop(shopProjectId: string): Promise<any> {
    const user = await this.storageService.getActiveUser();
    return bfast.functions().request(`/shop`).delete({
      data: {
        user_id: user.id,
        project_id: shopProjectId
      }
    });
  }

  async users(): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return bfast.functions().request(`/shop/${shop.projectId}/users`).get();
  }
}

