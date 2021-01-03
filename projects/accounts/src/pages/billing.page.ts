import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BillingService} from '../services/billing.service';
import {DeviceInfoUtil, LogService} from '@smartstocktz/core-libs';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MobilePayDetailsComponent} from '../components/mobile-pay-details.component';

@Component({
  selector: 'smartstock-billing',
  template: `
    <mat-sidenav-container class="match-parent">
      <mat-sidenav class="match-parent-side"
                   [fixedInViewport]="true"
                   #sidenav
                   [mode]="enoughWidth()?'side':'over'"
                   [opened]="!isMobile">
        <smartstock-drawer></smartstock-drawer>
      </mat-sidenav>

      <mat-sidenav-content>
        <smartstock-toolbar [heading]="'Bills'"
                            [sidenav]="sidenav"
                            [showProgress]="false"
                            [backLink]="'/account'"
                            [hasBackRoute]="isMobile">
        </smartstock-toolbar>

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
                <smartstock-dash-card [content]="subscription" [title]="'Subscription'"
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
                      <smartstock-data-not-ready *ngIf="subscriptionFlag"
                                                 [isLoading]="subscriptionFlag"
                                                 [height]="100"
                                                 [width]="100"></smartstock-data-not-ready>
                    </div>
                  </ng-template>
                </smartstock-dash-card>
              </div>
              <div style="margin-bottom: 8px" class="col-12 col-md-6 col-xl-6 col-sm-12 col-lg-6">
                <smartstock-dash-card [content]="reference" [title]="'Reference'"
                                      [height]="250"
                                      [description]="'Your payment reference number'">
                  <ng-template #reference>
                    <div style="display: flex; height: 100%; justify-content: center; align-items: center">
                  <span *ngIf="!referenceFetchFlag" style="font-size: 30px; text-space: 2px">
                    {{referenceNumber}}
                  </span>
                      <smartstock-data-not-ready *ngIf="referenceFetchFlag"
                                                 [isLoading]="referenceFetchFlag"
                                                 [height]="100"
                                                 [width]="100"></smartstock-data-not-ready>
                    </div>
                  </ng-template>
                </smartstock-dash-card>
              </div>
            </div>

            <div>
              <!--                            <div>-->
              <!--                              <p style="padding: 10px 0">-->
              <!--                                Payments-->
              <!--                              </p>-->
              <!--                            </div>-->

              <div style="margin-bottom: 16px" class="row">
                <button *ngIf="!subscriptionFlag" (click)="getSubscription()" mat-flat-button class="btn-block" color="primary">
                  Update Status
                </button>
              </div>
            </div>

            <div class="" style="margin-bottom: 16px">
              <mat-tab-group>
                <mat-tab label="How To Pay">
                  <smartstock-billing-how-to-pay [cost]="monthCost" [reference]="referenceNumber"></smartstock-billing-how-to-pay>
                </mat-tab>
                <mat-tab label="Receipts">
                  <smartstock-billing-receipts></smartstock-billing-receipts>
                </mat-tab>
              </mat-tab-group>
            </div>

          </div>

        </div>

      </mat-sidenav-content>

    </mat-sidenav-container>
  `,
  styleUrls: ['../style/billing.style.scss']
})
export class BillingPage extends DeviceInfoUtil implements OnInit {
  isMobilePay = true;
  amountFormControl = new FormControl(0);
  isMobile = false;
  referenceNumber: string;
  getReferenceNumberFlag = false;
  referenceFetchFlag = false;
  subscriptionFlag = false;
  subStatus = false;
  subMessage = '';
  dueBill: number;
  costFlag = false;
  monthCost = 30000;

  constructor(private readonly billingApi: BillingService,
              private readonly bottomSheet: MatBottomSheet,
              private readonly logger: LogService) {
    super();
  }

  ngOnInit(): void {
    this.getCost();
    this.getSubscription();
    this.getPaymentReference();
  }

  getPaymentReference(): void {
    this.referenceFetchFlag = true;
    this.billingApi.getPaymentReference().then(value => {
      this.referenceFetchFlag = false;
      this.referenceNumber = value.reference;
    }).catch(_ => {
      this.referenceFetchFlag = false;
      this.logger.i(_);
    });
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
}
