import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SubscriptionModel} from '../models/subscription.model';
import {CostModel} from '../models/cost.model';
import {BillingState} from '../states/billing.state';
import {Subject, takeUntil} from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '@smartstocktz/core-libs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { functions } from 'bfast';

@Component({
  selector: 'app-payment-header',
  template: `
    <div class="line">
      <span class="invoice-number">Lipa namba (Tigopesa)</span>
      <span class="line-space"></span>
      <span class="invoice-number">Status</span>
    </div>
    <div class="line">
      <span class="invoice-number-body">{{reference}}</span>
      <span class="line-space"></span>
      <span *ngIf="subs.subscription" class="paid-label">{{subs.reason}}</span>
      <span *ngIf="!subs.subscription" class="not-paid-label">{{subs.reason}}</span>
    </div>
    <div class="line">
      <span class="line-space"></span>
      <button [disabled]="loading"
              *ngIf="!subs.subscription"
              (click)="refresh()" mat-button class="refresh-button" color="primary">
        Refresh Status
        <mat-progress-spinner mode="indeterminate" style="display: inline-block"
                              *ngIf="loading" diameter="20" color="primary">
        </mat-progress-spinner>
      </button>
    </div>
    <div *ngIf="!subs.subscription" class="line">
      <span class="line-space"></span>
      refresh in <span style="margin-left: 5px" id="tcounter">01:00</span>
    </div>
    <div class="table-container">
      <table mat-table [dataSource]="costDataSource">
        <ng-container matColumnDef="cost">
          <th class="table-title" mat-header-cell *matHeaderCellDef>Cost ( TZS )</th>
          <td class="table-data" mat-cell *matCellDef="let element"> {{(element.cost) | number}} </td>
        </ng-container>
        <ng-container matColumnDef="fee">
          <th class="table-title" mat-header-cell *matHeaderCellDef>Months</th>
          <td class="table-data" mat-cell *matCellDef="let element">{{element.mode | number}}</td>
        </ng-container>
        <ng-container matColumnDef="total">
          <th class="table-title" mat-header-cell *matHeaderCellDef>Balance ( TZS )</th>
          <td class="table-data" mat-cell *matCellDef="let element">{{element.balance | number}} </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns;"></tr>
      </table>
    </div>
    <div class="reference-container">
      <p class="reference-instruction-text">Ukimaliza weka kumbukumbu namba apo chini. Kisha bofya thibitisha malipo.</p>
      <div class="reference-input-container">
        <input placeholder="Kumbumbuku namba" class="reference-input" type="text" [formControl]="referenceControl">
      </div>
      <button (click)="confirmPayment()" [disabled]="confirmOnProgress" mat-button class="reference-confirm-button" >
        <span *ngIf="!confirmOnProgress" class="reference-confirm-text">Thibitisha malipo.</span>
        <span *ngIf="confirmOnProgress" class="reference-confirm-text">Subiri...</span>
      </button>
    </div>
  `,
  styleUrls: ['../styles/order-header.style.scss']
})

export class PaymentHeaderComponent implements OnInit, OnDestroy {
  @Input() subs: SubscriptionModel;
  @Input() cost: CostModel;
  @Input() reference = '6829508';
  costDataSource = new MatTableDataSource([]);
  columns: string[] = ['cost', 'fee', 'total'];
  referenceControl = new FormControl("", [
    Validators.nullValidator,
    Validators.minLength(1)
  ]);
  confirmOnProgress = false;
  private interval: NodeJS.Timeout;
  loading = false;
  private destroyer = new Subject();

  constructor(private readonly billingState: BillingState,
              private readonly userService: UserService,
              private readonly snack: MatSnackBar) {
  }

  refresh(): void {
    this.billingState.fetch();
  }

  ngOnInit(): void {
    this.billingState.reference.pipe(takeUntil(this.destroyer)).subscribe({
      next: _ => {
        this.updateTable();
      }
    });
    if (this.subs.subscription === false) {
      this.startTimer(60);
    }else{
      clearInterval(this.interval)
    }
    this.updateTable();
  }

  updateTable(): void {
    this.costDataSource.data = [{
      mode: this.cost.mode,
      balance: this.subs.balance,
      cost: this.cost.cost
    }];
  }

  startTimer(duration: number): void {
    let timer = duration;
    let minutes;
    let seconds;
    this.interval = setInterval(() => {
      minutes = parseInt(String(timer / 60), 10);
      seconds = parseInt(String(timer % 60), 10);

      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      const a = document.getElementById('tcounter');
      if (a) {
        a.textContent = minutes + ':' + seconds;
      }

      if (--timer < 0) {
        timer = duration;
        this.refresh();
      }
    }, 1000);
  }

  async confirmPayment(): Promise<void> {
    // console.log(this.referenceControl.value)
    // if(!this.referenceControl.valid){
    //   return
    // }
    this.confirmOnProgress = true;
    // let shop;
    // this.userService.getCurrentShop().then(_shop=>{
    //   if(!_shop){
    //     throw {message: "no active shop"}
    //   }
    //   shop = _shop
    this.userService.currentUser().then(u=>{
      if(u && u.id)return u.id
      else return null
    })
    .then(uid=>{
      if(uid){
        return functions().request(`/billing/${uid}/payment`).post({
          reference: this.referenceControl.value
        });
      }
    })
    .catch(r=>{
      // console.log(r);
      this.snack.open(r && r.message?r.message:"Unknown error",'Ok',{
        duration: 2000
      });
    }).finally(()=>{
      this.confirmOnProgress = false;
      this.refresh();
    })
  }

  ngOnDestroy(): void {
    this.destroyer.next('done');
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
