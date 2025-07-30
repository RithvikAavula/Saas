import { useState } from 'react'
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAuth } from '@/hooks/useAuth'
import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const { user, isAuthenticated, signOut } = useAuth()

  const navigation = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ]

  // Animation variants

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { y: -20, opacity: 0 },
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

  const navItemHover = {
    scale: 1.05,
    color: 'hsl(var(--foreground))',
    transition: { duration: 0.2 }
  }

  const mobileMenuVariants = {
    open: {
      height: 'auto',
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const
      }
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const
      }
    }
  }

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.h1 
              className="text-2xl font-bold gradient-text"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              SaaSLand
            </motion.h1>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav 
            className="hidden md:flex space-x-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {navigation.map((item) => (
              <motion.div
                key={item.name}
                className="relative"
                onHoverStart={() => setHoveredItem(item.name)}
                onHoverEnd={() => setHoveredItem(null)}
                variants={itemVariants}
              >
                <motion.a
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors relative z-10 flex items-center"
                  whileHover={navItemHover}
                >
                  {item.name}
                  {item.name === 'Features' && (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </motion.a>
                
                {/* Animated underline */}
                {hoveredItem === item.name && (
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                    layoutId="navUnderline"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  />
                )}
              </motion.div>
            ))}
          </motion.nav>

          <motion.div 
            className="hidden md:flex items-center space-x-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <ThemeToggle />
            </motion.div>
            
            {isAuthenticated ? (
              <motion.div variants={itemVariants}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="relative overflow-hidden"
                    >
                      <User className="h-4 w-4" />
                      <motion.div 
                        className="absolute inset-0 bg-primary/10 opacity-0"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border-border">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <DropdownMenuItem 
                        onClick={signOut}
                        className="cursor-pointer focus:bg-primary/10"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </motion.div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            ) : (
              <>
                <motion.div variants={itemVariants}>
                  <Button 
                    variant="ghost" 
                    asChild
                    className="relative overflow-hidden"
                  >
                    <Link to="/auth">
                      Sign In
                      <motion.div 
                        className="absolute inset-0 bg-primary/10 opacity-0"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Button 
                    className="gradient-bg text-white hover:opacity-90 relative overflow-hidden"
                    asChild
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link to="/auth">
                      Get Started
                      <motion.div 
                        className="absolute inset-0 bg-white opacity-0"
                        animate={{
                          opacity: [0, 0.2, 0],
                          x: ['-100%', '100%'],
                          transition: { duration: 2, repeat: Infinity }
                        }}
                      />
                    </Link>
                  </Button>
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Mobile menu button */}
          <motion.div 
            className="md:hidden flex items-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
              {!isMenuOpen && (
                <motion.div 
                  className="absolute inset-0 rounded-full bg-primary/10"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                />
              )}
            </Button>
          </motion.div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden overflow-hidden"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
            >
              <motion.div 
                className="px-2 pt-2 pb-3 space-y-1 border-t border-border"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {navigation.map((item) => (
                  <motion.div key={item.name} variants={itemVariants}>
                    <a
                      href={item.href}
                      className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  </motion.div>
                ))}
                <div className="px-3 py-2 space-y-2">
                  {isAuthenticated ? (
                    <motion.div variants={itemVariants}>
                      <Button 
                        variant="ghost" 
                        className="w-full" 
                        onClick={signOut}
                        whileHover={{ backgroundColor: 'hsl(var(--primary)/0.1)' }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </motion.div>
                  ) : (
                    <>
                      <motion.div variants={itemVariants}>
                        <Button 
                          variant="ghost" 
                          className="w-full" 
                          asChild
                          whileHover={{ backgroundColor: 'hsl(var(--primary)/0.1)' }}
                        >
                          <Link to="/auth">Sign In</Link>
                        </Button>
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <Button 
                          className="w-full gradient-bg text-white hover:opacity-90"
                          asChild
                          whileHover={{ 
                            scale: 1.02,
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link to="/auth">Get Started</Link>
                        </Button>
                      </motion.div>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}