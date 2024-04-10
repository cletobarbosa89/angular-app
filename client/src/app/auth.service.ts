import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from './../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    if(typeof error.error.message !== 'undefined')
      return throwError(error.error.message);
    else
      return throwError(error.error)
  }


  // Auth
  isAuthenticated(key: any): Observable<any> {
    const headers = new HttpHeaders().set('key', key);

    return this.http.get(`${environment.APIUrl}/api/v1/auth/isAuthenticated`, {headers: headers})
      .pipe(
        catchError(this.handleError)
      );
  }
}
