import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {getDaasAddress, getFaasAddress, UserService} from '@smartstocktz/core-libs';
import {init} from 'bfast';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService,
              private readonly router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve, reject) => {
      this.userService.currentUser().then(async shop => {
        if (shop) {
          init({
            applicationId: shop.applicationId,
            projectId: shop.projectId,
            databaseURL: getDaasAddress(shop),
            functionsURL: getFaasAddress(shop)
          }, shop.projectId);
          resolve(true);
        } else {
          this.router.navigateByUrl('/account/login').catch(console.log);
          reject(false);
        }
      }).catch(_ => {
        this.router.navigateByUrl('/account/login').catch(console.log);
        reject(false);
      });
    });
  }

}
