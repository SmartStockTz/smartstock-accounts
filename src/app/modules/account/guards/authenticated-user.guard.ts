import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {StorageService, UserService} from '@smartstocktz/core-libs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedUserGuard implements CanActivate {
  constructor(private readonly storageService: StorageService,
              private readonly userService: UserService,
              private readonly router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve, reject) => {
      this.userService.currentUser().then(value => {
        if (value && value.role === 'admin') {
          this.router.navigateByUrl('/dashboard').catch(reason => console.log(reason));
        } else if (value && value.role === 'online') {
          this.router.navigateByUrl('/').catch(reason => console.log(reason));
        } else if (value && value.role === 'user') {
          this.router.navigateByUrl('/sale').catch(reason => console.log(reason));
        }else if (value && value.role === 'manager') {
          this.router.navigateByUrl('/sale').catch(reason => console.log(reason));
        } else {
          resolve(true);
        }
      }).catch(_ => {
        this.router.navigateByUrl('/account/login').catch(reason => console.log(reason));
        reject(false);
      });
    });
  }

}
