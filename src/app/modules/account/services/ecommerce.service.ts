import {Injectable} from '@angular/core';
import {functions} from 'bfast';
import {StorageService} from '@smartstocktz/core-libs';

@Injectable({
  providedIn: 'root'
})

export class EcommerceService {
  constructor(private readonly storageService: StorageService) {
  }

  async updateEcommerceDetails(ecommerce: any, shop: any): Promise<any> {
    return functions().request('/ecommerce/' + shop.projectId).put(ecommerce, {
      headers: {}
    }).then((_: any) => {
      shop.ecommerce = ecommerce;
      return shop.ecommerce;
      // return this.storageService.saveActiveShop(shop as any);
    });
  }
}
