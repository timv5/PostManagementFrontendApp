import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {EmailVerificationBaseService} from './email-verification-base.service';

const BACKEND_URL = environment.apiUrl + '/user/verify/';

@Injectable({ providedIn: 'root' })
export class EmailVerificationService implements EmailVerificationBaseService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  sendEmailVerification(confirmationToken: string) {
    this.http
      .get(BACKEND_URL + confirmationToken)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

}
