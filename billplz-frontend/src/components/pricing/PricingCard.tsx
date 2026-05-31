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

  const handlePayInApp = () => {
    // navigate(`/checkout?plan=${name.toLowerCase()}&price_id=${priceId || 'price_demo'}`);
    navigate(`/checkout?plan=${name.toLowerCase()}&price_id=${priceId || 'price_demo'}&amount=${encodeURIComponent(price)}`);
  };

  const handlePayViaStripe = () => {
    // Placeholder for Stripe redirect - to be wired by developers
    console.log(`Stripe checkout redirect for plan: ${name}, priceId: ${priceId}`);
    // Example: window.location.href = `${API_URL}/stripe/checkout?price_id=${priceId}`;
  };

  return (
    <Card className={cn(
      "relative flex flex-col transition-all duration-200 hover:shadow-lg",
      popular && "border-primary shadow-md"
    )}>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1">
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
            onClick={handlePayInApp}
            variant={popular ? "default" : "outline"} 
            className={cn(
              "w-full",
              !popular && "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            )}
          >
            Pay in App
          </Button>
          
          <Button 
            onClick={handlePayViaStripe}
            variant="ghost"
            className="w-full text-muted-foreground hover:text-foreground"
          >
            Pay via Stripe
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
