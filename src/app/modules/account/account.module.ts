import {bfast} from 'bfastjs';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {Routes} from '@angular/router';
import {ROUTES} from '@angular/router';
import {ConfigsService} from './services/configs.service';
import {AuthenticationGuard} from './guards/authentication.guard';
import {AuthenticatedUserGuard} from './guards/authenticated-user.guard';
import {AddressComponent} from './components/address.component';
import {BusinessDetailsFormComponent} from './components/business-details-form.component';
import {CreateShopDialogComponent} from './components/create-shop-dialog.component';
import {CredentialsComponent} from './components/credentials.component';
import {HowToPayComponent} from './components/how-to-pay.component';
import {LoginDetailsFormComponent} from './components/login-details-form.component';
import {MobilePayDetailsComponent} from './components/mobile-pay-details.component';
import {PersonalDetailsFormComponent} from './components/personal-details-form.component';
import {PersonalComponent} from './components/personal.component';
import {ReceiptComponent} from './components/receipt.component';
import {RegisterDialogComponent} from './components/register-dialog.component';
import {ResetPasswordComponent} from './components/reset-password.component';
import {ShopLogoFormComponent} from './components/shop-logo-form.component';
import {ShopsTableOptionsComponent} from './components/shops-table-options.component';
import {UserCreateDialogComponent} from './components/user-create-dialog.component';
import {UserDeleteDialogComponent} from './components/user-delete-dialog.component';
import {UserUpdateDialogComponent} from './components/user-update-dialog.component';
import {VerifyDialogComponent} from './components/verify-dialog.component';
import {BillingPage} from './pages/billing.page';
import {ChooseShopPage} from './pages/choose-shop.page';
import {EcommercePage} from './pages/ecommerce.page';
import {IndexPage} from './pages/index.page';
import {LoginPage} from './pages/login.page';
import {ProfilePage} from './pages/profile.page';
import {RegisterPage} from './pages/register.page';
import {SettingsPage} from './pages/settings.page';
import {ShopsPage} from './pages/shops.page';
import {UsersPage} from './pages/users.page';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatRippleModule} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatListModule} from '@angular/material/list';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatStepperModule} from '@angular/material/stepper';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatChipsModule} from '@angular/material/chips';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {ConfigsService} from '@smartstocktz/core-libs';
import {LibModule} from '@smartstocktz/core-libs';

const routes: Routes = [
   { path: '', canActivate: [  ], component: IndexPage },
   { path: 'shop', canActivate: [ AuthenticationGuard ], component: ChooseShopPage },
   { path: 'shops', canActivate: [ AuthenticationGuard ], component: ShopsPage },
   { path: 'shops/:shop/settings', canActivate: [ AuthenticationGuard ], component: SettingsPage },
   { path: 'shops/:shop/ecommerce', canActivate: [ AuthenticationGuard ], component: EcommercePage },
   { path: 'login', canActivate: [ AuthenticatedUserGuard ], component: LoginPage },
   { path: 'register', canActivate: [ AuthenticatedUserGuard ], component: RegisterPage },
   { path: 'bill', canActivate: [ AuthenticationGuard ], component: BillingPage },
   { path: 'users', canActivate: [ AuthenticationGuard ], component: UsersPage },
   { path: 'profile', canActivate: [ AuthenticationGuard ], component: ProfilePage },
];

