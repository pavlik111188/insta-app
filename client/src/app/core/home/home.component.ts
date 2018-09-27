import {Component, OnInit} from '@angular/core';
import {User} from "../../shared/models/user.model";
import {UserService} from "../../shared/services/user.service";
import { FlashMessagesService } from 'angular2-flash-messages';
import {History} from "../../shared/models/history.model";
import * as io from "socket.io-client";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: User = new User();
  history: History[];
  balance: any;
  purse_address: String;
  joinned: boolean = false;
  socket = io('http://localhost:4300');

  constructor(
    private flashMessage: FlashMessagesService,
    private userService: UserService) {
  }

  ngOnInit() {
    this.getUserInfo();
    this.getUserHistory();
    this.socket.on('message', (data) => {
      if (data['text']['data'] != this.user.email) {
        this.getUserInfo();
        this.getUserHistory();
        this.flashMessage.show('Increased your balance!', { cssClass: 'alert-success', timeout: 3000 });
      }
    });
  }

  getUserInfo() {
    this.userService.getCurrentUser().subscribe(res => {
      if (res['user']) {
        this.user = res['user'];
      }
    });
  }

  getUserHistory() {
    this.userService.loadUserHistory().subscribe(res => {
      if (res['history']) {
        this.history = res['history'];
      }
    });
  }

  shareBalance() {
    if (this.balance < this.user.money && this.balance > 0) {
      let curr_balance = this.user.money - this.balance;
      let params = { balance: this.balance, purse_address: this.purse_address, curr_balance: curr_balance };
      this.userService.sendBalance(params).subscribe(res => {
        if (res['success']) {
          this.flashMessage.show('Success', { cssClass: 'alert-success', timeout: 3000 });
          this.getUserInfo();
          this.getUserHistory();
          this.socket.emit('message', {data: res['user']['email']});
        } else {
          this.flashMessage.show(res['msg'], { cssClass: 'alert-danger', timeout: 3000 });
        }
      });
    } else {
      this.flashMessage.show('The amount is less than your balance', { cssClass: 'alert-warning', timeout: 3000 });
    }
  }

}
