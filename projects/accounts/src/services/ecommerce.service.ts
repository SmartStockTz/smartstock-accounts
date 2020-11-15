import {Injectable} from '@angular/core';
import {EcommerceModel} from '../models/ecommerce.model';
import {BFast} from 'bfastjs';
import {ShopModel} from '../models/shop.model';
import {StorageService} from '@smartstocktz/core-libs';

@Injectable({
  providedIn: 'any'
})

export class EcommerceService {
  constructor(private readonly storageService: StorageService) {
  }

  async updateEcommerceDetails(ecommerce: EcommerceModel, shop: ShopModel): Promise<any> {
    return BFast.functions().request('/ecommerce/' + shop.projectId).put(ecommerce, {
      headers: {}
    }).then((_: any) => {
      shop.ecommerce = ecommerce;
      return shop.ecommerce;
      // return this.storageService.saveActiveShop(shop as any);
    });
  }
}
