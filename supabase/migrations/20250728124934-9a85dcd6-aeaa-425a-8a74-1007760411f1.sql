-- Create tables for dynamic SaaS landing page content

-- Features table
CREATE TABLE public.features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Pricing plans table
CREATE TABLE public.pricing_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  billing_period TEXT NOT NULL DEFAULT 'monthly',
  features TEXT[] NOT NULL DEFAULT '{}',
  is_popular BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT,
  content TEXT NOT NULL,
  avatar_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Newsletter signups table
CREATE TABLE public.newsletter_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS on all tables
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_signups ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to content tables
CREATE POLICY "Features are viewable by everyone" 
ON public.features 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Pricing plans are viewable by everyone" 
ON public.pricing_plans 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Testimonials are viewable by everyone" 
ON public.testimonials 
FOR SELECT 
USING (is_active = true);

-- Create policy for newsletter signups (insert only)
CREATE POLICY "Anyone can subscribe to newsletter" 
ON public.newsletter_signups 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_features_updated_at
  BEFORE UPDATE ON public.features
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pricing_plans_updated_at
  BEFORE UPDATE ON public.pricing_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.features (title, description, icon, order_index) VALUES
('Advanced Analytics', 'Get deep insights into your business with our powerful analytics dashboard', 'BarChart3', 1),
('Team Collaboration', 'Work seamlessly with your team using our collaborative tools and real-time sync', 'Users', 2),
('Secure & Reliable', 'Enterprise-grade security with 99.9% uptime guarantee and automatic backups', 'Shield', 3),
('Easy Integration', 'Connect with your favorite tools through our extensive API and integrations', 'Zap', 4),
('24/7 Support', 'Get help whenever you need it with our dedicated support team available round the clock', 'MessageCircle', 5),
('Scalable Infrastructure', 'Grow your business without worrying about infrastructure limitations', 'TrendingUp', 6);

INSERT INTO public.pricing_plans (name, description, price, billing_period, features, is_popular, order_index) VALUES
('Starter', 'Perfect for individuals and small teams getting started', 9.99, 'monthly', 
 ARRAY['Up to 5 projects', '10GB storage', 'Basic analytics', 'Email support'], false, 1),
('Professional', 'Ideal for growing businesses and teams', 29.99, 'monthly',
 ARRAY['Up to 25 projects', '100GB storage', 'Advanced analytics', 'Priority support', 'Team collaboration', 'API access'], true, 2),
('Enterprise', 'For large organizations with advanced needs', 99.99, 'monthly',
 ARRAY['Unlimited projects', '1TB storage', 'Custom analytics', '24/7 phone support', 'Advanced security', 'Custom integrations', 'Dedicated account manager'], false, 3);

INSERT INTO public.testimonials (name, role, company, content, rating, order_index) VALUES
('Sarah Johnson', 'VP of Marketing', 'TechFlow Inc.', 'This platform has revolutionized how we manage our projects. The analytics are incredible!', 5, 1),
('Mike Chen', 'CTO', 'StartupXYZ', 'The integration capabilities saved us months of development time. Highly recommended!', 5, 2),
('Emma Davis', 'Project Manager', 'CreativeAgency', 'Outstanding support team and the collaboration features are exactly what we needed.', 5, 3),
('David Rodriguez', 'CEO', 'GrowthCorp', 'Scalable, reliable, and intuitive. This tool has been a game-changer for our business.', 5, 4);