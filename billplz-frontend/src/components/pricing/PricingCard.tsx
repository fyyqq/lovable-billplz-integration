import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  priceId?: string;
}

const PricingCard = ({ name, price, period, description, features, popular, priceId }: PricingCardProps) => {
  const navigate = useNavigate();

  const handlePayViaBillplz = async () => {
    const data_collected = {
      'user_id' : "1",
      'amount' : 19.00,
      'purpose' : name,
      'name' : "Afiq",
      'email' : "afiqakimy123@gmail.com",
    };

    try {
      // Hantar request ke backend Laravel
      const response = await fetch('http://127.0.0.1:8000/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data_collected),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok && data.url) {
        // Alihkan (Redirect) browser pengguna terus ke halaman Billplz Sandbox
        window.location.href = data.url;
      } else {
        alert('Ralat sistem: Gagal dapatkan pautan pembayaran.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Sambungan ke server gagal.');
    }
  };

  return (
    <Card className={cn(
      "relative flex flex-col transition-all duration-200",
      popular && "border shadow-md"
    )}>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary hover:bg-blue-900 text-primary-foreground text-xs font-medium px-3 py-1">
            Most Popular
          </span>
        </div>
      )}
      
      <CardHeader className="pb-0">
        <h3 className="text-lg font-semibold text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col pt-6">
        <div className="mb-6">
          <span className="text-4xl font-bold text-foreground">{price}</span>
          <span className="text-muted-foreground ml-1">{period}</span>
        </div>
        
        <ul className="space-y-3 mb-8 flex-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
        
        <div className="space-y-3">
          <Button 
            onClick={handlePayViaBillplz}
            variant={popular ? "default" : "outline"} 
            className={cn(
              "w-full",
              !popular && "border-primary hover:bg-blue-600 hover:text-white"
            )}
          >
            Pay via Billplz
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
