import {NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {ForgottenPasswordComponent} from './forgottenPassword/forgotten-password.component';
import {ResetPasswordComponent} from './forgottenPassword/resetPassword/reset-password.component';
import {ResendEmailComponent} from './resendEmailVerification/resend-email.component';
import {AccountDeactivationComponent} from './accountDeactivation/account-deactivation.component';
import {ChangePasswordComponent} from './changePassword/change-password.component';
import {AccountDeactivationConfirmationComponent} from './accountDeactivation/accountDeactivationConfirmationView/account-deactivation-confirmation.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgottenpass', component: ForgottenPasswordComponent },
  { path: 'forgottenpass/email/:token', component: ResetPasswordComponent },
  { path: 'resend/email', component: ResendEmailComponent },
  { path: 'account/deactivation/:token', component: AccountDeactivationComponent },
  { path: 'changepass/:id', component: ChangePasswordComponent },
  { path: 'account/deactivated', component: AccountDeactivationConfirmationComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule {}
