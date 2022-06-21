import { Injectable } from "@angular/core";
import { functions, cache } from "bfast";
import { UserService } from "smartstock-core";

@Injectable({
  providedIn: "root"
})
export class BillingService {
  constructor(private readonly userService: UserService) {}

  async subscription(): Promise<any> {
    const owner = await this.userService.currentUser();
    const payment = await functions()
      .request(`/billing/${owner.id}/subscription`)
      .get();
    if (payment) {
      cache({ database: "payment", collection: "subscription" })
        .set("status", payment, { secure: true })
        .catch((_) => {});
    }
    return payment;
  }

  async payByCard(data: {
    amount: string;
    reference: string;
    mobile: string;
  }): Promise<string> {
    return functions()
      .request("https://fahamupay-faas.bfast.fahamutech.com/functions/pay/card")
      .get({
        params: data
      });
  }

  async monthlyCost(): Promise<any> {
    const owner = await this.userService.currentUser();
    const value = await functions()
      .request(`/billing/${owner.id}/cost`)
      .get<{ cost: any }>();
    value.cost = parseInt(value.cost, 10).toFixed(0);
    return value;
  }

  async getPaymentReference(): Promise<any> {
    const owner = await this.userService.currentUser();
    return functions().request(`/billing/${owner.id}/reference`).get();
  }

  async getReceipt(): Promise<any[]> {
    const owner = await this.userService.currentUser();
    return functions().request(`/billing/${owner.id}/receipts`).get();
  }

  async getInvoices(): Promise<any[]> {
    const owner = await this.userService.currentUser();
    return functions().request(`/billing/${owner.id}/invoices`).get();
  }
}
