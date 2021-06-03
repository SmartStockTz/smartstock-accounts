import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeviceInfoUtil, EventService, SettingsService, SsmEvents, UserService} from '@smartstocktz/core-libs';
import {ActivatedRoute, Router} from '@angular/router';
import {SettingsModel} from '../models/settings.model';

@Component({
  selector: 'app-setting',
  template: `
    <mat-sidenav-container class="match-parent">
      <mat-sidenav class="match-parent-side"
                   [fixedInViewport]="true"
                   #sidenav
                   [mode]="enoughWidth()?'side':'over'"
                   [opened]="!isMobile">
        <app-drawer></app-drawer>
      </mat-sidenav>

      <mat-sidenav-content>
        <app-toolbar [heading]="'Settings'"
                     [sidenav]="sidenav"
                     [hasBackRoute]="isMobile"
                     [backLink]="'/account'"
                     [showProgress]="false">
        </app-toolbar>

        <div class="container d-flex flex-column justify-content-center align-items-center stock-new-wrapper">
          <div *ngIf="getSettingsProgress" style="height: 400px; display: flex; justify-content: center; align-items: center">
            <mat-progress-spinner [diameter]="30" mode="indeterminate"
                                  [matTooltip]="'Fetch settings'"
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
                  <!--              <mat-card-subtitle>Header message</mat-card-subtitle>-->
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
      </mat-sidenav-content>

    </mat-sidenav-container>

    <!--<app-settings-general *ngIf="isMobile"></app-settings-general>-->
  `,
  styleUrls: ['../styles/setting.style.scss']
})
export class SettingsPage extends DeviceInfoUtil implements OnInit {
  settingsForm: FormGroup;
  getSettingsProgress = false;
  saveSettingProgress = false;

  isMobile = false;
  selectedShop = '';
  stockModules = [
    '@smartstocktz/stocks',
    '@smartstocktz/stocks-real-estate'
  ];
  shopCurrencies = [
    'TZS',
    'USD'
  ];

  constructor(private readonly formBuilder: FormBuilder,
              private readonly snack: MatSnackBar,
              private readonly eventApi: EventService,
              private readonly activatedRoute: ActivatedRoute,
              private readonly router: Router,
              private readonly userService: UserService,
              private readonly settings: SettingsService) {
    super();
    document.title = 'SmartStock - Settings';
  }

  ngOnInit(): void {
    this.getSettings();
  }

  private getSettings(): void {
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

  private goToIndex(): void {
    this.router.navigateByUrl('/account').catch();
  }

  private initiateSettingsForm(settings: SettingsModel): void {
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

  saveSettings(): void {
    this.saveSettingProgress = true;
    this.settings.saveSettings(this.settingsForm.value).then(_ => {
      console.log(_);
      this.snack.open('Settings saved', 'Ok', {duration: 3000});
      this.saveSettingProgress = false;
      this.eventApi.broadcast(SsmEvents.SETTINGS_UPDATED);
    }).catch(reason => {
      console.warn(reason);
      this.snack.open('Fails to save settings, try again later', 'Ok', {
        duration: 3000
      });
      this.saveSettingProgress = false;
    });
  }
}
