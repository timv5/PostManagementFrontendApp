import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import {AuthService} from './auth.service';

/*
*
* Checks if user is authenticated (logged in)
* When token expires user is routed on login page
*
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.authService.getIsAuth();
    // if you are not logged in navigate to login page
    if (!isAuth) {
      this.router.navigate(['login']);
    }
    return isAuth;
  }
}