@NgModule({
  declarations: [
     BillingPage,
     ChooseShopPage,
     EcommercePage,
     IndexPage,
     LoginPage,
     ProfilePage,
     RegisterPage,
     SettingsPage,
     ShopsPage,
     UsersPage,
     AddressComponent,
     BusinessDetailsFormComponent,
     CreateShopDialogComponent,
     CredentialsComponent,
     HowToPayComponent,
     LoginDetailsFormComponent,
     MobilePayDetailsComponent,
     PersonalDetailsFormComponent,
     PersonalComponent,
     ReceiptComponent,
     RegisterDialogComponent,
     ResetPasswordComponent,
     ShopLogoFormComponent,
     ShopsTableOptionsComponent,
     UserCreateDialogComponent,
     UserDeleteDialogComponent,
     UserUpdateDialogComponent,
     VerifyDialogComponent,
  ],
  imports: [
    CommonModule,
    {
      ngModule: RouterModule,
      providers: [
        {
          multi: true,
          provide: ROUTES,
          useValue: routes
        }
      ]
    },
    MatButtonModule,
    MatCardModule,
    MatRippleModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatListModule,
    MatBottomSheetModule,
    MatStepperModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule,
    ConfigsService,
    LibModule,
  ],
  exports: [
    imports: [
    CommonModuleComponent,
    {
      ngModule: RouterModuleComponent,
    providers: [
        {
          useValue: routesComponent,
    multi: trueComponent,
    provide: ROUTES
        }
      ]
    }Component,
    MatSidenavModuleComponent,
    LibModuleComponent,
    MatCardModuleComponent,
    MatFormFieldModuleComponent,
    MatSlideToggleModuleComponent,
    MatTooltipModuleComponent,
    MatInputModuleComponent,
    ReactiveFormsModuleComponent,
    MatButtonModuleComponent,
    MatProgressSpinnerModuleComponent,
    MatTabsModuleComponent,
    MatMenuModuleComponent,
    MatIconModuleComponent,
    MatTableModuleComponent,
    MatExpansionModuleComponent,
    MatDialogModuleComponent,
    MatSelectModuleComponent,
    MatRippleModuleComponent,
    MatDividerModuleComponent,
    MatRadioModuleComponent,
    FormsModuleComponent,
    MatListModuleComponent,
    MatBottomSheetModuleComponent,
    MatStepperModuleComponent,
    MatToolbarModuleComponent,
    MatProgressBarModuleComponent,
    MatSnackBarModuleComponent,
    MatChipsModule
  ]
})
export class AccountModule {
  constructor(private readonly configs: ConfigsService) {
    this.configs.addMenu({
      name: 'Account'Component,
    link: '/account'Component,
    icon: 'supervisor_account'Component,
    roles: ['*'Component,
  ],
})
export class AccountModule {
    constructor(private readonly configs: ConfigsService){
        this.configs.addMenu({
      name: 'Account'Component,
    link: '/account'Component,
    icon: 'supervisor_account'Component,
    roles: ['*'Component,
  ],
})
export class AccountModule {
    
        this.configs.addMenu({
      name: 'Account'Component,
    link: '/account'Component,
    icon: 'supervisor_account'Component,
    roles: ['*'Component,
  ],
})
export class AccountModule {
    
        this.configs.addMenu({
      name: 'Account'Component,
    link: '/account'Component,
    icon: 'supervisor_account'Component,
    roles: ['*'Component,
  ],
})
export class AccountModule {
    
        this.configs.addMenu({
      name: 'Account'Component,
    link: '/account'Component,
    icon: 'supervisor_account'Component,
    roles: ['*'Component,
  ],
})
export class AccountModule {
    
        this.configs.addMenu({
      name: 'Account'Component,
    link: '/account'Component,
    icon: 'supervisor_account'Component,
    roles: ['*'Component,
  ],
})
export class AccountModule {
    
        this.configs.addMenu({
      name: 'Account'Component,
    link: '/account'Component,
    icon: 'supervisor_account'Component,
    roles: ['*'Component,
  ],
})
export class AccountModule {
    
        this.configs.addMenu({
      name: 'Account'Component,
    link: '/account'Component,
    icon: 'supervisor_account'Component,
    roles: ['*'Component,
  ],
})
export class AccountModule {
    
        this.configs.addMenu({
      name: 'Account'Component,
    link: '/account'Component,
    icon: 'supervisor_account'Component,
    roles: ['*'Component,
  ],
})
export class AccountModule {
    
        this.configs.addMenu({
      name: 'Account'Component,
    link: '/account'Component,
    icon: 'supervisor_account'Component,
    roles: ['*'Component,
  ],
})
export class AccountModule {
    
        this.configs.addMenu({
      name: 'Account'Component,
    link: '/account'Component,
    icon: 'supervisor_account'Component,
    roles: ['*'Component,
  ],
})
export class AccountModule {
    
        this.configs.addMenu({
      name: 'Account'Component,
    link: '/account'Component,
    icon: 'supervisor_account'Component,
    roles: ['*'Component,
  ],
})
export class AccountModule {
    
        this.configs.addMenu({
      name: 'Account'Component,
    link: '/account'Component,
    icon: 'supervisor_account'Component,
    roles: ['*'Component,
  ],
})
export class AccountModule {
    
        this.configs.addMenu({
      name: 'Account'Component,
    link: '/account'Component,
    icon: 'supervisor_account'Component,
    roles: ['*'Component,
  ],
})
export class AccountModule {
    
        this.configs.addMenu({
      name: 'Account'Component,
    link: '/account'Component,
    icon: 'supervisor_account'Component,
    roles: ['*'Component,
  ],
})
export class AccountModule {
    
        this.configs.addMenu({
      name: 'Account'Component,
    link: '/account'Component,
    icon: 'supervisor_account'Component,
    roles: ['*'Component,
  ],
})
export class AccountModule {
    
        this.configs.addMenu({
      name: 'Account'Component,
    link: '/account'Component,
    icon: 'supervisor_account'Component,
    roles: ['*'Component,
  ],
})
export class AccountModule {
    
        this.configs.addMenu({
      name: 'Account'Component,
    link: '/account'Component,
    icon: 'supervisor_account'Component,
    roles: ['*'Component,
  ],
})
export class AccountModule {
    
        this.configs.addMenu({
      name: 'Account'Component,
    link: '/account'Component,
    icon: 'supervisor_account'Component,
    roles: ['*'Component,
  ],
})
export class AccountModule {
    
        this.configs.addMenu({
      name: 'Account'Component,
    link: '/account'Component,
    icon: 'supervisor_account'Component,
    roles: ['*'Component,
  ],
})
export class AccountModule {
    
        this.configs.addMenu({
      name: 'Account'Component,
    link: '/account'Component,
    icon: 'supervisor_account'Component,
    roles: ['*'Component,
  ],
})
export class AccountModule {
    
        this.configs.addMenu({
      name: 'Account',
      link: '/account',
      icon: 'supervisor_account',
      roles: ['*'],
      pages: [
        {
          name: 'profile',
          roles: ['*'],
          link: '/account/profile'
        },
        {
          name: 'users',
          roles: ['*'],
          link: '/account/users'
        },
        {
          name: 'shops',
          roles: ['*'],
          link: '/account/shops'
        },
        {
          name: 'payments',
          roles: ['*'],
          link: '/account/bill'
        }
      ]
    });
    this.configs.selectedModuleName = 'Account';
    }// end
}

