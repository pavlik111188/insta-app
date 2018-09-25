import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {Observable} from "rxjs/Observable";


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})

export class FooterComponent implements OnInit {

  getState: Observable<any>;
  authenticated: false;
  user = null;
  error = null;

  constructor(private changeDetector: ChangeDetectorRef) {

  }

  ngOnInit() {
    /*this.changeDetector.detectChanges();

    this.getState.subscribe((state) => {
      this.authenticated = state.authenticated;
      this.user = state.user;
      this.error = state.error;
    });*/

  }

}
