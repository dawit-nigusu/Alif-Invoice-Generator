export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface RestaurantInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  table: string;
  date: string;
}

export interface Invoice {
  id?: string;
  invoice_number: string;
  restaurant_info: RestaurantInfo;
  customer_info: CustomerInfo;
  items: InvoiceItem[];
  tax_rate: number;
  subtotal: number;
  tax: number;
  total: number;
  show_disclaimer: boolean;
  disclaimer_text: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceFormData {
  invoiceNumber: string;
  restaurantInfo: RestaurantInfo;
  customerInfo: CustomerInfo;
  items: InvoiceItem[];
  taxRate: number;
  showDisclaimer: boolean;
  disclaimerText: string;
}
