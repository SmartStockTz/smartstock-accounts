import { PaymentModel } from "../models/payment.model";
import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { BillingService } from "../services/billing.service";
import { LogService } from "smartstock-core";

@Component({
  selector: "app-receipt",
  template: `
    <mat-card class="">
      <mat-list *ngIf="!receiptProgressFlag">
        <mat-list-item *ngFor="let receipt of receipts">
          <h1 matLine>{{ receipt.receipt }}</h1>
          <p matLine>
            {{ receipt.amount | currency: "TZS " }} via {{ receipt.mobile }}
          </p>
          <p matSuffix>{{ receipt.date | date }}</p>
        </mat-list-item>
      </mat-list>
      <app-data-not-ready
        style="padding: 16px"
        *ngIf="receiptProgressFlag"
        [isLoading]="receiptProgressFlag"
      ></app-data-not-ready>
    </mat-card>
  `,
  styleUrls: ["../styles/receipt.style.scss"]
})
export class ReceiptComponent implements OnInit, OnDestroy, AfterViewInit {
  receipts: PaymentModel[];
  receiptProgressFlag = false;

  constructor(
    public readonly billingApi: BillingService,
    public readonly logger: LogService
  ) {} // end

  async ngOnInit(): Promise<void> {
    await this.getReceipts();
  }

  async getReceipts(): Promise<void> {
    this.receiptProgressFlag = true;
    this.billingApi
      .getReceipt()
      .then((value) => {
        this.receiptProgressFlag = false;
        this.receipts = value.map<PaymentModel>((receipt) => {
          return {
            amount: receipt.amount,
            date: receipt.timestamp,
            id: receipt.id,
            mobile: receipt.msisdn,
            receipt: receipt.receipt
          };
        });
      })
      .catch((reason) => {
        this.receiptProgressFlag = false;
        this.logger.i(reason);
      });
  }

  async ngAfterViewInit(): Promise<void> {}

  async ngOnDestroy(): Promise<void> {}
}
