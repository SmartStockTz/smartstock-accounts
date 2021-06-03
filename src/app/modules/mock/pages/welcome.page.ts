import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-welcome',
  template: `
    <h1>Welcome to Accounts Mock</h1>
    <a routerLink="/account">Start Now</a>
  `,
  styleUrls: []
})

export class WelcomePage implements OnInit, OnDestroy {
  constructor() {
  } // end
  async ngOnDestroy(): Promise<void> {
  }

  async ngOnInit(): Promise<void> {
  }

}
