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
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faLinkedin,
  faInstagram
} from '@fortawesome/free-brands-svg-icons';

export default function Home() {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const sections = sectionsRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          } else {
            entry.target.classList.remove('visible');
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

  const navLinks = [
    { href: '#hero', icon: faHome, text: 'Home' },
    { href: '#about', icon: faUser, text: 'About' },
    { href: '#skills', icon: faCode, text: 'Skills' },
    { href: '#projects', icon: faLaptopCode, text: 'Projects' },
    { href: '#contact', icon: faEnvelope, text: 'Contact' },
  ];

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
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
        <div ref={(el) => { sectionsRef.current[1] = el }} className="section-content w-full max-w-2xl text-center px-4 space-y-8">
          <h2 className="text-3xl font-bold">About Me</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            I&apos;m a Software Engineer passionate about building innovative web and mobile applications. I enjoy solving complex problems through technology and have experience with C++, Java, PHP, and Kotlin. I focus on creating user-centric, efficient solutions and thrive in dynamic, forward-thinking teams.
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="min-h-screen w-full flex items-center justify-center py-16">
        <div ref={(el) => { sectionsRef.current[2] = el }} className="section-content w-full max-w-5xl px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Skills & Expertise</h2>
          <GitHubStats />
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="min-h-screen w-full flex items-center justify-center py-16">
        <div ref={(el) => { sectionsRef.current[3] = el }} className="section-content w-full max-w-5xl px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Sabah Holiday Fetcher",
                description: "A simple API that provides public holiday data for Malaysia (Sabah) in JSON format.",
                link: "https://sabah-holiday.dydxsoft.my/
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
      <section id="contact" className="min-h-screen w-full flex items-center justify-center">
        <div ref={(el) => { sectionsRef.current[4] = el }} className="section-content w-full max-w-2xl text-center px-4 space-y-8">
          <h2 className="text-3xl font-bold">Get in Touch</h2>
          <p className="text-muted-foreground text-lg">Feel free to reach out for collaborations or just a friendly hello!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" size="lg" className="group hover:border-primary/50" asChild>
              <a href="mailto:dydxsoft@gmail.com">
                <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 mr-2 group-hover:text-primary" />
                Email
              </a>
            </Button>
            <Button variant="outline" size="lg" className="group hover:border-primary/50" asChild>
              <a href="https://github.com/DyDxdYdX" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faGithub} className="w-4 h-4 mr-2 group-hover:text-primary" />
                GitHub
              </a>
            </Button>
            <Button variant="outline" size="lg" className="group hover:border-primary/50" asChild>
              <a href="https://www.linkedin.com/in/dykesdexter" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedin} className="w-4 h-4 mr-2 group-hover:text-primary" />
                LinkedIn
              </a>
            </Button>
            <Button variant="outline" size="lg" className="group hover:border-primary/50" asChild>
              <a href="https://www.instagram.com/dexterdykes/" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} className="w-4 h-4 mr-2 group-hover:text-primary" />
                Instagram
              </a>
            </Button>
          </div>
        </div>
      </section>

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
