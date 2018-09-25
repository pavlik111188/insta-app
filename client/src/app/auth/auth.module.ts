import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';

import {AuthRoutingModule} from './auth-routing.module';
import {SharedModule} from '../shared/shared.module';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {LogoutComponent} from './logout/logout.component';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    LogoutComponent
  ],
  imports: [
    AuthRoutingModule,
    SharedModule
  ],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AuthModule {}
