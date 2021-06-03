import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BillingService} from '../services/billing.service';
import {DeviceInfoUtil, LogService, UserService} from '@smartstocktz/core-libs';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MobilePayDetailsComponent} from '../components/mobile-pay-details.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-billing',
  template: `
    <mat-sidenav-container class="match-parent">
      <mat-sidenav class="match-parent-side"
                   [fixedInViewport]="true"
                   #sidenav
                   [mode]="enoughWidth()?'side':'over'"
                   [opened]="!isMobile">
        <app-drawer></app-drawer>
      </mat-sidenav>

      <mat-sidenav-content>
        <app-toolbar [heading]="'Bills'"
                     [sidenav]="sidenav"
                     [showProgress]="false"
                     [backLink]="'/account'"
                     [hasBackRoute]="isMobile">
        </app-toolbar>

        <div [ngClass]="isMobile?'container-fluid':'container my-billing-wrapper'">

          <div [ngClass]="isMobile?'col-12':'col-12 col-lg-10 col-xl-10 offset-xl-1 offset-lg-1 offset-md-0 offset-sm-0'">
            <div style="padding-top: 16px">
              <h2>Your Month Total Payment For All Shops</h2>
              <h1 *ngIf="!costFlag">{{monthCost | currency: 'TZS '}}</h1>
              <mat-progress-spinner color="primary" diameter="30" mode="indeterminate" *ngIf="costFlag"></mat-progress-spinner>
            </div>
            <hr>
            <div>
              <!--              <p style="padding: 10px 0">-->
              <!--                Billing-->
              <!--              </p>-->
            </div>

            <div class="row" style="margin-bottom: 16px">
              <div style="margin-bottom: 8px" class="col-12 col-md-6 col-xl-6 col-sm-12 col-lg-6">
                <app-dash-card [content]="subscription" [title]="'Subscription'"
                               [height]="250"
                               [description]="'your subscription status'">
                  <ng-template #subscription>
                    <div style="display: flex; height: 100%; justify-content: center; align-items: center">
                      <span *ngIf="!subscriptionFlag" style="font-size: 30px; text-space: 2px">
                        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center">
                            <span style="font-size: 20px; margin-right: 4px"
                                  class="text-{{subStatus===true?'success':'danger'}}">{{subStatus === true ? 'ACTIVE' : 'NOT ACTIVE'}}</span>
                            <div style="display: inline-block; width: 18px; height: 18px"
                                 class="spinner-grow text-{{subStatus===true?'success':'danger'}}" role="status"></div>
                            <span style="font-size: 15px; padding-top: 8px">{{subMessage}}</span>
                        </div>
                      </span>
                      <app-data-not-ready *ngIf="subscriptionFlag"
                                          [isLoading]="subscriptionFlag"
                                          [height]="100"
                                          [width]="100"></app-data-not-ready>
                    </div>
                  </ng-template>
                </app-dash-card>
              </div>
              <div style="margin-bottom: 8px" class="col-12 col-md-6 col-xl-6 col-sm-12 col-lg-6">
                <app-dash-card [content]="reference" [title]="'Reference'"
                               [height]="250"
                               [description]="'Your payment reference number'">
                  <ng-template #reference>
                    <div style="display: flex; height: 100%; justify-content: center; align-items: center">
                  <span *ngIf="!referenceFetchFlag" style="font-size: 30px; text-space: 2px">
                    {{referenceNumber}}
                  </span>
                      <app-data-not-ready *ngIf="referenceFetchFlag"
                                          [isLoading]="referenceFetchFlag"
                                          [height]="100"
                                          [width]="100"></app-data-not-ready>
                    </div>
                  </ng-template>
                </app-dash-card>
              </div>
            </div>

            <div>
              <!--                            <div>-->
              <!--                              <p style="padding: 10px 0">-->
              <!--                                Payments-->
              <!--                              </p>-->
              <!--                            </div>-->

              <div style="margin-bottom: 16px" class="row">
                <button *ngIf="!subscriptionFlag" (click)="refresh()" mat-stroked-button class="btn-block" color="primary">
                  Update Status
                </button>
              </div>
            </div>

            <div class="" style="margin-bottom: 16px">
              <mat-tab-group>
                <mat-tab label="How To Pay">
                  <div style="padding: 16px">
                    <h3 style="margin-top: 16px">How To Pay With Visa & MasterCard</h3>
                    <hr>
                    <div class="row">
                      <div class="col-12">
                        <img style="height: 80px" alt="VISA" src="./assets/img/masterandvisacard.png">
                        <div style="padding-top: 8px">
                          <p>To pay using mastercard or visa, enter your valid phone number below and click "pay with card" button.
                            After you successfull pay come after you press the button come back and press "Update status button".</p>
                          <form (ngSubmit)="payByCard()" [formGroup]="cardForm">
                            <mat-form-field appearance="outline" style="width: 100%">
                              <mat-label>Mobile</mat-label>
                              <input matInput type="number" min="0" required formControlName="mobile">
                              <mat-error>Your mobile number required</mat-error>
                            </mat-form-field>
                            <button [disabled]="subscriptionFlag || cardPayUrlFlag" mat-raised-button color="primary">
                              PAY WITH CARD
                              <mat-progress-spinner *ngIf="cardPayUrlFlag" mode="indeterminate" color="primary" diameter="20"
                                                    style="display: inline-block"></mat-progress-spinner>
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  <app-billing-how-to-pay [cost]="monthCost.toString()"
                                          [reference]="referenceNumber"></app-billing-how-to-pay>
                </mat-tab>
                <mat-tab label="Receipts">
                  <app-billing-receipts></app-billing-receipts>
                </mat-tab>
              </mat-tab-group>
            </div>

          </div>

        </div>

      </mat-sidenav-content>

    </mat-sidenav-container>
  `,
  styleUrls: ['../styles/billing.style.scss']
})
export class BillingPage extends DeviceInfoUtil implements OnInit {
  isMobilePay = true;
  isMobile = false;
  referenceNumber: string;
  getReferenceNumberFlag = false;
  referenceFetchFlag = false;
  subscriptionFlag = false;
  subStatus = false;
  subMessage = '';
  dueBill: number;
  costFlag = false;
  monthCost = 0;
  cardForm: FormGroup;
  cardPayUrlFlag = false;

