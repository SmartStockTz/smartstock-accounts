import {Injectable} from '@angular/core';
import {BFast} from 'bfastjs';
import {StorageService} from '@smartstocktz/core-libs';

@Injectable({
  providedIn: 'any'
})
export class BillingService {

  constructor(private readonly storage: StorageService) {
  }

  async subscription(): Promise<any> {
    const owner = await this.storage.getActiveUser();
    return BFast.functions().request(`/billing/${owner.id}/subscription`).get();
  }

  async monthlyCost(): Promise<any> {
    const owner = await this.storage.getActiveUser();
    return BFast.functions().request(`/billing/${owner.id}/cost`).get();
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
