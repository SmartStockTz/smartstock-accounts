import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {WelcomePage} from './pages/welcome.page';
import {LoginPageComponent} from './pages/login.page';
import {AuthGuard} from './guards/auth.guard';

const routes: Routes = [
  {path: '', component: WelcomePage},
  {path: 'login', component: LoginPageComponent},
  {path: 'account', canActivate: [AuthGuard], loadChildren: () => import('../../../accounts/src/public-api').then(mod => mod.AccountModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
