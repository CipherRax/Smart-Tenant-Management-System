// app/components/BillingSystem.tsx
'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BadgeCheck, 
  Calendar, 
  Zap, 
  Crown, 
  Sparkles,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

// TypeScript interfaces
interface Feature {
  name: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: Feature[];
  popular?: boolean;
  ctaText: string;
  isFreeTier: boolean;
}

// Mock user data
interface UserSubscription {
  planId: string;
  status: 'active' | 'canceled' | 'expired';
  currentPeriodEnd: string; // ISO date
  paymentMethod?: string;
}

export default function BillingSystem() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock current user subscription
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>({
    planId: 'free',
    status: 'active',
    currentPeriodEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: null
  });

  // Define plans
  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for trying out the platform',
      price: { monthly: 0, yearly: 0 },
      features: [
        { name: 'Basic AI Assistant', included: true },
        { name: '100 messages/month', included: true },
        { name: 'Standard response speed', included: true },
        { name: 'Text-only interactions', included: true },
        { name: 'Community support', included: true },
        { name: 'Voice interactions', included: false },
        { name: 'Priority support', included: false },
        { name: 'Advanced analytics', included: false },
        { name: 'Custom integrations', included: false },
        { name: 'Unlimited messages', included: false }
      ],
      ctaText: 'Current Plan',
      isFreeTier: true
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For power users and professionals',
      price: { monthly: 19, yearly: 190 },
      features: [
        { name: 'Advanced AI Assistant', included: true },
        { name: 'Unlimited messages', included: true },
        { name: 'Priority response speed', included: true },
        { name: 'Text + Voice interactions', included: true },
        { name: 'Email support', included: true },
        { name: 'Basic analytics', included: true },
        { name: '2 custom integrations', included: true },
        { name: 'Ad-free experience', included: true },
        { name: 'Early feature access', included: true },
        { name: 'Dedicated account manager', included: false }
      ],
      popular: true,
      ctaText: 'Upgrade to Pro',
      isFreeTier: false
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For teams and businesses',
      price: { monthly: 49, yearly: 490 },
      features: [
        { name: 'Enterprise-grade AI', included: true },
        { name: 'Unlimited messages', included: true },
        { name: 'Ultra-fast response', included: true },
        { name: 'Text + Voice + Video', included: true },
        { name: '24/7 priority support', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Unlimited integrations', included: true },
        { name: 'Custom AI training', included: true },
        { name: 'SLA guarantee', included: true },
        { name: 'Dedicated account manager', included: true }
      ],
      ctaText: 'Contact Sales',
      isFreeTier: false
    }
  ];

  // Handle plan selection
  const handleSelectPlan = async (planId: string) => {
    if (planId === 'enterprise') {
      window.location.href = 'mailto:sales@yourapp.com?subject=Enterprise Plan Inquiry';
      return;
    }
    
    if (currentSubscription?.planId === planId) {
      toast('You are already on this plan');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update subscription
      const newSubscription: UserSubscription = {
        planId,
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + (billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
        paymentMethod: 'credit_card'
      };
      
      setCurrentSubscription(newSubscription);
      
      toast.success(`Plan upgraded successfully!`, {
        description: `You're now on the ${plans.find(p => p.id === planId)?.name} plan`
      });
    } catch (error) {
      toast.error('Payment failed', {
        description: 'Please check your payment details and try again'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get current plan
  const currentPlan = plans.find(plan => plan.id === currentSubscription?.planId) || plans[0];

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Upgrade to unlock more features and capabilities. All plans include core functionality with additional benefits.
        </p>
        
        {/* Billing Cycle Toggle */}
        <div className="flex items-center justify-center mt-8 bg-secondary rounded-full p-1 w-fit mx-auto">
          <button
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              billingCycle === 'monthly' 
                ? 'bg-background shadow-sm' 
                : 'text-muted-foreground'
            }`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
              billingCycle === 'yearly' 
                ? 'bg-background shadow-sm' 
                : 'text-muted-foreground'
            }`}
            onClick={() => setBillingCycle('yearly')}
          >
            <Sparkles className="h-3 w-3" />
            Yearly (Save 17%)
          </button>
        </div>
      </div>

      {/* Current Plan Info */}
      {currentSubscription && (
        <div className="bg-muted/50 rounded-xl p-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BadgeCheck className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Current Plan: {currentPlan.name}</p>
                <p className="text-sm text-muted-foreground">
                  {currentSubscription.status === 'active' ? (
                    `Renews on ${new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}`
                  ) : (
                    'Plan expired - please renew'
                  )}
                </p>
              </div>
            </div>
            {currentPlan.isFreeTier && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleSelectPlan('pro')}
              >
                Upgrade Now
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = currentSubscription?.planId === plan.id;
          const isDisabled = isCurrentPlan || isLoading;
          const price = billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly;
          
          return (
            <Card 
              key={plan.id} 
              className={`flex flex-col h-full ${
                plan.popular ? 'ring-2 ring-primary' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-primary text-primary-foreground text-xs font-bold py-1 px-3 rounded-tl-lg rounded-tr-lg text-center">
                  MOST POPULAR
                </div>
              )}
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  {plan.id === 'free' && <Sparkles className="h-5 w-5 text-blue-500" />}
                  {plan.id === 'pro' && <Zap className="h-5 w-5 text-yellow-500" />}
                  {plan.id === 'enterprise' && <Crown className="h-5 w-5 text-purple-500" />}
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                </div>
                <CardDescription>{plan.description}</CardDescription>
                
                <div className="mt-4">
                  {price === 0 ? (
                    <span className="text-3xl font-bold">Free</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">{formatCurrency(price)}</span>
                      <span className="text-muted-foreground">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
                    </>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 pb-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      {feature.included ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      )}
                      <span className={feature.included ? '' : 'text-muted-foreground line-through'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="pt-2">
                {plan.id === 'enterprise' ? (
                  <Button 
                    className="w-full"
                    variant={isCurrentPlan ? "secondary" : "default"}
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isDisabled}
                  >
                    {plan.ctaText}
                  </Button>
                ) : (
                  <Button 
                    className="w-full"
                    variant={isCurrentPlan ? "secondary" : "default"}
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isDisabled}
                  >
                    {isCurrentPlan ? (
                      <span className="flex items-center gap-2">
                        <BadgeCheck className="h-4 w-4" />
                        {plan.ctaText}
                      </span>
                    ) : (
                      plan.ctaText
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Free Tier Limitations */}
      {currentPlan.isFreeTier && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              Free Tier Limitations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700">
              Your free plan includes 100 messages per month. You'll receive an email when you reach 80% of your limit. 
              Upgrade to Pro for unlimited messages and advanced features.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>Messages used: 78/100</span>
                  <span>78%</span>
                </div>
                <div className="h-2 bg-yellow-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-600" 
                    style={{ width: '78%' }}
                  ></div>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-yellow-600 text-yellow-700 hover:bg-yellow-100"
                onClick={() => handleSelectPlan('pro')}
              >
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Can I change my plan later?
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at the start of your next billing cycle.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              What payment methods do you accept?
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. Enterprise plans can be billed via invoice.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium flex items-center gap-2">
              <BadgeCheck className="h-4 w-4" />
              Is there a free trial?
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              Our Free plan gives you full access to basic features with message limits. Pro and Enterprise plans can be tried for 7 days with full functionality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}