import { useState } from 'react'
import { ChevronDown, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    question: "How does the free trial work?",
    answer: "You get full access to all features for 14 days, no credit card required. After the trial, you can choose a plan that fits your needs.",
    color: "from-purple-400 to-indigo-500"
  },
  {
    question: "Can I change my plan later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
    color: "from-blue-400 to-cyan-500"
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 30-day money-back guarantee for all plans. If you're not satisfied, we'll refund your payment in full.",
    color: "from-green-400 to-teal-500"
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use enterprise-grade security with 256-bit SSL encryption, regular security audits, and comply with SOC 2 standards.",
    color: "from-yellow-400 to-amber-500"
  },
  {
    question: "How does customer support work?",
    answer: "We offer 24/7 email support for all plans, with priority support for Professional and Enterprise customers. Enterprise customers also get dedicated phone support.",
    color: "from-pink-400 to-rose-500"
  },
  {
    question: "Can I integrate with other tools?",
    answer: "Yes, we offer 200+ integrations with popular tools like Slack, GitHub, Jira, and more. We also provide a comprehensive API for custom integrations.",
    color: "from-indigo-400 to-violet-500"
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Floating particles configuration
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2,
    color: `rgba(${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 155 + 100)}, 0.3)`
  }))

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating particles background */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ opacity: 0, y: -10, x: -5 }}
          animate={{
            opacity: [0, 0.8, 0],
            y: [-10, 10],
            x: [-5, 5]
          }}
          transition={{
            delay: particle.delay,
            duration: particle.duration,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color
          }}
        />
      ))}

      <div className="container mx-auto max-w-3xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground"
          >
            Everything you need to know about our platform
          </motion.p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="card-shadow border-none bg-background/90 backdrop-blur-sm relative overflow-hidden"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Gradient glow effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: hoveredIndex === index ? 0.2 : 0.1,
                    background: `linear-gradient(to right, ${faq.color})`
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 -z-10"
                />

                <motion.button
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-muted/10 transition-colors"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <h3 className="font-semibold pr-4">{faq.question}</h3>
                  <motion.div
                    animate={{ 
                      rotate: openIndex === index ? 180 : 0,
                      color: openIndex === index ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                        height: 'auto', 
                        opacity: 1,
                        transition: { 
                          height: { type: 'spring', stiffness: 200, damping: 20 },
                          opacity: { duration: 0.3 }
                        }
                      }}
                      exit={{ 
                        height: 0, 
                        opacity: 0,
                        transition: { 
                          height: { duration: 0.3 },
                          opacity: { duration: 0.2 }
                        }
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <motion.p 
                          className="text-muted-foreground"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {faq.answer}
                        </motion.p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Decorative sparkles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute -bottom-10 -right-10 text-primary/20"
        >
          <Sparkles className="h-40 w-40" />
        </motion.div>
      </div>
    </section>
  )
}