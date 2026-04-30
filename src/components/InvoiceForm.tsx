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
import alifLogo from "@/assets/alif logo.jpg";
import salamLogo from "@/assets/salamcafephl logo.jpg";
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

/** Saved on every invoice — joint catering branding for both locations */
const JOINT_RESTAURANT_INFO: RestaurantInfo = {
  name: "Alif Brew & Mini Mart · Salam Cafe",
  address:
    "Alif: 4501 Baltimore Ave, Philadelphia, PA 19143 · Salam: 5532 Greene St, Philadelphia, PA 19144",
  phone: "(215) 315-8427 · (215) 660-9780",
  email: "",
};

const CATERING_VENUES = [
  {
    name: "Alif Brew & Mini Mart",
    address: "4501 Baltimore Ave",
    cityLine: "Philadelphia, PA 19143",
    phone: "(215) 315-8427",
    logo: alifLogo,
    logoAlt: "Alif Brew & Mini Mart logo",
  },
  {
    name: "Salam Cafe",
    address: "5532 Greene St",
    cityLine: "Philadelphia, PA 19144",
    phone: "(215) 660-9780",
    logo: salamLogo,
    logoAlt: "Salam Cafe logo",
  },
] as const;

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
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [disclaimerText, setDisclaimerText] = useState(
    "Card payments include a 3% processing fee",
  );
  const [saving, setSaving] = useState(false);

  // Load initial data if provided
  useEffect(() => {
    if (initialData) {
      setInvoiceNumber(initialData.invoiceNumber);
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
        restaurantInfo: JOINT_RESTAURANT_INFO,
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
    <div className="max-w-[1320px] mx-auto px-4 py-6 md:px-6">
      <div className="grid grid-cols-1 xl:grid-cols-[900px_340px] justify-center gap-6 xl:gap-8 items-start">
        {/* Controls Panel */}
        <aside className="order-1 xl:order-2 space-y-4 print:hidden xl:sticky xl:top-6">
          <Card className="border-border/80 shadow-md rounded-xl bg-gradient-to-b from-white to-invoice-section/40">
            <CardHeader className="pb-3 space-y-2">
              <CardTitle className="text-xl text-invoice-header">Invoice Workspace</CardTitle>
              <p className="text-sm text-muted-foreground">Manage settings and actions from one place.</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md border bg-white px-3 py-2">
                  <p className="text-muted-foreground">Invoice #</p>
                  <p className="font-semibold text-foreground">{invoiceNumber}</p>
                </div>
                <div className="rounded-md border bg-white px-3 py-2">
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-semibold text-foreground">{new Date(customerInfo.date).toLocaleDateString()}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="disclaimer-toggle"
                    checked={showDisclaimer}
                    onCheckedChange={(checked) => setShowDisclaimer(checked === true)}
                  />
                  <Label htmlFor="disclaimer-toggle" className="text-sm font-medium">
                    Show payment disclaimer
                  </Label>
                </div>
                {showDisclaimer && (
                  <div className="pl-6">
                    <Label htmlFor="disclaimer-text" className="text-xs text-muted-foreground">
                      Disclaimer text
                    </Label>
                    <Textarea
                      id="disclaimer-text"
                      value={disclaimerText}
                      onChange={(e) => setDisclaimerText(e.target.value)}
                      className="mt-1 text-xs resize-none bg-white"
                      placeholder="Enter disclaimer text..."
                      rows={3}
                    />
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                {onSave && (
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/10 h-10"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Saving..." : isNew ? "Save Invoice" : "Update Invoice"}
                  </Button>
                )}
                <Button onClick={handlePrint} className="w-full bg-primary hover:bg-primary/90 h-10">
                  <Printer className="w-4 h-4 mr-2" />
                  Print Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Invoice Content */}
        <div className="order-2 xl:order-1">
          <div className="invoice-paper bg-white shadow-xl print:shadow-none border border-border rounded-xl overflow-hidden">
        {/* Catering header — sister restaurants (dark coffee, slightly lifted) */}
        <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[hsl(22_38%_22%)] via-[hsl(24_32%_26%)] to-[hsl(20_36%_19%)] text-white print:border-stone-700">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 18% 15%, hsl(36 45% 52% / 0.35) 0%, transparent 42%), radial-gradient(circle at 85% 75%, hsl(215 28% 42% / 0.22) 0%, transparent 45%)",
            }}
          />
          <div className="relative px-3 py-3 sm:px-4 sm:py-3.5">
            <div className="grid gap-2 sm:grid-cols-2 sm:gap-2.5">
              {CATERING_VENUES.map((venue) => (
                <div
                  key={venue.name}
                  className="flex items-start gap-2.5 rounded-lg border border-white/18 bg-white/[0.09] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-[1px] print:border-white/25 print:bg-white/10"
                >
                  <div className="shrink-0">
                    <img
                      src={venue.logo}
                      alt={venue.logoAlt}
                      className="h-10 w-10 rounded-md border border-white/25 bg-white object-contain p-1 shadow-sm sm:h-11 sm:w-11"
                    />
                  </div>
                  <div className="min-w-0 text-[10px] leading-snug text-white/90 sm:text-xs">
                    <p className="invoice-mono text-[11px] font-semibold text-white sm:text-xs">{venue.name}</p>
                    <p className="mt-0.5 text-[10px] text-white/75 sm:text-[11px]">
                      {venue.address}, {venue.cityLine}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] tabular-nums text-amber-100/95 sm:text-[11px]">{venue.phone}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-0.5 border-t border-white/12 pt-2.5 text-[10px] sm:text-[11px]">
              <span className="invoice-mono font-semibold tabular-nums text-white/95">{invoiceNumber}</span>
              <span className="text-white/55">{new Date(customerInfo.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Customer (paper-style, compact) */}
        <div className="border-b bg-invoice-section px-4 py-3 print:px-3 print:py-2">
          <div className="mb-2 border-b border-border pb-1 print:mb-1.5">
            <h3 className="invoice-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-invoice-header">
              Customer
            </h3>
          </div>

          <div className="space-y-2 text-xs print:space-y-1.5">
            <div className="grid gap-1 sm:grid-cols-[4.75rem_1fr] sm:items-start sm:gap-x-3">
              <Label htmlFor="customer-bill-to" className="pt-1 text-[11px] text-muted-foreground print:pt-0.5">
                Bill to
              </Label>
              <Textarea
                id="customer-bill-to"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                className="min-h-[2.125rem] resize-none rounded border-border bg-white py-1 text-sm leading-snug print:border-0 print:bg-transparent print:py-0.5 print:shadow-none"
                placeholder="Name or company"
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${target.scrollHeight}px`;
                }}
              />
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-x-4">
              <div className="grid gap-1 sm:grid-cols-[4.75rem_1fr] sm:items-center sm:gap-x-3">
                <Label htmlFor="customer-phone" className="text-[11px] text-muted-foreground">
                  Phone
                </Label>
                <Input
                  id="customer-phone"
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className="h-8 rounded border-border bg-white px-2 text-sm print:border-0 print:bg-transparent print:shadow-none"
                  placeholder="—"
                />
              </div>
              <div className="grid gap-1 sm:grid-cols-[4.75rem_1fr] sm:items-center sm:gap-x-3">
                <Label htmlFor="customer-email" className="text-[11px] text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="customer-email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className="h-8 rounded border-border bg-white px-2 text-sm print:border-0 print:bg-transparent print:shadow-none"
                  placeholder="—"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-x-4">
              <div className="grid gap-1 sm:grid-cols-[4.75rem_1fr] sm:items-center sm:gap-x-3">
                <Label htmlFor="customer-date" className="text-[11px] text-muted-foreground">
                  Date
                </Label>
                <Input
                  id="customer-date"
                  type="date"
                  value={customerInfo.date}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, date: e.target.value })}
                  className="h-8 rounded border-border bg-white px-2 text-sm print:border-0 print:bg-transparent print:shadow-none"
                />
              </div>
              <div className="grid gap-1 sm:grid-cols-[4.75rem_1fr] sm:items-center sm:gap-x-3">
                <Label htmlFor="invoice-number-field" className="text-[11px] text-muted-foreground">
                  Inv. #
                </Label>
                <Input
                  id="invoice-number-field"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="h-8 rounded border border-dashed border-border/80 bg-white px-2 font-mono text-sm print:border-0 print:bg-transparent print:px-0 print:shadow-none"
                />
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
      </div>
    </div>
  );
};