import {Component} from '@angular/core';
import {ShopState} from '../states/shop.state';

@Component({
  selector: 'app-shops-context',
  template: `
    <div class="users-context-container">
      <div class="actions">
        <button routerLink="/account/shop"class="action-button" mat-button>
          Add Shop
        </button>
        <button routerLink="/account/shop" class="action-button" mat-button>
          Select
        </button>
        <button (click)="shopState.fetchShops()" class="action-button" mat-button>
          Reload
        </button>
      </div>
      <mat-progress-bar *ngIf="(shopState.loadShops | async) === true"
                        mode="indeterminate"
                        color="primary">
      </mat-progress-bar>
    </div>
  `,
  styleUrls: ['../styles/table-context.style.scss']
})
export class ShopsContextComponent{
  constructor(public readonly shopState: ShopState) {
  }
}
