import {Injectable} from '@angular/core';
import {BillingService} from '../services/billing.service';
import {BehaviorSubject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class BillingState {
  loading = new BehaviorSubject(false);
  subs = new BehaviorSubject({subscription: false, balance: 0, reason: 'N/A'});
  cost = new BehaviorSubject({mode: 12, cost: 0});
  reference = new BehaviorSubject('');

  constructor(private readonly billingService: BillingService,
              private readonly snack: MatSnackBar) {
  }

  fetch(): void {
    this.loading.next(true);
    this.billingService.subscription().then(s => {
      this.subs.next(s);
      return this.billingService.monthlyCost();
    }).then(c => {
      this.cost.next(c);
      return this.billingService.getPaymentReference();
    }).then(r => {
      this.reference.next(r.reference);
    }).catch(reason => {
      this.snack.open(reason ? reason.message : 'Fail to process payments', 'Ok', {
        duration: 2000
      });
    }).finally(() => {
      this.loading.next(false);
    });
  }

  dispose(): void {
    this.loading.next(false);
    this.subs.next({subscription: false, balance: 0, reason: 'LOADING'});
    this.cost.next({mode: 12, cost: 0});
    this.reference.next('');
  }
}
