import {Component, OnInit} from '@angular/core';
import {BillingState} from '../states/billing.state';

@Component({
  selector: 'app-payment',
  template: `
    <mat-progress-bar mode="indeterminate" color="primary" *ngIf="billingState.loading.value"></mat-progress-bar>
    <div class="payment-container">
      <div class="payment-container-item">
        <app-payment-header [cost]="billingState.cost | async"
                            [reference]="billingState.reference | async"
                            [subs]="billingState.subs |async">
        </app-payment-header>
        <app-payment-modes></app-payment-modes>
      </div>
    </div>
  `,
  styleUrls: ['../styles/payment.style.scss']
})
export class PaymentComponent implements OnInit {
  constructor(public readonly billingState: BillingState) {
  }

  ngOnInit(): void {
    this.billingState.fetch();
  }
}
