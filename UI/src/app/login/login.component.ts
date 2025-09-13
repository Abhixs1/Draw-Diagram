import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  MsalService,
  MsalBroadcastService,
  MSAL_GUARD_CONFIG,
} from '@azure/msal-angular';
import type { MsalGuardConfiguration } from '@azure/msal-angular';
import {
  RedirectRequest,
  AuthenticationResult,
  InteractionStatus,
} from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import {
  MatCardModule
} from '@angular/material/card';
import {
  MatButtonModule
} from '@angular/material/button';
import {
  MatIconModule
} from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoggingIn = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ✅ Handle redirect after MS login completes
    this.authService.handleRedirectObservable().subscribe({
      next: (result: AuthenticationResult | null) => {
        if (result) {
          this.authService.instance.setActiveAccount(result.account);
          this.router.navigate(['/home'], { replaceUrl: true }); // 👈 prevents back nav to /login
        }
      },
      error: (err) => console.error('Redirect error:', err),
    });

    // ✅ Handle if already logged in (MSAL restored session)
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        const account = this.authService.instance.getActiveAccount();
        if (account) {
          this.router.navigate(['/home'], { replaceUrl: true }); // 👈 same here
        }
      });
  }

  loginRedirect(): void {
    if (this.isLoggingIn) return;
    this.isLoggingIn = true;

    const loginRequest = this.msalGuardConfig.authRequest
      ? { ...this.msalGuardConfig.authRequest }
      : {};

    this.authService.loginRedirect(loginRequest as RedirectRequest);
  }

  ngOnDestroy(): void {
    this._destroying$.next();
    this._destroying$.complete();
  }
}
