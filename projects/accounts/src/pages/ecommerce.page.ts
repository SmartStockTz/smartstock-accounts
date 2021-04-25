import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeviceInfoUtil, EventService, FileBrowserDialogComponent, MessageService, UserService} from '@smartstocktz/core-libs';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {EcommerceModel} from '../models/ecommerce.model';
import {ShopModel} from '../models/shop.model';
import {EcommerceService} from '../services/ecommerce.service';

@Component({
  selector: 'app-setting',
  template: `
    <app-layout-sidenav [leftDrawerOpened]="enoughWidth()"
                               [leftDrawerMode]="enoughWidth()?'side':'over'"
                               [isMobile]="false"
                               [heading]="'E-Commerce'"
                               [body]="body"
                               [leftDrawer]="leftDrawer">
      <ng-template #leftDrawer>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <div class="container d-flex flex-column justify-content-center align-items-center stock-new-wrapper">
          <div *ngIf="ecommerceGetProgress" style="height: 400px; display: flex; justify-content: center; align-items: center">
            <mat-progress-spinner [diameter]="30" mode="indeterminate"
                                  [matTooltip]="'Fetch e-commerce settings'"
                                  color="primary">
            </mat-progress-spinner>
          </div>
          <form *ngIf="!ecommerceGetProgress && ecommerceForm" [formGroup]="ecommerceForm"
                style="margin-top: 16px; margin-bottom: 100px"
                class="col-xl-9 col-lg-9 col-md-10 col-sm-11 col-12">

            <h2 style="margin-top: 8px">Shop</h2>
            <div style="display: flex;align-items: center">
              <mat-card>
                <mat-icon color="primary" style="font-size: 60px; height: 60px; width: 60px">store</mat-icon>
              </mat-card>
              <h1 style="margin-left: 8px">{{selectedShop.businessName}}</h1>
            </div>

            <h2 style="margin-top: 8px">Logo</h2>
            <mat-card>
              <img alt="Logo" mat-card-image [src]="ecommerceForm.value.logo">
              <mat-card-actions>
                <button (click)="browseMedia('logo',$event)" mat-flat-button>
                  Upload Logo
                </button>
              </mat-card-actions>
            </mat-card>
            <div style="height: 20px"></div>

            <h2 style="margin-top: 8px">Cover</h2>
            <mat-card>
              <img alt="Logo" mat-card-image [src]="ecommerceForm.value.cover">
              <mat-card-actions>
                <button (click)="browseMedia('cover', $event)" mat-flat-button>
                  Upload Cover Photo
                </button>
              </mat-card-actions>
            </mat-card>
            <div style="height: 20px"></div>

            <h2 style="margin-top: 8px">Description</h2>
            <mat-card>
              <mat-dialog-content>
                <mat-form-field appearance="outline">
                  <mat-label>About</mat-label>
                  <textarea matInput rows="3" formControlName="about"></textarea>
                  <mat-error>About required and must be at least 50 words</mat-error>
                </mat-form-field>
              </mat-dialog-content>
              <!--              <mat-card-actions>-->
              <!--                <button (click)="browseMedia('cover')" mat-flat-button>-->
              <!--                  Upload Cover Photo-->
              <!--                </button>-->
              <!--              </mat-card-actions>-->
            </mat-card>
            <div style="height: 20px"></div>

            <h2 style="margin-top: 8px">Social</h2>
            <mat-card formGroupName="social">
              <mat-dialog-content>
                <mat-form-field appearance="outline">
                  <mat-label>Instagram</mat-label>
                  <input matInput type="url" formControlName="instagram">
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Twitter</mat-label>
                  <input matInput type="url" formControlName="twitter">
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Facebook</mat-label>
                  <input matInput type="url" formControlName="facebook">
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>WhatsApp</mat-label>
                  <input matInput type="number" formControlName="whatsapp">
                </mat-form-field>
              </mat-dialog-content>
            </mat-card>
            <div style="height: 20px"></div>

            <button [disabled]="ecommerceSaveProgress"
                    style="margin-top: 16px"
                    color="primary"
                    mat-flat-button
                    (click)="saveEcommerceDetails()"
                    class="btn-block ft-button">
              Update E-Commerce Details
              <mat-progress-spinner style="display: inline-block" *ngIf="ecommerceSaveProgress" [diameter]="20"
                                    color="primary"
                                    mode="indeterminate">
              </mat-progress-spinner>
            </button>

          </form>

        </div>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ['../style/setting.style.scss']
})
export class EcommercePage extends DeviceInfoUtil implements OnInit {
  ecommerceForm: FormGroup;
  ecommerceGetProgress = false;
  ecommerceSaveProgress = false;
  selectedShop: ShopModel;

  constructor(private readonly formBuilder: FormBuilder,
              private readonly snack: MatSnackBar,
              private readonly eventApi: EventService,
              private readonly activatedRoute: ActivatedRoute,
              private readonly router: Router,
              private readonly dialog: MatDialog,
              private readonly userService: UserService,
              private readonly messageService: MessageService,
              private readonly ecommerceService: EcommerceService) {
    super();
    document.title = 'SmartStock - E-Commerce Settings';
  }

  ngOnInit(): void {
    this.getEcommerce();
  }

  private getEcommerce(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params && params.shop) {
        this.ecommerceGetProgress = true;
        this.userService.currentUser().then(user => {
          return this.userService.getShops(user);
        }).then((shops: ShopModel[]) => {
          const shop = shops.filter(x => x.projectId === params.shop);
          if (shop && shop[0] && shop[0].businessName) {
            this.selectedShop = shop[0];
            return this.selectedShop && this.selectedShop.ecommerce ? this.selectedShop.ecommerce : {
              cover: '',
              about: '',
              logo: '',
              social: {},
              faq: []
            };
          } else {
            this.goToIndex();
            throw new Error('bad shop data');
          }
        }).then((value: EcommerceModel) => {
          this.initEcommerceForm(value);
          this.ecommerceGetProgress = false;
        }).catch(_ => {
          this.initEcommerceForm({
            cover: '',
            about: '',
            logo: '',
            social: {},
            // faq: []
          });
          this.ecommerceGetProgress = false;
        });
      } else {
        this.goToIndex();
      }
    }, error => {
      this.goToIndex();
    });
  }

  private goToIndex(): void {
    this.router.navigateByUrl('/account').catch();
  }

  private initEcommerceForm(ecommerce: EcommerceModel): void {
    this.ecommerceForm = this.formBuilder.group({
      logo: [ecommerce.logo, [Validators.required, Validators.nullValidator]],
      about: [ecommerce.about, [Validators.nullValidator, Validators.required, Validators.minLength(50)]],
      cover: [ecommerce.cover, [Validators.required, Validators.nullValidator]],
      social: this.formBuilder.group({
        instagram: [ecommerce.social?.instagram],
        twitter: [ecommerce.social?.twitter],
        facebook: [ecommerce.social?.facebook],
        whatsapp: [ecommerce.social?.whatsapp],
      }),
      // faq: [this.formBuilder.array(
      //   ecommerce.faq?.map(x => {
      //     return this.formBuilder.group({
      //       question: [x.question],
      //       answer: [x.answer],
      //     });
      //   })
      // )],
    });
  }

  saveEcommerceDetails(): void {
    if (this.ecommerceForm.valid) {
      this.ecommerceSaveProgress = true;
      this.ecommerceService.updateEcommerceDetails(this.ecommerceForm.value, this.selectedShop).then(value => {
        this.messageService.showMobileInfoMessage('E-Commerce details updated', 4000, 'bottom');
        this.updateEcommerceForSelectedShop(value, this.selectedShop);
      }).finally(() => {
        this.ecommerceSaveProgress = false;
      });
    } else {
      this.messageService.showMobileInfoMessage('Please fill all required detail and submit again',
        2000, 'bottom');
    }
  }

  browseMedia(controlName: string, $event: MouseEvent): void {
    $event.preventDefault();
    this.userService.getCurrentShop().then(shop => {
      this.dialog.open(FileBrowserDialogComponent, {
        closeOnNavigation: false,
        disableClose: true,
        data: {
          shop
        }
      }).afterClosed().subscribe(value => {
        if (value && value.url) {
          this.ecommerceForm.get(controlName).setValue(value.url);
        } else {
          this.messageService.showMobileInfoMessage('Media not selected', 2000, 'bottom');
        }
      });
    });
  }

  private updateEcommerceForSelectedShop(ecommerceModel: EcommerceModel, selectedShop: ShopModel): void {
    this.userService.currentUser().then(user => {
      return this.userService.getShops(user);
    }).then(async shops => {
      selectedShop.ecommerce = ecommerceModel;
      return this.userService.updateShops(shops.map(x => {
          if (x.projectId === selectedShop.projectId) {
            return this.selectedShop;
          } else {
            return x;
          }
        })
        , await this.userService.currentUser());
    }).catch(_ => {
    });
  }
}
