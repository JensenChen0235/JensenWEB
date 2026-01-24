import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "../components/Header/Header";
import { experiences } from "../data/experience"; 
import "./About.css";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const [accentColor, setAccentColor] = useState("#0047ff");
  const [activeTab, setActiveTab] = useState("experience");

  useEffect(() => {
    // 允许页面垂直滚动
    document.body.style.backgroundColor = "#000";
    document.body.style.overflowY = "auto";
    document.body.style.overflowX = "hidden";

    let ctx = gsap.context(() => {
      // 页面入场：纯黑底遮罩 + 每个模块自底部浮现
      const entryTargets = gsap.utils.toArray(".about-entry-reveal");
      const entryFloatTargets = gsap.utils.toArray(".about-entry-float");
      const entryTl = gsap.timeline();
      entryTl
        .set(".about-entry-overlay", { autoAlpha: 1 })
        .set(entryTargets, { clipPath: "inset(100% 0 0 0)", y: 40, opacity: 0 })
        .set(entryFloatTargets, { y: 50, opacity: 0 })
        .to(".about-entry-overlay", { autoAlpha: 0, duration: 0.6, ease: "power2.out" })
        .to(entryTargets, {
          clipPath: "inset(0% 0 0 0)",
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.08
        }, "-=0.15");
      if (entryFloatTargets.length) {
        entryTl.fromTo(entryFloatTargets,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.06 },
          "-=0.2"
        );
      }

      // 右侧图片和卡片滚动进入效果
      const fadeElements = gsap.utils.toArray(".reveal-item");
      fadeElements.forEach((el) => {
        gsap.fromTo(el, 
          { opacity: 0, y: 100 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true,
              toggleActions: "play none none none",
              scroller: ".tab-panel"
            }
          }
        );
      });
    });

    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.overflowY = "";
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (window.hero3dColor) setAccentColor(window.hero3dColor);
    const handleColor = (event) => {
      if (event?.detail) {
        window.hero3dColor = event.detail;
        setAccentColor(event.detail);
      }
    };
    window.addEventListener("hero3d-color", handleColor);
    return () => window.removeEventListener("hero3d-color", handleColor);
  }, []);

  const mediaSources = [
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=1600&q=80"
  ];

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [activeTab]);

  const educationItems = [
    {
      title: "The University of Sydney | Master",
      period: "2024.7 - 2026.6 (Expected)",
      detail: "Interaction Design and Electronic Arts (Audio and Acoustic) | WAM: 80",
      points: [
        "Coursework: Design Thinking, Interface Design, Strategy Design, Audio Design, Designing for the Digital Revolution"
      ]
    },
    {
      title: "Shenzhen University | Bachelor",
      period: "2019.6 - 2023.6",
      detail: "Industrial Design (Interaction Design) | WAM: 87 (Top 1%)",
      points: [
        "Coursework: User Research, UX Design, 3D Modeling, Ergonomics, Front-end Development, Data Visualization"
      ]
    }
  ];

  const skillsItems = [
    "User Research: Competitive Analysis, Affinity Mapping, Journey Map, Persona, Maslow's Hierarchy of Needs",
    "Design Process: UX Design (Figma), Motion Design (AE), Sound Design (Reaper + Wwise), 3D Modeling (Blender)",
    "User Evaluation: Usability Testing, SUS / AQS / NPS Analysis",
    "AI-Driven Design: AI Agent Flow (Coze), Sora Prompting",
    "Languages: English (IELTS 7.0), Mandarin / Cantonese / Hakka (Native), German (Beginner)"
  ];

  const honorsItems = [
    {
      title: "First Prize, CADA Japan Conceptual Art Design Competition",
      period: "2022"
    },
    {
      title: "Bronze Award, 6th International Environmental Protection Public Welfare Competition",
      period: "2022"
    }
  ];

  return (
    <div className="atlas-container" style={{ "--about-accent": accentColor }}>
      <div className="about-entry-overlay" aria-hidden="true" />
      <Header />
      <div className="atlas-content-wrapper">
        
        {/* --- 左侧固定栏 (Fixed) --- */}
        <aside className="atlas-left-col">
          <div className="sticky-inner">
            <div className="atlas-photo-frame about-entry-reveal">
              <img src="/Jensen01.png" alt="Jensen portrait" />
            </div>
            
            <div className="atlas-metadata">
              <div className="meta-row about-entry-reveal">
                <span className="label">YEAR</span>
                <span className="value">2023 - 2025</span>
              </div>
              <div className="meta-row about-entry-reveal">
                <span className="label">ROLE</span>
                <span className="value">DESIGN &<br/>DEVELOPMENT</span>
              </div>
              <div className="meta-row about-entry-reveal">
                <span className="label">LOCATION</span>
                <span className="value">SYDNEY / SZ</span>
              </div>
            </div>

            <div className="atlas-description about-entry-reveal">
              <p>Designing digital experiences through the lens of creative technology and interaction arts.</p>
            </div>
          </div>
        </aside>

        {/* --- 右侧滚动栏 (Scroll) --- */}
        <main className="atlas-right-col">
          <div className="atlas-tabs">
            {[
              { key: "experience", label: "Experience" },
              { key: "education", label: "Education" },
              { key: "skills", label: "Skills & Tools" },
              { key: "honors", label: "Honors & Awards" }
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`atlas-tab ${activeTab === tab.key ? "is-active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="tab-panel" key={activeTab}>
            {activeTab === "experience" && (
              <>
                {experiences.map((exp, index) => {
                  const mediaSrc = mediaSources[index % mediaSources.length];

                  return (
                    <React.Fragment key={`${exp.title}-${index}`}>
                      <section className="atlas-section">
                  {index === 0 && (
                    <h2 className="section-label about-entry-reveal sr-only">Experience</h2>
                  )}
                        <div className="experience-stack">
                          <div className="atlas-exp-card reveal-item about-entry-reveal">
                            <div className="card-header">
                              <span className="card-type">[{exp.type}]</span>
                              <span className="card-date">{exp.period}</span>
                            </div>
                            <h3 className="card-title">{exp.title}</h3>
                            <p className="card-company">{exp.company}</p>
                            <ul className="card-points">
                              {exp.points.map((p, i) => <li key={i}>{p}</li>)}
                            </ul>
                          </div>
                        </div>
                      </section>

                      <section className="atlas-hero-media reveal-item about-entry-float">
                        <div className="media-placeholder">
                          <img src={mediaSrc} alt={`Experience ${index + 1}`} />
                        </div>
                      </section>
                    </React.Fragment>
                  );
                })}
              </>
            )}

            {activeTab === "education" && (
              <>
                <section className="atlas-section">
                  <h2 className="section-label about-entry-reveal sr-only">Education</h2>
                  <div className="experience-stack">
                    {educationItems.map((item, index) => (
                      <div key={index} className="atlas-exp-card reveal-item about-entry-reveal">
                        <div className="card-header">
                          <span className="card-type">[EDU]</span>
                          <span className="card-date">{item.period}</span>
                        </div>
                        <h3 className="card-title">{item.title}</h3>
                        <p className="card-company">{item.detail}</p>
                        <ul className="card-points">
                          {item.points.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {activeTab === "skills" && (
              <>
                <section className="atlas-section">
                  <h2 className="section-label about-entry-reveal sr-only">Skills & Tools</h2>
                  <div className="experience-stack">
                    <div className="atlas-exp-card reveal-item about-entry-reveal">
                      <div className="card-header">
                        <span className="card-type">[SKILLS]</span>
                        <span className="card-date">Updated</span>
                      </div>
                      <h3 className="card-title">Capabilities</h3>
                      <ul className="card-points">
                        {skillsItems.map((item, index) => <li key={index}>{item}</li>)}
                      </ul>
                    </div>
                  </div>
                </section>
              </>
            )}

            {activeTab === "honors" && (
              <>
                <section className="atlas-section">
                  <h2 className="section-label about-entry-reveal sr-only">Honors & Awards</h2>
                  <div className="experience-stack">
                    {honorsItems.map((item, index) => (
                      <div key={index} className="atlas-exp-card reveal-item about-entry-reveal">
                        <div className="card-header">
                          <span className="card-type">[AWARD]</span>
                          <span className="card-date">{item.period}</span>
                        </div>
                        <h3 className="card-title">{item.title}</h3>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </main>

      </div>
    </div>
  );
};

export default About;
