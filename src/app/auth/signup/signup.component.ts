import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../auth.service';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {PostNumberService} from '../../commons/postNumberService/post-number.service';
import {PostNumber} from '../../commons/postNumberService/post-number.model';
import {mimeType} from '../../users/user-details/mime-type.validator';
import {buttonProperties, validationMessages} from '../../app.constants';
import { viewLabelProperties } from '../../app.constants';


@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  // spinner when loading
  isLoading = false;
  private authStatusSub: Subscription;
  postNumbers: PostNumber[] = [];
  private postNumberSub: Subscription;
  totalPostNumbers = 0;
  imagePreview: string;
  form: FormGroup;

  // view properties - app.constants
  validationMessages = validationMessages;
  viewLabelProperties = viewLabelProperties;
  buttonProperties = buttonProperties;

  constructor(public authService: AuthService, public postNumberService: PostNumberService) {}

  ngOnInit(): void {
    console.log(validationMessages);
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.postNumberService.getPostNumbers();
    this.postNumberSub = this.postNumberService.getPostNumbersListener()
      .subscribe((data: {posts: PostNumber[], postCount: number}) => {
        this.totalPostNumbers = data.postCount;
        this.postNumbers = data.posts;
      });

    // initalize form
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
      postNumber: new FormControl(
        null,
        {validators: [Validators.required]}
      ),
      email: new FormControl(
        null,
        {validators: [Validators.required, Validators.minLength(3)]}
      ),
      password: new FormControl(
        null,
        {validators: [Validators.required, Validators.minLength(3)]}
      ),
      image: new FormControl(
        null,
        {
          validators: [Validators.required],
          asyncValidators: [mimeType]
        }
      )
    });

  }

  onSignup() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(
      this.form.value.email,
      this.form.value.password,
      this.form.value.phone,
      this.form.value.name,
      this.form.value.lastName,
      this.form.value.postNumber,
      this.form.value.image
    );
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

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

}
