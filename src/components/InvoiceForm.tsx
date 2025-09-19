import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Printer } from "lucide-react";
import restaurantLogo from "@/assets/restaurant-logo.jpg";

interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface PredefinedItem {
  id: string;
  name: string;
  price: number;
  category: string;
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
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().slice(-6)}`);

  // Predefined menu items with prices
  const predefinedItems: PredefinedItem[] = [
    // Fried Chicken
    { id: "half-mild", name: "Half Mild Fried Chicken", price: 9.50, category: "Fried Chicken" },
    { id: "half-spicy", name: "Half Spicy Fried Chicken", price: 9.50, category: "Fried Chicken" },
    { id: "whole-mild", name: "Whole Mild Fried Chicken", price: 18.00, category: "Fried Chicken" },
    { id: "whole-spicy", name: "Whole Spicy Fried Chicken", price: 18.00, category: "Fried Chicken" },
    { id: "chicken-sandwich", name: "Chicken Sandwich", price: 10.00, category: "Fried Chicken" },

    //vegans
    { id: "felafal-wrap", name: "Felafal Wrap", price: 10.00, category: "Vegan Dishes" },
    { id: "felafal-salad", name: "Felafal Salad", price: 10.00, category: "Vegan Dishes" },
    { id: "fried-mushroom", name: "Fried Mushroom", price: 10.00, category: "Vegan Dishes" },
    
    // Traditional Dishes
    { id: "doro-wot", name: "Doro Wot (Chicken Stew)", price: 14.00, category: "Main Dishes" },
    { id: "doro-tibs", name: "Doro Tibs (Chicken Tibs)", price: 13.50, category: "Main Dishes" },
   
    //shawarma
    { id: "shawarma-wrap", name: "Shawarma", price: 10.00, category: "Shawarma" },
    { id: "shawarma-salad", name: "Shawarma Salad", price: 10.00, category: "Shawarma" },
    
    //sides
    { id: "gomen", name: "Gomen (Collard Greens)", price: 11.99, category: "Sides" },
    { id: "mac-n-cheese", name: "Mac N Cheese", price: 11.99, category: "Sides" },
    { id: "french-fries", name: "French Fries", price: 11.99, category: "Sides" },
    
    // Beverages
    { id: "ethiopian-coffee", name: "Ethiopian Coffee", price: 4.99, category: "Beverages" },
    { id: "biriz", name: "Biriz (Fermented Honey Water)", price: 4.00, category: "Beverages" },
    { id: "kerkede", name: "Kerkede (Hibiscus Iced Tea)", price: 5.50, category: "Beverages" },
    { id: "soft-drink", name: "Soft Drink", price: 2.99, category: "Beverages" },
    { id: "ambo", name: "Ethiopian Sparkling Water (Ambo)", price: 4.00, category: "Beverages" },
    
    //desserts
    { id: "tres-leches", name: "Cardamom Tres Leches Cake", price: 8.99, category: "Desserts" },
    { id: "tiramisu", name: "Tiramisu", price: 8.99, category: "Desserts" },
  ];

  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
    name: "Doro Bet / ዶሮ ቤት",
    address: "4533 Baltimore Ave, Philadelphia, PA 19143",
    phone: "(215) 921-6558 ",
    email: "contact@aliffamillyrestaurant.com"
  });

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    table: "",
    date: new Date().toISOString().split('T')[0]
  });

  const [items, setItems] = useState<InvoiceItem[]>([]);

  const [taxRate, setTaxRate] = useState(15);
  const [selectKey, setSelectKey] = useState(0); // For resetting the select component

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      price: 0
    };
    setItems([...items, newItem]);
  };

  const addPredefinedItem = (predefinedItemId: string) => {
    const predefinedItem = predefinedItems.find(item => item.id === predefinedItemId);
    if (predefinedItem) {
      const newItem: InvoiceItem = {
        id: Date.now().toString(),
        name: predefinedItem.name,
        quantity: 1,
        price: predefinedItem.price
      };
      setItems([...items, newItem]);
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
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
        <h1 className="text-3xl font-bold text-invoice-header">Doro Bet Invoice Generator</h1>
        <Button onClick={handlePrint} className="bg-primary hover:bg-primary/90">
          <Printer className="w-4 h-4 mr-2" />
          Print Invoice
        </Button>
      </div>

      {/* Invoice Content */}
      <div className="bg-white shadow-lg print:shadow-none border border-border rounded-lg overflow-hidden">
        {/* Professional Invoice Header with Logo */}
        <div className="bg-invoice-header text-invoice-header-foreground p-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-6">
              <img 
                src={restaurantLogo} 
                alt="Restaurant Logo" 
                className="w-16 h-16 object-contain bg-white rounded-lg p-2"
              />
              <div>
                <h1 className="text-3xl font-bold text-white">{restaurantInfo.name}</h1>
                <p className="text-blue-200 mt-1">Ethiopian Chicken House</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white text-invoice-header rounded-lg px-4 py-2 inline-block">
                <div className="text-sm font-medium">INVOICE</div>
                <div className="text-lg font-bold">{invoiceNumber}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Contact Info */}
        <div className="bg-invoice-section border-b p-6">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-invoice-header mb-3">Contact Information</h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-2">
                  <Label className="text-xs text-muted-foreground">Name:</Label>
                  <Input
                    value={restaurantInfo.name}
                    onChange={(e) => setRestaurantInfo({...restaurantInfo, name: e.target.value})}
                    className="col-span-2 h-8 text-sm print:border-none print:shadow-none print:bg-transparent"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Label className="text-xs text-muted-foreground">Address:</Label>
                  <Input
                    value={restaurantInfo.address}
                    onChange={(e) => setRestaurantInfo({...restaurantInfo, address: e.target.value})}
                    className="col-span-2 h-8 text-sm print:border-none print:shadow-none print:bg-transparent"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Label className="text-xs text-muted-foreground">Phone:</Label>
                  <Input
                    value={restaurantInfo.phone}
                    onChange={(e) => setRestaurantInfo({...restaurantInfo, phone: e.target.value})}
                    className="col-span-2 h-8 text-sm print:border-none print:shadow-none print:bg-transparent"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Label className="text-xs text-muted-foreground">Email:</Label>
                  <Input
                    value={restaurantInfo.email}
                    onChange={(e) => setRestaurantInfo({...restaurantInfo, email: e.target.value})}
                    className="col-span-2 h-8 text-sm print:border-none print:shadow-none print:bg-transparent"
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-invoice-header mb-3">Bill To</h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-2">
                  <Label className="text-xs text-muted-foreground">Customer:</Label>
                  <Input
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="col-span-2 h-8 text-sm print:border-none print:shadow-none print:bg-transparent"
                    placeholder="Customer name"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Label className="text-xs text-muted-foreground">Table:</Label>
                  <Input
                    value={customerInfo.table}
                    onChange={(e) => setCustomerInfo({...customerInfo, table: e.target.value})}
                    className="col-span-2 h-8 text-sm print:border-none print:shadow-none print:bg-transparent"
                    placeholder="Table number"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Label className="text-xs text-muted-foreground">Date:</Label>
                  <Input
                    type="date"
                    value={customerInfo.date}
                    onChange={(e) => setCustomerInfo({...customerInfo, date: e.target.value})}
                    className="col-span-2 h-8 text-sm print:border-none print:shadow-none print:bg-transparent"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 print:hidden">
                  <Label className="text-xs text-muted-foreground">Invoice #:</Label>
                  <Input
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="col-span-2 h-8 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Items Table */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-invoice-header">Items & Services</h3>
            <div className="flex gap-2 print:hidden">
              <Select 
                key={selectKey}
                onValueChange={(value) => {
                  if (value === "manual") {
                    addItem();
                  } else {
                    addPredefinedItem(value);
                  }
                  // Reset the select component to show "Add Item" again
                  setSelectKey(prev => prev + 1);
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Add Item" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">
                    <div className="flex items-center">
                      <Plus className="w-4 h-4 mr-2" />
                      Manual Entry
                    </div>
                  </SelectItem>
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Fried Chicken</div>
                  {predefinedItems.filter(item => item.category === "Fried Chicken").map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      <div className="flex justify-between items-center w-full">
                        <span>{item.name}</span>
                        <span className="text-muted-foreground ml-4">${item.price}</span>
                      </div>
                    </SelectItem>
                  ))}
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Vegan Dishes</div>
                  {predefinedItems.filter(item => item.category === "Vegan Dishes").map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      <div className="flex justify-between items-center w-full">
                        <span>{item.name}</span>
                        <span className="text-muted-foreground ml-4">${item.price}</span>
                      </div>
                    </SelectItem>
                  ))}
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Main Dishes</div>
                  {predefinedItems.filter(item => item.category === "Main Dishes").map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      <div className="flex justify-between items-center w-full">
                        <span>{item.name}</span>
                        <span className="text-muted-foreground ml-4">${item.price}</span>
                      </div>
                    </SelectItem>
                  ))}
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Shawarma</div>
                  {predefinedItems.filter(item => item.category === "Shawarma").map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      <div className="flex justify-between items-center w-full">
                        <span>{item.name}</span>
                        <span className="text-muted-foreground ml-4">${item.price}</span>
                      </div>
                    </SelectItem>
                  ))}
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Sides</div>
                  {predefinedItems.filter(item => item.category === "Sides").map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      <div className="flex justify-between items-center w-full">
                        <span>{item.name}</span>
                        <span className="text-muted-foreground ml-4">${item.price}</span>
                      </div>
                    </SelectItem>
                  ))}
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Beverages</div>
                  {predefinedItems.filter(item => item.category === "Beverages").map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      <div className="flex justify-between items-center w-full">
                        <span>{item.name}</span>
                        <span className="text-muted-foreground ml-4">${item.price}</span>
                      </div>
                    </SelectItem>
                  ))}
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Desserts</div>
                  {predefinedItems.filter(item => item.category === "Desserts").map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      <div className="flex justify-between items-center w-full">
                        <span>{item.name}</span>
                        <span className="text-muted-foreground ml-4">${item.price}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border border-border rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-invoice-section border-b border-border">
              <div className="grid grid-cols-12 gap-4 p-3 text-sm font-medium text-invoice-header">
                <div className="col-span-5">Description</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Unit Price</div>
                <div className="col-span-2 text-right">Amount</div>
                <div className="col-span-1 print:hidden"></div>
              </div>
            </div>
            
            {/* Table Items */}
            <div className="divide-y divide-border">
              {items.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-muted-foreground">
                    <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No items added yet</p>
                    <p className="text-xs mt-1">Use the dropdown above to add items to your invoice</p>
                  </div>
                </div>
              ) : (
                items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-center p-3 hover:bg-muted/30">
                    <div className="col-span-5">
                      <Input
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        placeholder="e.g., Margherita Pizza"
                        className="border-none shadow-none p-0 h-auto bg-transparent focus-visible:ring-0 print:bg-transparent"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        className="text-center border-none shadow-none p-0 h-auto bg-transparent focus-visible:ring-0 print:bg-transparent"
                      />
                    </div>
                    <div className="col-span-2 text-right">
                      <div className="flex items-center justify-end">
                        <span className="text-sm text-muted-foreground mr-1">$</span>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                          className="text-right border-none shadow-none p-0 h-auto bg-transparent focus-visible:ring-0 w-20 print:bg-transparent"
                        />
                      </div>
                    </div>
                    <div className="col-span-2 text-right font-semibold">
                      ${(item.quantity * item.price).toFixed(2)}
                    </div>
                    <div className="col-span-1 print:hidden">
                      <Button
                        onClick={() => removeItem(item.id)}
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive p-1 h-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Professional Totals Section */}
        <div className="border-t border-border bg-invoice-section/30">
          <div className="p-6">
            <div className="flex justify-end">
              <div className="w-80 space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="font-medium">Subtotal:</span>
                  <span className="text-lg font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Tax</span>
                    <span className="text-sm text-muted-foreground">
                      (
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={taxRate}
                        onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                        className="w-12 h-6 text-xs inline-block border-none shadow-none p-1 bg-transparent print:border-none print:shadow-none"
                      />
                      %)
                    </span>
                  </div>
                  <span className="text-lg font-semibold">${tax.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 bg-invoice-total/10 px-4 rounded-lg border-2 border-invoice-total/20">
                  <span className="text-xl font-bold text-invoice-total">TOTAL:</span>
                  <span className="text-2xl font-bold text-invoice-total">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Footer */}
        <div className="bg-invoice-header/5 p-6 text-center border-t">
          <div className="space-y-2">
            <p className="font-semibold text-invoice-header">Thank you for dining with us!</p>
            <p className="text-sm text-muted-foreground">
              Payment is due within 30 days. Please keep this invoice for your records.
            </p>
            <div className="flex justify-center gap-8 text-xs text-muted-foreground mt-4">
              <span>Invoice #{invoiceNumber}</span>
              <span>Generated on {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};