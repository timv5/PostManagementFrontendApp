import {Component, OnDestroy, OnInit} from '@angular/core';
import {buttonProperties, messagesProperties, validationMessages, viewLabelProperties} from '../../../app.constants';

@Component({
  selector: 'app-account-deactivation-confirmation',
  templateUrl: 'account-deactivation-confirmation.component.html'
})
export class AccountDeactivationConfirmationComponent implements OnInit, OnDestroy{

  // view properties - app.constants
  buttonProperties = buttonProperties;
  messagesProperties = messagesProperties;

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
  }
}
