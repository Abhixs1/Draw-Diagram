import { ViewChild, Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DiagramService } from 'src/app/studio/services/diagram.service';
import { SafeHtml } from '@angular/platform-browser';


import {
  MsalService,
  MsalModule,
  MsalBroadcastService,
  MSAL_GUARD_CONFIG,
} from '@azure/msal-angular';

import type { MsalGuardConfiguration } from '@azure/msal-angular';

import {
  AuthenticationResult,
  InteractionStatus,
  RedirectRequest,
  EventMessage,
  EventType,
} from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { GraphSService } from '../../studio/services/graph-s.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatCardModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MsalModule,
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();
  userName: string = '';
  userPhotoUrl?: SafeUrl ;
  initials: string | undefined;
  userPrincipalName: string | undefined;
  documents: any[] = [];
  isProfileLoaded = false;
  isLoggingIn = false;
  diagrams: any[] = [];
  isLoading = false;
  error: string | null = null;
  profileUserName: string = '';

templates: { title: string; file: string; type: string; icon: string; safeIcon?: SafeHtml }[] = [
  {
    title: 'Business Process',
    file: 'business-process',
    type: 'bpmn',
   icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="80" height="80">
  <defs>
    <linearGradient id="processGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e40af;stop-opacity:0.08" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.03" />
    </linearGradient>
    <linearGradient id="startGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#059669;stop-opacity:0.12" />
      <stop offset="100%" style="stop-color:#10b981;stop-opacity:0.06" />
    </linearGradient>
    <linearGradient id="endGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#dc2626;stop-opacity:0.12" />
      <stop offset="100%" style="stop-color:#ef4444;stop-opacity:0.06" />
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="#000" flood-opacity="0.15"/>
    </filter>
  </defs>
  
  <!-- Background process lane -->
  <rect x="2" y="8" width="44" height="32" rx="3" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" opacity="0.8"/>
  
  <!-- Start Event -->
  <circle cx="10" cy="24" r="5" fill="url(#startGrad)" stroke="#059669" stroke-width="2" filter="url(#shadow)"/>
  <circle cx="10" cy="24" r="2.5" fill="#059669" opacity="0.3"/>
  
  <!-- Task 1 -->
  <rect x="20" y="18" width="14" height="12" rx="2" fill="url(#processGrad)" stroke="#1e40af" stroke-width="1.5" filter="url(#shadow)"/>
  <circle cx="22.5" cy="21" r="1" fill="#1e40af" opacity="0.6"/>
  <rect x="25" y="20" width="7" height="1" fill="#1e40af" opacity="0.7"/>
  <rect x="25" y="22" width="5" height="1" fill="#1e40af" opacity="0.5"/>
  <rect x="25" y="26" width="6" height="1" fill="#1e40af" opacity="0.5"/>
  
  <!-- Gateway -->
  <polygon points="40,18 46,24 40,30 34,24" fill="#fef3c7" stroke="#d97706" stroke-width="1.5" filter="url(#shadow)"/>
  <path d="M37 21 L43 27 M43 21 L37 27" stroke="#d97706" stroke-width="1.5"/>
  
  <!-- Task 2 (Yes path) -->
  <rect x="28" y="6" width="12" height="8" rx="1.5" fill="url(#processGrad)" stroke="#1e40af" stroke-width="1.5" filter="url(#shadow)"/>
  <circle cx="29.5" cy="8.5" r="0.8" fill="#1e40af" opacity="0.6"/>
  <rect x="31.5" y="8" width="5" height="0.8" fill="#1e40af" opacity="0.7"/>
  <rect x="31.5" y="10" width="3.5" height="0.8" fill="#1e40af" opacity="0.5"/>
  
  <!-- Task 3 (No path) -->
  <rect x="28" y="34" width="12" height="8" rx="1.5" fill="url(#processGrad)" stroke="#1e40af" stroke-width="1.5" filter="url(#shadow)"/>
  <circle cx="29.5" cy="36.5" r="0.8" fill="#1e40af" opacity="0.6"/>
  <rect x="31.5" y="36" width="5" height="0.8" fill="#1e40af" opacity="0.7"/>
  <rect x="31.5" y="38" width="4" height="0.8" fill="#1e40af" opacity="0.5"/>
  
  <!-- End Event -->
  <circle cx="42" cy="24" r="4" fill="url(#endGrad)" stroke="#dc2626" stroke-width="2.5" filter="url(#shadow)"/>
  
  <!-- Clean flow lines (no arrows) -->
  <path d="M15 24 L20 24" stroke="#64748b" stroke-width="1.5"/>
  <path d="M34 24 L34 24" stroke="#64748b" stroke-width="1.5"/>
  <path d="M40 18 L34 10" stroke="#64748b" stroke-width="1.5"/>
  <path d="M40 30 L34 38" stroke="#64748b" stroke-width="1.5"/>
  <path d="M40 10 Q42 8 42 20" stroke="#64748b" stroke-width="1.5" fill="none"/>
  <path d="M40 38 Q42 40 42 28" stroke="#64748b" stroke-width="1.5" fill="none"/>
</svg>`
  },
  {
    title: 'Scrum Board',
    file: 'standup-board',
    type: 'standard',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24">
<rect x="2" y="4" width="6" height="16" fill="none" stroke="#4285f4" stroke-width="1.5" rx="1"/>
<text x="5" y="7" text-anchor="middle" font-family="Arial" font-size="3" fill="#4285f4">To Do</text>
<rect x="9" y="4" width="6" height="16" fill="none" stroke="#34a853" stroke-width="1.5" rx="1"/>
<text x="12" y="7" text-anchor="middle" font-family="Arial" font-size="3" fill="#34a853">Doing</text>
<rect x="16" y="4" width="6" height="16" fill="none" stroke="#ea4335" stroke-width="1.5" rx="1"/>
<text x="19" y="7" text-anchor="middle" font-family="Arial" font-size="3" fill="#ea4335">Done</text>
<rect x="3" y="9" width="4" height="2" fill="#e8f0fe" stroke="#4285f4" stroke-width="0.5" rx="0.5"/>
<rect x="3" y="12" width="4" height="2" fill="#e8f0fe" stroke="#4285f4" stroke-width="0.5" rx="0.5"/>
<rect x="10" y="9" width="4" height="2" fill="#e6f4ea" stroke="#34a853" stroke-width="0.5" rx="0.5"/>
<rect x="17" y="9" width="4" height="2" fill="#fce8e6" stroke="#ea4335" stroke-width="0.5" rx="0.5"/>
<rect x="17" y="12" width="4" height="2" fill="#fce8e6" stroke="#ea4335" stroke-width="0.5" rx="0.5"/>
<rect x="17" y="15" width="4" height="2" fill="#fce8e6" stroke="#ea4335" stroke-width="0.5" rx="0.5"/>
</svg>`
  },
  {
    title: 'Decision Tree',
    file: 'decision-tree',
    type: 'decisiontree',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24">
<rect x="10" y="2" width="4" height="3" fill="#6c5ce7" stroke="#5b4cdb" stroke-width="1" rx="1"/>
<rect x="3" y="8" width="3" height="2.5" fill="#74b9ff" stroke="#0984e3" stroke-width="1" rx="0.5"/>
<rect x="7.5" y="8" width="3" height="2.5" fill="#00b894" stroke="#00a085" stroke-width="1" rx="0.5"/>
<rect x="12" y="8" width="3" height="2.5" fill="#fdcb6e" stroke="#e17055" stroke-width="1" rx="0.5"/>
<rect x="16.5" y="8" width="3" height="2.5" fill="#e84393" stroke="#d63384" stroke-width="1" rx="0.5"/>
<circle cx="4" cy="15" r="1" fill="#74b9ff" stroke="#0984e3" stroke-width="0.5"/>
<circle cx="6.5" cy="15" r="1" fill="#74b9ff" stroke="#0984e3" stroke-width="0.5"/>
<circle cx="9" cy="15" r="1" fill="#00b894" stroke="#00a085" stroke-width="0.5"/>
<circle cx="11" cy="15" r="1" fill="#00b894" stroke="#00a085" stroke-width="0.5"/>
<circle cx="13.5" cy="15" r="1" fill="#fdcb6e" stroke="#e17055" stroke-width="0.5"/>
<circle cx="18" cy="15" r="1" fill="#e84393" stroke="#d63384" stroke-width="0.5"/>
<line x1="11" y1="5" x2="4.5" y2="7.5" stroke="#8b5cf6" stroke-width="1" opacity="0.7"/>
<line x1="11.5" y1="5" x2="9" y2="7.5" stroke="#10b981" stroke-width="1" opacity="0.7"/>
<line x1="12.5" y1="5" x2="13.5" y2="7.5" stroke="#f59e0b" stroke-width="1" opacity="0.7"/>
<line x1="13" y1="5" x2="18" y2="7.5" stroke="#ec4899" stroke-width="1" opacity="0.7"/>
<line x1="4.5" y1="10.5" x2="4" y2="14" stroke="#3b82f6" stroke-width="0.8" opacity="0.6"/>
<line x1="4.5" y1="10.5" x2="6.5" y2="14" stroke="#3b82f6" stroke-width="0.8" opacity="0.6"/>
<line x1="9" y1="10.5" x2="9" y2="14" stroke="#059669" stroke-width="0.8" opacity="0.6"/>
<line x1="9" y1="10.5" x2="11" y2="14" stroke="#059669" stroke-width="0.8" opacity="0.6"/>
<line x1="13.5" y1="10.5" x2="13.5" y2="14" stroke="#d97706" stroke-width="0.8" opacity="0.6"/>
<line x1="18" y1="10.5" x2="18" y2="14" stroke="#be185d" stroke-width="0.8" opacity="0.6"/>
</svg>`
  },
  {
    title: 'Flowchart Example',
    file: 'flowchart-example',
    type: 'flowchart',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24">
      <rect x="2" y="2" width="8" height="4" fill="#d0f0c0" stroke="#4CAF50"/>
      <polygon points="12,6 16,10 12,14 8,10" fill="#f0e68c" stroke="#FFD700"/>
      <rect x="14" y="2" width="8" height="4" fill="#add8e6" stroke="#2196F3"/>
      <rect x="8" y="18" width="8" height="4" fill="#ffcccb" stroke="#F44336"/>
    </svg>`
  }
];

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private readonly graphService: GraphSService,
    private sanitizer: DomSanitizer,
    private diagramService: DiagramService,
    private router: Router) {}

  ngOnInit(): void {
    this.authService.handleRedirectObservable().subscribe();
    this.isIframe = window !== window.parent && !window.opener;

    this.checkAndSetActiveAccount();
    this.setLoginDisplay();
    if (this.loginDisplay) {
      this.loadUserProfile();
    }

    this.authService.instance.enableAccountStorageEvents(); // Optional - This will enable ACCOUNT_ADDED and ACCOUNT_REMOVED events emitted when a user logs in or out of another tab or window
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === EventType.ACCOUNT_ADDED ||
            msg.eventType === EventType.ACCOUNT_REMOVED
        )
      )
      .subscribe(() => {
        this.setLoginDisplay();
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.checkAndSetActiveAccount();
        this.setLoginDisplay();
        this.loadUserProfile();
      });
        this.templates.forEach(template => {
      template.safeIcon = this.sanitizer.bypassSecurityTrustHtml(template.icon);
    });
  }

  private setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  private checkAndSetActiveAccount() {
    let activeAccount = this.authService.instance.getActiveAccount();
    if (
      !activeAccount &&
      this.authService.instance.getAllAccounts().length > 0
    ) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }

    loginRedirect() {
      if (this.isLoggingIn) return; // prevent multiple clicks

      this.isLoggingIn = true;
      const loginRequest = this.msalGuardConfig.authRequest
        ? { ...this.msalGuardConfig.authRequest }
        : {};
      this.authService.loginRedirect(loginRequest as RedirectRequest);
    }


  logout() {
    this.authService.logoutRedirect({
      postLogoutRedirectUri: '/',
    });
  }

  ngOnDestroy(): void {
    this._destroying$.next();
    this._destroying$.complete();
  }

