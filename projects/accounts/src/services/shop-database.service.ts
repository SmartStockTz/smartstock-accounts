import {Injectable} from '@angular/core';
import {ShopModel} from '../models/shop.model';
import {HttpClient} from '@angular/common/http';
import {SettingsService, StorageService} from '@smartstocktz/core-libs';

@Injectable()
export class ShopDatabaseService {

  constructor(private readonly httpClient: HttpClient,
              private readonly storageService: StorageService,
              private readonly settingsService: SettingsService) {
  }

  createShop(shop: ShopModel): Promise<ShopModel> {
    return new Promise<ShopModel>(async (resolve, reject) => {
      try {
        const user = await this.storageService.getActiveUser();
        this.httpClient.post<ShopModel>(this.settingsService.ssmFunctionsURL + '/shops/' + user.id, shop, {
          headers: this.settingsService.ssmFunctionsHeader
        }).subscribe(value => {
          resolve(value);
        }, error => {
          reject(error);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
