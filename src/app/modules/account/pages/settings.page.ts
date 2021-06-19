import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeviceState, EventService, SettingsService, SsmEvents, UserService} from '@smartstocktz/core-libs';
import {ActivatedRoute, Router} from '@angular/router';
import {SettingsModel} from '../models/settings.model';

@Component({
  selector: 'app-setting-page',
  template: `
    <app-layout-sidenav
      [leftDrawerOpened]="(deviceState.enoughWidth | async )=== true"
      [leftDrawerMode]="(deviceState.enoughWidth | async )=== true?'side': 'over'"
      [hasBackRoute]="true"
      [backLink]="'/account/shops'"
      [heading]="'General settings'"
      [leftDrawer]="side"
      [body]="body">
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <div style="min-height: 100vh"
             class="container d-flex flex-column justify-content-center align-items-center stock-new-wrapper">
          <div *ngIf="getSettingsProgress" style="height: 400px; display: flex; justify-content: center; align-items: center">
            <mat-progress-spinner [diameter]="30" mode="indeterminate"
                                  [matTooltip]="'Fetch settingsService'"
                                  color="primary">
            </mat-progress-spinner>
          </div>
          <form *ngIf="!getSettingsProgress && settingsForm"
                (ngSubmit)="saveSettings()"
                [formGroup]="settingsForm"
                style="margin-top: 16px; margin-bottom: 100px"
                class="col-xl-9 col-lg-9 col-md-10 col-sm-11 col-12">

            <h2 style="margin-top: 8px">Shop</h2>
            <div style="display: flex;align-items: center">
              <mat-card>
                <mat-icon color="primary" style="font-size: 60px; height: 60px; width: 60px">store</mat-icon>
              </mat-card>
              <h1 style="margin-left: 8px">{{selectedShop}}</h1>
            </div>

            <h2 style="margin-top: 8px">Modules</h2>
            <mat-card formGroupName="module">
              <mat-card-content>
                <div class="d-flex flex-row align-items-center">
                  <mat-form-field appearance="fill">
                    <mat-label>Stock Module</mat-label>
                    <mat-select formControlName="stock">
                      <mat-option *ngFor="let stockModule of stockModules" [value]="stockModule">
                        {{stockModule}}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>
                <div style="height: 20px"></div>
              </mat-card-content>
            </mat-card>

            <h2 style="margin-top: 8px">Currency</h2>
            <mat-card>
              <mat-card-content>
                <div class="d-flex flex-row align-items-center">
                  <mat-form-field appearance="fill">
                    <mat-label>Shop Currency</mat-label>
                    <mat-select formControlName="currency">
                      <mat-option *ngFor="let stockCurrency of shopCurrencies" [value]="stockCurrency">
                        {{stockCurrency}}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>
              </mat-card-content>
              <div style="height: 20px"></div>
            </mat-card>

            <h2 style="margin-top: 8px">Printer</h2>
            <mat-card>
              <mat-card-content>
                <div class="d-flex flex-row align-items-center">
                  <mat-card-subtitle>Disable Printer</mat-card-subtitle>
                  <span class="toolbar-spacer"></span>
                  <mat-slide-toggle
                    formControlName="saleWithoutPrinter"
                    matTooltip="If you enable you won't be able sale without printer" color="primary"
                    labelPosition="after">
                  </mat-slide-toggle>
                </div>

                <div style="margin-top: 16px">
                  <mat-form-field appearance="fill">
                    <mat-label>Header</mat-label>
                    <textarea matTooltip="This content will be shown on top of a receipt when printed"
                              formControlName="printerHeader"
                              placeholder="Type here..." matInput type="text" [rows]="6">
                </textarea>
                  </mat-form-field>
                </div>

                <div style="margin-top: 16px">
                  <!--              <mat-card-subtitle>Header message</mat-card-subtitle>-->
                  <mat-form-field appearance="fill">
                    <mat-label>Footer</mat-label>
                    <textarea matTooltip="This content will be shown on bottom of a receipt when printed"
                              formControlName="printerFooter"
                              placeholder="Type here..." matInput type="text" [rows]="6">
                </textarea>
                  </mat-form-field>
                </div>

              </mat-card-content>
            </mat-card>

            <button [disabled]="saveSettingProgress"
                    style="margin-top: 16px"
                    color="primary"
                    mat-flat-button
                    class="btn-block ft-button">Update
              <mat-progress-spinner style="display: inline-block" *ngIf="saveSettingProgress" [diameter]="20"
                                    color="primary"
                                    mode="indeterminate">
              </mat-progress-spinner>
            </button>
          </form>
        </div>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ['../styles/setting.style.scss']
})
export class SettingsPage implements OnInit, OnDestroy {
  settingsForm: FormGroup;
  getSettingsProgress = false;
  saveSettingProgress = false;
  selectedShop = '';
  stockModules = ['@smartstocktz/stocks', '@smartstocktz/stocks-real-estate'];
  shopCurrencies = ['TZS', 'USD'];

  constructor(public readonly formBuilder: FormBuilder,
              public readonly matSnackBar: MatSnackBar,
              public readonly eventService: EventService,
              public readonly activatedRoute: ActivatedRoute,
              public readonly router: Router,
              public readonly userService: UserService,
              public readonly deviceState: DeviceState,
              public readonly settingsService: SettingsService) {
    document.title = 'SmartStock - Settings';
  }

  async ngOnInit(): Promise<void> {
    await this.getSettings();
  }

  async getSettings(): Promise<void> {
    this.activatedRoute.params.subscribe(params => {
      if (params && params.shop) {
        this.getSettingsProgress = true;
        this.userService.currentUser().then((user: any) => {
          return this.userService.getShops(user as any);
        }).then(shops => {
          const shop = shops.filter(x => x.projectId === params.shop);
          if (shop && shop[0] && shop[0].settings) {
            this.selectedShop = shop[0].businessName;
            return shop[0].settings;
          } else {
            this.goToIndex();
            throw new Error('bad shop data');
          }
        }).then(value => {
          this.initiateSettingsForm(value as any);
          this.getSettingsProgress = false;
        }).catch(_ => {
          this.initiateSettingsForm({
            saleWithoutPrinter: true,
            printerHeader: '',
            printerFooter: '',
            allowRetail: true,
            allowWholesale: true,
            module: {
              stock: '@smartstocktz/stocks'
            },
            currency: 'TZS'
          });
          this.getSettingsProgress = false;
        });
      } else {
        this.goToIndex();
      }
    }, _234 => {
      this.goToIndex();
    });
  }

  async goToIndex(): Promise<void> {
    this.router.navigateByUrl('/account').catch();
  }

  async initiateSettingsForm(settings: SettingsModel): Promise<void> {
    this.settingsForm = this.formBuilder.group({
      saleWithoutPrinter: [settings.saleWithoutPrinter],
      printerHeader: [settings.printerHeader],
      printerFooter: [settings.printerFooter],
      allowRetail: [settings.allowRetail],
      allowWholesale: [settings.allowWholesale],
      module: this.formBuilder.group({
        stock: [settings.module && settings.module.stock ? settings.module.stock : '@smartstocktz/stocks', []]
      }),
      currency: [settings.currency ? settings.currency : 'TZS', []]
    });
  }

  async saveSettings(): Promise<void> {
    this.saveSettingProgress = true;
    this.settingsService.saveSettings(this.settingsForm.value).then(_ => {
      console.log(_);
      this.matSnackBar.open('Settings saved', 'Ok', {duration: 3000});
      this.saveSettingProgress = false;
      this.eventService.broadcast(SsmEvents.SETTINGS_UPDATED);
    }).catch(reason => {
      console.warn(reason);
      this.matSnackBar.open('Fails to save settingsService, try again later', 'Ok', {
        duration: 3000
      });
      this.saveSettingProgress = false;
    });
  }

  async ngOnDestroy(): Promise<void> {
  }
}
