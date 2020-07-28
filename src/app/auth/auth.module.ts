import {NgModule} from '@angular/core';
import {LoginComponent} from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularMaterialModule} from '../angular-material.module';
import { AuthRoutingModule } from './auth-routing.module';
import { CommonModule } from '@angular/common';
import {MatInputModule, MatOptionModule, MatSelectModule} from '@angular/material';
import {ForgottenPasswordComponent} from './forgottenPassword/forgotten-password.component';
import {ResetPasswordComponent} from './forgottenPassword/resetPassword/reset-password.component';
import {ResendEmailComponent} from './resendEmailVerification/resend-email.component';
import {AccountDeactivationComponent} from './accountDeactivation/account-deactivation.component';
import {ChangePasswordComponent} from './changePassword/change-password.component';
import {AccountDeactivationConfirmationComponent} from './accountDeactivation/accountDeactivationConfirmationView/account-deactivation-confirmation.component';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    ForgottenPasswordComponent,
    ResetPasswordComponent,
    ResendEmailComponent,
    AccountDeactivationComponent,
    ChangePasswordComponent,
    AccountDeactivationConfirmationComponent
  ],
  imports: [
    FormsModule,
    AngularMaterialModule,
    AuthRoutingModule,
    CommonModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class AuthModule {}
