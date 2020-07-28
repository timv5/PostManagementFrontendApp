import {NgModule} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import {AngularMaterialModule} from "../angular-material.module";
import {MatDatepickerModule, MatNativeDateModule, MatSelectModule} from '@angular/material';
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {DialogDeactivateAccount, UserDetailsComponent} from './user-details/user-details.component';

@NgModule({
  declarations: [
    UserDetailsComponent,
    DialogDeactivateAccount
  ],
  entryComponents: [
    DialogDeactivateAccount
  ],
  imports: [
    ReactiveFormsModule,
    AngularMaterialModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule,
    CommonModule
  ]
})
export class UsersModule {}
