import {PaymentModel} from '../models/payment.model';
import {Component, OnInit} from '@angular/core';
import {BillingService} from '../services/billing.service';
import {LogService} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-billing-receipts',
  template: `
    <mat-card class="">
      <mat-list *ngIf="!receiptProgressFlag">
        <mat-list-item *ngFor="let receipt of receipts">
          <h1 matLine>{{receipt.receipt}}</h1>
          <p matLine>{{receipt.amount | currency:'TZS '}} via {{receipt.mobile}}</p>
          <p matSuffix>{{receipt.date | date}}</p>
        </mat-list-item>
      </mat-list>
      <app-data-not-ready style="padding: 16px" *ngIf="receiptProgressFlag"
                                 [isLoading]="receiptProgressFlag"></app-data-not-ready>
    </mat-card>
  `,
  styleUrls: ['../style/receipt.style.scss']
})
export class ReceiptsComponent implements OnInit {

  receipts: PaymentModel[];
  receiptProgressFlag = false;

  constructor(private readonly billingApi: BillingService,
              private readonly logger: LogService) {
  }

  ngOnInit(): void {
    this.getReceipts();
  }

  getReceipts(): void {
    this.receiptProgressFlag = true;
    this.billingApi.getReceipt().then(value => {
      this.receiptProgressFlag = false;
      this.receipts = value.map<PaymentModel>(receipt => {
        return {
          amount: receipt.amount,
          date: receipt.timestamp,
          id: receipt.id,
          mobile: receipt.msisdn,
          receipt: receipt.receipt
        };
      });
    }).catch(reason => {
      this.receiptProgressFlag = false;
      this.logger.i(reason);
    });
  }

}
