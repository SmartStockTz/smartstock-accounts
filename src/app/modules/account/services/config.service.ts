import {ConfigsService} from '@smartstocktz/core-libs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'any'
})
export class ConfigService {
  constructor(private readonly configsService: ConfigsService) {
  } // end

  async addMenu(menu: any): Promise<any> {
    this.configsService.addMenu(menu);
  }

  async selectedModuleName(name): Promise<any> {
    this.configsService.selectedModuleName = name;
  }
}
