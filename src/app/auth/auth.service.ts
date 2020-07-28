import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {LoginAuthData} from './login-auth-data.model';
import {ForgottenPasswordModel} from './forgottenPassword/forgotten-password.model';
import {ResetPasswordModel} from './forgottenPassword/resetPassword/reset-password.model';
import {ResendEmailModel} from './resendEmailVerification/resend-email.model';
import {AccountDeactivationModel} from './accountDeactivation/account-deactivation.model';
import {ChangePasswordModel} from './changePassword/change-password.model';
import {AuthBaseService} from './auth-base.service';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({ providedIn: 'root' })
export class AuthService implements AuthBaseService{
  // token
  private token: string;
  // lifetime of a token
  private tokenTimer: any;
  // listener if user is authenticated
  private authStatusListener = new Subject<boolean>();
  // if user is authenticated
  private isAuthenticated = false;
  // user id
  private userId: string;

  constructor(private http: HttpClient, private router: Router) {}

  /*
   * Get authentication - used in main component for automatic auth
   * All the needed data is set
   */
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    // calculate expiration time
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    // if true: past, if not: future
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  /*
     ******************** Create user ********************
   */
  createUser(
    email: string,
    password: string,
    phone: string,
    name: string,
    lastName: string,
    postNumber: string,
    imagePath: string
    ) {

    const userData = new FormData();
    userData.append('email', email);
    userData.append('password', password);
    userData.append('phone', phone);
    userData.append('name', name);
    userData.append('lastName', lastName);
    userData.append('postNumber', postNumber);
    userData.append('image', imagePath);

    // call endpoint
    this.http
      .post<{ message: string, user: any }>(BACKEND_URL + '/signup', userData)
      .subscribe(response => {
        this.router.navigate(['/auth/resend/email']);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  /*
    Login
   */
  login(email: string, password: string) {
    // prepare data
    const loginAuthData: LoginAuthData = {
      email,
      password
    };

    // call endpoint for login
    this.http.post<{ token: string, expiresIn: number, userId: string }>( BACKEND_URL + '/login', loginAuthData )
      .subscribe(response => {
        // get token from backend
        const token = response.token;
        // store token globally
        this.token = token;
        if (token) {
          // get expiration time for token
          const expiresInDuration = response.expiresIn;

          // set timer
          this.setAuthTimer(expiresInDuration);

          // set relevant data for user to be logged in
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);

          // save data in local storage
          const expirationDate = new Date(new Date().getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }

      }, error => {
        this.authStatusListener.next(false);
      });

  }

  /*
    Send email to change password
   */
  sendEmailForgottenPassword(email: string) {
    // prepare data
    const forgottenPasswordData: ForgottenPasswordModel = {
      email
    };

    this.http.post<{ email: string }>( BACKEND_URL + "forgottenpass/", forgottenPasswordData )
      .subscribe(response => {
        this.router.navigate(['/']);
      }, error => {
        this.authStatusListener.next(false);
      });

  }

  // Reset forgotten password
  resetPassword(password: string, passwordRepeat: string, token: string) {
    // prepare data
    const resetPasswordModel: ResetPasswordModel = {
      password
    };

    this.http.post<{ email: string }>( BACKEND_URL + "forgottenpass/confirm/" + token, resetPasswordModel )
      .subscribe(response => {
        this.router.navigate(['/']);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  /*
  * Resend email with verification token
  *
  */
  resendEmailVerificationToken(email: string){
    // prepare data
    const resendEmailModel: ResendEmailModel = {
      email
    };

    this.http.post<{ email: string }>( BACKEND_URL + "resend/email", resendEmailModel )
      .subscribe(response => {
        this.router.navigate(['/']);
      }, error => {
        this.authStatusListener.next(false);
      });

  }

  /*
  * Deaktivate user account
   */
  deactivateUserAccount(token: string){
    this.http.get<{ message: string }>(
      BACKEND_URL + "deactivate/account/" + token
    ).subscribe(response => {
      this.accountDeactivationLogout();
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  /*
  * Send email for account deactivation
   */
  sendDeactivationEmail(email: string){

    const accountDeactivationModel: AccountDeactivationModel = {
      email
    };

    return this.http.post<{}>( BACKEND_URL + "deactivate/account/sendemail", accountDeactivationModel)
      .subscribe(() => {});
  }

  changePassword(passwordCurrent: string, passwordNew: string){
    const changePasswordModel: ChangePasswordModel = {
      passwordCurrent,
      passwordNew
    };

    this.http.post<{}>( BACKEND_URL + "changepass/" + this.userId, changePasswordModel)
      .subscribe(response => {
        this.router.navigate(['/']);
      }, error => {
        this.authStatusListener.next(false);
      });
  }
  /*
   *  Save user authentication data in local storage
   */
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  /*
    Logout - clear all relevant data
   */
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.userId = null;
    AuthService.clearAuthData();
    this.router.navigate(['/']);
  }

  /*
    Logout - just for account deactivation
   */
  accountDeactivationLogout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.userId = null;
    AuthService.clearAuthData();
    this.router.navigate(['/auth/account/deactivated']);
  }

  /*
    Clear user authentication data from local storage
   */
  private static clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  /*
    GETTERS
   */

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  // return as observable so we can emit new values from other components
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    // check if exists
    if (!token && !expirationDate) {
      return;
    }

    // return auth data
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId
    };
  }

  /*
    SETTERS
   */
  setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

}
