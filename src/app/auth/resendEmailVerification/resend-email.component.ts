import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Subscription} from 'rxjs';
import {buttonProperties, messagesProperties, validationMessages, viewLabelProperties} from '../../app.constants';


@Component({
  selector: 'app-resend-email',
  templateUrl: './resend-email.component.html',
  styleUrls: ['./resend-email.component.css']
})
export class ResendEmailComponent implements OnInit, OnDestroy{

  isLoading = false;
  private authStatusSub: Subscription;

  // view properties - app.constants
  validationMessages = validationMessages;
  viewLabelProperties = viewLabelProperties;
  buttonProperties = buttonProperties;
  messagesProperties = messagesProperties;

  constructor(
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onResendEmail(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.resendEmailVerificationToken(form.value.email)
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
