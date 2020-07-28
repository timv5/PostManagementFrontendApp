import {NgModule} from '@angular/core';
import {EmailVerificationComponent} from './email-verification.component';
import {RouterModule} from '@angular/router';
import {AngularMaterialModule} from '../../angular-material.module';
import {CommonModule} from '@angular/common';
import {EmailVerificationRoutingModule} from './email-verification-routing.module';

@NgModule({
  declarations: [
    EmailVerificationComponent
  ],
  imports: [
    RouterModule,
    AngularMaterialModule,
    CommonModule,
    EmailVerificationRoutingModule
  ]
})
export class EmailVerificationModule {}
