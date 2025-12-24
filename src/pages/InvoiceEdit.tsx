import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { InvoiceForm } from "@/components/InvoiceForm";
import { invoiceService } from "@/lib/firebase";
import type { Invoice, InvoiceFormData } from "@/types/invoice";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

const InvoiceEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(id !== "new");
  const [invoiceData, setInvoiceData] = useState<InvoiceFormData | null>(null);

  useEffect(() => {
    if (id && id !== "new") {
      loadInvoice();
    } else {
      console.log("iddddd", id);
      setLoading(false);
    }
  }, [id]);

  const loadInvoice = async () => {
    try {
      setLoading(true);
      const invoice = await invoiceService.getInvoiceById(id!);
      
      // Convert database invoice to form data
      const formData: InvoiceFormData = {
        invoiceNumber: invoice.invoice_number,
        restaurantInfo: invoice.restaurant_info,
        customerInfo: invoice.customer_info,
        items: invoice.items,
        taxRate: invoice.tax_rate,
        showDisclaimer: invoice.show_disclaimer,
        disclaimerText: invoice.disclaimer_text,
      };
      
      setInvoiceData(formData);
    } catch (error) {
      console.error("Error loading invoice:", error);
      toast({
        title: "Error",
        description: "Failed to load invoice. Please check your Firebase configuration.",
        variant: "destructive",
      });
      navigate("/invoices");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: InvoiceFormData) => {
    try {
      // Calculate totals
      const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      const tax = subtotal * (formData.taxRate / 100);
      const total = subtotal + tax;

      const invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'> = {
        invoice_number: formData.invoiceNumber,
        restaurant_info: formData.restaurantInfo,
        customer_info: formData.customerInfo,
        items: formData.items,
        tax_rate: formData.taxRate,
        subtotal,
        tax,
        total,
        show_disclaimer: formData.showDisclaimer,
        disclaimer_text: formData.disclaimerText,
      };

      if (id === undefined) {
        await invoiceService.createInvoice(invoice);
        toast({
          title: "Success",
          description: "Invoice saved successfully",
        });
      } else {
        await invoiceService.updateInvoice(id!, invoice);
        toast({
          title: "Success",
          description: "Invoice updated successfully",
        });
      }

      navigate("/invoices");
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast({
        title: "Error",
        description: "Failed to save invoice. Please check your Firebase configuration.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading invoice...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/invoices")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Invoices
        </Button>
        <InvoiceForm 
          initialData={invoiceData}
          onSave={handleSave}
          isNew={id === undefined}
        />
      </div>
    </div>
  );
};

export default InvoiceEdit;
