import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-login-page',
  template: `
    <app-login></app-login>
  `
})
export class LoginPage implements OnInit, OnDestroy {

  constructor() {
  }

  async ngOnDestroy(): Promise<void> {
  }

  async ngOnInit(): Promise<void> {
  }
}
