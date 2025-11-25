import { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import { useHybridStore } from '../../stores/hybridStore'
import './PortfolioScene.css'

// Animated particle background for Three.js
function AnimatedStars() {
  const starsRef = useRef<any>(null)

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.x = state.clock.elapsedTime * 0.01
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <Stars
      ref={starsRef}
      radius={100}
      depth={50}
      count={5000}
      factor={4}
      saturation={0}
      fade
      speed={1}
    />
  )
}

export function PortfolioScene() {
  const { setSceneMode } = useHybridStore()
  const [activeSection, setActiveSection] = useState<'about' | 'projects' | 'skills' | 'contact'>('about')

  const handleBackClick = () => {
    setSceneMode('galaxy')
  }

  const scrollToSection = (section: 'about' | 'projects' | 'skills' | 'contact') => {
    setActiveSection(section)
    const element = document.getElementById(section)
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="portfolio-scene">
      {/* 3D Background */}
      <div className="portfolio-background">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <AnimatedStars />
          <ambientLight intensity={0.5} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Navigation Header */}
      <header className="portfolio-header">
        <button className="back-button" onClick={handleBackClick}>
          ← Back to Galaxy
        </button>
        <nav className="portfolio-nav">
          <button
            className={activeSection === 'about' ? 'active' : ''}
            onClick={() => scrollToSection('about')}
          >
            About
          </button>
          <button
            className={activeSection === 'projects' ? 'active' : ''}
            onClick={() => scrollToSection('projects')}
          >
            Projects
          </button>
          <button
            className={activeSection === 'skills' ? 'active' : ''}
            onClick={() => scrollToSection('skills')}
          >
            Skills
          </button>
          <button
            className={activeSection === 'contact' ? 'active' : ''}
            onClick={() => scrollToSection('contact')}
          >
            Contact
          </button>
        </nav>
      </header>

      {/* Portfolio Content */}
      <div className="portfolio-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="glitch" data-text="Glitchwii888">Glitchwii888</h1>
            <p className="subtitle">Full Stack Developer | 3D Web Specialist | Creative Technologist</p>
            <div className="hero-cta">
              <button onClick={() => scrollToSection('projects')} className="cta-button primary">
                View My Work
              </button>
              <button onClick={() => scrollToSection('contact')} className="cta-button secondary">
                Get In Touch
              </button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="portfolio-section">
          <div className="section-content">
            <h2 className="section-title">About Me</h2>
            <div className="about-grid">
              <div className="about-text">
                <p>
                  I'm a passionate developer specializing in creating immersive web experiences
                  that blend cutting-edge technology with creative design. With expertise in
                  React, Three.js, and modern web frameworks, I build applications that push
                  the boundaries of what's possible on the web.
                </p>
                <p>
                  My journey in software development has been driven by curiosity and a love
                  for learning. I believe in writing clean, maintainable code and creating
                  experiences that delight users.
                </p>
              </div>
              <div className="about-stats">
                <div className="stat-card">
                  <h3>5+</h3>
                  <p>Years Experience</p>
                </div>
                <div className="stat-card">
                  <h3>50+</h3>
                  <p>Projects Completed</p>
                </div>
                <div className="stat-card">
                  <h3>100%</h3>
                  <p>Client Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="portfolio-section">
          <div className="section-content">
            <h2 className="section-title">Featured Projects</h2>
            <div className="projects-grid">
              <div className="project-card">
                <div className="project-image">
                  <div className="placeholder-image">3D Galaxy Viewer</div>
                </div>
                <div className="project-info">
                  <h3>3D Galaxy Visualization</h3>
                  <p>An interactive 3D galaxy built with React Three Fiber, featuring real-time controls and stunning visual effects.</p>
                  <div className="project-tags">
                    <span>React</span>
                    <span>Three.js</span>
                    <span>WebGL</span>
                  </div>
                </div>
              </div>

              <div className="project-card">
                <div className="project-image">
                  <div className="placeholder-image">Web Platform</div>
                </div>
                <div className="project-info">
                  <h3>E-Commerce Platform</h3>
                  <p>A full-stack e-commerce solution with payment integration, inventory management, and responsive design.</p>
                  <div className="project-tags">
                    <span>Next.js</span>
                    <span>Node.js</span>
                    <span>PostgreSQL</span>
                  </div>
                </div>
              </div>

              <div className="project-card">
                <div className="project-image">
                  <div className="placeholder-image">Mobile App</div>
                </div>
                <div className="project-info">
                  <h3>Real-Time Chat Application</h3>
                  <p>A WebSocket-powered chat app with end-to-end encryption and multimedia support.</p>
                  <div className="project-tags">
                    <span>React</span>
                    <span>Socket.io</span>
                    <span>MongoDB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="portfolio-section">
          <div className="section-content">
            <h2 className="section-title">Skills & Technologies</h2>
            <div className="skills-grid">
              <div className="skill-category">
                <h3>Frontend</h3>
                <div className="skill-list">
                  <div className="skill-item">
                    <span>React / Next.js</span>
                    <div className="skill-bar"><div className="skill-progress" style={{ width: '90%' }}></div></div>
                  </div>
                  <div className="skill-item">
                    <span>TypeScript</span>
                    <div className="skill-bar"><div className="skill-progress" style={{ width: '85%' }}></div></div>
                  </div>
                  <div className="skill-item">
                    <span>Three.js / WebGL</span>
                    <div className="skill-bar"><div className="skill-progress" style={{ width: '80%' }}></div></div>
                  </div>
                  <div className="skill-item">
                    <span>CSS / Tailwind</span>
                    <div className="skill-bar"><div className="skill-progress" style={{ width: '88%' }}></div></div>
                  </div>
                </div>
              </div>

              <div className="skill-category">
                <h3>Backend</h3>
                <div className="skill-list">
                  <div className="skill-item">
                    <span>Node.js / Express</span>
                    <div className="skill-bar"><div className="skill-progress" style={{ width: '85%' }}></div></div>
                  </div>
                  <div className="skill-item">
                    <span>Python / Django</span>
                    <div className="skill-bar"><div className="skill-progress" style={{ width: '75%' }}></div></div>
                  </div>
                  <div className="skill-item">
                    <span>PostgreSQL / MongoDB</span>
                    <div className="skill-bar"><div className="skill-progress" style={{ width: '82%' }}></div></div>
                  </div>
                  <div className="skill-item">
                    <span>REST / GraphQL</span>
                    <div className="skill-bar"><div className="skill-progress" style={{ width: '80%' }}></div></div>
                  </div>
                </div>
              </div>

              <div className="skill-category">
                <h3>Tools & DevOps</h3>
                <div className="skill-list">
                  <div className="skill-item">
                    <span>Git / GitHub</span>
                    <div className="skill-bar"><div className="skill-progress" style={{ width: '90%' }}></div></div>
                  </div>
                  <div className="skill-item">
                    <span>Docker / K8s</span>
                    <div className="skill-bar"><div className="skill-progress" style={{ width: '70%' }}></div></div>
                  </div>
                  <div className="skill-item">
                    <span>AWS / Vercel</span>
                    <div className="skill-bar"><div className="skill-progress" style={{ width: '78%' }}></div></div>
                  </div>
                  <div className="skill-item">
                    <span>CI/CD</span>
                    <div className="skill-bar"><div className="skill-progress" style={{ width: '75%' }}></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="portfolio-section">
          <div className="section-content">
            <h2 className="section-title">Get In Touch</h2>
            <div className="contact-content">
              <div className="contact-text">
                <p>
                  I'm always interested in hearing about new projects and opportunities.
                  Whether you have a question or just want to say hi, feel free to reach out!
                </p>
              </div>
              <div className="contact-links">
                <a href="mailto:your.email@example.com" className="contact-link">
                  <span className="icon">✉</span>
                  <span>your.email@example.com</span>
                </a>
                <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="contact-link">
                  <span className="icon">🔗</span>
                  <span>GitHub</span>
                </a>
                <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="contact-link">
                  <span className="icon">💼</span>
                  <span>LinkedIn</span>
                </a>
                <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="contact-link">
                  <span className="icon">🐦</span>
                  <span>Twitter</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="portfolio-footer">
          <p>&copy; 2025 Your Name. Built with React, Three.js, and passion.</p>
        </footer>
      </div>
    </div>
  )
}
