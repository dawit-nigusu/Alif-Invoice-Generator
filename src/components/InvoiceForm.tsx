import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Printer, Save } from "lucide-react";
import restaurantLogo from "@/assets/restaurant-logo.jpg";
import type { InvoiceFormData } from "@/types/invoice";

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
  phone: string;
  email: string;
  table: string;
  date: string;
}

interface InvoiceFormProps {
  initialData?: InvoiceFormData | null;
  onSave?: (data: InvoiceFormData) => void;
  isNew?: boolean;
}

export const InvoiceForm = ({ initialData, onSave, isNew = true }: InvoiceFormProps) => {
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().slice(-6)}`);

  // Predefined menu items with prices
  const predefinedItems: PredefinedItem[] = [
    // Fried Chicken
    { id: "alicha-mild", name: "Alicha (Turmeric Lemon - Mild)", price: 9.00, category: "Fried Chicken" },
    { id: "awaze-spicy", name: "Awaze (Berbere Spice - Spicy)", price: 9.00, category: "Fried Chicken" },
    { id: "chicken-sandwich", name: "Crispy Fried Chicken Sandwich", price: 13.00, category: "Fried Chicken" },

    // Traditional Eats
    { id: "doro-wot-half", name: "Doro Wot - Half", price: 120.00, category: "Traditional Eats" },
    { id: "doro-wot-full", name: "Doro Wot - Full", price: 240.00, category: "Traditional Eats" },
    { id: "doro-tibs-half", name: "Doro Tibs - Half", price: 130.00, category: "Traditional Eats" },
    { id: "doro-tibs-full", name: "Doro Tibs - Full", price: 240.00, category: "Traditional Eats" },
    
    // Shawarma
    { id: "shawarma-wrap", name: "Shawarma Wrap", price: 12.00, category: "Shawarma" },
    { id: "shawarma-salad", name: "Shawarma Salad", price: 120.00, category: "Shawarma" },
    
    // Vegan Bites
    { id: "enguday-half", name: "Enguday (Fried Mushrooms) - Half", price: 75.00, category: "Vegan Bites" },
    { id: "enguday-full", name: "Enguday (Fried Mushrooms) - Full", price: 150.00, category: "Vegan Bites" },
    { id: "falafal-salad", name: "Falafel Salad", price: 55.00, category: "Vegan Bites" },
    { id: "falafal-wrap", name: "Falafel Wrap", price: 10.00, category: "Vegan Bites" },
    
    // Sides
    { id: "mac-n-cheese-half", name: "Aida's Mac N Cheese - Half", price: 50.00, category: "Sides" },
    { id: "mac-n-cheese-full", name: "Aida's Mac N Cheese - Full", price: 100.00, category: "Sides" },
    { id: "addis-fries-half", name: "Addis Fries (Spiced) - Half", price: 50.00, category: "Sides" },
    { id: "addis-fries-full", name: "Addis Fries (Spiced) - Full", price: 100.00, category: "Sides" },
    { id: "collard-greens-half", name: "Collard Greens - Half", price: 50.00, category: "Sides" },
    { id: "collard-greens-full", name: "Collard Greens - Full", price: 100.00, category: "Sides" },
    
    // Sauces & Drinks
    { id: "sauce-8oz", name: "Sauce (8oz each)", price: 6.00, category: "Sauces & Drinks" },
    { id: "birz-1gal", name: "Birz 1 Gallon (Fermented Honey)", price: 50.00, category: "Sauces & Drinks" },
    { id: "kerkede-1gal", name: "Kerkede 1 Gallon (Hibiscus Iced Tea)", price: 50.00, category: "Sauces & Drinks" },
    
    // Services
    { id: "delivery", name: "Delivery", price: 50.00, category: "Services" },
  ];

  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
    name: "Doro Bet / ዶሮ ቤት",
    address: "4533 Baltimore Ave, Philadelphia, PA 19143",
    phone: "(215) 921-6558 ",
    email: "dorobetphl@gmail.com"
  });

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
    email: "",
    table: "",
    date: new Date().toISOString().split('T')[0]
  });

  const [items, setItems] = useState<InvoiceItem[]>([]);

  const [taxRate, setTaxRate] = useState(8.5);
  const [selectKey, setSelectKey] = useState(0); // For resetting the select component
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disclaimerText, setDisclaimerText] = useState("Your total does not include tax, gratuity and 3% credit card processing fee");
  const [saving, setSaving] = useState(false);

  // Load initial data if provided
  useEffect(() => {
    if (initialData) {
      setInvoiceNumber(initialData.invoiceNumber);
      setRestaurantInfo(initialData.restaurantInfo);
      setCustomerInfo(initialData.customerInfo);
      setItems(initialData.items);
      setTaxRate(initialData.taxRate);
      setShowDisclaimer(initialData.showDisclaimer);
      setDisclaimerText(initialData.disclaimerText);
    }
  }, [initialData]);

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

  const handleSave = async () => {
    if (!onSave) return;
    
    setSaving(true);
    try {
      const formData: InvoiceFormData = {
        invoiceNumber,
        restaurantInfo,
        customerInfo,
        items,
        taxRate,
        showDisclaimer,
        disclaimerText,
      };
      await onSave(formData);
    } catch (error) {
      console.error("Error saving invoice:", error);
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center print:hidden">
        <h1 className="text-3xl font-bold text-invoice-header">Doro Bet Invoice Generator</h1>
        <div className="flex items-center gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="disclaimer-toggle"
                checked={showDisclaimer}
                onCheckedChange={(checked) => setShowDisclaimer(checked === true)}
              />
              <Label htmlFor="disclaimer-toggle" className="text-sm">
                Show payment disclaimer
              </Label>
            </div>
            {showDisclaimer && (
              <div className="ml-6">
                <Label htmlFor="disclaimer-text" className="text-xs text-muted-foreground">
                  Disclaimer text:
                </Label>
                <Textarea
                  id="disclaimer-text"
                  value={disclaimerText}
                  onChange={(e) => setDisclaimerText(e.target.value)}
                  className="mt-1 text-xs resize-none"
                  placeholder="Enter disclaimer text..."
                  rows={2}
                />
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {onSave && (
              <Button 
                onClick={handleSave} 
                disabled={saving}
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : isNew ? "Save Invoice" : "Update Invoice"}
              </Button>
            )}
            <Button onClick={handlePrint} className="bg-primary hover:bg-primary/90">
              <Printer className="w-4 h-4 mr-2" />
              Print Invoice
            </Button>
          </div>
        </div>
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
                <div className="text-sm font-medium">INVOICE No</div>
                <div className="text-lg font-bold">{invoiceNumber}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Contact Info */}
        <div className="bg-invoice-section border-b p-6">
          <div className="grid grid-cols-5 gap-8">
            <div className="col-span-3">
              <h3 className="font-semibold text-invoice-header mb-3">Contact Information</h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-1 items-start">
                  <Label className="text-xs text-muted-foreground">Name:</Label>
                  <Input
                    value={restaurantInfo.name}
                    onChange={(e) => setRestaurantInfo({...restaurantInfo, name: e.target.value})}
                    className="col-span-2 h-auto min-h-7 text-sm py-1 px-3 print:border-none print:shadow-none print:bg-transparent break-words"
                  />
                </div>
                <div className="grid grid-cols-3 gap-1 items-start">
                  <Label className="text-xs text-muted-foreground">Address:</Label>
                  <Input
                    value={restaurantInfo.address}
                    onChange={(e) => setRestaurantInfo({...restaurantInfo, address: e.target.value})}
                    className="col-span-2 h-auto min-h-7 text-sm py-1 px-3 print:border-none print:shadow-none print:bg-transparent break-words"
                  />
                </div>
                <div className="grid grid-cols-3 gap-1 items-start">
                  <Label className="text-xs text-muted-foreground">Phone:</Label>
                  <Input
                    value={restaurantInfo.phone}
                    onChange={(e) => setRestaurantInfo({...restaurantInfo, phone: e.target.value})}
                    className="col-span-2 h-auto min-h-7 text-sm py-1 px-3 print:border-none print:shadow-none print:bg-transparent break-words"
                  />
                </div>
                <div className="grid grid-cols-3 gap-1 items-start">
                  <Label className="text-xs text-muted-foreground">Email:</Label>
                  <Input
                    value={restaurantInfo.email}
                    onChange={(e) => setRestaurantInfo({...restaurantInfo, email: e.target.value})}
                    className="col-span-2 h-auto min-h-7 text-sm py-1 px-3 print:border-none print:shadow-none print:bg-transparent break-words"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <h3 className="font-semibold text-invoice-header mb-3">Bill To</h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-1 items-start">
                  <Label className="text-xs text-muted-foreground">Bill To:</Label>
                  <Textarea
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="col-span-2 min-h-7 text-sm py-1 px-3 print:border-none print:shadow-none print:bg-transparent resize-none overflow-hidden"
                    placeholder="Customer name"
                    rows={1}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = `${target.scrollHeight}px`;
                    }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-1 items-start">
                  <Label className="text-xs text-muted-foreground">Phone:</Label>
                  <Input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="col-span-2 h-auto min-h-7 text-sm py-1 px-3 print:border-none print:shadow-none print:bg-transparent break-words"
                    placeholder="Phone number"
                  />
                </div>
                <div className="grid grid-cols-3 gap-1 items-start">
                  <Label className="text-xs text-muted-foreground">Email:</Label>
                  <Input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    className="col-span-2 h-auto min-h-7 text-sm py-1 px-3 print:border-none print:shadow-none print:bg-transparent break-words"
                    placeholder="Email address"
                  />
                </div>
                <div className="grid grid-cols-3 gap-1 items-start">
                  <Label className="text-xs text-muted-foreground">Date:</Label>
                  <Input
                    type="date"
                    value={customerInfo.date}
                    onChange={(e) => setCustomerInfo({...customerInfo, date: e.target.value})}
                    className="col-span-2 h-auto min-h-7 text-sm py-1 px-3 print:border-none print:shadow-none print:bg-transparent break-words"
                  />
                </div>
                <div className="grid grid-cols-3 gap-1 items-start print:hidden">
                  <Label className="text-xs text-muted-foreground">Invoice #:</Label>
                  <Input
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="col-span-2 h-auto min-h-7 text-sm py-1 px-3 break-words"
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
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Traditional Eats</div>
                  {predefinedItems.filter(item => item.category === "Traditional Eats").map((item) => (
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
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Vegan Bites</div>
                  {predefinedItems.filter(item => item.category === "Vegan Bites").map((item) => (
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
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Sauces & Drinks</div>
                  {predefinedItems.filter(item => item.category === "Sauces & Drinks").map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      <div className="flex justify-between items-center w-full">
                        <span>{item.name}</span>
                        <span className="text-muted-foreground ml-4">${item.price}</span>
                      </div>
                    </SelectItem>
                  ))}
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Services</div>
                  {predefinedItems.filter(item => item.category === "Services").map((item) => (
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
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                        className="text-right border-none shadow-none py-0 px-2 h-auto bg-transparent focus-visible:ring-0 w-20 print:bg-transparent"
                        placeholder="0.00"
                      />
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
                
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-xl font-bold text-black">TOTAL:</span>
                  <span className="text-2xl font-bold text-black">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 text-center space-y-3">
          {showDisclaimer && disclaimerText && (
            <p className="text-xs text-muted-foreground italic">
              {disclaimerText}
            </p>
          )}
          <p className="text-lg font-medium text-black">Thank You!</p>
        </div>
      </div>
    </div>
  );
};