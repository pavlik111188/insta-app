import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PasswordValidation} from '../../shared/validators/password-match';
import {Observable} from 'rxjs/Observable';
import {User} from '../../shared/models/user.model';
import {AuthenticationService} from "../../shared/services/auth.service";
import {Router} from "@angular/router";
import { FlashMessagesService } from 'angular2-flash-messages';
import {AuthGuardService} from "../auth-guard.service";

@Component({
  selector: 'app-signup',
  templateUrl: 'signup.component.html',
  styleUrls: ['signup.component.scss']
})

export class SignupComponent implements OnInit {

  user: User = new User();
  getState: Observable<any>;
  error: string | null;
  isLoggen: Observable<boolean>;


  /**
   * The authentication form.
   */
  public signupForm: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private authGuardService: AuthGuardService,
    private fb: FormBuilder) {
  }

  ngOnInit() {
    // Signup form
    this.buildSignupForm();
    if (this.authGuardService.isLogged()) {
      this.router.navigate(['/']);
    }
  }

  /** Signup forms validation */
  buildSignupForm(): void {
    this.signupForm = this.fb.group({
      'first_name' : [null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30)
      ]
      ],
      'email' : [null, [
        Validators.email
      ]
      ],
      'password' : [null, [
        Validators.required,
        Validators.minLength(6)
      ]
      ],
      'passwordConfirm' : [null, [
        Validators.required
      ]
      ]
    }, {
      validator: PasswordValidation.MatchPassword
    });

    this.signupForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.signupForm) { return; }
    const form = this.signupForm;
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

  /** Errors array */
  formErrors = {
    'first_name': [],
    'email': [],
    'password': [],
    'passwordConfirm': [],
    'role': []
  };

  /** Validation messages */
  validationMessages = {
    'first_name': {
      'required': 'Please provide a valid nickname',
      'minlength': 'Please provide a valid nickname',
      'maxLength': 'Please provide a valid nickname'
    },
    'email': {
      'email': 'Please provide a valid E-Mail'
    },
    'password': {
      'required': 'Please provide a valid password',
      'minlength': 'Please provide a valid password'
    },
    'passwordConfirm': {
      'required': 'Please provide a valid password',
      'MatchPassword': 'Please provide a valid password'
    }
  };

  /** Signup with credentials */
  signupWithCredentials() {
    // create a new User object
    const user: User = new User();
    user.email = this.signupForm.get('email').value;
    user.first_name = this.signupForm.get('first_name').value;
    user.password = this.signupForm.get('password').value;

    // trim values
    user.email.trim();
    user.first_name.trim();
    user.password.trim();

    this.authService.signup(user).subscribe(res => {
      if (res['success']) {
        this.flashMessage.show(res['msg'], { cssClass: 'alert-success', timeout: 3000 });
        this.router.navigate(['/login']);
      } else {
        this.flashMessage.show(res['msg'], { cssClass: 'alert-danger', timeout: 3000 });
      }
    });
  }

}
