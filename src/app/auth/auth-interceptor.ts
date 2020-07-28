import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';

/*
* Service as interceptor - every outgoing request will receive that token
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // get token
    const authToken = this.authService.getToken();

    // change original request and edit it
    const authRequest = req.clone({
      // Authorization is set on backend in check-auth.js
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    });

    return next.handle(authRequest);
  }
}
