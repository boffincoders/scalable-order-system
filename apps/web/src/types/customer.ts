export interface CustomerAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country: string; // REQUIRED by Stripe India
}

export interface CustomerInfo {
  name: string; // REQUIRED
  address: CustomerAddress;
}
