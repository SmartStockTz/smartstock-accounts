import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes, ROUTES } from "@angular/router";
import { AuthenticationGuard } from "./guards/authentication.guard";
import { AuthenticatedUserGuard } from "./guards/authenticated-user.guard";
import { AddressComponent } from "./components/address.component";
import { BusinessDetailsFormComponent } from "./components/business-details-form.component";
import { CreateShopDialogComponent } from "./components/create-shop-dialog.component";
import { CredentialsComponent } from "./components/credentials.component";
import { HowToPayComponent } from "./components/how-to-pay.component";
import { LoginDetailsFormComponent } from "./components/login-details-form.component";
import { MobilePayDetailsComponent } from "./components/mobile-pay-details.component";
import { PersonalDetailsFormComponent } from "./components/personal-details-form.component";
import { PersonalComponent } from "./components/personal.component";
import { ReceiptComponent } from "./components/receipt.component";
import { RegisterDialogComponent } from "./components/register-dialog.component";
import { ResetPasswordComponent } from "./components/reset-password.component";
import { ShopLogoFormComponent } from "./components/shop-logo-form.component";
import { ShopsOptionsSheetComponent } from "./components/shops-options-sheet.component";
import { UserDeleteDialogComponent } from "./components/user-delete-dialog.component";
import { UserUpdateDialogComponent } from "./components/user-update-dialog.component";
import { UsersComponent } from "./components/users.component";
import { VerifyDialogComponent } from "./components/verify-dialog.component";
import { PaymentPage } from "./pages/payment.page";
import { ChooseShopPage } from "./pages/choose-shop.page";
import { SettingsEcommercePage } from "./pages/settings-ecommerce.page";
import { IndexPage } from "./pages/index.page";
import { LoginPage } from "./pages/login.page";
import { ProfilePage } from "./pages/profile.page";
import { RegisterPage } from "./pages/register.page";
import { SettingsGeneralPage } from "./pages/settings-general.page";
import { ShopsPage } from "./pages/shops.page";
import { UsersPage } from "./pages/users.page";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { LibModule } from "smartstock-core";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import {
  MatLineModule,
  MatOptionModule,
  MatRippleModule
} from "@angular/material/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTabsModule } from "@angular/material/tabs";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatMenuModule } from "@angular/material/menu";
import { MatTableModule } from "@angular/material/table";
import { MatChipsModule } from "@angular/material/chips";
import { MatPaginatorModule } from "@angular/material/paginator";
import { UsersCreatePage } from "./pages/users-create.page";
import { UsersCreateFormComponent } from "./components/users-create-form.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ShopDeleteConfirmDialogComponent } from "./components/shop-delete-confirm-dialog.component";
import { AccountsNavigationService } from "./services/accounts-navigation.service";
import { ManagerRoleGuard } from "./guards/manager-role.guard";
import { UsersContextComponent } from "./components/users-context.component";
import { UsersMobileComponent } from "./components/users-mobile.component";
import { ShopsContextComponent } from "./components/shops-context.component";
import { ShopsTableComponent } from "./components/shops-table.component";
import { ShopsOptionsComponent } from "./components/shops-options.component";
import { ShopsOptionsDialogComponent } from "./components/shops-options-dialog.component";
import { ShopsListComponent } from "./components/shops-list.component";
import { SettingsEcommerceComponent } from "./components/settings-ecommerce.component";
import { SettingsGeneralComponent } from "./components/settings-general.component";
import { PaymentComponent } from "./components/payment.component";
import { PaymentHeaderComponent } from "./components/payment-header.component";
import { PaymentModesComponent } from "./components/payment-modes.component";
import { PaymentModesMobileComponent } from "./components/payment-modes-mobile.component";
import { CreateSecondaryShopComponent } from "./components/create-secondary-shop-form.component";
import { CreateShopSheetComponent } from "./components/create-shop-sheet.component";

const routes: Routes = [
  { path: "", canActivate: [], component: IndexPage },
  {
    path: "shop",
    canActivate: [AuthenticationGuard],
    component: ChooseShopPage
  },
  { path: "shops", canActivate: [ManagerRoleGuard], component: ShopsPage },
  {
    path: "shops/:shop/settings",
    canActivate: [ManagerRoleGuard],
    component: SettingsGeneralPage
  },
  {
    path: "shops/:shop/ecommerce",
    canActivate: [ManagerRoleGuard],
    component: SettingsEcommercePage
  },
  {
    path: "login",
    canActivate: [AuthenticatedUserGuard],
    component: LoginPage
  },
  {
    path: "register",
    canActivate: [AuthenticatedUserGuard],
    component: RegisterPage
  },
  { path: "bill", canActivate: [AuthenticationGuard], component: PaymentPage },
  { path: "users", canActivate: [ManagerRoleGuard], component: UsersPage },
  {
    path: "users/create",
    canActivate: [ManagerRoleGuard],
    component: UsersCreatePage
  },
  {
    path: "profile",
    canActivate: [AuthenticationGuard],
    component: ProfilePage
  }
];

@NgModule({
  declarations: [
    UsersMobileComponent,
    ShopsContextComponent,
    ShopsTableComponent,
    ShopsOptionsComponent,
    ShopsOptionsDialogComponent,
    ShopsListComponent,
    UsersContextComponent,
    ShopDeleteConfirmDialogComponent,
    PaymentPage,
    UsersCreateFormComponent,
    UsersCreatePage,
    ChooseShopPage,
    SettingsEcommercePage,
    IndexPage,
    LoginPage,
    ProfilePage,
    RegisterPage,
    SettingsGeneralPage,
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
    ShopsOptionsSheetComponent,
    SettingsEcommerceComponent,
    SettingsGeneralComponent,
    PaymentComponent,
    PaymentHeaderComponent,
    PaymentModesComponent,
    PaymentModesMobileComponent,
    CreateSecondaryShopComponent,
    CreateShopSheetComponent,
    UserDeleteDialogComponent,
    UserUpdateDialogComponent,
    UsersComponent,
    VerifyDialogComponent
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
    FormsModule
  ],
  exports: []
})
export class AccountModule {
  constructor(private readonly accNav: AccountsNavigationService) {
    this.accNav.init();
    this.accNav.selected();
  } // end
}
