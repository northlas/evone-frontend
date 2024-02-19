import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { authenticationGuard } from './guard/authentication.guard';
import { authorizationGuard } from './guard/authorization.guard';

const routes: Routes = [
  {path: 'login', component:LoginComponent, title: 'Login'},
  {path: '', title:'Evone', canActivate: [authenticationGuard],  canActivateChild: [authorizationGuard], children: [
    {path: 'dashboard', component: DashboardComponent, title: 'Dashboard', data: {'path': '/dashboard'}}
  ]}
];
11
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
