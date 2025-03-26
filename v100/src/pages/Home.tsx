import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Slider Component
const Slider = () => {
  const slides = [
    {
      id: 1,
      title: "AI-Powered Content Creation",
      subtitle: "Intelligent Writing Assistant",
      description: "Our advanced AI analyzes top-performing content to generate high-converting copy perfectly tailored to your audience and brand voice.",
      bgGradient: "from-blue-600 via-blue-500 to-indigo-700",
      accentColor: "blue",
      icon: "✨",
      features: ["Smart Templates", "Tone Detection", "Keyword Optimization"]
    },
    {
      id: 2,
      title: "SEO Optimization Engine",
      subtitle: "Rank Higher, Get Found",
      description: "Built-in keyword research and optimization tools ensure your content ranks higher in search results and drives more organic traffic.",
      bgGradient: "from-purple-600 via-purple-500 to-pink-700",
      accentColor: "purple",
      icon: "🔍",
      features: ["Keyword Analysis", "SERP Preview", "Readability Score"]
    },
    {
      id: 3,
      title: "Multi-format Content Export",
      subtitle: "Create Once, Publish Everywhere",
      description: "Generate and export your content in multiple formats including blog posts, social media updates, email newsletters, and more.",
      bgGradient: "from-emerald-600 via-emerald-500 to-teal-700",
      accentColor: "emerald",
      icon: "🚀",
      features: ["Blog Format", "Social Media Cards", "Email Templates"]
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState('next'); // For animation direction
  const [progress, setProgress] = useState(0);

  const nextSlide = useCallback(() => {
    setDirection('next');
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setProgress(0);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setDirection('prev');
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setProgress(0);
  }, [slides.length]);

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 'next' : 'prev');
    setCurrentSlide(index);
    setProgress(0);
  };

  // Handle progress bar animation
  useEffect(() => {
    let progressInterval;
    const duration = 5000; // 5 seconds
    const intervalTime = 50; // Update every 50ms
    const step = (intervalTime / duration) * 100;
    
    if (isPlaying) {
      setProgress(0);
      progressInterval = setInterval(() => {
        setProgress(prevProgress => {
          const newProgress = prevProgress + step;
          if (newProgress >= 100) {
            nextSlide();
            return 0;
          }
          return newProgress;
        });
      }, intervalTime);
    }

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [isPlaying, currentSlide, nextSlide]);

  const handleMouseEnter = () => {
    setIsPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsPlaying(true);
  };

  // Get color class based on accentColor
  const getAccentClass = (color, element) => {
    const colorMap = {
      blue: {
        bg: "bg-blue-600",
        text: "text-blue-600",
        border: "border-blue-600",
        hover: "hover:bg-blue-700"
      },
      purple: {
        bg: "bg-purple-600",
        text: "text-purple-600",
        border: "border-purple-600",
        hover: "hover:bg-purple-700"
      },
      emerald: {
        bg: "bg-emerald-600",
        text: "text-emerald-600",
        border: "border-emerald-600",
        hover: "hover:bg-emerald-700"
      }
    };
    
    return colorMap[color]?.[element] || colorMap.blue[element];
  };

  return (
    <div 
      className="relative w-full overflow-hidden rounded-xl shadow-2xl" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ height: "500px" }}
    >
      {/* Background Overlay with Glass Effect */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10"></div>
      
      {/* Slides */}
      <div className="h-full relative">
        {slides.map((slide, index) => {
          const isCurrent = index === currentSlide;
          const isNext = (currentSlide === slides.length - 1 ? 0 : currentSlide + 1) === index;
          const isPrev = (currentSlide === 0 ? slides.length - 1 : currentSlide - 1) === index;
          
          let positionClass = "opacity-0"; // Hidden by default
          
          if (isCurrent) {
            positionClass = "opacity-100 translate-x-0 z-30";
          } else if (direction === 'next' && isNext) {
            positionClass = "opacity-0 translate-x-full z-20";
          } else if (direction === 'prev' && isPrev) {
            positionClass = "opacity-0 -translate-x-full z-20";
          }
          
          return (
            <div 
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${positionClass}`}
            >
              {/* Background Gradient */}
              <div className={`w-full h-full bg-gradient-to-br ${slide.bgGradient} absolute`}></div>
              
              {/* Content Container */}
              <div className="flex h-full relative z-20">
                {/* Left Content */}
                <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                  <div className="mb-2 flex items-center">
                    <span className="text-4xl mr-3">{slide.icon}</span>
                    <span className="text-white/80 uppercase tracking-wider text-sm font-semibold">{slide.subtitle}</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                    {slide.title}
                  </h2>
                  
                  <p className="text-white/90 text-lg mb-6 max-w-xl">
                    {slide.description}
                  </p>
                  
                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {slide.features.map((feature, i) => (
                      <span 
                        key={i} 
                        className="px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium backdrop-blur-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      className="bg-white hover:bg-gray-100"
                      size="lg"
                    >
                      <span className={getAccentClass(slide.accentColor, "text")}>Get Started</span>
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="border-white text-white hover:bg-white/10"
                      size="lg"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
                
                {/* Right Content - 3D Float Effect */}
                <div className="hidden md:flex md:w-2/5 items-center justify-center p-12">
                  <div className="relative perspective-1000">
                    <div 
                      className="w-full h-64 bg-white/10 backdrop-blur-xl rounded-xl shadow-xl overflow-hidden border border-white/20 
                      transform transition-transform duration-1000 hover:rotate-y-10 hover:scale-105 hover:shadow-2xl"
                    >
                      {/* Placeholder for your actual content/image */}
                      <div className="absolute inset-0 flex items-center justify-center text-white p-4">
                        <div className="space-y-4 w-full">
                          <div className="h-6 w-20 bg-white/30 rounded-full"></div>
                          <div className="h-4 w-full bg-white/20 rounded-full"></div>
                          <div className="h-4 w-4/5 bg-white/20 rounded-full"></div>
                          <div className="h-4 w-3/5 bg-white/20 rounded-full"></div>
                          <div className="mt-8 h-12 w-full bg-white/40 rounded-lg"></div>
                        </div>
                      </div>
                      
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-50"></div>
                      
                      {/* Decorative elements */}
                      <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20"></div>
                      <div className="absolute bottom-6 left-6 w-8 h-8 rounded-full bg-white/20"></div>
                    </div>
                    
                    {/* Floating elements for depth */}
                    <div className="absolute -top-4 -right-4 w-16 h-16 rounded-xl bg-white/10 -z-10 backdrop-blur-sm border border-white/10"></div>
                    <div className="absolute -bottom-6 -left-6 w-24 h-12 rounded-xl bg-white/5 -z-10 backdrop-blur-sm border border-white/10"></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Control Panel with Glass Effect */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md h-16 z-40 px-6 flex items-center justify-between">
        {/* Slide Counter */}
        <div className="text-white/90 font-medium">
          {currentSlide + 1} / {slides.length}
        </div>
        
        {/* Progress Bar */}
        <div className="flex-1 mx-8">
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-3">
          <button 
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            ←
          </button>
          
          <button
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>
          
          <button 
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            →
          </button>
        </div>
      </div>
      
      {/* Side Navigation Dots */}
      <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col space-y-2 z-50">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide 
                ? "bg-white w-4" 
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  // Sample testimonials
  const testimonials = [
    {
      quote: "This tool has transformed our content creation process completely.",
      author: "Sarah Johnson",
      role: "Marketing Director"
    },
    {
      quote: "We've seen a 40% increase in engagement since using this platform.",
      author: "Michael Chen",
      role: "Content Strategist"
    }
  ];

  // Sample feature details
  const features = [
    {
      title: "AI-Powered",
      description: "Advanced AI that understands your content needs and adapts to your brand voice.",
      icon: "✨"
    },
    {
      title: "SEO Optimized",
      description: "Built-in SEO best practices for better rankings and increased visibility.",
      icon: "🔍"
    },
    {
      title: "Easy to Use",
      description: "Simple interface for quick content generation without technical complexity.",
      icon: "🚀"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section - Enhanced with gradient background */}
      <div className="relative rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-8 mb-12">
        <div className="max-w-3xl mx-auto space-y-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Content Generator <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Pro</span>
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            Transform your ideas into engaging, SEO-optimized content in minutes.
            Get more done with less effort.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link to="/generator">
              <Button variant="gradient" size="lg">
                Start Creating
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>Trusted by content creators worldwide • No credit card required</p>
          </div>
        </div>
      </div>

      {/* Professional Slider Section */}
      <div className="mb-16">
        <div className="relative overflow-hidden rounded-xl">
          {/* Slider Component */}
          <Slider />
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-center">
        <div className="p-6 rounded-lg bg-white border border-gray-100 shadow-sm">
          <div className="text-3xl font-bold text-blue-600 mb-1">10x</div>
          <div className="text-gray-600">Faster Content Creation</div>
        </div>
        <div className="p-6 rounded-lg bg-white border border-gray-100 shadow-sm">
          <div className="text-3xl font-bold text-blue-600 mb-1">15k+</div>
          <div className="text-gray-600">Active Users</div>
        </div>
        <div className="p-6 rounded-lg bg-white border border-gray-100 shadow-sm">
          <div className="text-3xl font-bold text-blue-600 mb-1">98%</div>
          <div className="text-gray-600">Customer Satisfaction</div>
        </div>
      </div>

      {/* Features Section - Enhanced with icons */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Powerful Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-3xl mb-2">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex-1 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Define Your Topic</h3>
                <p className="text-gray-600">Enter your topic and target audience to set the right context.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Customize Options</h3>
                <p className="text-gray-600">Select tone, length, and SEO keywords for your content.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Generate & Edit</h3>
                <p className="text-gray-600">Review, edit, and export your professionally created content.</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="aspect-video rounded-lg bg-white border border-gray-200 flex items-center justify-center">
              <p className="text-gray-400 text-center">Content preview image</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="mb-16 bg-gray-50 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-10">What Our Users Say</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-10 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Content?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of content creators who are saving time and creating better content.
        </p>
        <Link to="/generator">
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            Get Started Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;