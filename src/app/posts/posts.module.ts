import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from './../angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';

import {PostDetailsDialog, PostListComponent} from './posts-list/post-list.component';
import {CommonModule} from '@angular/common';
import {PostCreateComponent} from './post-create/post-create.component';
import {
  DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE,
  MatDatepickerModule, MatListModule,
  MatNativeDateModule,
  MatSelectModule,
  MatTableModule
} from "@angular/material";
import {PostUserComponent, UserPostDetailsDialog} from './posts-user/posts-user.component';
import {SatDatepickerModule, SatNativeDateModule} from "saturn-datepicker";
import {MAT_MOMENT_DATE_FORMATS, MatMomentDateModule, MomentDateAdapter} from "@angular/material-moment-adapter";
import {BarRatingModule} from "ngx-bar-rating";

@NgModule({
  declarations: [
    PostListComponent,
    PostCreateComponent,
    PostUserComponent,
    PostDetailsDialog,
    UserPostDetailsDialog
  ],
  entryComponents: [
    PostDetailsDialog,
    UserPostDetailsDialog
  ],
  imports: [
    ReactiveFormsModule,
    AngularMaterialModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule,
    CommonModule,
    MatTableModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatMomentDateModule,
    BarRatingModule,
    MatListModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'sl'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class PostsModule {}