private loadUserProfile(): void {
  this.graphService.getUserProfileInfo().subscribe((profile) => {
    this.userName = profile.displayName;
    this.userPrincipalName = profile.userPrincipalName;
    this.profileUserName = profile.displayName;

    this.initials =
      (profile.givenName?.charAt(0) || '') +
      (profile.surname?.charAt(0) || '');

    // ✅ Load profile image
    this.graphService.getUserProfilePhoto().subscribe((photoUrl) => {
      this.userPhotoUrl = photoUrl;

      // ✅ THIS LINE IS MISSING
      this.isProfileLoaded = true;
    });

    this.fetchDiagrams();
  });
}


  private loadProfilePhoto(): void {
    this.graphService.getUserProfileInfo().subscribe((profile) => {
      this.userName = profile.displayName;
      this.userPrincipalName = profile.userPrincipalName;
      this.profileUserName = profile.displayName; // ✅ use this as API param
    });

  }
  
  goToStudio() {
    this.router.navigate(['/studio']);
  }
  fetchDiagrams(): void {
  if (!this.userPrincipalName) {
    console.warn('No profile name set');
    return;
  }

  this.isLoading = true;
  this.error = null;

  this.diagramService.getUniqueLatestDiagramsForUser(this.profileUserName).subscribe({
    next: (data) => {
      this.diagrams = data;
      this.isLoading = false;
      console.log('✅ Fetched diagrams:', this.diagrams);
    },
    error: (err) => {
      this.error = 'Failed to load diagrams';
      this.isLoading = false;
      console.error('❌ Failed to fetch diagrams:', err);
    }
  });
}