  constructor(private readonly billingApi: BillingService,
              private readonly bottomSheet: MatBottomSheet,
              private readonly formBuilder: FormBuilder,
              private readonly snack: MatSnackBar,
              private readonly userService: UserService,
              private readonly logger: LogService) {
    super();
    document.title = 'SmartStock - Bills';
  }

  ngOnInit(): void {
    this.cardForm = this.formBuilder.group({
      mobile: ['', [Validators.minLength(9)]],
      reference: ['0235'],
      amount: ['0']
    });
    this.userService.currentUser().then(value => {
      if (value && value.mobile) {
        this.cardForm.get('mobile').setValue(value.mobile);
      }
    }).catch(_ => {
    });
    this.getCost();
    this.getSubscription();
    this.getPaymentReference();
  }

  getPaymentReference(): void {
    this.referenceFetchFlag = true;
    this.billingApi.getPaymentReference().then(value => {
      this.referenceFetchFlag = false;
      this.referenceNumber = value.reference;
      this.cardForm.get('reference').setValue(value.reference);
    }).catch(_ => {
      this.referenceFetchFlag = false;
      this.logger.i(_);
    });
  }

  refresh(): void {
    this.getSubscription();
    this.getPaymentReference();
    this.getCost();
  }

  getSubscription(): void {
    this.subscriptionFlag = true;
    this.billingApi.subscription().then(value => {
      this.subscriptionFlag = false;
      this.subStatus = value.subscription;
      this.subMessage = value.reason;
    }).catch(_ => {
      this.subscriptionFlag = false;
      this.logger.i(_);
    });
  }

  getCost(): void {
    this.costFlag = true;
    this.billingApi.monthlyCost().then(value => {
      this.costFlag = false;
      this.monthCost = value.cost;
      this.cardForm.get('amount').setValue(value.cost);
    }).catch(_ => {
      this.costFlag = false;
      this.logger.i(_);
    });
  }

  mobilePay(): void {
    this.bottomSheet.open(MobilePayDetailsComponent, {
      autoFocus: true,
      closeOnNavigation: false,
      data: {
        ref: this.referenceNumber,
        amount: this.dueBill
      }
    }).afterDismissed().subscribe(value => {
      if (value === true) {
        this.getSubscription();
        //  this.getUnInvoicedBalance();
      }
    });
  }

  payByCard(): void {
    if (this.referenceNumber && this.monthCost) {
      if (this.cardForm.valid) {
        this.cardPayUrlFlag = true;
        this.billingApi.payByCard(this.cardForm.value).then(async value => {
          // if (typeof process !== 'undefined' && process.env && process.env.IS_DESKTOP_SSM === '1') {
          //   try {
          //     await require('electron').shell.openExternal(value);
          //   } catch (e) {
          //     window.open(value, '_blank');
          //   }
          // } else {
          window.open(value, '_blank');
          // }
        }).catch(reason => {
          console.log(reason);
          this.snack.open(reason && reason.message ? reason.message : reason.toString(), 'Ok', {
            duration: 2000
          });
        }).finally(() => {
          this.cardPayUrlFlag = false;
        });
      }
    } else {
      this.snack.open('Reference number and/or monthly cost is unavailable, press "Update Status" button to refresh',
        'Refresh Now', {
          duration: 6000
        }).onAction().subscribe(value => {
        this.refresh();
      });
    }
  }
}
