import { Star, Sparkles } from 'lucide-react'
import { useTestimonials } from '@/hooks/useSupabaseData'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { motion, AnimatePresence } from 'framer-motion'

export function Testimonials() {
  const { data: testimonials, isLoading, error } = useTestimonials()

  // Floating particles configuration
  const particles = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2,
    color: `rgba(255, 215, 0, ${Math.random() * 0.3 + 0.1})` // Gold-like colors
  }))

  if (isLoading) {
    return (
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center mb-4">
                  <Skeleton className="h-12 w-12 rounded-full mr-4" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
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
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/10">
        <div className="container mx-auto text-center">
          <p className="text-destructive">Failed to load testimonials</p>
        </div>
      </section>
    )
  }

  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/10 relative overflow-hidden">
      {/* Floating golden particles */}
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
            Loved by{' '}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent">
              Thousands
            </span>{' '}
            of Teams
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            See what our customers are saying about their experience
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials?.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.15,
                type: 'spring',
                stiffness: 100,
                damping: 10
              }}
              whileHover={{
                y: -5,
                transition: { type: 'spring', stiffness: 400, damping: 10 }
              }}
            >
              <Card className="p-6 border-none bg-background/90 backdrop-blur-sm relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                {/* Golden gradient glow on hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.2 }}
                  className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-yellow-600/20 -z-10 transition-opacity duration-300"
                />

                {/* Stars with subtle pulse animation */}
                <motion.div 
                  className="flex text-yellow-400 mb-4"
                  whileHover={{ scale: 1.05 }}
                >
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      <Star className="h-5 w-5 fill-current" />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Quote with hover effect */}
                <motion.blockquote 
                  className="text-muted-foreground mb-6 italic group-hover:text-foreground/90 transition-colors duration-300"
                  whileHover={{ scale: 1.01 }}
                >
                  "{testimonial.content}"
                </motion.blockquote>

                {/* Author with hover effects */}
                <motion.div 
                  className="flex items-center"
                  whileHover={{ x: 5 }}
                >
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <Avatar className="h-12 w-12 mr-4 group-hover:ring-2 group-hover:ring-yellow-400 transition-all duration-300">
                      <AvatarImage src={testimonial.avatar_url || ''} alt={testimonial.name} />
                      <AvatarFallback className="group-hover:bg-yellow-400/10 transition-colors">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  <div>
                    <div className="font-semibold group-hover:text-yellow-500 transition-colors duration-300">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">
                      {testimonial.role}
                      {testimonial.company && (
                        <span> at {testimonial.company}</span>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Sparkle effect on hover */}
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.8 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-4 right-4 text-yellow-400/50"
                  >
                    <Sparkles className="h-5 w-5" />
                  </motion.div>
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Large decorative sparkle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 1 }}
          className="absolute -bottom-20 -right-20 text-yellow-400/20"
        >
          <Sparkles className="h-60 w-60" />
        </motion.div>
      </div>
    </section>
  )
}