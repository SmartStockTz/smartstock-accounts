import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ShopService} from '../services/shop.service';
import {MessageService, UserService} from '@smartstocktz/core-libs';


@Injectable({
  providedIn: 'root'
})
export class ShopState {
  loadUsers = new BehaviorSubject<boolean>(false);
  loadShops = new BehaviorSubject<boolean>(false);
  shops = new BehaviorSubject([]);

  constructor(private readonly shopService: ShopService,
              private messageService: MessageService,
              private readonly userService: UserService) {
  }

  async users(): Promise<any> {
    this.loadUsers.next(true);
    return this.shopService.users().finally(() => {
      this.loadUsers.next(false);
    });
  }

  fetchShops(): void {
    this.loadShops.next(true);
    this.userService.currentUser().then(user => {
      return this.userService.getShops(user);
    }).then(v => {
      if (Array.isArray(v)) {
        this.shops.next(v);
      }
    }).catch(reason => {
      this.messageService.showMobileInfoMessage(reason && reason.message ?
        reason.message : reason.toString(), 2000, 'bottom');
    }).finally(() => {
      this.loadShops.next(false);
    });
  }

  dispose(): void {
    this.loadUsers.next(false);
    this.loadShops.next(false);
    this.shops.next([]);
  }
}
