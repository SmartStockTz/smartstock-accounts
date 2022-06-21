import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SettingsModel } from "../models/settings.model";
import { UserService } from "smartstock-core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { ShopState } from "../states/shop.state";
import { SettingsService } from "../services/settings.service";
import { ShopModel } from "../models/shop.model";

@Component({
  selector: "app-settings-general",
  template: `
    <mat-progress-bar
      mode="indeterminate"
      *ngIf="getSettingsProgress"
      color="primary"
    ></mat-progress-bar>
    <div class="settings-container">
      <form
        class="settings-form"
        *ngIf="settingsForm"
        (ngSubmit)="saveSettings()"
        [formGroup]="settingsForm"
      >
        <mat-form-field>
          <mat-label>Currency</mat-label>
          <mat-select formControlName="currency">
            <mat-option
              *ngFor="let stockCurrency of shopState.currencies | async"
              [value]="stockCurrency.cc"
            >
              {{ stockCurrency.name }} - {{ stockCurrency.symbol }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <div class="status-item">
          <div class="status-text text-wrap">
            Allow save sale without printing?
          </div>
          <div class="status-checker">
            <span>{{
              settingsForm.get("saleWithoutPrinter").value === true
                ? "YES"
                : "NO"
            }}</span>
            <mat-slide-toggle
              formControlName="saleWithoutPrinter"
            ></mat-slide-toggle>
          </div>
        </div>

        <mat-form-field>
          <mat-label>Header</mat-label>
          <textarea
            formControlName="printerHeader"
            placeholder="Type here..."
            matInput
            type="text"
            [rows]="4"
          >
          </textarea>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Footer</mat-label>
          <textarea
            formControlName="printerFooter"
            placeholder="Type here..."
            matInput
            type="text"
            [rows]="4"
          >
          </textarea>
        </mat-form-field>

        <button
          [disabled]="saveSettingProgress"
          color="primary"
          mat-flat-button
          class="save-button"
        >
          Update Settings
          <mat-progress-spinner
            style="display: inline-block"
            *ngIf="saveSettingProgress"
            [diameter]="20"
            color="primary"
            mode="indeterminate"
          >
          </mat-progress-spinner>
        </button>
      </form>
    </div>
  `,
  styleUrls: ["../styles/setting.style.scss"]
})
export class SettingsGeneralComponent implements OnInit {
  settingsForm: FormGroup;
  getSettingsProgress = false;
  saveSettingProgress = false;
  selectedShop: ShopModel;

  constructor(
    public readonly formBuilder: FormBuilder,
    public readonly matSnackBar: MatSnackBar,
    public readonly activatedRoute: ActivatedRoute,
    public readonly router: Router,
    private readonly settingsService: SettingsService,
    public readonly shopState: ShopState,
    public readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.getSettings();
    this.shopState.fetchCurrencies();
  }

  getSettings(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        if (params && params.shop) {
          this.getSettingsProgress = true;
          this.userService
            .currentUser()
            .then((user: any) => {
              return this.userService.getShops(user as any);
            })
            .then((shops) => {
              const shop = shops.filter((x) => x.projectId === params.shop);
              if (shop && shop[0] && shop[0].settings) {
                this.selectedShop = shop[0] as any;
                return shop[0].settings;
              } else {
                this.goToIndex();
                throw new Error("bad shop data");
              }
            })
            .then((value) => {
              this.initiateSettingsForm(value as any);
              this.getSettingsProgress = false;
            })
            .catch((_) => {
              this.initiateSettingsForm({
                saleWithoutPrinter: true,
                printerHeader: "",
                printerFooter: "",
                allowRetail: true,
                allowWholesale: true,
                module: {
                  stock: "@smartstocktz/stocks"
                },
                currency: "TZS"
              });
              this.getSettingsProgress = false;
            });
        } else {
          this.goToIndex();
        }
      },
      error: (_234) => {
        this.goToIndex();
      }
    });
  }

  goToIndex(): void {
    this.router.navigateByUrl("/account").catch();
  }

  initiateSettingsForm(settings: SettingsModel): void {
    this.settingsForm = this.formBuilder.group({
      saleWithoutPrinter: [settings.saleWithoutPrinter],
      printerHeader: [settings.printerHeader],
      printerFooter: [settings.printerFooter],
      allowRetail: [settings.allowRetail],
      allowWholesale: [settings.allowWholesale],
      // module: this.formBuilder.group({
      //   stock: [settings.module && settings.module.stock ? settings.module.stock : '@smartstocktz/stocks', []]
      // }),
      currency: [settings.currency ? settings.currency : "TZS", []]
    });
  }

  async saveSettings(): Promise<void> {
    this.saveSettingProgress = true;
    this.settingsService
      .updateGeneralSettings(this.settingsForm.value, this.selectedShop)
      .then((_) => {
        this.matSnackBar.open("Settings saved", "Ok", { duration: 2000 });
        this.selectedShop.settings = _;
        this.settingsService.updateSelectedShop(this.selectedShop);
      })
      .catch((reason) => {
        this.matSnackBar.open(
          reason
            ? reason.message
            : "Fails to save settingsService, try again later",
          "Ok",
          {
            duration: 2000
          }
        );
      })
      .finally(() => {
        this.saveSettingProgress = false;
      });
  }
}
