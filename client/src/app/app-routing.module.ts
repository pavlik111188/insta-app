import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { HomeComponent } from './core/home/home.component';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { LayoutComponent } from './core/layout/layout.component';

const appRoutes: Routes = [
    // { path: '', component: HomeComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      }
    ],
    canActivate: [AuthGuard]
  },
  { path: 'dashboard', component: HomeComponent, canActivate: [AuthGuard]}
];

@NgModule({
    providers: [
        AuthGuard
    ],
    imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
    exports: [RouterModule]
})
export class AppRoutingModule {}
