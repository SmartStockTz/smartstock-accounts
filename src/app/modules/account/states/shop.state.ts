import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ShopService} from '../services/shop.service';


@Injectable({
  providedIn: 'root'
})
export class ShopState {
  constructor(private readonly shopService: ShopService) {
  }

  loadUsers: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  async users(): Promise<any> {
    this.loadUsers.next(true);
    return this.shopService.users().then(_users => {
      return _users;
    }).finally(() => {
      this.loadUsers.next(false);
    });
  }
}

