export class SettingsModel {
  saleWithoutPrinter: boolean;
  printerFooter: string;
  printerHeader: string;
  allowRetail: boolean;
  allowWholesale: boolean;
  module: {
    stock?: string
  };
  currency: string;
}
