import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, Mail, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// Update the import path to match the actual file location and casing
import { useTheme } from '@/components/ThemeProvider';

export function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Particle effects configuration
  const particles = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2
  }));

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Signed in successfully! Redirecting...' });
      setTimeout(() => navigate('/'), 1000);
    }
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: 'https://saas-gamma-vert-27.vercel.app/auth',
      },
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({
        type: 'success',
        text: 'Account created! Check your email (including spam) for confirmation.',
      });
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://saas-gamma-vert-27.vercel.app/ResetPassword",
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Password reset link sent! Check your email (including spam folder).',
      });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to send password reset email',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const tabContentVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  const particleVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: [0, 0.8, 0],
      y: [-10, 10],
      x: [-5, 5],
      transition: {
        delay: i * 0.1,
        duration: i * 0.5 + 2,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Animated background particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          custom={particle.delay}
          variants={particleVariants}
          initial="hidden"
          animate="visible"
          className="absolute rounded-full bg-primary/20 pointer-events-none"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
        />
      ))}

      <div className="w-full max-w-md z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <motion.div
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
              <span>Back to home</span>
              <Sparkles className="h-3 w-3 ml-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 10 }}
        >
          <Card className="border-none bg-background/90 backdrop-blur-lg shadow-2xl relative overflow-hidden">
            {/* Glow effect behind card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
              className="absolute -inset-2 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur-xl -z-10"
            />

            <CardHeader className="text-center space-y-3 pb-3">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  {showForgotPassword ? 'Reset Password' : 'Welcome to SaaSLand'}
                </CardTitle>
              </motion.div>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <CardDescription className="text-muted-foreground/80">
                  {showForgotPassword
                    ? 'Enter your email to receive a password reset link'
                    : 'Sign in to your account or create a new one to get started'}
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="pt-4">
              <AnimatePresence mode="wait">
                {showForgotPassword ? (
                  <motion.div
                    key="forgot-password"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                      >
                        <motion.div variants={itemVariants} className="space-y-2">
                          <Label htmlFor="reset-email" className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-primary" />
                            Email
                          </Label>
                          <div className="relative">
                            <Input
                              id="reset-email"
                              name="email"
                              type="email"
                              placeholder="Enter your email"
                              required
                              className="pl-10 border-muted-foreground/30 focus:border-primary/50"
                            />
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          </div>
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
                                  <span>Send Reset Link</span>
                                  <Sparkles className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </>
                              )}
                            </span>
                          </Button>
                        </motion.div>
                      </motion.div>
                    </form>

                    <motion.div variants={itemVariants}>
                      <Button
                        variant="ghost"
                        className="w-full text-muted-foreground hover:text-primary"
                        onClick={() => setShowForgotPassword(false)}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Sign In
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="auth-tabs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Tabs
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className="w-full"
                    >
                      <motion.div layout className="relative">
                        <TabsList className="grid w-full grid-cols-2 bg-muted/20 h-12 relative">
                          {['signin', 'signup'].map((tab) => (
                            <motion.div
                              key={tab}
                              onHoverStart={() => setHoveredTab(tab)}
                              onHoverEnd={() => setHoveredTab(null)}
                              className="relative h-full"
                            >
                              <TabsTrigger
                                value={tab}
                                className="w-full h-full relative z-10"
                              >
                                {tab === 'signin' ? 'Sign In' : 'Sign Up'}
                              </TabsTrigger>
                              {hoveredTab === tab && (
                                <motion.div
                                  layoutId="tabHover"
                                  className="absolute inset-0 bg-muted/30 rounded-md"
                                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                />
                              )}
                            </motion.div>
                          ))}
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 h-[2px] bg-primary w-1/2"
                            animate={{
                              x: activeTab === 'signin' ? 0 : '100%',
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          />
                        </TabsList>
                      </motion.div>

                      <AnimatePresence mode="wait">
                        <motion.div layout className="mt-6">
                          <TabsContent value="signin" className="space-y-4">
                            <motion.div
                              variants={tabContentVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              transition={{ duration: 0.3 }}
                            >
                              <form onSubmit={handleSignIn} className="space-y-4">
                                <motion.div
                                  variants={containerVariants}
                                  initial="hidden"
                                  animate="visible"
                                  className="space-y-4"
                                >
                                  <motion.div variants={itemVariants} className="space-y-2">
                                    <Label htmlFor="signin-email" className="flex items-center">
                                      <Mail className="h-4 w-4 mr-2 text-primary" />
                                      Email
                                    </Label>
                                    <div className="relative">
                                      <Input
                                        id="signin-email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        required
                                        className="pl-10 border-muted-foreground/30 focus:border-primary/50"
                                      />
                                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    </div>
                                  </motion.div>

                                  <motion.div variants={itemVariants} className="space-y-2">
                                    <Label htmlFor="signin-password" className="flex items-center">
                                      <Lock className="h-4 w-4 mr-2 text-primary" />
                                      Password
                                    </Label>
                                    <div className="relative">
                                      <Input
                                        id="signin-password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        required
                                        className="pl-10 border-muted-foreground/30 focus:border-primary/50"
                                      />
                                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                      <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
                                        onClick={() => setShowPassword(!showPassword)}
                                      >
                                        {showPassword ? (
                                          <EyeOff className="h-4 w-4" />
                                        ) : (
                                          <Eye className="h-4 w-4" />
                                        )}
                                      </button>
                                    </div>
                                  </motion.div>

                                  <motion.div variants={itemVariants} className="text-right">
                                    <Button
                                      type="button"
                                      variant="link"
                                      className="text-sm text-muted-foreground hover:text-primary p-0"
                                      onClick={() => setShowForgotPassword(true)}
                                    >
                                      Forgot your password?
                                    </Button>
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
                                            <span>Sign In</span>
                                            <Sparkles className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                          </>
                                        )}
                                      </span>
                                    </Button>
                                  </motion.div>
                                </motion.div>
                              </form>
                            </motion.div>
                          </TabsContent>

                          <TabsContent value="signup" className="space-y-4">
                            <motion.div
                              variants={tabContentVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              transition={{ duration: 0.3 }}
                            >
                              <form onSubmit={handleSignUp} className="space-y-4">
                                <motion.div
                                  variants={containerVariants}
                                  initial="hidden"
                                  animate="visible"
                                  className="space-y-4"
                                >
                                  <motion.div variants={itemVariants} className="space-y-2">
                                    <Label htmlFor="signup-name" className="flex items-center">
                                      <User className="h-4 w-4 mr-2 text-primary" />
                                      Full Name
                                    </Label>
                                    <div className="relative">
                                      <Input
                                        id="signup-name"
                                        name="fullName"
                                        type="text"
                                        placeholder="Enter your full name"
                                        required
                                        className="pl-10 border-muted-foreground/30 focus:border-primary/50"
                                      />
                                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    </div>
                                  </motion.div>

                                  <motion.div variants={itemVariants} className="space-y-2">
                                    <Label htmlFor="signup-email" className="flex items-center">
                                      <Mail className="h-4 w-4 mr-2 text-primary" />
                                      Email
                                    </Label>
                                    <div className="relative">
                                      <Input
                                        id="signup-email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        required
                                        className="pl-10 border-muted-foreground/30 focus:border-primary/50"
                                      />
                                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    </div>
                                  </motion.div>

                                  <motion.div variants={itemVariants} className="space-y-2">
                                    <Label htmlFor="signup-password" className="flex items-center">
                                      <Lock className="h-4 w-4 mr-2 text-primary" />
                                      Password
                                    </Label>
                                    <div className="relative">
                                      <Input
                                        id="signup-password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Create a password"
                                        required
                                        className="pl-10 border-muted-foreground/30 focus:border-primary/50"
                                      />
                                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                      <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
                                        onClick={() => setShowPassword(!showPassword)}
                                      >
                                        {showPassword ? (
                                          <EyeOff className="h-4 w-4" />
                                        ) : (
                                          <Eye className="h-4 w-4" />
                                        )}
                                      </button>
                                    </div>
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
                                            <span>Create Account</span>
                                            <Sparkles className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                          </>
                                        )}
                                      </span>
                                    </Button>
                                  </motion.div>
                                </motion.div>
                              </form>
                            </motion.div>
                          </TabsContent>
                        </motion.div>
                      </AnimatePresence>
                    </Tabs>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="mt-4"
                  >
                    <Alert
                      className={`${
                        message.type === 'error'
                          ? 'border-destructive/50 bg-destructive/10 text-destructive'
                          : 'border-primary/50 bg-primary/10 text-primary'
                      } backdrop-blur-sm`}
                    >
                      <AlertDescription className="flex items-center">
                        {message.type === 'success' && (
                          <Sparkles className="h-4 w-4 mr-2 flex-shrink-0" />
                        )}
                        {message.text}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}