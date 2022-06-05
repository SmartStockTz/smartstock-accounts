import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { functions } from 'bfast';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MobilePaymentModel } from '../models/mobile-payment.model';
import { CostModel } from '../models/cost.model';
import { BillingState } from '../states/billing.state';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-payment-modes',
  template: `
    <div class="line payment-mode-container">
      <span class="invoice-number">Payments Modes</span>
      <span class="line-space"></span>
    </div>
    <mat-tab-group class="t" mat-align-tabs="center">

      <mat-tab label="Mitandao ya simu">
        <div style="margin-bottom: 24px"></div>
        <app-payment-modes-mobile [mode]="mobile" *ngFor="let mobile of mobileModes"></app-payment-modes-mobile>
      </mat-tab>

      <mat-tab label="Benki">
        <div style="margin-bottom: 24px"></div>
        <app-payment-modes-mobile [mode]="benki" *ngFor="let benki of benkiModes"></app-payment-modes-mobile>
      </mat-tab>

    </mat-tab-group>
  `,
  styleUrls: ['../styles/order-header.style.scss']
})

export class PaymentModesComponent implements OnInit, OnDestroy {
  cost: CostModel = { cost: 0, mode: 12 };
  reference = '6829508';
  link = '';
  loadCardUrl = false;
  mobileModes: MobilePaymentModel[] = [];
  benkiModes: MobilePaymentModel[] = [];
  private destroyer = new Subject();

  constructor(private readonly snack: MatSnackBar,
    private readonly billingState: BillingState) {
  }

  ngOnInit(): void {
    this.billingState.cost.pipe(takeUntil(this.destroyer)).subscribe({
      next: value => {
        this.cost = value;
        this.mobileModes = this.getModes();
        this.benkiModes = this.getBenkiModes();
      }
    });
    this.billingState.reference.pipe(takeUntil(this.destroyer)).subscribe({
      next: value => {
        this.reference = value;
        this.mobileModes = this.getModes();
        this.benkiModes = this.getBenkiModes();
      }
    });
    this.mobileModes = this.getModes();
    this.benkiModes = this.getBenkiModes();
  }

  private getBenkiModes() {
    return [
      {
        name: 'BENKI ZOTE',
        logo: 'https://smartstock-daas.bfast.fahamutech.com/storage/smartstock_lb/file/d028828e-add6-4590-b6a1-0627a837ebe1/thumbnail?width=132',
        total: this.cost.cost,
        reference: this.reference,
        instructions: [
          '1. Fungua menu ya huduma za kifedha.',
          '2. Chagua Tuma Pesa.',
          '3. Chagua kwenda mitandao ya simu.',
          '4. Chagua Tigo Pesa.',
          '5. Ingiza <b>6829508</b> kama namba ya simu.',
          `6. Ingiza <b>${this.cost.cost}</b> kama kiasi.`,
          '7. Weka namba ya siri kusibitisha, jina litakuja SMARTSTOCK COMPANY LIMITED.'
        ].join('<br>')
      }
    ]
  }

  private getModes(): any[] {
    return [
      {
        name: 'TIGO-PESA',
        logo: 'https://smartstock-daas.bfast.fahamutech.com/storage/smartstock_lb/file/d028828e-add6-4590-b6a1-0627a837ebe1/thumbnail?width=132',
        total: this.cost.cost,
        reference: this.reference,
        instructions: [
          '1. Ingia kwenye menu ya Tigo Pesa, *150*01#',
          '2. Chagua 5 "Lipa kwa simu".',
          '3. Chagua namaba 1 "kwa Tigo Pesa".',
          '3. Weka <b>6829508</b> kama lipa namba.',
          `4. Weka <b>${this.cost.cost}</b> kama kiasi.`,
          '5. Jina litakuja SMARTSTOCK COMPANY LIMITED, weka namba ya siri kusibitisha.',
        ].join('<br>')
      },
      {
        name: 'MITANDAO MINGINE',
        logo: 'https://smartstock-daas.bfast.fahamutech.com/storage/smartstock_lb/file/4885b5d1-f2df-4a2b-833c-eb7857763429/thumbnail?width=132',
        total: this.cost.cost,
        reference: this.reference,
        instructions: [
          'Piga menu yako ya huduma za kifedha.',
          '1. Chagua tuma pesa.',
          '2. Chagua kwenda mitandao mingine.',
          '3. Chagua Tigo Pesa.',
          '4. Ingiza <b>6829508</b> kama namba ya simu.',
          `5. Ingiza <b>${this.cost.cost}</b> kama kiasi.`,
          '6. Ingiza namba ya siri, jina litakuja SMARTSTOCK COMPANY LIMITED.',
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
