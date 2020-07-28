import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PostListComponent} from './posts/posts-list/post-list.component';
import { AuthGuard } from './auth/auth.guard';
import {PostCreateComponent} from './posts/post-create/post-create.component';
import {UserDetailsComponent} from "./users/user-details/user-details.component";
import {PostUserComponent} from "./posts/posts-user/posts-user.component";

/*
  This module protects backend routes from users
 */
const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'user/:userId', component: UserDetailsComponent },
  { path: 'myposts', component: PostUserComponent, canActivate: [AuthGuard] },
  { path: 'verify', loadChildren: './auth/emailVerificationService/email-verification.module#EmailVerificationModule' },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' }
];

/*
  export to main module - app.module.ts
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
