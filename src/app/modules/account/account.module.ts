import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes, ROUTES} from '@angular/router';
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
import {UsersComponent} from './components/users.component';
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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {LibModule} from '@smartstocktz/core-libs';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatLineModule, MatOptionModule, MatRippleModule} from '@angular/material/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import {MatChipsModule} from '@angular/material/chips';
import {MatPaginatorModule} from '@angular/material/paginator';
import {UsersCreatePage} from './pages/users-create.page';
import {UsersCreateFormComponent} from './components/users-create-form.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ShopDeleteConfirmDialogComponent} from './components/shop-delete-confirm-dialog.component';
import {AccountsNavigationService} from './services/accounts-navigation.service';

const routes: Routes = [
  {path: '', canActivate: [], component: IndexPage},
  {path: 'shop', canActivate: [AuthenticationGuard], component: ChooseShopPage},
  {path: 'shops', canActivate: [AuthenticationGuard], component: ShopsPage},
  {path: 'shops/:shop/settings', canActivate: [AuthenticationGuard], component: SettingsPage},
  {path: 'shops/:shop/ecommerce', canActivate: [AuthenticationGuard], component: EcommercePage},
  {path: 'login', canActivate: [AuthenticatedUserGuard], component: LoginPage},
  {path: 'register', canActivate: [AuthenticatedUserGuard], component: RegisterPage},
  {path: 'bill', canActivate: [AuthenticationGuard], component: BillingPage},
  {path: 'users', canActivate: [AuthenticationGuard], component: UsersPage},
  {path: 'users/create', canActivate: [AuthenticationGuard], component: UsersCreatePage},
  {path: 'profile', canActivate: [AuthenticationGuard], component: ProfilePage},
];

@NgModule({
  declarations: [
    ShopDeleteConfirmDialogComponent,
    BillingPage,
    UsersCreateFormComponent,
    UsersCreatePage,
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
    UsersComponent,
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
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatCardModule,
    LibModule,
    MatListModule,
    MatIconModule,
    MatDialogModule,
    MatOptionModule,
    MatExpansionModule,
    MatStepperModule,
    MatTooltipModule,
    MatSidenavModule,
    MatTabsModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatTableModule,
    MatChipsModule,
    MatLineModule,
    MatRippleModule,
    MatPaginatorModule,
    MatCheckboxModule,
    FormsModule,
  ],
  exports: [],
})
export class AccountModule {
  constructor(private readonly accNav: AccountsNavigationService) {
    this.accNav.init();
    this.accNav.selected();
  }// end
}

