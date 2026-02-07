import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  GraduationCap,
  Sun,
  Moon,
  Star,
  Zap,
  Shield,
  Sparkles,
  Award,
  TrendingUp,
  Globe,
  BarChart3,
  Target,
  Briefcase,
  Menu,
  X,
  ChevronRight,
  CheckCircle,
  Building,
  Lock,
  Cpu,
  Network
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { getInstituteProfile } from '../../services/authapi';

const SchoolLandingPage = () => {
  const [isDark, setIsDark] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef(null);
  const [instituteDetails, setInstituteDetails] = useState({
    name: 'BRAINNIX',
    logo: ''
  });

  useEffect(() => {
    const fetchInstituteDetails = async () => {
      try {
        const res = await getInstituteProfile();
        if (res?.institute?.length > 0) {
          const inst = res.institute[0];
          setInstituteDetails({
            name: inst.instituteName || 'BRAINNIX',
            logo: inst.logo?.[0]?.url || ''
          });
        }
      } catch (error) {
        console.error("Failed to fetch institute details", error);
      }
    };
    fetchInstituteDetails();
  }, []);



  const handleGetStarted = () => {
    console.log('Navigate to get started');
  };


  const navigate = useNavigate()

  function handleSignIn() {
    navigate("/signup");
  }
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Data-driven insights and predictive analytics to optimize business performance and drive strategic decisions with real-time reporting.",
      accent: "blue"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Integration",
      description: "Seamless connectivity across international markets with multi-currency support, compliance management, and regional customization.",
      accent: "emerald"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "Bank-grade security protocols with end-to-end encryption, compliance certifications, and advanced threat protection.",
      accent: "slate"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Strategic Automation",
      description: "Intelligent workflow automation that scales with your business, optimizes resource allocation, and eliminates manual processes.",
      accent: "indigo"
    }
  ];

  const benefits = [
    { title: "99.9% Uptime Guarantee", description: "Enterprise-grade reliability" },
    { title: "24/7 Expert Support", description: "Dedicated success team" },
    { title: "SOC 2 Compliance", description: "Industry-leading security" },
    { title: "Global Infrastructure", description: "Low-latency worldwide" }
  ];

  const testimonials = [
    {
      quote: "BRAINNIX transformed our operations, delivering 40% efficiency gains in the first quarter.",
      author: "Sarah Chen",
      role: "CEO, TechCorp International",
      company: "Fortune 500"
    },
    {
      quote: "The platform's analytics capabilities gave us insights we never had before.",
      author: "Michael Rodriguez",
      role: "COO, Global Systems",
      company: "Industry Leader"
    },
    {
      quote: "Security and compliance features are exactly what our enterprise needed.",
      author: "Dr. Amanda Foster",
      role: "CTO, SecureFlow",
      company: "Tech Innovator"
    }
  ];

  return (
    <div className={`min-h-screen overflow-x-hidden transition-all duration-700 font-inter ${isDark ? 'bg-[#1E1E1E] text-white' : 'bg-white text-slate-900'}`}>

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/SuperadminLogin.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      </div>

      <nav className={`fixed top-0 w-full z-50 backdrop-blur-xl transition-all duration-500 ${isDark ? 'bg-[#1E1E1E]/90 border-white/10' : 'bg-white/90 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl ${isDark ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center shadow-lg overflow-hidden`}>
                {instituteDetails.logo ? (
                  <img src={instituteDetails.logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Briefcase className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                )}
              </div>
              <span className={`font-bold text-xl lg:text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {instituteDetails.name}
              </span>
            </div>

            <div className="hidden lg:flex items-center space-x-8">
              <nav className="flex space-x-8">
                {['Solutions', 'Enterprise', 'Resources', 'Pricing'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className={`text-sm font-medium transition-colors duration-200 hover:scale-105 ${isDark ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>

            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-lg transition-all duration-300 hover:scale-110 ${isDark ? 'bg-gray-800/70 hover:bg-gray-700' : 'bg-slate-100 hover:bg-slate-200'}`}
              >
                {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>

              <button
                onClick={handleSignIn}
                className={`px-6 py-3 text-base rounded-lg transition-all duration-300 hover:scale-105 ${isDark
                  ? "text-gray-300 bg-gray-800/70 hover:bg-gray-700"
                  : "text-slate-600 bg-slate-100 hover:bg-slate-200"
                  } font-medium`}
              >
                Sign In
              </button>

              <button
                onClick={handleGetStarted}
                className={`px-6 py-3 text-base ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-xl`}
              >
                Get Started
              </button>
            </div>

            <div className="flex items-center space-x-4 lg:hidden">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-300 ${isDark ? 'bg-gray-800/70 hover:bg-gray-700' : 'bg-slate-100 hover:bg-slate-200'}`}
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>
              <button
                onClick={toggleMobileMenu}
                className={`p-2 rounded-lg transition-all duration-300 ${isDark ? 'bg-gray-800/70 hover:bg-gray-700' : 'bg-slate-100 hover:bg-slate-200'}`}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className={`lg:hidden border-t ${isDark ? 'border-white/10 bg-[#1E1E1E]/95' : 'border-slate-200 bg-white/95'} backdrop-blur-xl`}>
              <div className="px-4 py-6 space-y-4">
                {['Solutions', 'Enterprise', 'Resources', 'Pricing'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className={`block text-base font-medium transition-colors duration-200 ${isDark ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {item}
                  </a>
                ))}
                <div className="pt-4 space-y-4">
                  <button
                    onClick={handleSignIn}
                    className={`w-full px-4 py-3 text-base rounded-lg transition-all duration-300 ${isDark ? 'text-gray-300 bg-gray-800/70 hover:bg-gray-700' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'} font-medium`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleGetStarted}
                    className={`w-full px-4 py-3 text-base ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg transition-all duration-300 font-medium`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>


      <section ref={heroRef} className="relative pt-20 lg:pt-32 pb-16 lg:pb-32 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="text-center space-y-8 lg:space-y-12">
            <div className={`inline-flex items-center space-x-2 px-4 py-2 lg:px-6 lg:py-3 rounded-full ${isDark ? 'bg-gray-800/70 border-white/10' : 'bg-slate-100/80 border-slate-200'} backdrop-blur-sm border text-sm lg:text-base`}>
              <Star className={`w-4 h-4 lg:w-5 lg:h-5 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
              <span className="font-medium">{instituteDetails.name}</span>
            </div>

            <div className="space-y-4 lg:space-y-6">
              <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span className="block">Enterprise</span>
                <span className={`block ${isDark ? 'text-blue-400' : 'text-blue-600'} font-extrabold`}>
                  EXCELLENCE
                </span>
                <span className="block">Delivered</span>
              </h1>

              <p className={`text-lg sm:text-xl lg:text-2xl font-light max-w-4xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                Transform your business operations with
                <span className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}> intelligent analytics</span>,
                <span className={`font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}> global scalability</span>, and
                <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-slate-700'}`}> enterprise security</span>
              </p>
            </div>



            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pt-12 lg:pt-16">
              {[
                { number: '10M+', label: 'Global Users', icon: <Users className="w-6 h-6 lg:w-8 lg:h-8" /> },
                { number: '500+', label: 'Enterprise Clients', icon: <Award className="w-6 h-6 lg:w-8 lg:h-8" /> },
                { number: '99.99%', label: 'System Reliability', icon: <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8" /> },
                { number: '24/7', label: 'Expert Support', icon: <Zap className="w-6 h-6 lg:w-8 lg:h-8" /> }
              ].map((stat, i) => (
                <div key={i} className="text-center space-y-2 lg:space-y-3">
                  <div className={`inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 rounded-xl ${isDark ? 'bg-gray-800/70 text-blue-400' : 'bg-slate-100 text-blue-500'} transition-all duration-300 hover:scale-110`}>
                    {stat.icon}
                  </div>
                  <div className={`text-2xl lg:text-3xl xl:text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {stat.number}
                  </div>
                  <div className={`text-sm lg:text-base font-medium ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className="py-16 lg:py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-20">
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-4 lg:mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                Enterprise-Grade
              </span>
              <br />
              <span>Solutions</span>
            </h2>
            <p className={`text-lg lg:text-xl ${isDark ? 'text-gray-300' : 'text-slate-600'} mb-8 lg:mb-12 max-w-2xl mx-auto`}>
              Join thousands of forward-thinking companies that have already revolutionized their operations with {instituteDetails.name}.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center items-center">
              <button
                onClick={handleGetStarted}
                className={`w-full sm:w-auto px-10 lg:px-12 py-4 lg:py-6 ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg font-semibold text-lg lg:text-xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl`}
              >
                <span className="flex items-center justify-center space-x-3">
                  <Sparkles className="w-6 h-6" />
                  <span>Start Free Trial</span>
                </span>
              </button>

         
            </div>

            <div className="mt-8 lg:mt-12">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-6 lg:p-12 rounded-2xl lg:rounded-3xl transition-all duration-500 hover:scale-105 cursor-pointer ${isDark ? 'bg-[#1E1E1E]/90 hover:bg-[#2D2D2D]/90 border border-white/20 hover:border-blue-500/50' : 'bg-slate-50/80 hover:bg-slate-50 border border-slate-200 hover:border-blue-300'} backdrop-blur-sm shadow-2xl hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]`}
              >
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-14 h-14 lg:w-20 lg:h-20 rounded-xl lg:rounded-2xl mb-6 lg:mb-8 transition-all duration-500 group-hover:scale-110 ${feature.accent === 'blue' ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') :
                    feature.accent === 'emerald' ? (isDark ? 'bg-emerald-600 text-white' : 'bg-emerald-500 text-white') :
                      feature.accent === 'slate' ? (isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-600 text-white') :
                        (isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white')
                    } shadow-lg group-hover:shadow-xl`}>
                    {feature.icon}
                  </div>

                  <h3 className={`text-xl lg:text-2xl xl:text-3xl font-extrabold mb-3 lg:mb-4 ${isDark ? 'text-white group-hover:text-blue-400' : 'text-slate-900 group-hover:text-blue-600'} transition-colors duration-500`}>
                    {feature.title}
                  </h3>
                  <p className={`text-base lg:text-lg ${isDark ? 'text-gray-300' : 'text-slate-600'} leading-relaxed`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={`py-16 lg:py-32 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-[#1E1E1E]/90' : 'bg-slate-50/50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-20">
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 lg:mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>Why</span> Leading Companies Choose Us
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className={`text-center p-6 lg:p-8 rounded-2xl ${isDark ? 'bg-[#1E1E1E]/95 border-white/20' : 'bg-white/80 border-slate-200'} border backdrop-blur-sm hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]`}>
                <CheckCircle className={`w-8 h-8 lg:w-12 lg:h-12 mx-auto mb-4 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
                <h3 className={`text-lg lg:text-xl font-extrabold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {benefit.title}
                </h3>
                <p className={`text-sm lg:text-base ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-16 lg:py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-6 lg:mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <span className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              Experience Excellence
            </span>
          </h2>

          <div className="relative max-w-5xl mx-auto">
            <div className={`relative p-6 lg:p-8 rounded-2xl lg:rounded-3xl ${isDark ? 'bg-[#1E1E1E]/95 border-white/20' : 'bg-white/80 border-slate-200'} backdrop-blur-xl border shadow-2xl hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]`}>
              <div className="space-y-6 lg:space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className={`text-xl lg:text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>Executive Dashboard</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {[
                    { title: 'Performance', value: '98.7%', subtitle: 'System Uptime', color: 'emerald' },
                    { title: 'Growth', value: '247%', subtitle: 'YoY Revenue', color: 'blue' },
                    { title: 'Global Reach', value: '127', subtitle: 'Active Markets', color: 'slate' }
                  ].map((metric, i) => (
                    <div key={i} className={`p-4 lg:p-6 rounded-xl lg:rounded-2xl ${isDark ? 'bg-gray-800/70 border-white/20' : 'bg-slate-50/70 border-slate-200'} backdrop-blur-md border hover:scale-105 transition-all duration-300 shadow-xl`}>
                      <div className={`text-2xl lg:text-3xl font-extrabold ${metric.color === 'emerald' ? (isDark ? 'text-emerald-400' : 'text-emerald-600') :
                        metric.color === 'blue' ? (isDark ? 'text-blue-400' : 'text-blue-600') :
                          (isDark ? 'text-gray-300' : 'text-slate-700')
                        }`}>
                        {metric.value}
                      </div>
                      <div className={`font-semibold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{metric.title}</div>
                      <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>{metric.subtitle}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-16 lg:py-32 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-[#1E1E1E]/90' : 'bg-slate-50/50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-20">
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 lg:mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              What Industry Leaders Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className={`p-6 lg:p-8 rounded-2xl ${isDark ? 'bg-[#1E1E1E]/95 border-white/20' : 'bg-white/80 border-slate-200'} border backdrop-blur-sm hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]`}>
                <div className="mb-6">
                  <p className={`text-base lg:text-lg ${isDark ? 'text-gray-300' : 'text-slate-700'} leading-relaxed italic`}>
                    "{testimonial.quote}"
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full ${isDark ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center`}>
                    <span className="text-white font-extrabold text-lg">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {testimonial.author}
                    </div>
                    <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                      {testimonial.role}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 lg:mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Ready to Transform Your Business?
          </h2>
          <p className={`text-lg lg:text-xl ${isDark ? 'text-gray-300' : 'text-slate-600'} mb-8 lg:mb-12 max-w-3xl mx-auto`}>
            Join thousands of enterprises leveraging {instituteDetails.name} to achieve operational excellence and drive sustainable growth.
          </p>



          <div className="mt-8 lg:mt-12">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 lg:py-20 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-[#1E1E1E]/90 border-white/10' : 'bg-white/80 border-slate-200'} backdrop-blur-xl border-t`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 lg:mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4 lg:mb-6">
              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl ${isDark ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center shadow-lg overflow-hidden`}>
                {instituteDetails.logo ? (
                  <img src={instituteDetails.logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Briefcase className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                )}
              </div>
              <span className={`font-extrabold text-2xl lg:text-3xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {instituteDetails.name}
              </span>
            </div>
            <p className={`text-base lg:text-lg ${isDark ? 'text-gray-300' : 'text-slate-600'} max-w-2xl mx-auto`}>
              Empowering global enterprises with innovative solutions for sustainable growth and operational excellence.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 mb-8 lg:mb-12">
            {[
              {
                title: 'Solutions',
                links: ['Enterprise Suite', 'Analytics Pro', 'Security Center', 'Integration Hub'],
                icons: [<Cpu />, <BarChart3 />, <Lock />, <Network />]
              },
              {
                title: 'Company',
                links: ['About Us', 'Leadership', 'Careers', 'Press'],
                icons: [<Building />, <Users />, <Award />, <Globe />]
              },
              {
                title: 'Resources',
                links: ['Documentation', 'Case Studies', 'API Reference', 'System Status'],
                icons: [<Target />, <TrendingUp />, <Zap />, <Shield />]
              },
              {
                title: 'Support',
                links: ['Help Center', 'Contact Sales', 'Training', 'Community'],
                icons: [<Star />, <Briefcase />, <GraduationCap />, <Users />]
              }
            ].map((section, i) => (
              <div key={i}>
                <h4 className={`font-extrabold text-base lg:text-lg mb-3 lg:mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {section.title}
                </h4>
                <ul className="space-y-2 lg:space-y-3">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <a
                        href="#"
                        className={`text-sm lg:text-base ${isDark ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors duration-200 hover:scale-105 inline-flex items-center space-x-2 group`}
                      >
                        <span className={`w-4 h-4 ${isDark ? 'text-gray-600' : 'text-slate-400'} group-hover:text-blue-500 transition-colors duration-200`}>
                          {React.cloneElement(section.icons[j], { className: 'w-4 h-4' })}
                        </span>
                        <span>{link}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={`flex flex-col md:flex-row justify-between items-center border-t ${isDark ? 'border-white/10' : 'border-slate-200'} pt-6 lg:pt-8 space-y-4 md:space-y-0`}>
            <div className="flex items-center space-x-6">
              {[
                { name: 'LinkedIn', icon: <Building className="w-5 h-5" /> },
                { name: 'Twitter', icon: <Globe className="w-5 h-5" /> },
                { name: 'GitHub', icon: <Zap className="w-5 h-5" /> }
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors duration-200 hover:scale-110`}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <a
                href="#"
                className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors duration-200`}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors duration-200`}
              >
                Terms of Service
              </a>
              <a
                href="#"
                className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors duration-200`}
              >
                Security
              </a>
            </div>
          </div>

          <div className={`text-center border-t ${isDark ? 'border-white/10' : 'border-slate-200'} pt-6 lg:pt-8 mt-6 lg:mt-8`}>
            <p className={`text-sm lg:text-base ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
              © 2025 {instituteDetails.name}. All rights reserved. Built for enterprise excellence.
            </p>
            <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
              Designed with precision for world-class professionals and industry leaders.
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 w-12 h-12 ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40`}
        style={{ display: scrollY > 400 ? 'block' : 'none' }}
      >
        <ChevronRight className="w-6 h-6 mx-auto rotate-[-90deg]" />
      </button>

      {/* Custom Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @media (max-width: 768px) {
          .text-8xl { font-size: 4rem; }
          .text-7xl { font-size: 3.5rem; }
          .text-6xl { font-size: 3rem; }
        }
        
        @media (max-width: 640px) {
          .text-8xl { font-size: 3rem; }
          .text-7xl { font-size: 2.5rem; }
          .text-6xl { font-size: 2.25rem; }
        }
      `}</style>
    </div>
  );
};

export default SchoolLandingPage;