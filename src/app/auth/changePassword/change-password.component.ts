import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {buttonProperties, validationMessages, viewLabelProperties} from '../../app.constants';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authStatusSub: Subscription;
  userId: string;
  form: FormGroup;

  // view properties - app.constants
  validationMessages = validationMessages;
  viewLabelProperties = viewLabelProperties;
  buttonProperties = buttonProperties;

  constructor(
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );

    this.form = new FormGroup({
      passwordCurrent: new FormControl(
        null,
        {validators: [Validators.required, Validators.minLength(3)]},
      ),
      passwordNew: new FormControl(
        null,
        {validators: [Validators.required, Validators.minLength(3)]}
      ),
      passwordConfirm: new FormControl(
        null,
        {validators: [Validators.required, Validators.minLength(3)]}
      )
    });

  }

  onChangePassword(){
    if (this.form.invalid) {
      return;
    }else if (this.handlePassword()){
      this.isLoading = true;
      this.authService.changePassword(this.form.get('passwordCurrent').value, this.form.get('passwordNew').value);
    }else{
      this.showError("Pršlo je do napake");
    }
  }

  /*
  * Handle password validation
   */
  handlePassword() {
    if(this.checkPassword()){
      this.showSuccess("Geslo shranjeno");
      return true;
    }else{
      this.showError("Gesli, ki ste ju vnesli se ne ujemata");
      return false;
    }
  }

  /*
  * password checker
   */
  checkPassword() {
    if((this.form.get('passwordNew').value != null && this.form.get('passwordNew').value !== '' )
      && (this.form.get('passwordConfirm').value != null && this.form.get('passwordConfirm').value !== '' )){
     return this.form.get('passwordNew').value === this.form.get('passwordConfirm').value;
    }else {
      return false;
    }
  }

  showSuccess(message: string) {
    this.snackBar.open(message, "", {
      duration: 2000,
    });
  }

  showError(message: string){
    this.snackBar.open(message, "X", {panelClass: ['error']});
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
