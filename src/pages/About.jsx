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

      // 右侧图片和卡片滚动进入效果已移除（避免滚动动效）
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
    "/Experience 1.jpg",
    "/Experience 2.jpg",
    "/Experience 3.jpg",
    null
  ];

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [activeTab]);

  const educationItems = [
    {
      title: "The University of Sydney | Master",
      period: "07/2024 - 06/2026 (Expected)",
      detail: "Interaction Design and Electronic Arts (Audio and Acoustic) | WAM: 80",
      points: [
        "Courses: Design Thinking, Interface Design, Strategy Design, Audio Design, Designing for the Digital Revolution"
      ]
    },
    {
      title: "Shenzhen Technology University | Bachelor",
      period: "09/2019 - 06/2023",
      detail: "Industrial Design (Interaction Design) | WAM: 87 (Top 1%)",
      points: [
        "Courses: User Research, UX Design, Visual Icons Design, 3D Modeling, Front-end Development, Data Visualization"
      ]
    }
  ];

  const skillsItems = [
    "Visual & Graphic Design: Layout Design, Typography, Brand Consistency, Marketing Visuals, Digital Advertising Assets",
    "Design Tools: Figma, Photoshop, Illustrator, Premiere Pro, After Effects, Blender, Unity, Reaper, SolidWorks",
    "AI-Driven Design: Vibe coding, AI video clip",
    "Languages: English (Professional), Mandarin (Native), Cantonese (Native)"
  ];

  const honorsItems = [
    {
      title: "First Prize, CADA Japan Conceptual Art Design Competition",
      period: "2022"
    },
    {
      title: "Bronze Award, 6th International Environmental Protection Public Welfare Competition",
      period: "2022"
    },
    {
      title: "Utility Model Patent, National Intellectual Property Administration of China",
      period: "2021"
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
                <span className="label">AVAILABLE</span>
                <span className="value">Immediate / Open to Opportunities</span>
              </div>
              <div className="meta-row about-entry-reveal">
                <span className="label">ROLE</span>
                <span className="value">UX &amp; Graphic Designer</span>
              </div>
              <div className="meta-row about-entry-reveal">
                <span className="label">LOCATION</span>
                <span className="value">Sydney</span>
              </div>
            </div>

            <div className="atlas-description about-entry-reveal">
              <p>Designing clear and engaging digital experiences through visual communication, collaborative thinking, and creative problem solving.</p>
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
                  const mediaSrc = mediaSources[index] ?? null;

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

                      {mediaSrc && (
                        <section className="atlas-hero-media reveal-item about-entry-float">
                          <div className="media-placeholder">
                            <img src={mediaSrc} alt={`Experience ${index + 1}`} />
                          </div>
                        </section>
                      )}
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
