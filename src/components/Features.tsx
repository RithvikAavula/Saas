import { useFeatures } from '@/hooks/useSupabaseData'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import * as LucideIcons from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export function Features() {
  const { data: features, isLoading, error } = useFeatures()

  // Floating particles configuration
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2,
    color: `rgba(${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 155 + 100)}, 0.3)`
  }))

  if (isLoading) {
    return (
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-12 w-12 mb-4" />
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <p className="text-destructive">Failed to load features</p>
        </div>
      </section>
    )
  }

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/10 relative overflow-hidden">
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

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Powerful Features for{' '}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Modern Teams
            </span>
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Everything you need to build, manage, and scale your business efficiently
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features?.map((feature, index) => {
            const IconComponent = (LucideIcons as any)[feature.icon] || LucideIcons.Zap
            
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 100,
                  damping: 10
                }}
                whileHover={{ 
                  y: -5,
                  transition: { type: 'spring', stiffness: 400, damping: 10 }
                }}
              >
                <Card className="p-6 border-none bg-background/90 backdrop-blur-sm relative overflow-hidden group">
                  {/* Gradient glow effect */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    whileHover={{ opacity: 0.2 }}
                    className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-600/30 -z-10"
                  />

                  {/* Icon with floating animation */}
                  <motion.div
                    className="mb-4"
                    animate={{
                      y: [0, -5, 0],
                      transition: {
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }
                    }}
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                  </motion.div>

                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                    {feature.description}
                  </p>

                  {/* Sparkle effect on hover */}
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0, 0.8, 0],
                        transition: {
                          duration: 2,
                          repeat: Infinity,
                          delay: 0.5
                        }
                      }}
                      className="absolute top-4 right-4 text-primary/30"
                    >
                      <Sparkles className="h-5 w-5" />
                    </motion.div>
                  </AnimatePresence>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Decorative sparkles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 1 }}
          className="absolute -bottom-20 -right-20 text-primary/20"
        >
          <Sparkles className="h-60 w-60" />
        </motion.div>
      </div>
    </section>
  )
}