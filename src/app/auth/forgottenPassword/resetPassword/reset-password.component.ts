import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth.service';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {buttonProperties, validationMessages, viewLabelProperties} from '../../../app.constants';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy{
  isLoading = false;
  private authStatusSub: Subscription;
  public token: string;

  // view properties - app.constants
  validationMessages = validationMessages;
  viewLabelProperties = viewLabelProperties;
  buttonProperties = buttonProperties;

  constructor(
    public authService: AuthService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onResetPassword(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('token')) {
        this.token = paramMap.get('token');
        this.authService.resetPassword(form.value.password, form.value.passwordRepeat, this.token);
      }
    });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
