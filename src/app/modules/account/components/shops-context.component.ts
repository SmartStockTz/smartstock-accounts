import { Component } from "@angular/core";
import { ShopState } from "../states/shop.state";
import { DeviceState } from "smartstock-core";

@Component({
  selector: "app-shops-context",
  template: `
    <div class="users-context-container">
      <div class="actions">
        <button (click)="addShop()" class="action-button" mat-button>
          Add
        </button>
        <button routerLink="/account/shop" class="action-button" mat-button>
          Change
        </button>
        <button
          (click)="shopState.fetchShops()"
          class="action-button"
          mat-button
        >
          Reload
        </button>
      </div>
      <mat-progress-bar
        *ngIf="(shopState.loadShops | async) === true"
        mode="indeterminate"
        color="primary"
      >
      </mat-progress-bar>
    </div>
  `,
  styleUrls: ["../styles/table-context.style.scss"]
})
export class ShopsContextComponent {
  constructor(
    public readonly shopState: ShopState,
    private readonly deviceState: DeviceState
  ) {}

  addShop(): void {
    this.shopState
      .addShoPopup(this.deviceState.isSmallScreen.value, {})
      .then((value) => {
        if (value) {
          this.shopState.fetchShops();
        }
      });
  }
}
