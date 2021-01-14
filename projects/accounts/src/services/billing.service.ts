import {Injectable} from '@angular/core';
import {BFast, bfast} from 'bfastjs';
import {StorageService} from '@smartstocktz/core-libs';

@Injectable({
  providedIn: 'any'
})
export class BillingService {

  constructor(private readonly storage: StorageService) {
  }

  async subscription(): Promise<any> {
    const owner = await this.storage.getActiveUser();
    const payment = await BFast.functions().request(`/billing/${owner.id}/subscription`).get();
    if (payment) {
      bfast.cache({database: 'payment', collection: 'subscription'}).set('status', payment, {secure: true})
        .catch(_ => {
        });
    }
    return payment;
  }

  async payByCard(data: { amount: string, reference: string, mobile: string }): Promise<string> {
    return bfast.functions().request('https://fahamupay-faas.bfast.fahamutech.com/functions/pay/card').get({
      params: data
    });
  }

  async monthlyCost(): Promise<any> {
    const owner = await this.storage.getActiveUser();
    const value = await BFast.functions().request(`/billing/${owner.id}/cost`).get<{ cost: any }>();
    value.cost = parseInt(value.cost).toFixed(0);
    return value;
  }

  // async getDueBalance(currency: 'TZS' | 'USD'): Promise<any> {
  //   const owner = await this.storage.getActiveUser();
  //   return BFast.functions().request(`/billing/${owner.id}/dueBilling`).get();
  // }

  // async getUnInvoicesBalance(currency: 'TZS' | 'USD'): Promise<any> {
  //   const owner = await this.storage.getActiveUser();
  //   return BFast.functions().request(`/billing/${owner.id}/unInvoicedBalance`).get();
  // }

  async getPaymentReference(): Promise<any> {
    const owner = await this.storage.getActiveUser();
    return BFast.functions().request(`/billing/${owner.id}/reference`).get();
  }

  // async getInvoices(): Promise<{ businessName: string, invoice: { _id: string, amount: number, accountId: string }[] }[]> {
  //   const owner = await this.storage.getActiveUser();
  //   return BFast.functions().request(`/billing/${owner.id}/invoices`).get();
  // }

  async getReceipt(): Promise<any[]> {
    const owner = await this.storage.getActiveUser();
    return BFast.functions().request(`/billing/${owner.id}/receipts`).get();
  }

}
