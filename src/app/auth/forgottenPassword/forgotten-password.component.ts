import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../auth.service';
import {NgForm} from '@angular/forms';
import {buttonProperties, validationMessages, viewLabelProperties} from '../../app.constants';


@Component({
  selector: 'app-forgotten-password',
  templateUrl: './forgotten-password.component.html',
  styleUrls: ['./forgotten-password.component.css']
})
export class ForgottenPasswordComponent implements OnInit, OnDestroy{

  isLoading = false;
  private authStatusSub: Subscription;

  // view properties - app.constants
  validationMessages = validationMessages;
  viewLabelProperties = viewLabelProperties;
  buttonProperties = buttonProperties;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onForgottenPassword(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.sendEmailForgottenPassword(form.value.email);
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
