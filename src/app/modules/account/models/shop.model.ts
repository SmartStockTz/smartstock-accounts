import {EcommerceModel} from './ecommerce.model';
import {SettingsModel} from './settings.model';

export interface ShopModel {
  businessName?: string;
  type?: 'PRINCIPAL' | 'SECONDARY';
  applicationId: string;
  projectId: string;
  projectUrlId: string;
  category?: string;
  settings?: SettingsModel;
  ecommerce?: EcommerceModel;
  country?: string;
  region?: string;
  street?: string;
}
