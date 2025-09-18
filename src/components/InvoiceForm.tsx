import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Printer } from "lucide-react";

interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface RestaurantInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface CustomerInfo {
  name: string;
  table: string;
  date: string;
}

export const InvoiceForm = () => {
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
    name: "The Golden Spoon",
    address: "123 Main Street, City, State 12345",
    phone: "(555) 123-4567",
    email: "info@goldenspoon.com"
  });

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    table: "",
    date: new Date().toISOString().split('T')[0]
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", name: "", quantity: 1, price: 0 }
  ]);

  const [taxRate, setTaxRate] = useState(8.5);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      price: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center print:hidden">
        <h1 className="text-3xl font-bold text-invoice-header">Restaurant Invoice Generator</h1>
        <Button onClick={handlePrint} className="bg-primary hover:bg-primary/90">
          <Printer className="w-4 h-4 mr-2" />
          Print Invoice
        </Button>
      </div>

      {/* Invoice Content */}
      <div className="print:shadow-none">
        {/* Restaurant Info */}
        <Card className="mb-6">
          <CardHeader className="bg-invoice-header text-invoice-header-foreground">
            <CardTitle className="text-xl">Restaurant Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="restaurant-name">Restaurant Name</Label>
                <Input
                  id="restaurant-name"
                  value={restaurantInfo.name}
                  onChange={(e) => setRestaurantInfo({...restaurantInfo, name: e.target.value})}
                  className="print:border-none print:shadow-none"
                />
              </div>
              <div>
                <Label htmlFor="restaurant-phone">Phone</Label>
                <Input
                  id="restaurant-phone"
                  value={restaurantInfo.phone}
                  onChange={(e) => setRestaurantInfo({...restaurantInfo, phone: e.target.value})}
                  className="print:border-none print:shadow-none"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="restaurant-address">Address</Label>
              <Input
                id="restaurant-address"
                value={restaurantInfo.address}
                onChange={(e) => setRestaurantInfo({...restaurantInfo, address: e.target.value})}
                className="print:border-none print:shadow-none"
              />
            </div>
            <div>
              <Label htmlFor="restaurant-email">Email</Label>
              <Input
                id="restaurant-email"
                type="email"
                value={restaurantInfo.email}
                onChange={(e) => setRestaurantInfo({...restaurantInfo, email: e.target.value})}
                className="print:border-none print:shadow-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customer Info */}
        <Card className="mb-6">
          <CardHeader className="bg-invoice-section">
            <CardTitle>Customer & Order Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="customer-name">Customer Name</Label>
                <Input
                  id="customer-name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  className="print:border-none print:shadow-none"
                />
              </div>
              <div>
                <Label htmlFor="table-number">Table Number</Label>
                <Input
                  id="table-number"
                  value={customerInfo.table}
                  onChange={(e) => setCustomerInfo({...customerInfo, table: e.target.value})}
                  className="print:border-none print:shadow-none"
                />
              </div>
              <div>
                <Label htmlFor="order-date">Date</Label>
                <Input
                  id="order-date"
                  type="date"
                  value={customerInfo.date}
                  onChange={(e) => setCustomerInfo({...customerInfo, date: e.target.value})}
                  className="print:border-none print:shadow-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card className="mb-6">
          <CardHeader className="bg-invoice-section">
            <div className="flex justify-between items-center">
              <CardTitle>Menu Items</CardTitle>
              <Button onClick={addItem} size="sm" variant="outline" className="print:hidden">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-5">
                    {index === 0 && <Label>Item Name</Label>}
                    <Input
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      placeholder="e.g., Margherita Pizza"
                      className="print:border-none print:shadow-none"
                    />
                  </div>
                  <div className="col-span-2">
                    {index === 0 && <Label>Quantity</Label>}
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                      className="print:border-none print:shadow-none"
                    />
                  </div>
                  <div className="col-span-2">
                    {index === 0 && <Label>Price ($)</Label>}
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                      className="print:border-none print:shadow-none"
                    />
                  </div>
                  <div className="col-span-2 text-right">
                    {index === 0 && <Label>Total</Label>}
                    <div className="text-lg font-semibold">
                      ${(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>
                  <div className="col-span-1 print:hidden">
                    {items.length > 1 && (
                      <Button
                        onClick={() => removeItem(item.id)}
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Totals */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span>Subtotal:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span>Tax Rate (%):</span>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-20 print:border-none print:shadow-none"
                  />
                </div>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center text-2xl font-bold text-invoice-total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground print:mt-16">
          <p>Thank you for dining with us!</p>
          <p>Please keep this invoice for your records.</p>
        </div>
      </div>
    </div>
  );
};