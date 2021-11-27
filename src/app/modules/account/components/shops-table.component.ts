import {Component, OnDestroy} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {ShopModel} from '../models/shop.model';
import {firstValueFrom, Subject, takeUntil} from 'rxjs';
import {ShopState} from '../states/shop.state';
import {ShopsOptionsSheetComponent} from './shops-options-sheet.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatDialog} from '@angular/material/dialog';
import {ShopsOptionsDialogComponent} from './shops-options-dialog.component';

@Component({
  selector: 'app-shops-table',
  template: `
    <app-shops-context></app-shops-context>
    <div class="table-container">
      <table class="s-table" mat-table [dataSource]="shopsDatasource">
        <ng-container matColumnDef="name">
          <th class="column-header" mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let element">
            {{element.businessName}}
            <!--            <mat-chip-list *ngIf="currentShop?.projectId===element.projectId" style="display: inline-block">-->
            <!--              <mat-chip color="primary" selected>Selected</mat-chip>-->
            <!--            </mat-chip-list>-->
          </td>
        </ng-container>
        <ng-container matColumnDef="appId">
          <th class="column-header" mat-header-cell *matHeaderCellDef>AppId</th>
          <td mat-cell *matCellDef="let element">
            {{element.applicationId}}
          </td>
        </ng-container>
        <ng-container matColumnDef="projectId">
          <th class="column-header" mat-header-cell *matHeaderCellDef>ProjectId</th>
          <td mat-cell *matCellDef="let element">
            {{element.projectId}}
          </td>
        </ng-container>
        <ng-container matColumnDef="address">
          <th class="column-header" mat-header-cell *matHeaderCellDef>Address</th>
          <td mat-cell *matCellDef="let element">
            {{element.country}} <br> {{element.region}} <br> {{element.street}}
          </td>
        </ng-container>
        <ng-container matColumnDef="action">
          <th class="column-header" mat-header-cell *matHeaderCellDef>
            <div class="d-flex justify-content-end align-items-end">
              Actions
            </div>
          </th>
          <td mat-cell *matCellDef="let element">
            <div class="d-flex justify-content-end align-items-end">
              <button (click)="rowClicked(element)" color="primary" mat-icon-button>
                <mat-icon>more_vert</mat-icon>
              </button>
            </div>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="shopsTableColumns"></tr>
        <tr mat-row class="table-data-row" *matRowDef="let row; columns: shopsTableColumns;"></tr>
      </table>
    </div>
  `,
  styleUrls: ['../styles/table.style.scss']
})
export class ShopsTableComponent implements OnDestroy{
  shopsDatasource: MatTableDataSource<ShopModel> = new MatTableDataSource<ShopModel>([]);
  shopsTableColumns = ['name', 'address', 'action'];
  destroyer = new Subject();

  constructor(public readonly shopState: ShopState,
              private readonly matDialog: MatDialog) {
    shopState.fetchShops();
    shopState.shops.pipe(takeUntil(this.destroyer)).subscribe(value => {
      this.shopsDatasource.data = value;
    });
  }

  ngOnDestroy(): void {
    this.destroyer.next('done');
  }

  async rowClicked(row: ShopModel): Promise<void> {
    const obs = this.matDialog.open(ShopsOptionsDialogComponent, {
      data: {
        shop: row
      }
    }).afterClosed();
    firstValueFrom(obs).then(value1 => {
      if (value1 === true) {
        this.shopsDatasource.data = this.shopsDatasource.data.filter(value => value.projectId !== row.projectId);
      }
    });
  }
}
