import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SignupComponent} from './signup/signup.component';
import {LoginComponent} from './login/login.component';
import {LogoutComponent} from './logout/logout.component';
import {ForgotComponent} from './forgot/forgot.component';
import {ResetComponent} from "./reset/reset.component";

const authRoutes: Routes = [
  { path: 'signup', component: SignupComponent},
  { path: 'login', component: LoginComponent},
  { path: 'logout', component: LogoutComponent},
  { path: 'reset_password/:token', component: ResetComponent},
  { path: 'forgot', component: ForgotComponent}
];

@NgModule({
    imports: [
        RouterModule.forChild(authRoutes)
    ],
    exports: [RouterModule]
})
export class AuthRoutingModule {}
