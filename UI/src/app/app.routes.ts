import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './Home/home/home.component';
import { MsalGuard } from '@azure/msal-angular';
import { ParentComponent } from './studio/parent/parent.component';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'home',
        component: HomeComponent,
         canActivate:[MsalGuard]
    },
    {
        path:'home/studio',
        component: ParentComponent, 
        canActivate: [MsalGuard]
    },
];
