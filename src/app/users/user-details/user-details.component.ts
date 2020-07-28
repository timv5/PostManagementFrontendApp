import {Component, OnDestroy, OnInit} from "@angular/core";
import {UserService} from "../user.service";
import {AuthService} from "../../auth/auth.service";
import {Subscription} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PostNumber} from "../../commons/postNumberService/post-number.model";
import {PostNumberService} from "../../commons/postNumberService/post-number.service";
import {ActivatedRoute, ParamMap} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {mimeType} from './mime-type.validator';
import {User} from '../user.model';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']

})
export class UserDetailsComponent implements OnInit, OnDestroy{

  isLoading = false;
  userId: string;
  private authStatusSub: Subscription;
  userIsAuthenticated = false;
  form: FormGroup;
  postNumbers: PostNumber[] = [];
  private postNumberSub: Subscription;
  isUser = false;
  imagePreview: string;
  user: User;

  constructor(
    public route: ActivatedRoute,
    public userService: UserService,
    public authService: AuthService,
    public postNumberService: PostNumberService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

    this.postNumberService.getPostNumbers();
    this.postNumberSub = this.postNumberService.getPostNumbersListener()
      .subscribe((data: { posts: PostNumber[], postCount: number }) => {
        this.isLoading = false;
        this.postNumbers = data.posts;
      });


    this.form = new FormGroup({
      name: new FormControl(
        null,
        {validators: [Validators.required, Validators.minLength(3)]},
      ),
      lastName: new FormControl(
        null,
        {validators: [Validators.required, Validators.minLength(3)]}
      ),
      phone: new FormControl(
        null,
        {validators: [Validators.required, Validators.minLength(3)]}
      ),
      email: new FormControl(
        null,
        {validators: [Validators.required, Validators.minLength(3)]}
      ),
      postNumber: new FormControl(
        null,
        {validators: [Validators.required]}
      ),
      image: new FormControl(
        null,
        {
          validators: [Validators.required],
          asyncValidators: [mimeType]
        }
      )
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userId')) {

        this.userService.getUser(paramMap.get('userId'))
          .subscribe((userData) => {
            this.user = {
              id: userData._id,
              name: userData.name,
              lastName: userData.lastName,
              email: userData.email,
              phone: userData.phone,
              postNumber: userData.postNumber,
              imagePath: userData.imagePath
            };
            this.form.setValue({
              name: this.user.name,
              lastName: this.user.lastName,
              email: this.user.email,
              phone: this.user.phone,
              postNumber: this.user.postNumber,
              image: this.user.imagePath
            });
            if (localStorage.getItem('userId') == paramMap.get('userId')) {
              this.isUser = true;
              this.form.enable();
            }
            else {
              this.form.disable();
            }
          });
      }
    });

  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;

    let userData: User;
    userData = {
      id: this.userId,
      email: this.form.value.email,
      phone:  this.form.value.phone,
      name: this.form.value.name,
      lastName: this.form.value.lastName,
      postNumber: this.form.value.postNumber,
      imagePath: this.form.value.image
    };

    this.userService.updateUser(userData).subscribe((updatedUser) => {
      // get data of updated user from response
      this.user = {
        id: updatedUser.user.id,
        name: updatedUser.user.name,
        lastName: updatedUser.user.lastName,
        email: updatedUser.user.email,
        phone: updatedUser.user.phone,
        postNumber: updatedUser.user.postNumber,
        imagePath: updatedUser.user.imagePath
      };
      // set form with updated values
      this.form.setValue({
        name: this.user.name,
        lastName: this.user.lastName,
        email: this.user.email,
        phone: this.user.phone,
        postNumber: this.user.postNumber,
        image: this.user.imagePath
      });
      this.isUser = true;
      this.form.enable();
      this.isLoading = false;
      this.snackBar.open("Shranjeno.", "", {
        duration: 2000,
      });

      // reset image picker
      this.imagePreview = '';
    });
  }

  onImagePicked(event: Event) {
    // get file we picked - we only add one file, so we access to just one [0]
    const file = (event.target as HTMLInputElement).files[0];
    // patches the file whih we upladed with formGroup element
    this.form.patchValue({image: file});
    // check if patched formGroup element - image value is valid
    this.form.get('image').updateValueAndValidity();
    // convert my image to dataUrl - we can then preview image on the page
    const reader = new FileReader();
    // function is excecuted when is done loading certain resource
    // we have to use callback function because i is async call and will take a while
    reader.onload = () => {
      this.imagePreview = <string>reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSendDeactivationEmail(){
    var tmp = this.authService.sendDeactivationEmail(this.form.value.email);
    if(tmp) {
      this.openDialog();
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogDeactivateAccount);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
    this.postNumberSub.unsubscribe();
  }
}

@Component({
  selector: 'deactivate-account-modal-window',
  templateUrl: './account-deactivation-modal/deactivate-account-modal-window.html'
})
export class DialogDeactivateAccount {
  constructor(){}
}
