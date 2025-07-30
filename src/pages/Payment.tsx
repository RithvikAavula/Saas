import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { usePricingPlans } from '@/hooks/useSupabaseData'
import { CreditCard, Building2, Smartphone, ArrowLeft, Check, Shield, Lock } from 'lucide-react'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 10
    }
  }
}

const cardHoverVariants = {
  hover: {
    y: -5,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.98 }
}

const paymentMethodVariants = {
  selected: {
    borderColor: 'hsl(var(--primary))',
    backgroundColor: 'hsla(var(--primary)/0.05)',
    transition: { duration: 0.2 }
  },
  notSelected: {
    borderColor: 'hsl(var(--border))',
    backgroundColor: 'transparent',
    transition: { duration: 0.2 }
  }
}

export default function Payment() {
  const [selectedPayment, setSelectedPayment] = useState<'card' | 'bank' | 'wallet'>('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [searchParams] = useSearchParams()
  const planId = searchParams.get('planId')
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()
  const { data: plans } = usePricingPlans()

  const selectedPlan = plans?.find(plan => plan.id === planId)

  useEffect(() => {
    if (!planId || !selectedPlan) {
      navigate('/')
      return
    }
  }, [planId, selectedPlan, navigate])

  const handlePayment = async () => {
    if (!user || !selectedPlan) return

    setIsProcessing(true)

    try {
      // Demo payment processing - simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create demo subscription
      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan_id: selectedPlan.id,
          status: 'active',
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })

      if (error) throw error

      // Update user profile
      await supabase
        .from('profiles')
        .update({ plan_id: selectedPlan.id })
        .eq('user_id', user.id)

      toast({
        title: "Payment Successful!",
        description: `You've successfully subscribed to the ${selectedPlan.name} plan.`,
      })

      navigate('/')
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (!selectedPlan) return null

  const paymentMethods = [
    {
      id: 'card' as const,
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, American Express'
    },
    {
      id: 'bank' as const,
      name: 'Bank Transfer',
      icon: Building2,
      description: 'Direct bank transfer'
    },
    {
      id: 'wallet' as const,
      name: 'Digital Wallet',
      icon: Smartphone,
      description: 'PayPal, Apple Pay, Google Pay'
    }
  ]

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background p-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Plans
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Complete Your Payment</h1>
            <p className="text-muted-foreground">Secure checkout for your subscription</p>
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-8"
        >
          {/* Payment Form */}
          <div className="space-y-6">
            {/* Plan Summary */}
            <motion.div variants={itemVariants}>
              <Card className="p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500"></div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Plan Summary</h2>
                  {selectedPlan.is_popular && (
                    <Badge className="gradient-bg text-white animate-pulse">Most Popular</Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{selectedPlan.name}</span>
                    <span className="font-bold">${selectedPlan.price}/{selectedPlan.billing_period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedPlan.description}</p>
                </div>
              </Card>
            </motion.div>

            {/* Payment Method Selection */}
            <motion.div variants={itemVariants}>
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon
                    return (
                      <motion.div
                        key={method.id}
                        className={`p-4 border rounded-lg cursor-pointer ${
                          selectedPayment === method.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedPayment(method.id)}
                        variants={cardHoverVariants}
                        whileHover="hover"
                        whileTap="tap"
                        animate={selectedPayment === method.id ? "selected" : "notSelected"}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <div className="flex-1">
                            <div className="font-medium">{method.name}</div>
                            <div className="text-sm text-muted-foreground">{method.description}</div>
                          </div>
                          <AnimatePresence>
                            {selectedPayment === method.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                              >
                                <Check className="h-5 w-5 text-primary" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </Card>
            </motion.div>

            {/* Payment Details Form */}
            <motion.div variants={itemVariants}>
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedPayment}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {selectedPayment === 'card' && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            className="mt-1"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input
                              id="expiry"
                              placeholder="MM/YY"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="cardName">Cardholder Name</Label>
                          <Input
                            id="cardName"
                            placeholder="John Doe"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}

                    {selectedPayment === 'bank' && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="accountNumber">Account Number</Label>
                          <Input
                            id="accountNumber"
                            placeholder="1234567890"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="routingNumber">Routing Number</Label>
                          <Input
                            id="routingNumber"
                            placeholder="021000021"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="accountHolder">Account Holder Name</Label>
                          <Input
                            id="accountHolder"
                            placeholder="John Doe"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}

                    {selectedPayment === 'wallet' && (
                      <div className="space-y-4">
                        <div className="text-center p-8">
                          <motion.div
                            animate={{ 
                              y: [0, -5, 0],
                              transition: { 
                                repeat: Infinity, 
                                duration: 2,
                                ease: "easeInOut"
                              }
                            }}
                          >
                            <Smartphone className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          </motion.div>
                          <p className="text-lg font-medium mb-2">Choose your digital wallet</p>
                          <p className="text-muted-foreground">You'll be redirected to complete the payment</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <Button 
                            variant="outline" 
                            className="h-16"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            PayPal
                          </Button>
                          <Button 
                            variant="outline" 
                            className="h-16"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Apple Pay
                          </Button>
                          <Button 
                            variant="outline" 
                            className="h-16"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Google Pay
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </Card>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <motion.div variants={itemVariants}>
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>{selectedPlan.name} Plan</span>
                    <span>${selectedPlan.price}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Billing Period</span>
                    <span>{selectedPlan.billing_period}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <motion.span 
                      className="text-primary"
                      initial={{ scale: 1 }}
                      animate={{ 
                        scale: [1, 1.05, 1],
                        transition: { repeat: Infinity, duration: 2 }
                      }}
                    >
                      ${selectedPlan.price}/{selectedPlan.billing_period}
                    </motion.span>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">What's Included</h2>
                <ul className="space-y-3">
                  {selectedPlan.features.map((feature, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-center gap-3"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      </motion.div>
                      <span className="text-sm">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-6 bg-primary/5 border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      transition: { repeat: Infinity, duration: 3 }
                    }}
                  >
                    <Shield className="h-5 w-5 text-primary" />
                  </motion.div>
                  <h3 className="font-semibold">Secure Payment</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Your payment information is encrypted and secure. We use industry-standard SSL encryption.
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <span>256-bit SSL encrypted</span>
                </div>
              </Card>
            </motion.div>

            {/* Payment Button */}
            <motion.div variants={itemVariants}>
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full h-12 gradient-bg text-white hover:opacity-90 relative overflow-hidden"
                size="lg"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <span>Pay ${selectedPlan.price} {selectedPlan.billing_period === 'monthly' ? 'Monthly' : 'Yearly'}</span>
                    <motion.div 
                      className="absolute inset-0 bg-white opacity-0"
                      animate={{
                        opacity: [0, 0.1, 0],
                        x: ['-100%', '100%'],
                        transition: { duration: 1.5, repeat: Infinity }
                      }}
                    />
                  </>
                )}
              </Button>
            </motion.div>

            <motion.p 
              className="text-xs text-center text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              By proceeding, you agree to our Terms of Service and Privacy Policy.
              Your subscription will automatically renew.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}