import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GraphSService {
  private graphUrl = 'https://graph.microsoft.com/v1.0/me';
  private profilePhotoEndpoint = '/photo/$value';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  /**
   * Get the user's profile information.
   * @returns Observable containing user profile information.
   */
  public getUserProfileInfo(): Observable<ProfileType> {
    return this.http.get<ProfileType>(this.graphUrl).pipe(
      map((profile) => {
        return {
          displayName: profile.displayName || 'Unknown User',
          givenName: profile.givenName || '',
          surname: profile.surname || '',
          userPrincipalName: profile.userPrincipalName || '',
          id: profile.id || '',
        };
      }),
      catchError((error) => {
        console.error('Error loading user profile:', error);
        return of({
          displayName: 'Unknown User',
          givenName: '',
          surname: '',
          userPrincipalName: '',
          id: '',
        });
      })
    );
  }

  /**
   * Get the user's profile photo.
   * @returns Observable containing the SafeUrl of the profile photo.
   */
  public getUserProfilePhoto(): Observable<SafeUrl> {
    return this.http
      .get(this.graphUrl + this.profilePhotoEndpoint, { responseType: 'blob' })
      .pipe(
        map((photo) => {
          const objectURL = URL.createObjectURL(photo);
          return this.sanitizer.bypassSecurityTrustUrl(objectURL);
        }),
        catchError((error) => {
          console.error('Error loading profile photo:', error);
          return of(this.getDefaultProfilePicture());
        })
      );
  }

  /**
   * Get the default profile picture.
   * @returns SafeUrl for the default profile picture.
   */
  private getDefaultProfilePicture(): SafeUrl {
    const defaultImageUrl = 'assets/images/person_placeholder.png';
    return this.sanitizer.bypassSecurityTrustUrl(defaultImageUrl);
  }
}

/**
 * Type definition for the user's profile.
 */
type ProfileType = {
  displayName: string;
  givenName?: string;
  surname?: string;
  userPrincipalName?: string;
  id?: string;
};