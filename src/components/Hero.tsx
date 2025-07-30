import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Clock, Shield, Users } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export function Hero() {
  const { isAuthenticated } = useAuth()
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
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

  const statItemVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring" as "spring",
        stiffness: 100
      }
    }
  }

  const gradientText = {
    background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent'
  }

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto text-center">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 
            className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            variants={itemVariants}
          >
            Build Your{' '}
            <motion.span 
              className="gradient-text"
              style={gradientText}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'linear'
              }}
            >
              Dream SaaS
            </motion.span>{' '}
            <br />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Faster Than Ever
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
            variants={itemVariants}
          >
            The complete platform for modern teams. Streamline your workflow, 
            boost productivity, and scale your business with our powerful suite of tools.
          </motion.p>
          
          <motion.div 
            className="flex justify-center mb-12"
            variants={itemVariants}
          >
            {isAuthenticated ? (
              <Button 
                size="lg" 
                className="relative overflow-hidden group"
                asChild
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <a href="#pricing">
                  <span className="relative z-10 flex items-center">
                    Choose Your Plan
                    <motion.span 
                      className="ml-2"
                      animate={{
                        x: [0, 4, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: 'loop'
                      }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.span>
                  </span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-100 group-hover:from-indigo-600 group-hover:to-pink-500 transition-all duration-300"
                    initial={{ opacity: 1 }}
                  />
                  <motion.div 
                    className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10"
                    transition={{ duration: 0.3 }}
                  />
                </a>
              </Button>
            ) : (
              <Button 
                size="lg" 
                className="relative overflow-hidden group"
                asChild
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to="/auth">
                  <span className="relative z-10 flex items-center">
                    Start Free Trial
                    <motion.span 
                      className="ml-2"
                      animate={{
                        x: [0, 4, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: 'loop'
                      }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.span>
                  </span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-100 group-hover:from-indigo-600 group-hover:to-pink-500 transition-all duration-300"
                    initial={{ opacity: 1 }}
                  />
                  <motion.div 
                    className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10"
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </Button>
            )}
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.5
              }
            }
          }}
        >
          <motion.div 
            className="text-center p-6 bg-background rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
            variants={statItemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              50k+
            </div>
            <div className="text-muted-foreground">Active Users</div>
          </motion.div>

          <motion.div 
            className="text-center p-6 bg-background rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
            variants={statItemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                <Shield className="h-6 w-6" />
              </div>
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              99.9%
            </div>
            <div className="text-muted-foreground">Uptime</div>
          </motion.div>

          <motion.div 
            className="text-center p-6 bg-background rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
            variants={statItemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <Clock className="h-6 w-6" />
              </div>
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              24/7
            </div>
            <div className="text-muted-foreground">Support</div>
          </motion.div>
        </motion.div>

        {/* Floating elements for visual interest */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          />
          <motion.div 
            className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: 2
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-pink-500/10 blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: 1
            }}
          />
        </div>
      </div>
    </section>
  )
}