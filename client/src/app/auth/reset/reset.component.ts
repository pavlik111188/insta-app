import { Component, OnInit } from '@angular/core';
import {User} from "../../shared/models/user.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FlashMessagesService} from "angular2-flash-messages";
import {AuthGuardService} from "../auth-guard.service";
import {AuthenticationService} from "../../shared/services/auth.service";
import {Router, ActivatedRoute} from "@angular/router";
import {PasswordValidation} from "../../shared/validators/password-match";

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {

  user: User = new User();
  error: string | null;
  token: string;
  email: string;

  /**
   * reset password form group
   */
  public resetPasswordForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private flashMessage: FlashMessagesService,
              private authGuardService: AuthGuardService,
              private authenticationService: AuthenticationService) {
    this.route.params.subscribe( params => {
      this.token = params['token'];
    });
  }

  ngOnInit() {
    // Init login form
    this.buildResetPasswordForm();
    if (this.authGuardService.isLogged()) {
      this.router.navigate(['/']);
    }
    this.authenticationService.checkToken(this.token).subscribe(res => {
      if (res['success']) {
        this.email = res['email'];
      } else {
        this.flashMessage.show('incorrect token', { cssClass: 'alert-danger', timeout: 3000 });
        this.router.navigate(['/login']);
      }
    });
  }

  buildResetPasswordForm(): void {
    this.resetPasswordForm = this.formBuilder.group({
      'password' : [null, [
        Validators.required,
        Validators.minLength(6)
      ]
      ],
      'passwordConfirm' : [null, [
        Validators.required
      ]
      ],
      'email' : [this.email, [

      ]
      ],
      'token' : [this.token, [

      ]
      ]
    },
      {
        validator: PasswordValidation.MatchPassword
      });

    this.resetPasswordForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.resetPasswordForm) { return; }
    const form = this.resetPasswordForm;

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
    'password': [],
    'passwordConfirm': []
  };

  validationMessages = {
    'password': {
      'required': 'Please provide a valid password',
      'minlength': 'Please provide a valid password'
    },
    'passwordConfirm': {
      'required': 'Please provide a valid password',
      'MatchPassword': 'Please provide a valid password'
    }
  };

  resetPass() {
    const user: User = new User();
    user.email = this.email;
    user.token = this.token;
    user.password = this.resetPasswordForm.get('password').value;

    // trim values
    user.email.trim();
    user.password.trim();

    this.authenticationService.resetPass(user).subscribe(res => {
      if (res['success']) {
        this.flashMessage.show('Success', { cssClass: 'alert-success', timeout: 3000 });
        this.router.navigate(['/login']);
      } else {
        this.flashMessage.show('incorrect token', { cssClass: 'alert-danger', timeout: 3000 });
        this.router.navigate(['/login']);
      }
    });
  }

}
