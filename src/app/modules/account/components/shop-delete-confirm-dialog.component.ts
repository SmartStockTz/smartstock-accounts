import {AfterViewInit, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LogService, UserService} from '@smartstocktz/core-libs';
import {ShopService} from '../services/shop.service';

// @dynamic
@Component({
  selector: 'app-shop-delete-confirm-dialog',
  template: `
    <div class="container">
      <div class="row">
        <div class="col-12">
          <mat-panel-title class="text-center">
            Your about to delete shop : <b>{{' ' + data.name}}</b>
          </mat-panel-title>
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <div class="align-self-center" style="margin: 8px">
          <button [disabled]="deleteProgress" color="primary" mat-button (click)="deleteShop(data.project_id)">
            Delete
            <mat-progress-spinner *ngIf="deleteProgress"
                                  matTooltip="Delete in progress..."
                                  style="display: inline-block" mode="indeterminate" diameter="15"
                                  color="accent"></mat-progress-spinner>
          </button>
        </div>
        <div class="alert-secondary" style="margin: 8px">
          <button [disabled]="deleteProgress" color="primary" mat-button (click)="cancel()">Cancel</button>
        </div>
      </div>
      <p class="bg-danger" *ngIf="errorUserMessage">{{errorUserMessage}}</p>
    </div>
  `,
  styleUrls: ['../styles/users.style.scss']
})
export class ShopDeleteConfirmDialogComponent implements OnInit, OnDestroy, AfterViewInit {
  deleteProgress = false;
  errorUserMessage: string;

  constructor(
    public dialogRef: MatDialogRef<ShopDeleteConfirmDialogComponent>,
    public readonly userDatabase: UserService,
    public readonly logger: LogService,
    public readonly shopService: ShopService,
    @Inject(MAT_DIALOG_DATA) public data: {
      name: string,
      project_id: string
    }) {
  }

  async deleteShop(projectId: any): Promise<void> {
    this.errorUserMessage = undefined;
    this.deleteProgress = true;
    this.shopService.deleteShop(projectId).then(value => {
      this.dialogRef.close(projectId);
      this.deleteProgress = false;
      this.logger.i(value);
    }).catch(reason => {
      this.errorUserMessage = reason && reason.message ? reason.message : reason.toString();
      this.deleteProgress = false;
    });
  }

  async cancel(): Promise<void> {
    this.dialogRef.close(null);
  }

  async ngAfterViewInit(): Promise<void> {
  }

  async ngOnDestroy(): Promise<void> {
  }

  async ngOnInit(): Promise<void> {
  }
}
