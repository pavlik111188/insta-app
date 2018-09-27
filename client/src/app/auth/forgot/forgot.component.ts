import { Component, OnInit } from '@angular/core';
import {User} from "../../shared/models/user.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthGuardService} from "../auth-guard.service";
import {AuthenticationService} from "../../shared/services/auth.service";
import {Observable} from "rxjs/Observable";
import {Router} from "@angular/router";
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {

  user: User = new User();
  error: string | null;

  /**
   * reset password form group
   */
  public resetPasswordForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private flashMessage: FlashMessagesService,
              private authGuardService: AuthGuardService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    // Init login form
    this.buildResetPasswordForm();
    if (this.authGuardService.isLogged()) {
      this.router.navigate(['/']);
    }
  }

  buildResetPasswordForm(): void {
    this.resetPasswordForm = this.formBuilder.group({
      'email' : ['', [
        Validators.required,
        Validators.email
      ]
      ]
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
    'email': []
  };

  validationMessages = {
    'email': {
      'email': 'Please, provide a valid email'
    }
  };

  forgotPass() {
    this.authenticationService.forgotPass(this.resetPasswordForm.value).subscribe(res => {
      if (res['token']) {
        this.flashMessage.show('Success! Check your Email.', { cssClass: 'alert-success', timeout: 3000 });
      } else {
        this.flashMessage.show('Error', { cssClass: 'alert-danger', timeout: 3000 });
      }
      console.log(res);
    });
  }

}
