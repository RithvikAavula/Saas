import { useState } from 'react'
import { Mail, MessageSquare, Phone, Send, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'

export function Contact() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { toast } = useToast()

  // Floating particles configuration
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2
  }))

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('newsletter_signups')
        .insert([{ email }])

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already subscribed!",
            description: "This email is already subscribed to our newsletter.",
            variant: "destructive"
          })
        } else {
          throw error
        }
      } else {
        await supabase.functions.invoke('send-newsletter-email', {
          body: { email }
        })
        
        toast({
          title: "Success!",
          description: "Thank you for subscribing to our newsletter. Check your email for confirmation."
        })
        setEmail('')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !message) return

    setIsLoading(true)
    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const senderEmail = formData.get('email') as string
      
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: { name, email: senderEmail, message }
      })

      if (error) throw error

      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible."
      })
      setName('')
      setMessage('')
      ;(e.target as HTMLFormElement).reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  const particleVariants = {
    hidden: { opacity: 0 },
    visible: (custom: number) => ({
      opacity: [0, 0.8, 0],
      y: [-10, 10],
      x: [-5, 5],
      transition: {
        delay: custom,
        duration: custom * 0.5 + 2,
        repeat: Infinity,
        repeatType: 'reverse' as const,
      },
    }),
  }

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/10 relative overflow-hidden">
      {/* Floating particles background */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          custom={particle.delay}
          variants={particleVariants}
          initial="hidden"
          animate="visible"
          className="absolute rounded-full bg-primary/10 pointer-events-none"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
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
            Get in{' '}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold mb-8">Let's talk</h3>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemVariants} className="flex items-center group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors"
                >
                  <Mail className="h-6 w-6 text-primary group-hover:text-primary/90" />
                </motion.div>
                <div>
                  <div className="font-semibold">Email us</div>
                  <div className="text-muted-foreground">rithvikaavula5@gmail.com</div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors"
                >
                  <Phone className="h-6 w-6 text-primary group-hover:text-primary/90" />
                </motion.div>
                <div>
                  <div className="font-semibold">Call us</div>
                  <div className="text-muted-foreground">+1 (555) 123-4567</div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors"
                >
                  <MessageSquare className="h-6 w-6 text-primary group-hover:text-primary/90" />
                </motion.div>
                <div>
                  <div className="font-semibold">Live chat</div>
                  <div className="text-muted-foreground">Available 24/7</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Newsletter Signup */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <Card className="p-6 card-shadow border-none bg-background/90 backdrop-blur-sm relative overflow-hidden">
                {/* Glow effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                  className="absolute -inset-2 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur-xl -z-10"
                />

                <h4 className="font-semibold mb-4">Subscribe to our newsletter</h4>
                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileFocus={{ scale: 1.01 }}
                  >
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-muted-foreground/30 focus:border-primary/50"
                    />
                  </motion.div>
                  <Button 
                    type="submit" 
                    className="w-full gradient-bg text-white hover:opacity-90 relative overflow-hidden group"
                    disabled={isLoading}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    {isLoading && (
                      <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          ease: 'linear',
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      />
                    )}
                    <span className="relative z-10 flex items-center justify-center">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <span>Subscribe</span>
                          <AnimatePresence>
                            {isHovered && (
                              <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                                className="ml-2"
                              >
                                <Sparkles className="h-4 w-4" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </>
                      )}
                    </span>
                  </Button>
                </form>
              </Card>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="p-8 card-shadow border-none bg-background/90 backdrop-blur-sm relative overflow-hidden">
              {/* Glow effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                className="absolute -inset-2 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur-xl -z-10"
              />

              <h3 className="text-2xl font-semibold mb-6">Send us a message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  <motion.div variants={itemVariants}>
                    <Input
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="border-muted-foreground/30 focus:border-primary/50"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Your email"
                      required
                      className="border-muted-foreground/30 focus:border-primary/50"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Textarea
                      placeholder="Your message"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="border-muted-foreground/30 focus:border-primary/50"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Button 
                      type="submit" 
                      className="w-full gradient-bg text-white hover:opacity-90 relative overflow-hidden group"
                      disabled={isLoading}
                    >
                      {isLoading && (
                        <motion.div
                          initial={{ x: '-100%' }}
                          animate={{ x: '100%' }}
                          transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            ease: 'linear',
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        />
                      )}
                      <span className="relative z-10 flex items-center justify-center">
                        {isLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <>
                            <span>Send Message</span>
                            <Send className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </>
                        )}
                      </span>
                    </Button>
                  </motion.div>
                </motion.div>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}