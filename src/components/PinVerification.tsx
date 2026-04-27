import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, AlertCircle } from "lucide-react";
import restaurantLogo from "@/assets/alif logo.jpg";

interface PinVerificationProps {
  onAuthenticated: () => void;
}

const CORRECT_PIN = "9595"; // Static PIN - you can change this

export const PinVerification = ({ onAuthenticated }: PinVerificationProps) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate a brief loading delay for better UX
    setTimeout(() => {
      if (pin === CORRECT_PIN) {
        onAuthenticated(); 
      } else {
        setError("Invalid PIN. Please try again.");
        setPin("");
      }
      setIsLoading(false);
    }, 500);
  };

  const handlePinChange = (value: string) => {
    // Only allow numbers and limit to 4 digits
    const numericValue = value.replace(/\D/g, "").slice(0, 4);
    setPin(numericValue);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src={restaurantLogo} 
              alt="Alif Brew & Mini Mart Logo" 
              className="w-20 h-20 object-contain bg-white rounded-lg p-2 shadow-md"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Alif Brew & Mini Mart Invoice Generator
          </CardTitle>
          <p className="text-gray-600">Enter your 4-digit PIN to access the system</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="password"
                  value={pin}
                  onChange={(e) => handlePinChange(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  className="pl-10 text-center text-2xl font-mono tracking-widest"
                  maxLength={4}
                  autoFocus
                />
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={pin.length !== 4 || isLoading}
            >
              {isLoading ? "Verifying..." : "Access System"}
            </Button>
          </form>
          
          <div className="text-center text-sm text-gray-500">
            <p>Authorized access only</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
