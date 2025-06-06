'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { GitHubStats } from "@/components/github-stats";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faUser, 
  faLaptopCode, 
  faEnvelope,
  faArrowRight,
  faCode,
  faBars,
  faXmark,
  faHashtag,
  faLocationDot,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faLinkedin,
  faInstagram,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function Home() {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [age, setAge] = useState<number>(0);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const sections = sectionsRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Add animation classes to education items when section is visible
            if (entry.target.id === 'education') {
              const educationItems = entry.target.querySelectorAll('.education-item');
              educationItems.forEach((item) => {
                item.classList.add('opacity-100', 'translate-y-0');
              });
            }
          } else {
            entry.target.classList.remove('visible');
            // Reset animation classes when section is not visible
            if (entry.target.id === 'education') {
              const educationItems = entry.target.querySelectorAll('.education-item');
              educationItems.forEach((item) => {
                item.classList.remove('opacity-100', 'translate-y-0');
              });
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px',
      }
    );

    sections.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      sections.forEach((section) => {
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  useEffect(() => {
    // Calculate age based on date of birth
    const calculateAge = () => {
      const dob = new Date('2002-08-30');
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      
      setAge(age);
    };

    calculateAge();
  }, []);

  const navLinks = [
    { href: '#hero', icon: faHome, text: 'Home' },
    { href: '#about', icon: faUser, text: 'About' },
    { href: '#education', icon: faGraduationCap, text: 'Education' },
    { href: '#skills', icon: faCode, text: 'Skills' },
    { href: '#projects', icon: faLaptopCode, text: 'Projects' },
    { href: '#contact', icon: faEnvelope, text: 'Contact' },
  ];

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      Name: formData.get('Name')?.toString() || '',
      Email: formData.get('Email')?.toString() || '',
      Message: formData.get('Message')?.toString() || '',
    };

    console.log('Submitting form data:', data); // Debug log

    // Updated Google Apps Script endpoint
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxyArB7G2so1yOEEK4Dcic8YYB2oa3K-byviVxSaxfUO62pzCSdAuiogAkZPP0axK59/exec';

    const resetForm = () => {
      if (form) {
        form.reset();
      }
    };

    try {
      // Primary method: CORS mode (since it's working perfectly based on console logs)
      const response = await fetch(scriptUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        try {
          const result = await response.json();
          console.log('Response result:', result);

          if (result && result.result === 'success') {
            setShowSuccessDialog(true);
            resetForm();
          } else {
            setShowErrorDialog(true);
          }
        } catch (jsonError) {
          console.log('Could not parse JSON, but request was successful');
          setShowSuccessDialog(true);
          resetForm();
        }
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

    } catch (error) {
      console.error('Primary submission failed, trying fallback method:', error);

      try {
        // Fallback method: No-CORS mode
        await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(data),
        });

        console.log('Form submitted with no-cors fallback mode');
        setShowSuccessDialog(true);
        resetForm();

      } catch (fallbackError) {
        console.error('All submission methods failed:', fallbackError);
        setShowErrorDialog(true);
      }
    }

    setIsSubmitting(false);
  };

  return (
    <main 
      className="min-h-screen relative"
      onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
    >
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <FontAwesomeIcon 
          icon={isMobileMenuOpen ? faXmark : faBars} 
          className="w-6 h-6"
        />
      </button>

      {/* Mobile Sidebar Navigation */}
      <div 
        className={`
          fixed top-0 left-0 h-full w-64 bg-background/95 backdrop-blur-md border-r 
          transform transition-transform duration-300 ease-in-out z-40
          md:hidden
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        onClick={(e) => e.stopPropagation()}  // Prevent clicks inside menu from closing it
      >
        <div className="pt-20 px-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              className="flex items-center gap-3 py-3 px-4 text-sm font-medium hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
            >
              <FontAwesomeIcon icon={link.icon} className="w-4 h-4" />
              {link.text}
            </a>
          ))}
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/60 backdrop-blur-md border-b hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-16 gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2 opacity-75 hover:opacity-100"
              >
                <FontAwesomeIcon icon={link.icon} className="w-4 h-4" />
                {link.text}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen w-full flex items-center justify-center bg-dot-pattern">
        <div ref={(el) => { sectionsRef.current[0] = el }} className="section-content w-full max-w-3xl text-center flex flex-col items-center gap-8 px-4">
          <Avatar className="w-32 h-32 mx-auto ring-2 ring-border">
            <AvatarImage src="/images/profile.jpg" alt="Dexter Dykes Timothy" className="" />
            <AvatarFallback>DT</AvatarFallback>
          </Avatar>
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">Dexter Dykes Timothy</h1>
            <p className="text-xl text-muted-foreground">Computer Science Nerd | Passionate Software Engineer</p>
          </div>
          <Button size="lg" className="mt-4 text-lg group" asChild>
            <a href="#contact">
              Contact Me
              <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen w-full flex items-center justify-center">
        <div ref={(el) => { sectionsRef.current[1] = el }} className="section-content w-full max-w-5xl px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">About Me</h2>
          <Card className="border-2">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left Side - Image and Personal Details */}
              <div className="p-8 border-r border-border">
                <div className="space-y-6">
                  <div className="relative w-64 h-64 mx-auto">
                    <Avatar className="w-full h-full ring-4 ring-border">
                      <AvatarImage src="/images/profile2.jpg" alt="Dexter Dykes Timothy" />
                      <AvatarFallback>DT</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-4 text-center">
                    <h3 className="text-2xl font-semibold">Dexter Dykes Timothy</h3>
                    <div className="space-y-2 text-muted-foreground">
                      <p className="flex items-center justify-center gap-2">
                        <FontAwesomeIcon icon={faHashtag} className="w-4 h-4" />
                        {age} Years Old
                      </p>
                      <p className="flex items-center justify-center gap-2">
                        <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4" />
                        Based in Malaysia
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Description */}
              <div className="p-8">
                <div className="space-y-6">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    I&apos;m a Software Engineer passionate about building innovative web and mobile applications. I enjoy solving complex problems through technology and have experience with C++, Java, PHP, and Kotlin. I focus on creating user-centric, efficient solutions and thrive in dynamic, forward-thinking teams.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="outline" className="group hover:border-primary/50" asChild>
                      <a href="https://github.com/DyDxdYdX" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faGithub} className="w-4 h-4 mr-2 group-hover:text-primary" />
                        GitHub
                      </a>
                    </Button>
                    <Button variant="outline" className="group hover:border-primary/50" asChild>
                      <a href="https://www.linkedin.com/in/dykesdexter" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faLinkedin} className="w-4 h-4 mr-2 group-hover:text-primary" />
                        LinkedIn
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="min-h-screen w-full flex items-center justify-center py-16">
        <div ref={(el) => { sectionsRef.current[2] = el }} className="section-content w-full max-w-5xl px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Education</h2>
          <div className="relative">
            {/* Timeline line (only between first and last dot) */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-8 bottom-8 w-px bg-gray-300 z-0"></div>
            {/* Timeline items */}
            <div className="space-y-12 relative z-10">
              {[
                {
                  year: "2021 - 2025",
                  title: "Bachelor of Computer Science (Hons) in Software Engineering",
                  institution: "Universiti Malaysia Sabah (UMS)",
                  location: "Kota Kinabalu, Sabah",
                  achievement: "CGPA 3.50"
                },
                {
                  year: "2020 - 2021",
                  title: "Sains-Modul II (M002)-SDS",
                  institution: "Kolej Matrikulasi Labuan",
                  location: "Labuan",
                  achievement: "CGPA 3.54"
                },
                {
                  year: "2019",
                  title: "SPM",
                  institution: "SMK Elopura",
                  location: "Sandakan, Sabah",
                  achievement: "SPM 5A"
                }
              ].map((item, index) => (
                <div key={index} className="relative">
                  {/* Timeline dot, slightly larger and overlapping card */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 w-5 h-5 rounded-full bg-primary border-4 border-white shadow z-20"></div>
                  {/* Content */}
                  <div className={`flex flex-col items-end md:items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className="w-full md:w-1/2 px-4 md:px-8">
                      <div className="bg-card p-6 rounded-lg border shadow-sm hover:border-primary/50 transition-all duration-300">
                        <div className="text-sm text-muted-foreground mb-2">{item.year}</div>
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-muted-foreground mb-2">{item.institution}</p>
                        <p className="text-sm text-muted-foreground mb-2">{item.achievement}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4 mr-2" />
                          {item.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="min-h-screen w-full flex items-center justify-center py-16">
        <div ref={(el) => { sectionsRef.current[3] = el }} className="section-content w-full max-w-5xl px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Skills & Expertise</h2>
          <GitHubStats />
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="min-h-screen w-full flex items-center justify-center py-16">
        <div ref={(el) => { sectionsRef.current[4] = el }} className="section-content w-full max-w-5xl px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Sabah Holiday Fetcher",
                description: "A simple API that provides public holiday data for Malaysia (Sabah) in JSON format.",
                link: "https://sabah-holiday.dydxsoft.my/"
              },
              {
                title: "Shophawk",
                description: "An e-commerce platform that helps users discover and compare prices across different online stores.",
                link: "https://github.com/DyDxdYdX/shophawk"
              },{
                title: "Minigame by DyDxSoft",
                description: "Minigame website where you can play classic gane for free without annoying ads.",
                link: "https://minigame.dydxsoft.my"
              },
              {
                title: "Ongoing Projects",
                description: "And more projects coming soon!",
                link: "https://github.com/DyDxdYdX?tab=repositories"
              }
            ].map((project) => (
              <Card key={project.title} className="group hover:border-primary/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors">{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{project.description}</p>
                  <Button variant="ghost" className="group-hover:text-primary group-hover:bg-primary/10" asChild>
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      View Project
                      <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen w-full flex items-center justify-center py-16">
        <div ref={(el) => { sectionsRef.current[5] = el }} className="section-content w-full max-w-5xl px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Contact</h2>
          <Card className="border-2">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left Side - Contact Buttons */}
              <div className="p-8 border-r border-border">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold">Let's Connect!</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      Feel free to reach out for collaborations, project discussions, or just a friendly hello!
                      I'm always excited to connect with fellow developers and creators.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      className="group hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 h-auto p-4 justify-start"
                      asChild
                    >
                      <a href="mailto:dydxsoft@gmail.com" className="flex flex-col items-start gap-2">
                        <div className="flex items-center gap-3">
                          <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                          <span className="font-semibold">Email</span>
                        </div>
                        <span className="text-sm text-muted-foreground">dydxsoft@gmail.com</span>
                      </a>
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="group hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 h-auto p-4 justify-start"
                      asChild
                    >
                      <a href="https://github.com/DyDxdYdX" target="_blank" rel="noopener noreferrer" className="flex flex-col items-start gap-2">
                        <div className="flex items-center gap-3">
                          <FontAwesomeIcon icon={faGithub} className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                          <span className="font-semibold">GitHub</span>
                        </div>
                        <span className="text-sm text-muted-foreground">@DyDxdYdX</span>
                      </a>
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="group hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 h-auto p-4 justify-start"
                      asChild
                    >
                      <a href="https://www.linkedin.com/in/dykesdexter" target="_blank" rel="noopener noreferrer" className="flex flex-col items-start gap-2">
                        <div className="flex items-center gap-3">
                          <FontAwesomeIcon icon={faLinkedin} className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                          <span className="font-semibold">LinkedIn</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Dexter Dykes</span>
                      </a>
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="group hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 h-auto p-4 justify-start"
                      asChild
                    >
                      <a href="https://www.instagram.com/dexterdykes/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-start gap-2">
                        <div className="flex items-center gap-3">
                          <FontAwesomeIcon icon={faInstagram} className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                          <span className="font-semibold">Instagram</span>
                        </div>
                        <span className="text-sm text-muted-foreground">@dexterdykes</span>
                      </a>
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="group hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 h-auto p-4 justify-start"
                      asChild
                    >
                      <a href="https://www.youtube.com/@DexterDykes" target="_blank" rel="noopener noreferrer" className="flex flex-col items-start gap-2">
                        <div className="flex items-center gap-3">
                          <FontAwesomeIcon icon={faYoutube} className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                          <span className="font-semibold">Youtube</span>
                        </div>
                        <span className="text-sm text-muted-foreground">@DexterDykes</span>
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Side - Contact Form */}
              <div className="p-8">
                <div className="space-y-6">
                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                      <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 text-primary" />
                      Send me a message
                    </h3>
                    <p className="text-muted-foreground text-sm">I'll get back to you as soon as possible!</p>
                  </div>

                  <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label htmlFor="Name" className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-primary" />
                        Name
                      </label>
                      <input
                        type="text"
                        id="Name"
                        name="Name"
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 hover:border-primary/30"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="Email" className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-primary" />
                        Email
                      </label>
                      <input
                        type="email"
                        id="Email"
                        name="Email"
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 hover:border-primary/30"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="Message" className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-primary" />
                        Message
                      </label>
                      <textarea
                        id="Message"
                        name="Message"
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 hover:border-primary/30 resize-none"
                        placeholder="Tell me about your project, ideas, or just say hello..."
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full py-3 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 group"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Send Message
                          <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Success Alert Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-medium">
              Message Sent
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              I'll get back to you soon.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="w-full">Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Alert Dialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-medium">
              Message Failed
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Please try again or contact me directly at dydxsoft@gmail.com
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="w-full">Try Again</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Footer */}
      <footer className="w-full py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-6">
              <a href="https://github.com/DyDxdYdX" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <FontAwesomeIcon icon={faGithub} className="w-6 h-6" />
              </a>
              <a href="https://www.linkedin.com/in/dykesdexter" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <FontAwesomeIcon icon={faLinkedin} className="w-6 h-6" />
              </a>
              <a href="https://www.instagram.com/dexterdykes/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <FontAwesomeIcon icon={faInstagram} className="w-6 h-6" />
              </a>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Dexter Dykes Timothy. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

