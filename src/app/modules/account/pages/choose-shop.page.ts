import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CreateShopDialogComponent} from '../components/create-shop-dialog.component';
import {Observable, of} from 'rxjs';
import {Router} from '@angular/router';
import {StorageService, UserService} from '@smartstocktz/core-libs';
import {ShopModel} from '../models/shop.model';

@Component({
  selector: 'app-choose-shop-page',
  template: `
    <div class="main">
      <div class="container_shops d-flex flex-column justify-content-start justify-content-center align-items-center">
        <div class="container_logo d-flex">
          <div class="logo">
            <img alt="" width="100" src="../../../../assets/img/ss_logo_white%203.svg">
          </div>
        </div>
        <div style="margin-bottom: 10px" class="ct_shops_title d-flex justify-content-center">
          Choose Shop
        </div>

        <div class="d-flex flex-wrap btn-block justify-content-center">

          <div (click)="setCurrentProject(shop)" *ngFor="let shop of shops | async" class="ct_shop_profile">
            <div matRipple class="shop_profile">
              <mat-icon style="width: 70px; height: 70px; font-size: 70px" color="primary">store</mat-icon>
            </div>
            <div matTooltip="{{shop.businessName}}"
                 class="shop_name d-flex justify-content-center">
              {{shop.businessName}}
            </div>
          </div>

          <!--          <div class="ct_shop_profile">-->
          <!--            <div matRipple class="ct_add_shop d-flex justify-content-center" (click)="openCreateShopDialog()">-->
          <!--              <div class="d-flex justify-content-center align-items-center">-->
          <!--                <mat-icon class="add_shop_btn">add</mat-icon>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--            <div class="shop_name d-flex justify-content-center">Add Shop</div>-->
          <!--          </div>-->

        </div>

      </div>
    </div>
  `,
  styleUrls: ['../styles/shop.style.scss']
})
export class ChooseShopPage implements OnInit, OnDestroy {

  shopDetails = {};
  shops: Observable<any[]>;

  constructor(public createShopDialog: MatDialog,
              public readonly snackBar: MatSnackBar,
              public readonly router: Router,
              public readonly storageService: StorageService,
              public readonly userDatabase: UserService) {
    document.title = 'SmartStock - Choose Shop';
  }

  async openCreateShopDialog(): Promise<void> {
    const dialogRef = this.createShopDialog.open(CreateShopDialogComponent, {
      minWidth: 350,
      maxWidth: 600,
      data: this.shopDetails,
      disableClose: true,
      closeOnNavigation: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getShops();
      } else {
        // console.log('no shop to append');
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getShops();
  }

  async getShops(): Promise<void> {
    this.userDatabase.currentUser().then(user => {
      return this.userDatabase.getShops(user as any);
    }).then(shops => {
      this.shops = of(shops);
    }).catch(reason => {
      // console.log(reason);
      this.snackBar.open('Error when fetch available shops', 'Ok', {
        duration: 3000
      });
    });
  }

  async setCurrentProject(shop: ShopModel): Promise<void> {
    this.userDatabase.saveCurrentShop(shop as any).then(_ => {
      this.router.navigateByUrl('/dashboard').catch(reason => console.log(reason));
    }).catch(reason => {
      this.snackBar.open('Error when trying to save your current shop', 'Ok', {
        duration: 3000
      });
    });
  }

  async ngOnDestroy(): Promise<void> {
  }
}
