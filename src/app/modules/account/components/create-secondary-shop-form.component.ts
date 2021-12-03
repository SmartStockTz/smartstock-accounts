import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '@smartstocktz/core-libs';
import {ShopService} from '../services/shop.service';
import {ProfileState} from '../states/profile.state';

export interface DialogData {
  customer?: string;
  name?: string;
  type: number;
}

@Component({
  selector: 'app-secondary-shop-form',
  template: `
    <form *ngIf="createShopForm" [formGroup]="createShopForm" (ngSubmit)="createShop()" class="create-shop-form-container">
      <mat-form-field>
        <mat-label>Business Name</mat-label>
        <mat-icon matSuffix>business</mat-icon>
        <input matInput class="inputs" type="text" formControlName="businessName"
               required>
        <mat-error>Business name required</mat-error>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Shop Category</mat-label>
        <mat-icon matSuffix>category</mat-icon>
        <mat-select formControlName="category" class="" required="">
          <mat-option *ngFor="let category of profileState.categories | async"
                      value="{{category.value}}">{{category.name}}</mat-option>
        </mat-select>
        <mat-error>Choose category</mat-error>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Country</mat-label>
        <mat-icon matSuffix>person_pin</mat-icon>
        <!--          <input matInput class="inputs" type="text" formControlName="country" required>-->
        <mat-select formControlName="country" class="" required>
          <mat-option *ngFor="let country of profileState.countries | async" value="{{country.name}} - {{country.code}}">
            {{country.name}}</mat-option>
        </mat-select>
        <mat-error>Country required</mat-error>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Region</mat-label>
        <mat-icon matSuffix>person_pin</mat-icon>
        <input matInput class="inputs" type="text" formControlName="region" required>
        <mat-error>Region required</mat-error>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Street / Business location</mat-label>
        <mat-icon matSuffix>person_pin</mat-icon>
        <textarea matInput class="inputs" formControlName="street"
                  required></textarea>
        <mat-error>Street required</mat-error>
      </mat-form-field>

      <button [disabled]="createShopProgress" class="" color="primary" mat-flat-button>
        Create Shop
        <mat-progress-spinner style="display: inline-block"
                              *ngIf="createShopProgress" mode="indeterminate"
                              color="primary" [diameter]="20">
        </mat-progress-spinner>
      </button>
    </form>
  `,
  styleUrls: ['../styles/create-shop-dialog.style.scss', '../styles/login.style.scss'],
  providers: [
    ShopService
  ]
})
export class CreateSecondaryShopComponent implements OnInit {
  @Input() data: DialogData;
  @Output() done = new EventEmitter();
  createShopForm: FormGroup;
  createShopProgress = false;

  constructor(public readonly snack: MatSnackBar,
              public readonly shopService: ShopService,
              private readonly userService: UserService,
              public readonly profileState: ProfileState,
              public readonly formBuilder: FormBuilder) {
  }

  async createShop(): Promise<void> {
    if (this.createShopForm.valid) {
      this.createShopProgress = true;
      this.shopService.createShop(this.createShopForm.value).then(async (value: any) => {
        try {
          const user = await this.userService.currentUser();
          user.shops.push(value as any);
          await this.userService.updateCurrentUser(user);
          this.done.emit(value);
          this.snack.open('Shop created successful', 'Ok', {
            duration: 3000
          });
          this.createShopProgress = false;
        } catch (e) {

        }
      }).catch(reason => {
        this.snack.open(reason.message, 'Ok', {duration: 3000});
        this.createShopProgress = false;
      });
    } else {
      this.snack.open('Please fill all required fields', 'Ok', {
        duration: 3000
      });
    }
  }

  async ngOnInit(): Promise<void> {
    await this.profileState.getCountries();
    await this.profileState.getShopCategories();
    this.createShopForm = this.formBuilder.group({
      businessName: ['', [Validators.nullValidator, Validators.required]],
      country: ['', [Validators.nullValidator, Validators.required]],
      category: ['product_provider', [Validators.nullValidator, Validators.required]],
      region: ['', [Validators.nullValidator, Validators.required]],
      street: ['', [Validators.nullValidator, Validators.required]],
      settings: [{
        printerHeader: '',
        printerFooter: '',
        saleWithoutPrinter: true,
        currency: ''
      }],
      ecommerce: [{}],
    });
  }

  async closeDialog($event: Event): Promise<void> {
    $event.preventDefault();
    this.done.emit(null);
  }
}
