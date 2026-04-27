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
import restaurantLogo from "@/assets/alif logo.jpg";
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

  // Predefined items with prices for Alif Brew & Mini Mart
  const predefinedItems: PredefinedItem[] = [
    // Appetizers
    { id: "sambusa-lentil", name: "Sambusa - Lentil (each)", price: 1.5, category: "Appetizers" },
    { id: "sambusa-chicken", name: "Sambusa - Chicken (each)", price: 1.5, category: "Appetizers" },

    // Breakfast & Dips (served with pita bread)
    { id: "foul-medames-half", name: "Foul Medames (Fava Bean Stew) - Half Pan", price: 50, category: "Breakfast & Dips" },
    { id: "foul-medames-full", name: "Foul Medames (Fava Bean Stew) - Full Pan", price: 100, category: "Breakfast & Dips" },
    { id: "shakshuka-half", name: "Shakshuka (w/ Poached Egg) - Half Pan", price: 75, category: "Breakfast & Dips" },
    { id: "shakshuka-full", name: "Shakshuka (w/ Poached Egg) - Full Pan", price: 125, category: "Breakfast & Dips" },
    { id: "hummus-32oz", name: "Hummus (Spicy/Plain) - 32oz", price: 30, category: "Breakfast & Dips" },
    { id: "baba-ghanoush-32oz", name: "Baba Ghanoush - 32oz", price: 30, category: "Breakfast & Dips" },

    // Salads
    { id: "mediterranean-salad-half", name: "Mediterranean Salad - Half Pan", price: 35, category: "Salads" },
    { id: "mediterranean-salad-full", name: "Mediterranean Salad - Full Pan", price: 75, category: "Salads" },
    { id: "lentil-beet-salad-half", name: "Lentil & Beet Salad - Half Pan", price: 40, category: "Salads" },
    { id: "lentil-beet-salad-full", name: "Lentil & Beet Salad - Full Pan", price: 80, category: "Salads" },

    // Sides
    { id: "cabbage-carrots-half", name: "Cabbage & Carrots - Half Pan", price: 50, category: "Sides" },
    { id: "cabbage-carrots-full", name: "Cabbage & Carrots - Full Pan", price: 100, category: "Sides" },
    { id: "collard-greens-half", name: "Collard Greens - Half Pan", price: 50, category: "Sides" },
    { id: "collard-greens-full", name: "Collard Greens - Full Pan", price: 100, category: "Sides" },
    { id: "chickpea-stew-half", name: "Chickpea Stew - Half Pan", price: 50, category: "Sides" },
    { id: "chickpea-stew-full", name: "Chickpea Stew - Full Pan", price: 100, category: "Sides" },
    { id: "green-beans-carrot-half", name: "Green Beans & Carrot - Half Pan", price: 50, category: "Sides" },
    { id: "green-beans-carrot-full", name: "Green Beans & Carrot - Full Pan", price: 100, category: "Sides" },
    { id: "beets-half", name: "Beets - Half Pan", price: 50, category: "Sides" },
    { id: "beets-full", name: "Beets - Full Pan", price: 100, category: "Sides" },
    { id: "spinach-half", name: "Spinach - Half Pan", price: 50, category: "Sides" },
    { id: "spinach-full", name: "Spinach - Full Pan", price: 100, category: "Sides" },
    { id: "rice-half", name: "Rice - Half Pan", price: 30, category: "Sides" },
    { id: "rice-full", name: "Rice - Full Pan", price: 60, category: "Sides" },

    // Mains
    { id: "baked-salmon-piece", name: "Baked Salmon (per piece)", price: 10, category: "Mains" },
    { id: "chicken-kabob-2pcs", name: "Chicken Kabob (2 pieces)", price: 7, category: "Mains" },
    { id: "braised-lamb-piece", name: "Braised Lamb (per piece)", price: 10, category: "Mains" },

    // Stews (served with injera)
    { id: "misir-wot-half", name: "Misir Wot (Spicy Lentil Stew) - Half Pan", price: 50, category: "Stews" },
    { id: "misir-wot-full", name: "Misir Wot (Spicy Lentil Stew) - Full Pan", price: 100, category: "Stews" },
    { id: "alicha-kik-half", name: "Alicha Kik (Mild Split Peas) - Half Pan", price: 50, category: "Stews" },
    { id: "alicha-kik-full", name: "Alicha Kik (Mild Split Peas) - Full Pan", price: 100, category: "Stews" },
    { id: "doro-wot-half", name: "Doro Wot (Spicy Chicken Stew) - Half Pan", price: 100, category: "Stews" },
    { id: "doro-wot-full", name: "Doro Wot (Spicy Chicken Stew) - Full Pan", price: 200, category: "Stews" },
    { id: "siga-wot-half", name: "Siga Wot (Spicy Beef) - Half Pan", price: 160, category: "Stews" },
    { id: "siga-wot-full", name: "Siga Wot (Spicy Beef) - Full Pan", price: 320, category: "Stews" },

    // Dessert
    { id: "baklava-tray", name: "Baklava Tray", price: 70, category: "Dessert" },
  ];

  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
    name: "Alif Brew & Mini Mart",
    address: "4501 Baltimore ave, Philadelphia, 19143",
    phone: "(215) 315-8427",
    email: ""
  });

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
    email: "",
    table: "",
    date: new Date().toISOString().split('T')[0]
  });

  const [items, setItems] = useState<InvoiceItem[]>([]);

  const [taxRate, setTaxRate] = useState(8);
  const [selectKey, setSelectKey] = useState(0); // For resetting the select component
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disclaimerText, setDisclaimerText] = useState("Prices are listed in USD. Card payments include a 3% processing fee. Returns accepted within 7 days with receipt.");
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
  const groupedItems = predefinedItems.reduce<Record<string, PredefinedItem[]>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

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
        <h1 className="text-3xl font-bold text-invoice-header">Alif Brew & Mini Mart Invoice Generator</h1>
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
      <div className="invoice-paper bg-white shadow-lg print:shadow-none border border-border rounded-lg overflow-hidden">
        {/* Professional Invoice Header with Logo */}
        <div className="bg-invoice-header text-invoice-header-foreground p-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-6">
              <img 
                src={restaurantLogo} 
                alt="Alif Brew & Mini Mart Logo" 
                className="w-20 h-20 object-contain bg-white rounded-lg p-2 shadow-sm"
              />
              <div>
                <h1 className="text-3xl font-bold text-white">{restaurantInfo.name}</h1>
                <p className="text-blue-200 mt-1">Coffee Bar | Bakery | Mini Mart</p>
              </div>
            </div>
            <div className="text-right">
              <div className="invoice-mono bg-white text-invoice-header rounded-lg px-4 py-2 inline-block">
                <div className="text-sm font-medium">INVOICE No</div>
                <div className="text-lg font-bold">{invoiceNumber}</div>
                <div className="text-xs mt-1 opacity-80">Issued {new Date(customerInfo.date).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Contact Info */}
        <div className="bg-invoice-section border-b p-6">
          <div className="grid grid-cols-5 gap-8">
            <div className="col-span-3">
              <h3 className="font-semibold text-invoice-header mb-3">Store Details</h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 print:grid-cols-[54px_1fr] gap-1 print:gap-0 items-start">
                  <Label className="text-xs text-muted-foreground">Name:</Label>
                  <Input
                    value={restaurantInfo.name}
                    onChange={(e) => setRestaurantInfo({...restaurantInfo, name: e.target.value})}
                    className="col-span-2 print:col-span-1 h-auto min-h-7 text-sm py-1 px-3 print:px-1 print:border-none print:shadow-none print:bg-transparent break-words"
                  />
                </div>
                <div className="grid grid-cols-3 print:grid-cols-[54px_1fr] gap-1 print:gap-0 items-start">
                  <Label className="text-xs text-muted-foreground">Address:</Label>
                  <Input
                    value={restaurantInfo.address}
                    onChange={(e) => setRestaurantInfo({...restaurantInfo, address: e.target.value})}
                    className="col-span-2 print:col-span-1 h-auto min-h-7 text-sm py-1 px-3 print:px-1 print:border-none print:shadow-none print:bg-transparent break-words"
                  />
                </div>
                <div className="grid grid-cols-3 print:grid-cols-[54px_1fr] gap-1 print:gap-0 items-start">
                  <Label className="text-xs text-muted-foreground">Phone:</Label>
                  <Input
                    value={restaurantInfo.phone}
                    onChange={(e) => setRestaurantInfo({...restaurantInfo, phone: e.target.value})}
                    className="col-span-2 print:col-span-1 h-auto min-h-7 text-sm py-1 px-3 print:px-1 print:border-none print:shadow-none print:bg-transparent break-words"
                  />
                </div>
                <div className="grid grid-cols-3 print:grid-cols-[54px_1fr] gap-1 print:gap-0 items-start">
                  <Label className="text-xs text-muted-foreground">Email:</Label>
                  <Input
                    value={restaurantInfo.email}
                    onChange={(e) => setRestaurantInfo({...restaurantInfo, email: e.target.value})}
                    className="col-span-2 print:col-span-1 h-auto min-h-7 text-sm py-1 px-3 print:px-1 print:border-none print:shadow-none print:bg-transparent break-words"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <h3 className="font-semibold text-invoice-header mb-3">Customer Details</h3>
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
                  {Object.entries(groupedItems).map(([category, categoryItems]) => (
                    <div key={category}>
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">{category}</div>
                      {categoryItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          <div className="flex justify-between items-center w-full">
                            <span>{item.name}</span>
                            <span className="text-muted-foreground ml-4">${item.price.toFixed(2)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </div>
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
                        placeholder="e.g., Cappuccino (12oz)"
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
          <Separator />
          <p className="text-sm text-muted-foreground">Thank you for choosing Alif Brew & Mini Mart.</p>
        </div>
      </div>
    </div>
  );
};