export interface ShopModel {
  businessName: string;
  type?: 'PRINCIPAL' | 'SECONDARY';
  applicationId: string;
  projectId: string;
  projectUrlId: string;
  category: string;
  settings: {
    saleWithoutPrinter: boolean,
    printerFooter: string,
    printerHeader: string,
    allowRetail: boolean,
    allowWholesale: boolean,
  };
  ecommerce?: {
    logo?: string;
    cover?: string;
    about?: string;
    social: {
      instagram?: string;
      twitter?: string;
      whatsapp?: string;
      facebook?: string;
    };
    faq?: { question?: string, answer?: string }[]
  };
  country?: string;
  region?: string;
  street?: string;
}
