import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "smartstock-core";

@Injectable({
  providedIn: "root"
})
export class ActiveShopGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Promise(async (resolve, reject) => {
      try {
        const activeShop = await this.userService.getCurrentShop();
        if (activeShop && activeShop.projectId && activeShop.applicationId) {
          resolve(true);
        } else {
          this.router
            .navigateByUrl("/account/shop")
            .catch((reason) => console.log(reason));
          reject(false);
        }
      } catch (e) {
        this.router
          .navigateByUrl("/account/shop")
          .catch((reason) => console.log(reason));
        reject(false);
      }
    });
  }
}
