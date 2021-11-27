import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {functions} from 'bfast';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MobilePaymentModel} from '../models/mobile-payment.model';
import {CostModel} from '../models/cost.model';
import {BillingState} from '../states/billing.state';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-payment-modes',
  template: `
    <div class="line payment-mode-container">
      <span class="invoice-number">Payments Modes</span>
      <span class="line-space"></span>
    </div>
    <mat-tab-group class="t" mat-align-tabs="center">

      <mat-tab label="Mobile">
        <div style="margin-bottom: 24px"></div>
        <app-payment-modes-mobile [mode]="mobile" *ngFor="let mobile of mobileModes"></app-payment-modes-mobile>
      </mat-tab>

      <mat-tab label="Visa / MasterCard">
        <div class="card-container">
          <div class="invoice-number card-item">Total</div>
          <div class="invoice-number-body card-item">Tsh {{cost.cost | number}}</div>
          <button [disabled]="loadCardUrl" (click)="payCard()" class="card-item" color="primary" mat-flat-button>
            Pay with VISA / Mastercard
            <mat-progress-spinner *ngIf="loadCardUrl" diameter="20" color="primary"
                                  mode="indeterminate" style="display: inline-block">
            </mat-progress-spinner>
          </button>
        </div>
      </mat-tab>

    </mat-tab-group>
  `,
  styleUrls: ['../styles/order-header.style.scss']
})

export class PaymentModesComponent implements OnInit, OnDestroy {
  cost: CostModel = {cost: 0, mode: 12};
  reference = '';
  link = '';
  loadCardUrl = false;
  mobileModes: MobilePaymentModel[];
  private destroyer = new Subject();

  constructor(private readonly snack: MatSnackBar,
              private readonly billingState: BillingState) {
  }

  ngOnInit(): void {
    this.billingState.cost.pipe(takeUntil(this.destroyer)).subscribe({
      next: value => {
        this.cost = value;
        this.mobileModes = this.getModes();
      }
    });
    this.billingState.reference.pipe(takeUntil(this.destroyer)).subscribe({
      next: value => {
        this.reference = value;
        this.mobileModes = this.getModes();
      }
    });
    this.mobileModes = this.getModes();
  }

  private getModes(): any[] {
    return [
      {
        name: 'M-PESA',
        logo: 'https://smartstock-daas.bfast.fahamutech.com/storage/smartstock_lb/file/716e2e54-739d-495c-9500-4c3d4c16ff8b/thumbnail?width=132',
        total: this.cost.cost,
        reference: this.reference,
        instructions: [
          '1. Piga *150*00#',
          '2. Chagua namba 4',
          '3. Chagua namba 4',
          '4. Weka <b>400700</b> kama namba ya kampuni',
          `5. Weka <b>${this.reference}</b> kama kumbukumbu namba`,
          `6. Weka <b>${this.cost.cost}</b> kama kiasi`,
          '7. Weka namba ya siri',
          '8. Jina kampuni litatokea MLIPA, Thibitisha'
        ].join('<br>')
      },
      {
        name: 'TIGO-PESA',
        logo: 'https://smartstock-daas.bfast.fahamutech.com/storage/smartstock_lb/file/d028828e-add6-4590-b6a1-0627a837ebe1/thumbnail?width=132',
        total: this.cost.cost,
        reference: this.reference,
        instructions: [
          '1. Piga *150*01#',
          '2. Chagua namba 4',
          '3. Chagua namba 3',
          '4. Weka <b>400700</b> kama namba ya kampuni',
          `5. Weka <b>${this.reference}</b> kama kumbukumbu namba`,
          `6. Weka <b>${this.cost.cost}</b> kama kiasi`,
          '7. Weka namba ya siri'
        ].join('<br>')
      },
      {
        name: 'HALO-PESA',
        logo: 'https://smartstock-daas.bfast.fahamutech.com/storage/smartstock_lb/file/4885b5d1-f2df-4a2b-833c-eb7857763429/thumbnail?width=132',
        total: this.cost.cost,
        reference: this.reference,
        instructions: [
          '1. Piga *150*88#',
          '2. Chagua namba 4',
          '3. Chagua namba 3',
          '4. Weka <b>400700</b> kama namba ya kampuni',
          `5. Weka <b>${this.reference}</b> kama kumbukumbu namba`,
          `6. Weka <b>${this.cost.cost}</b> kama kiasi`,
          '7. Weka namba ya siri',
          '8. Thibitisha'
        ].join('<br>')
      },
      {
        name: 'AIRTEL-MONEY',
        logo: 'https://smartstock-daas.bfast.fahamutech.com/storage/smartstock_lb/file/6130c062-f6fd-4617-8ee8-9adac4b9a830/thumbnail?width=132',
        total: this.cost.cost,
        reference: this.reference,
        instructions: [
          '1. Piga *150*60#',
          '2. Chagua namba 5',
          '3. Chagua namba 4',
          '4. Weka <b>400700</b> kama namba ya kampuni',
          `5. Weka <b>${this.cost.cost}</b> kama kiasi`,
          `6. Weka <b>${this.reference}</b> kama kumbukumbu namba`,
          '7. Weka namba ya siri',
          '8. Thibitisha'
        ].join('<br>')
      }
    ];
  }

  payCard(): void {
    const mobile = encodeURIComponent('255764943055');
    const reference = encodeURIComponent(this.reference);
    this.link = `https://fahamupay-faas.bfast.fahamutech.com/functions/pay/card?mobile=${mobile}&reference=${reference}&amount=${this.cost.cost}`;
    this.loadCardUrl = true;
    functions().request(this.link).get().then(value => {
      // @ts-ignore
      window.open(value ? value.url : '', 'blank');
    }).catch(reason => {
      console.log(reason);
      this.snack.open(reason ? reason.message : reason.toString(), 'Ok', {
        duration: 2000
      });
    }).finally(() => {
      this.loadCardUrl = false;
    });
  }

  ngOnDestroy(): void {
    this.destroyer.next('done');
  }
}
