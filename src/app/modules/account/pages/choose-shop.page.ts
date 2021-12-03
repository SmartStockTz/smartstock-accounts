import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {DeviceState, UserService} from '@smartstocktz/core-libs';
import {ShopModel} from '../models/shop.model';
import {ShopState} from '../states/shop.state';

@Component({
  selector: 'app-choose-shop-page',
  template: `
    <div class="main">
      <div class="container_shops">
        <div class="ct_shops_title">
          Select Shop
        </div>

        <div class="shops">
          <div (click)="setCurrentProject(shop)" *ngFor="let shop of shops" class="ct_shop_profile">
            <div matRipple class="shop_profile">
              <img alt="logo" id="{{shop.projectId}}" (error)="hideImage(shop.projectId)" src="{{shop?.ecommerce?.logo}}">
            </div>
            <div class="shop_name">
              {{shop.businessName}}
            </div>
          </div>
        </div>
        <div matRipple class="ct_add_shop" (click)="openCreateShopDialog()">
          <mat-icon class="add_shop_btn">add</mat-icon>
        </div>

      </div>
    </div>
  `,
  styleUrls: ['../styles/shop.style.scss']
})
export class ChooseShopPage implements OnInit {
  shopDetails = {};
  shops: any[];

  constructor(public readonly snackBar: MatSnackBar,
              public readonly router: Router,
              public readonly deviceState: DeviceState,
              private readonly shopState: ShopState,
              public readonly userDatabase: UserService) {
    document.title = 'SmartStock - Choose Shop';
  }

  async openCreateShopDialog(): Promise<void> {
    this.shopState.addShoPopup(this.deviceState.isSmallScreen.value, this.shopDetails).then(result => {
      if (result) {
        this.getShops();
      }
    }).catch(console.log);
  }

  async ngOnInit(): Promise<void> {
    await this.getShops();
  }

  async getShops(): Promise<void> {
    this.userDatabase.currentUser().then(user => {
      return this.userDatabase.getShops(user as any);
    }).then(shops => {
      this.shops = shops;
    }).catch(_ => {
      this.snackBar.open('Error when fetch available shops', 'Ok', {
        duration: 3000
      });
    });
  }

  async setCurrentProject(shop: ShopModel): Promise<void> {
    this.userDatabase.saveCurrentShop(shop as any).then(_ => {
      this.router.navigateByUrl('/dashboard').catch(reason => console.log(reason));
    }).catch(_ => {
      this.snackBar.open('Error when trying to save your current shop', 'Ok', {
        duration: 3000
      });
    });
  }

  hideImage(projectId: any): void {
    document.getElementById(projectId).setAttribute('src',
      'https://ipfs.bfast.fahamutech.com/ipfs/bafybeifcn6jib6wtjqn77sardvjlbrhk6cj3km3bsvxxa3bdcdh5egsxui/sslogopng.png');
  }
}
