import { useState } from 'react';
import { Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { motion } from 'framer-motion';

export function DemoVideo() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const youtubeId = "ZK-rNEhJIDs";
  const embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          See Our Product in Action
        </h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          Watch how our platform can transform your workflow and boost your productivity
        </p>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Video Thumbnail Container */}
          <motion.div 
            className="relative rounded-xl overflow-hidden shadow-2xl"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="aspect-video">
              {/* Thumbnail with Play Button */}
              <div 
                className="relative w-full h-full cursor-pointer group"
                onClick={() => setIsVideoOpen(true)}
                aria-label="Play video"
              >
                {/* Thumbnail Image */}
                <img
                  src={thumbnailUrl}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-90"
                  onError={(e) => {
                    e.currentTarget.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                  }}
                />
                
                {/* Dark Overlay for Contrast */}
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                
                {/* Attractive Dark Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="relative"
                    initial={{ scale: 0.98 }}
                    animate={{ 
                      scale: [0.98, 1.02, 0.98],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Button
                        size="lg"
                        className="px-8 py-6 rounded-lg bg-gray-900/90 hover:bg-gray-900 text-white shadow-xl backdrop-blur-sm border border-gray-700"
                      >
                        <div className="flex items-center gap-3">
                          <Play className="h-6 w-6 fill-current" />
                          <span className="text-lg font-medium">Watch Demo</span>
                        </div>
                      </Button>
                    </motion.div>
                    
                    {/* Subtle Glow Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-blue-500/20 -z-10 blur-md"
                      initial={{ scale: 1, opacity: 0 }}
                      animate={{ 
                        scale: 1.1, 
                        opacity: [0, 0.3, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Video Stats */}
          <div className="grid grid-cols-3 gap-8 mt-8 max-w-2xl mx-auto">
            {[
              { value: "50%", label: "Time Saved" },
              { value: "200%", label: "Productivity Boost" },
              { value: "24/7", label: "Support Available" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Video Modal */}
        <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
          <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <Button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70"
                size="icon"
                aria-label="Close video"
              >
                <X className="h-5 w-5" />
              </Button>
              
              <div className="aspect-video bg-black">
                <iframe
                  src={embedUrl}
                  title="Product Demo Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}