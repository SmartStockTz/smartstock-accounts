import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-how-to-pay',
  template: `
    <mat-card class="mat-elevation-z0">
      <div style="">
        <h3 style="margin-top: 16px">How To Pay With Mobile Money</h3>
        <hr>
        <div class="row">
          <div class="col-sm-12 col-xl-6 col-lg-6 col-md-6 col-12">
            <img style="height: 80px" alt="M-PESA" src="./assets/img/mpesa.png">
            <div style="padding-top: 8px">
                <span style="">
                  1. Piga <b>*150*00#</b><br><br>
                  2. Chagua namba <b>4</b><br><br>
                  3. Changua namba <b>4</b><br><br>
                  4. Weka namba hii <b style="letter-spacing: 2px; font-size: 20px">400700</b> kama namba ya kampuni<br><br>
                  5. Weka namba hii <b style="letter-spacing: 2px; font-size: 20px">{{reference}}</b> kama namba ya kumbukumbu<br><br>
                  6. Weka kiasi <b style="letter-spacing: 2px; font-size: 20px">{{cost | number}}</b> <br><br>
                  7. Weka namba yako ya siri<br><br>
                  8. Jina la kampuni litatokea MLIPA, kama kila kitu kipo sawa thibitisha kwa kujibu <b>1</b><br><br>
                </span>
            </div>
          </div>
          <div class="col-sm-12 col-xl-6 col-lg-6 col-md-6 col-12">
            <img style="height: 80px" alt="TIGO PESA" src="./assets/img/tpesa.png">
            <div style="padding-top: 8px">
                <span style="">
                  1. Piga <b>*150*01#</b><br><br>
                  2. Chagua namba <b>4</b><br><br>
                  3. Changua namba <b>3</b><br><br>
                  4. Weka namba hii <b style="letter-spacing: 2px; font-size: 20px">400700</b> kama namba ya kampuni<br><br>
                  5. Weka namba hii <b style="letter-spacing: 2px; font-size: 20px">{{reference}}</b> kama namba ya kumbukumbu<br><br>
                  6. Weka kiasi <b style="letter-spacing: 2px; font-size: 20px">{{cost | number}}</b> <br><br>
                  7. Weka namba yako ya siri<br><br>
                </span>
            </div>
          </div>
          <div class="col-sm-12 col-xl-6 col-lg-6 col-md-6 col-12">
            <img style="height: 80px" alt="HALOPESA" src="./assets/img/halopesa.png">
            <div style="padding-top: 8px">
                <span style="">
                  1. Piga <b>*150*88#</b><br><br>
                  2. Chagua namba <b>4</b><br><br>
                  3. Changua namba <b>3</b><br><br>
                  4. Weka namba hii <b style="letter-spacing: 2px; font-size: 20px">400700</b> kama namba ya kampuni<br><br>
                  5. Weka namba hii <b style="letter-spacing: 2px; font-size: 20px">{{reference}}</b> kama namba ya kumbukumbu<br><br>
                  6. Weka kiasi <b style="letter-spacing: 2px; font-size: 20px">{{cost | number}}</b> <br><br>
                  7. Weka namba yako ya siri<br><br>
                  8. Kisha thibitisha malipo<br><br>
                </span>
            </div>
          </div>
          <div class="col-sm-12 col-xl-6 col-lg-6 col-md-6 col-12">
            <img style="height: 80px" alt="AIRTEL MONEY" src="./assets/img/airtelmoney.jpg">
            <div style="padding-top: 8px">
              <div>
                <span style="">
                  1. Piga <b>*150*60#</b><br><br>
                  2. Chagua namba <b>5</b><br><br>
                  3. Changua namba <b>4</b><br><br>
                  4. Weka namba hii <b style="letter-spacing: 2px; font-size: 20px">400700</b> kama namba ya kampuni<br><br>
                  5. Weka kiasi <b style="letter-spacing: 2px; font-size: 20px">{{cost | number}}</b> <br><br>
                  6. Weka namba hii <b style="letter-spacing: 2px; font-size: 20px">{{reference}}</b> kama namba ya kumbukumbu<br><br>
                  7. Weka namba yako ya siri<br><br>
                  8. Kisha thibitisha malipo<br><br>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </mat-card>
  `,
})
export class HowToPayComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() reference = '';
  @Input() cost = '';

  constructor() {
  }

  async ngAfterViewInit(): Promise<void> {

  }

  async ngOnDestroy(): Promise<void> {

  }

  async ngOnInit(): Promise<void> {
  }

}
