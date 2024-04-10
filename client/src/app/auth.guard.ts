import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import { auth } from './auth-token';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<any> | Promise<boolean | UrlTree> | boolean | UrlTree {
      // if(auth.token && route.queryParamMap.get('key') == auth.token) {
      //   return true;
      // }
      // return this.router.parseUrl('/notauthorized');
      if(route.queryParamMap.get('key')) {
        return this.authService.isAuthenticated(route.queryParamMap.get('key')).pipe(map(response => {
          if(response.status == 200 && response.authenticated == true)
            return true;
          return this.router.parseUrl('/notauthorized');
        }));
      }

      return this.router.parseUrl('/notauthorized');
    }
  }
