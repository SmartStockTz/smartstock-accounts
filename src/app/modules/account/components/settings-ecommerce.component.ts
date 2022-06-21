import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ShopModel } from "../models/shop.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import {
  DeviceState,
  FilesService,
  MessageService,
  UserService
} from "smartstock-core";
import { SettingsService } from "../services/settings.service";
import { EcommerceModel } from "../models/ecommerce.model";
import { Subject } from "rxjs";
import { ShopState } from "../states/shop.state";

@Component({
  selector: "app-settings-ecommerce",
  template: `
    <mat-progress-bar
      *ngIf="ecommerceGetProgress"
      mode="indeterminate"
      color="primary"
    ></mat-progress-bar>
    <div class="settings-container">
      <form
        class="settings-form"
        *ngIf="ecommerceForm"
        [formGroup]="ecommerceForm"
      >
        <div class="shop-header-container">
          <img
            src="{{ ecommerceForm.value.logo }}"
            class="shop-logo"
            alt="Logo"
          />
          <div class="shop-details">
            <p class="shop-details-head">{{ selectedShop.businessName }}</p>
            <!--            <p class="shop-details-total-products">{{mallState.totalProducts | async | number}} Products</p>-->
            <p class="shop-details-category">
              {{ selectedShop.country }} | {{ selectedShop.region }}
            </p>
            <button
              color="primary"
              (click)="browseMedia('logo', $event)"
              mat-button
            >
              Upload Logo
            </button>
          </div>
        </div>
        <div class="status-item">
          <div class="status-text text-wrap">
            Visible to public
          </div>
          <div class="status-checker">
            <span>{{
              ecommerceForm.get("visibility").value === true ? "YES" : "NO"
            }}</span>
            <mat-slide-toggle formControlName="visibility"></mat-slide-toggle>
          </div>
        </div>
        <div *ngIf="getVisibility()">
          <img
            alt="cover"
            class="cover"
            mat-card-image
            [src]="ecommerceForm.value.cover"
          />
          <button
            color="primary"
            (click)="browseMedia('cover', $event)"
            mat-button
          >
            Upload Cover Photo
          </button>
        </div>
        <div class="about" *ngIf="getVisibility()">
          <mat-form-field>
            <mat-label>About</mat-label>
            <textarea matInput rows="3" formControlName="about"></textarea>
            <mat-error>About required and must be at least 20 words</mat-error>
          </mat-form-field>
        </div>
        <div formGroupName="social" *ngIf="getVisibility()">
          <div class="heading">Social</div>
          <mat-form-field>
            <mat-label>Instagram</mat-label>
            <input matInput type="url" formControlName="instagram" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Twitter</mat-label>
            <input matInput type="url" formControlName="twitter" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Facebook</mat-label>
            <input matInput type="url" formControlName="facebook" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>WhatsApp</mat-label>
            <input matInput type="number" formControlName="whatsapp" />
          </mat-form-field>
        </div>
        <button
          [disabled]="ecommerceSaveProgress"
          color="primary"
          mat-flat-button
          (click)="saveEcommerceDetails()"
          class="save-button"
        >
          Update E-Commerce Details
          <mat-progress-spinner
            style="display: inline-block"
            *ngIf="ecommerceSaveProgress"
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
export class SettingsEcommerceComponent implements OnInit, OnDestroy {
  ecommerceForm: FormGroup;
  ecommerceGetProgress = false;
  ecommerceSaveProgress = false;
  selectedShop: ShopModel;
  private destroyer = new Subject();

  constructor(
    public readonly formBuilder: FormBuilder,
    public readonly snack: MatSnackBar,
    public readonly activatedRoute: ActivatedRoute,
    public readonly router: Router,
    public readonly userService: UserService,
    public readonly fileService: FilesService,
    public readonly messageService: MessageService,
    public readonly settingsService: SettingsService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getEcommerce();
  }

  async getEcommerce(): Promise<void> {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        if (params && params.shop) {
          this.ecommerceGetProgress = true;
          this.userService
            .currentUser()
            .then((user) => {
              return this.userService.getShops(user);
            })
            .then((shops: any[]) => {
              const shop = shops.filter((x) => x.projectId === params.shop);
              if (shop && shop[0] && shop[0].businessName) {
                this.selectedShop = shop[0];
                return this.selectedShop && this.selectedShop.ecommerce
                  ? this.selectedShop.ecommerce
                  : {
                      visibility: true,
                      cover: "",
                      about: "",
                      logo: "",
                      social: {
                        instagram: "",
                        twitter: "",
                        facebook: "",
                        whatsapp: ""
                      },
                      faq: []
                    };
              } else {
                this.goToIndex();
                throw new Error("bad shop data");
              }
            })
            .then((value: EcommerceModel) => {
              this.initEcommerceForm(value);
              this.ecommerceGetProgress = false;
            })
            .catch((_) => {
              this.initEcommerceForm({
                visibility: true,
                cover: "",
                about: "",
                logo: "",
                social: {
                  instagram: "",
                  twitter: "",
                  facebook: "",
                  whatsapp: ""
                }
              });
              this.ecommerceGetProgress = false;
            });
        } else {
          this.goToIndex();
        }
      },
      error: (_12) => {
        this.goToIndex();
      }
    });
  }

  async goToIndex(): Promise<void> {
    this.router.navigateByUrl("/account").catch();
  }

  getVisibility(): boolean {
    return this.ecommerceForm.get("visibility").value;
  }

  async initEcommerceForm(ecommerce: EcommerceModel): Promise<void> {
    const visibility =
      typeof ecommerce.visibility === "boolean" ? ecommerce.visibility : true;
    this.ecommerceForm = this.formBuilder.group({
      visibility: [visibility, [Validators.required, Validators.nullValidator]],
      logo: [ecommerce.logo, [Validators.required, Validators.nullValidator]],
      about: [
        ecommerce.about,
        [
          Validators.nullValidator,
          Validators.required,
          Validators.minLength(20)
        ]
      ],
      cover: [ecommerce.cover, [Validators.required, Validators.nullValidator]],
      social: this.formBuilder.group({
        instagram: [ecommerce.social ? ecommerce.social.instagram : ""],
        twitter: [ecommerce.social ? ecommerce.social.twitter : ""],
        facebook: [ecommerce.social ? ecommerce.social.facebook : ""],
        whatsapp: [ecommerce.social ? ecommerce.social.whatsapp : ""]
      })
    });
  }

  async saveEcommerceDetails(): Promise<void> {
    if (this.getVisibility() === false || this.ecommerceForm.valid) {
      this.ecommerceSaveProgress = true;
      const d = this.ecommerceForm.value;
      if (d.social.whatsapp) {
        d.social.whatsapp = d.social.whatsapp.toString();
      }
      this.settingsService
        .updateEcommerceDetails(d, this.selectedShop)
        .then((value) => {
          this.messageService.showMobileInfoMessage(
            "E-Commerce details updated",
            2000,
            "bottom"
          );
          this.selectedShop.ecommerce = value;
          this.settingsService.updateSelectedShop(this.selectedShop);
        })
        .finally(() => {
          this.ecommerceSaveProgress = false;
        })
        .catch((reason) => {
          this.messageService.showMobileInfoMessage(
            reason.message,
            2000,
            "bottom"
          );
        });
    } else {
      this.messageService.showMobileInfoMessage(
        "Please fill all required detail and submit again",
        2000,
        "bottom"
      );
    }
  }

  async browseMedia(controlName: string, $event: MouseEvent): Promise<void> {
    $event.preventDefault();
    this.fileService.browse().then((value) => {
      if (value && value.url) {
        this.ecommerceForm.get(controlName).setValue(value.url);
      } else {
        // this.messageService.showMobileInfoMessage('Media not selected', 2000, 'bottom');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyer.next("done");
  }
}