openDiagramCard(diagram: any): void {
  this.diagramService.loadSpecificVersion(diagram.name, diagram.version).subscribe({
    next: (data) => {
      localStorage.setItem('diagram', JSON.stringify(data));
      localStorage.setItem('currentDiagramName', diagram.name);
      localStorage.setItem('currentDiagramVersion', diagram.version.toString());

      this.router.navigate(['/home/studio']);
    },
    error: (err) => {
      console.error('❌ Failed to load diagram:', err);
      this.error = 'Failed to load diagram';
    }
  });
}
deleteDiagram(diagram: any): void {
  const confirmed = confirm(`Are you sure you want to delete version ${diagram.version} of "${diagram.name}"?`);
  if (!confirmed) return;

  this.diagramService.deleteVersion(this.userName, diagram.name, diagram.version).subscribe({
    next: () => {
      this.diagrams = this.diagrams.filter(d =>
        !(d.name === diagram.name && +d.version === +diagram.version)
      );
      alert(`✅ Version ${diagram.version} of "${diagram.name}" deleted successfully.`);
    },
    error: (err) => {
      console.error('❌ Error deleting diagram:', err);
      alert('Error deleting version.');
    }
  });
}

  loadTemplate(template: any): void {
    this.diagramService.getTemplate(template.file).subscribe({
      next: (data) => {
        localStorage.setItem('diagram', JSON.stringify({ data }));
        localStorage.setItem('currentDiagramName', template.title);
        localStorage.setItem('currentDiagramVersion', '1');
        this.router.navigate(['/home/studio']);
      },
      error: (err) => {
        console.error(`❌ Failed to load template ${template.title}:`, err);
      }
    });
  }
}
