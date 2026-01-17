// src/components/FeaturedWork.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import { projectsList } from "../data/project";
import ProjectCard from "./ProjectCard";
import "./FeaturedWork.css";

gsap.registerPlugin(ScrollTrigger);

const FeaturedWork = () => {
  const sectionRef = useRef(null);
  const titleLineRef = useRef(null);
  const navigate = useNavigate();
  const hoverSoundRef = useRef(null);
  const lastHoverRef = useRef(0);

  useEffect(() => {
    hoverSoundRef.current = new Audio("/focus.mp3");
    hoverSoundRef.current.volume = 0.1;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".featured-header",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        titleLineRef.current,
        { yPercent: 300 },
        { yPercent: 0, duration: 1.2, ease: "power4.out" }
      );

      gsap.from(".section-subtitle", {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 0.4,
        scrollTrigger: { trigger: ".featured-header", start: "top 80%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const goProject = (id) => {
    // ✅ 关键：导航前先停 Lenis 惯性（解决“快速滑+立刻点”必闪）
    try {
      if (window.lenis) {
        window.lenis.stop(); // 立刻停掉惯性
        // 这里不要 scrollTo(0)，否则你会看到页面突然回到顶再跳转
      }
    } catch (e) {}

    navigate(`/projects/${id}`);
  };

  const handleCardHover = () => {
    if (!window.soundEnabled) return;
    const now = performance.now();
    if (now - lastHoverRef.current < 300) return;
    lastHoverRef.current = now;

    if (hoverSoundRef.current) {
      hoverSoundRef.current.currentTime = 0;
      hoverSoundRef.current.play().catch(() => {});
    }
  };

  return (
    <section id="featured-work" ref={sectionRef} className="featured-work">
      <div className="featured-header">
        <div className="featured-title-mask">
          <div ref={titleLineRef} className="featured-line-inner">
            <span className="featured-text-unit">Featured</span>
            <span className="featured-text-unit">Work</span>
          </div>
        </div>
        <p className="section-subtitle">
          A SELECTION OF OUR MOST PASSIONATELY CRAFTED WORKS WITH FORWARD-THINKING
          CLIENTS AND FRIENDS OVER THE YEARS.
        </p>
      </div>

      <div className="projects-grid">
        {projectsList.map((project, index) => (
          <div
            key={index}
            className="project-card-wrapper"
            role="button"
            tabIndex={0}
            onClick={() => goProject(project.id)}
            onKeyDown={(e) => e.key === "Enter" && goProject(project.id)}
            onMouseEnter={handleCardHover}
            style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
          >
            <ProjectCard
              title={project.title}
              tags={project.services}
              image={project.image}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedWork;
