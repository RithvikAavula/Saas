import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, Variants } from 'framer-motion'

type Direction = 'up' | 'down' | 'left' | 'right'
type TransitionType = 'spring' | 'tween' | 'inertia' | 'keyframes'

const staggerContainer = (
  staggerChildren: number = 0.1,
  delayChildren: number = 0.1
): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
})

const fadeIn = (
  direction: Direction = 'up',
  type: TransitionType = 'spring',
  delay: number = 0,
  duration: number = 0.5
): Variants => ({
  hidden: {
    x: direction === 'left' ? 100 : direction === 'right' ? -100 : 0,
    y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type,
      delay,
      duration,
      ease: 'easeOut',
    },
  },
})

interface Plan {
  id: string
  name: string
  price: number
  billing_period: string
  description: string | null
  features: string[]
  is_popular: boolean
  is_active: boolean
  order_index: number
  created_at: string
  updated_at: string
}

interface PlanSelectorProps {
  plan: Plan
  onSelect?: (planId: string) => void
  index: number
}

export function PlanSelector({ plan, onSelect, index }: PlanSelectorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { toast } = useToast()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const handleSelectPlan = async () => {
    if (authLoading) {
      toast({
        title: 'Loading...',
        description: 'Please wait while we check your authentication status.',
      })
      return
    }

    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to select a plan.',
        variant: 'destructive',
      })
      navigate('/auth')
      return
    }

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      navigate(`/payment?planId=${plan.id}`)
      onSelect?.(plan.id)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      variants={fadeIn('up', 'spring', index * 0.2, 0.75)}
      initial="hidden"
      animate="show"
      whileHover={{ scale: 1.03, rotate: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative h-full"
    >
      {/* Animated gradient shimmer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-500 via-purple-500 to-pink-500 blur-3xl z-0 pointer-events-none"
      />

      {/* Floating sparkles */}
      <AnimatePresence>
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={`spark-${i}`}
            initial={{
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
              opacity: 0,
            }}
            animate={{
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
              opacity: [0, 0.4, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: i * 0.5,
            }}
            className="absolute w-1.5 h-1.5 rounded-full bg-white/60 blur-sm pointer-events-none z-0"
            style={{
              top: `${Math.random() * 90 + 5}%`,
              left: `${Math.random() * 90 + 5}%`,
            }}
          />
        ))}
      </AnimatePresence>

      <Card
        className={`p-8 relative overflow-hidden h-full flex flex-col backdrop-blur-md bg-white/30 z-10 shadow-xl transition-shadow duration-300 ${
          plan.is_popular ? 'border-2 border-blue-600/50' : 'border border-muted'
        }`}
      >
        {plan.is_popular && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg">
              Most Popular
            </Badge>
          </motion.div>
        )}

        <div className="text-center mb-6 relative z-10">
          <motion.h3
            className="text-2xl font-bold mb-2"
            whileHover={{ scale: 1.02 }}
          >
            {plan.name}
          </motion.h3>
          <motion.div className="mb-3" whileHover={{ scale: 1.02 }}>
            <span className="text-4xl font-bold">${plan.price}</span>
            <span className="text-muted-foreground">/{plan.billing_period}</span>
          </motion.div>
          {plan.description && (
            <motion.p
              className="text-muted-foreground text-sm"
              whileHover={{ scale: 1.01 }}
            >
              {plan.description}
            </motion.p>
          )}
        </div>

        <motion.ul
          className="space-y-2 mb-6 relative z-10 flex-grow"
          variants={staggerContainer()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          {plan.features.map((feature, featureIndex) => (
            <motion.li
              key={`feature-${featureIndex}`}
              className="flex items-start"
              variants={fadeIn('up', 'tween', featureIndex * 0.1, 0.5)}
            >
              <motion.span
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="shrink-0"
              >
                <Check className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
              </motion.span>
              <span className="text-sm">{feature}</span>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="relative z-10 mt-auto"
        >
          <Button
            onClick={handleSelectPlan}
            className={`w-full ${
              plan.is_popular
                ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90'
                : 'border-blue-600/20 hover:bg-blue-600/5'
            }`}
            variant={plan.is_popular ? 'default' : 'outline'}
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="flex items-center"
              >
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </motion.span>
            ) : isAuthenticated ? (
              'Select Plan'
            ) : (
              'Sign in to Select'
            )}
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  )
}
