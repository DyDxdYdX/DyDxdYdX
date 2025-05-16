'use client';

import { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faUser, 
  faLaptopCode, 
  faEnvelope,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons';

export default function Home() {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

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

  return (
    <main className="min-h-screen">
      <ThemeToggle />
      {/* Navigation Menu */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-16 gap-8">
            <a href="#hero" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
              <FontAwesomeIcon icon={faHome} className="w-4 h-4" />
              Home
            </a>
            <a href="#about" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
              About
            </a>
            <a href="#projects" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
              <FontAwesomeIcon icon={faLaptopCode} className="w-4 h-4" />
              Projects
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" />
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen w-full flex items-center justify-center">
        <div ref={(el) => { sectionsRef.current[0] = el }} className="section-content w-full max-w-3xl text-center flex flex-col items-center gap-6 px-4">
          <Avatar className="w-24 h-24 mx-auto shadow-lg">
            <AvatarImage src="https://media.licdn.com/dms/image/v2/D5635AQGJKn3yFnwLYA/profile-framedphoto-shrink_200_200/profile-framedphoto-shrink_200_200/0/1736253057219?e=1747908000&v=beta&t=PSfKG2DlJDu0n0KIcyJwsVyAAC5vRdXgcA-0dzxfIvY" alt="Dexter Dykes Timothy" />
            <AvatarFallback>DT</AvatarFallback>
          </Avatar>
          <h1 className="text-4xl font-bold tracking-tight">Dexter Dykes Timothy</h1>
          <p className="text-lg text-muted-foreground">Computer Science Nerd | Passionate Software Engineer</p>
          <Button className="mt-4 px-8 py-6 text-lg flex items-center gap-2" asChild>
            <a href="#contact">
              Contact Me
              <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen w-full flex items-center justify-center">
        <div ref={(el) => { sectionsRef.current[1] = el }} className="section-content w-full max-w-2xl text-center px-4">
          <h2 className="text-2xl font-semibold mb-4">About Me</h2>
          <p className="text-muted-foreground text-base">
          I&apos;m a Software Engineer passionate about building innovative web and mobile applications. I enjoy solving complex problems through technology and have experience with C++, Java, PHP, and Kotlin. I focus on creating user-centric, efficient solutions and thrive in dynamic, forward-thinking teams.
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="min-h-screen w-full flex items-center justify-center">
        <div ref={(el) => { sectionsRef.current[2] = el }} className="section-content w-full max-w-4xl px-4">
          <h2 className="text-2xl font-semibold mb-8 text-center">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Sabah Holiday Fetcher",
                description: "A simple API that provides public holiday data for Malaysia (Sabah) in JSON format.",
                link: "https://github.com/DyDxdYdX/sabah-public-holiday-fetcher"
              },
              {
                title: "Shophawk",
                description: "An e-commerce platform that helps users discover and compare prices across different online stores.",
                link: "https://github.com/DyDxdYdX/shophawk"
              },
              {
                title: "Ongoing Projects",
                description: "And more projects coming soon!",
                link: "https://github.com/DyDxdYdX?tab=repositories"
              }
            ].map((project) => (
              <Card key={project.title} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <Button variant="outline" asChild>
                    <a href={project.link} target="_blank" rel="noopener noreferrer">View Project</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen w-full flex items-center justify-center">
        <div ref={(el) => { sectionsRef.current[3] = el }} className="section-content w-full max-w-2xl text-center px-4">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground mb-6">Feel free to reach out for collaborations or just a friendly hello!</p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" asChild className="flex items-center gap-2">
              <a href="mailto:dydxsoft@gmail.com">
                <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" />
                Email
              </a>
            </Button>
            <Button variant="outline" asChild className="flex items-center gap-2">
              <a href="https://github.com/DyDxdYdX" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faGithub} className="w-4 h-4" />
                GitHub
              </a>
            </Button>
            <Button variant="outline" asChild className="flex items-center gap-2">
              <a href="https://www.linkedin.com/in/dykesdexter" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedin} className="w-4 h-4" />
                LinkedIn
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <a href="https://github.com/DyDxdYdX" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <FontAwesomeIcon icon={faGithub} className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/dykesdexter" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <FontAwesomeIcon icon={faLinkedin} className="w-5 h-5" />
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
