import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'any'
})

export class UserState {
  selectedUser: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() {
  }
}
