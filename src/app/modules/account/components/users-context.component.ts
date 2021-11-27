import {Component} from '@angular/core';
import {ShopState} from '../states/shop.state';

@Component({
  selector: 'app-users-context',
  template: `
    <div class="users-context-container">
      <div class="actions">
        <button routerLink="/account/users/create" class="action-button" mat-button>
          Add User
        </button>
        <button (click)="shopState.users()" class="action-button" mat-button>
          Reload
        </button>
      </div>
      <mat-progress-bar *ngIf="(shopState.loadUsers | async) === true"
                        mode="indeterminate"
                        color="primary">
      </mat-progress-bar>
    </div>
  `,
  styleUrls: ['../styles/table-context.style.scss']
})
export class UsersContextComponent {
  constructor(public readonly shopState: ShopState) {
  }
}
