import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-welcome',
  template: `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column">
      <h1>Welcome to Accounts Mock</h1>
      <a [routerLink]="'/account'">Start Now</a>
      <a [routerLink]="'/account/login'" [queryParams]="{url:'/'}">Login with url</a>
    </div>
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
