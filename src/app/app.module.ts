import {init} from 'bfast';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {RouterModule, Routes} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatSelectModule} from '@angular/material/select';
import {environment} from '../environments/environment';
import {AngularHttpService} from './modules/mock/services/angular-http.service';

const routes: Routes = [
  {path: '', canActivate: [], loadChildren: () => import('./modules/mock/mock.module').then(mod => mod.MockModule)},
  {path: 'dashboard', redirectTo: 'account'},
  {path: 'account', canActivate: [], loadChildren: () => import('./modules/account/public').then(mod => mod.AccountModule)},
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    HttpClientModule,
    MatDialogModule,
    MatBottomSheetModule,
    MatSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private readonly httpClient: HttpClient) {
    init({
      applicationId: 'smartstock_lb',
      projectId: 'smartstock',
      appPassword: 'ZMUGVn72o3yd8kSbMGhfWpI80N9nA2IHjxWKlAhG',
      databaseURL: `${environment.localBaseUrl}`,
      functionsURL: `${environment.localBaseUrl}`,
      adapters: {
        http: c => new AngularHttpService(this.httpClient)
      }
    });
  }// end
}

