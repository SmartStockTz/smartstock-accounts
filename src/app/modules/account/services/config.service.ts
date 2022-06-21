import { NavigationService } from "smartstock-core";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ConfigService {
  constructor(private readonly navigationService: NavigationService) {} // end

  async addMenu(menu: any): Promise<any> {
    this.navigationService.addMenu(menu);
  }

  async selectedModuleName(name): Promise<any> {
    this.navigationService.selectedModuleName = name;
  }
}
