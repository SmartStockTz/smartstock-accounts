import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes, ROUTES} from '@angular/router';

import {AuthGuard} from './guards/auth.guard';
import {LoginComponent} from './components/login.component';
import {LoginPage} from './pages/login.page';
import {WelcomePage} from './pages/welcome.page';
import {MatCardModule} from '@angular/material/card';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

const routes: Routes = [
  {path: 'login', canActivate: [AuthGuard], component: LoginPage},
  {path: '', canActivate: [AuthGuard], component: WelcomePage},
];

@NgModule({
  declarations: [
    LoginPage,
    WelcomePage,
    LoginComponent,
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
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatButtonModule,
  ],
  exports: [],
})
export class MockModule {
  constructor() {

  }// end
}

