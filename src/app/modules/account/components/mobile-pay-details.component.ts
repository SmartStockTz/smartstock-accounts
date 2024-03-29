import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit
} from "@angular/core";
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef
} from "@angular/material/bottom-sheet";
import { UntypedFormControl, Validators } from "@angular/forms";
import { BillingService } from "../services/billing.service";
import { LogService } from "smartstock-core";

// @dynamic
@Component({
  selector: "app-mobile-pay-details",
  template: `
    <!--    <div>-->
    <!--      <div style="display: flex;justify-content: center; align-items: center">-->
    <!--        <p>Payments</p>-->
    <!--      </div>-->
    <!--      <mat-divider></mat-divider>-->
    <!--      <div>-->
    <!--        <div style="padding: 16px;">-->
    <!--          <div>-->
    <!--            <mat-form-field style="width: 100%" appearance="outline">-->
    <!--              <mat-label>Amount To Pay</mat-label>-->
    <!--              <input min="1" [formControl]="amountControl" matInput type="number">-->
    <!--            </mat-form-field>-->
    <!--            <span>Your reference number</span>-->
    <!--            <p *ngIf="reference" style="font-size: 26px; word-spacing: 4px; padding: 8px 0">{{reference}}</p>-->
    <!--            <mat-progress-spinner *ngIf="!reference" mode="indeterminate" [diameter]="30"-->
    <!--                                  color="primary">-->
    <!--            </mat-progress-spinner>-->
    <!--            <button [disabled]="confirmPaymentFlag" style="width: 100%"-->
    <!--                    class="ft-button" (click)="bottomSheet.dismiss(true)" mat-flat-button color="primary">-->
    <!--              Confirm Payment-->
    <!--              <mat-progress-spinner color="primary" mode="indeterminate" [diameter]="30"-->
    <!--                                    style="display: inline-block"-->
    <!--                                    *ngIf="confirmPaymentFlag">-->
    <!--              </mat-progress-spinner>-->
    <!--            </button>-->
    <!--          </div>-->

    <!--        </div>-->

    <!--        <div style="padding: 8px 0">-->
    <!--          <mat-card-subtitle>How To Pay</mat-card-subtitle>-->
    <!--          <p>-->
    <!--            <mat-accordion>-->
    <!--              <mat-expansion-panel>-->
    <!--                <mat-expansion-panel-header>-->
    <!--                  M-PESA-->
    <!--                </mat-expansion-panel-header>-->
    <!--                  <div>-->
    <!--                    <span style="">-->
    <!--                      1. Piga <b>*150*00#</b><br><br>-->
    <!--                      2. Chagua namba <b>4</b><br><br>-->
    <!--                      3. Changua namba <b>4</b><br><br>-->
    <!--                      4. Weka namba hii <b><u>400700</u></b> kama namba ya kampuni<br><br>-->
    <!--                      5. Weka namba hii <b><u>{{payData.ref}}</u></b> kama namba ya kumbukumbu<br><br>-->
    <!--                      6. Weka kiasi hiki <b>{{getAmountToPay()}}</b><br><br>-->
    <!--                      7. Weka namba yako ya siri<br><br>-->
    <!--                      8. Jina la kampuni litatokea MLIPA, kama kila kitu kipo sawa thibitisha kwa kujibu <b>1</b><br><br>-->
    <!--                    </span>-->
    <!--                  </div>-->
    <!--                </mat-expansion-panel>-->
    <!--              <mat-expansion-panel>-->
    <!--                <mat-expansion-panel-header>-->
    <!--                  TIGOPESA-->
    <!--                </mat-expansion-panel-header>-->
    <!--                    <div>-->
    <!--                        <span style="">-->
    <!--                          1. Piga <b>*150*01#</b><br><br>-->
    <!--                          2. Chagua namba <b>4</b><br><br>-->
    <!--                          3. Changua namba <b>3</b><br><br>-->
    <!--                          4. Weka namba hii <b><u>400700</u></b> kama namba ya kampuni<br><br>-->
    <!--                          5. Weka namba hii <b><u>{{payData.ref}}</u></b> kama namba ya kumbukumbu<br><br>-->
    <!--                          6. Weka kiasi hiki <b>{{getAmountToPay()}}</b><br><br>-->
    <!--                          7. Weka namba yako ya siri<br><br>-->
    <!--                        </span>-->
    <!--                    </div>-->
    <!--              </mat-expansion-panel>-->
    <!--              <mat-expansion-panel>-->
    <!--                <mat-expansion-panel-header>-->
    <!--                  HALOPESA-->
    <!--                </mat-expansion-panel-header>-->
    <!--                <div>-->
    <!--            <span style="">-->
    <!--              1. Piga <b>*150*88#</b><br><br>-->
    <!--              2. Chagua namba <b>4</b><br><br>-->
    <!--              3. Changua namba <b>3</b><br><br>-->
    <!--              4. Weka namba hii <b><u>400700</u></b> kama namba ya kampuni<br><br>-->
    <!--              5. Weka namba hii <b><u>{{payData.ref}}</u></b> kama namba ya kumbukumbu<br><br>-->
    <!--              6. Weka kiasi hiki <b>{{getAmountToPay()}}</b><br><br>-->
    <!--              7. Weka namba yako ya siri<br><br>-->
    <!--              8. Kisha thibitisha malipo<br><br>-->
    <!--            </span>-->
    <!--                </div>-->
    <!--              </mat-expansion-panel>-->
    <!--              <mat-expansion-panel>-->
    <!--                <mat-expansion-panel-header>-->
    <!--                  AIRTEL MONEY-->
    <!--                </mat-expansion-panel-header>-->
    <!--                <div>-->
    <!--            <span style="">-->
    <!--              1. Piga <b>*150*60#</b><br><br>-->
    <!--              2. Chagua namba <b>5</b><br><br>-->
    <!--              3. Changua namba <b>4</b><br><br>-->
    <!--              4. Weka namba hii <b><u>400700</u></b> kama namba ya kampuni<br><br>-->
    <!--              5. Weka kiasi hiki <b>{{getAmountToPay()}}</b><br><br>-->
    <!--              6. Weka namba hii <b><u>{{payData.ref}}</u></b> kama namba ya kumbukumbu<br><br>-->
    <!--              7. Weka namba yako ya siri<br><br>-->
    <!--              8. Kisha thibitisha malipo<br><br>-->
    <!--            </span>-->
    <!--                </div>-->
    <!--              </mat-expansion-panel>-->
    <!--            </mat-accordion>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
  `,
  styleUrls: ["../styles/mobile-pay-details.style.scss"]
})
export class MobilePayDetailsComponent
  implements OnInit, OnDestroy, AfterViewInit {
  confirmPaymentFlag = false;
  amountToPay = 0;
  reference: string;
  amountControl = new UntypedFormControl(this.amountToPay, [
    Validators.nullValidator,
    Validators.required,
    Validators.min(1)
  ]);

  constructor(
    public bottomSheet: MatBottomSheetRef<MobilePayDetailsComponent>,
    public readonly billApi: BillingService,
    public readonly changeDetectorRef: ChangeDetectorRef,
    public readonly logger: LogService,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public payData: { ref: string; amount: number }
  ) {}

  async ngOnInit(): Promise<void> {
    this.reference = this.payData.ref;
    // if (!this.reference) {
    //   this.getPaymentReference();
    // }
    this.amountToPay = Math.round(Math.abs(this.payData.amount));
    this.amountControl.setValue(
      this.amountToPay === 0 ? 10000 : this.amountToPay
    );
    // this.getPaymentReference();
  }

  async getPaymentReference(): Promise<void> {
    // this.billApi.getPaymentReference().then(value => {
    //   this.reference = value;
    //   this.changeDetectorRef.detectChanges();
    // }).catch(_ => {
    //   this.reference = '';
    //   this.logService.i(_);
    //   this.changeDetectorRef.detectChanges();
    // });
  }

  async getAmountToPay(): Promise<void> {
    return this.amountControl.value;
  }

  async ngAfterViewInit(): Promise<void> {}

  async ngOnDestroy(): Promise<void> {}
}
