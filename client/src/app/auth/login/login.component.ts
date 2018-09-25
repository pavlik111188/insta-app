import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeWhile';
import {Observable} from 'rxjs/Observable';
import {User} from '../../shared/models/user.model';
import {AuthenticationService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
  user: User = new User();
  getState: Observable<any>;
  error: string | null;

  /**
   * Login form group
   */
  public loginForm: FormGroup;

  /**
   * reset password form group
   */
  public resetPasswordForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService) {

    // Init reset password form
    this.resetPasswordForm = this.formBuilder.group({
      'email': ['', [
        Validators.email, Validators.required
      ]]
    });
  }

  ngOnInit() {
    // Init login form
    this.buildLoginForm();
  }

  buildLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      'email' : ['', [
        Validators.email
      ]
      ],
      'password' : ['', [
        Validators.required,
        Validators.minLength(6)
      ]
      ]
    });

    this.loginForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.loginForm) { return; }
    const form = this.loginForm;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = [];
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field].push(messages[key]);
        }
      }
    }
  }

  formErrors = {
    'email': [],
    'password': []
  };

  validationMessages = {
    'email': {
      'email': 'TEXTS.PROVIDE_VALID_EMAIL'
    },
    'password': {
      'required': 'TEXTS.PROVIDE_VALID_PASSWORD',
      'minlength': 'TEXTS.REQ_MINLENGTH_PASSWORD'
    }
  };

  /**
   * Login with credentials
   */
  loginWithCredentials() {

    // get email and password values
    const email: string = this.loginForm.get('email').value;
    const password: string = this.loginForm.get('password').value;

    // trim values
    email.trim();
    password.trim();

    // set credentials
    const credentials = {
      email: email,
      password: password
    };

    // dispatch AuthenticationAction and pass in payload
    // this.store.dispatch(new LoginAction(credentials));
  }

  /**
   * Reset user password
   */
  resetPassword() {

  }

  forgotPass() {
    const email = this.resetPasswordForm.get('email').value;
    console.log(this.resetPasswordForm.value);
    this.authenticationService.forgotPass(this.resetPasswordForm.value).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
