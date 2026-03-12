import notificationLottie from "./lottie/notification.json";
import swipeUpLottie from "./lottie/swipe-up.json";

/**
 * 项目全局数据配置文件
 */
const makeMediaPlaceholder = (label) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="720" viewBox="0 0 960 720">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#f4f5f8"/>
          <stop offset="100%" stop-color="#e6e8ef"/>
        </linearGradient>
      </defs>
      <rect width="960" height="720" rx="32" fill="url(#bg)"/>
      <rect x="70" y="70" width="820" height="580" rx="24" fill="#ffffff" stroke="#d7d9e2"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="42" fill="#8a8fa3" letter-spacing="4">${label}</text>
    </svg>`
  )}`;
const makeBlankPlaceholder = () =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
      <rect width="1600" height="1000" rx="24" fill="#eef1f5"/>
    </svg>`
  )}`;
const makeSquarePlaceholder = (label) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
      <rect width="800" height="800" rx="16" fill="#e9ecf2"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="36" fill="#9aa1b2" letter-spacing="2">${label}</text>
    </svg>`
  )}`;
const makeDarkPlaceholder = () =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#090a0d"/>
          <stop offset="55%" stop-color="#0b1a2b"/>
          <stop offset="100%" stop-color="#0f0f12"/>
        </linearGradient>
      </defs>
      <rect width="1600" height="1000" rx="32" fill="url(#bg)"/>
      <rect x="120" y="120" width="1360" height="760" rx="28" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
      <circle cx="320" cy="360" r="2" fill="rgba(255,255,255,0.5)"/>
      <circle cx="520" cy="240" r="2" fill="rgba(255,255,255,0.35)"/>
      <circle cx="980" cy="420" r="2" fill="rgba(255,255,255,0.4)"/>
      <circle cx="1200" cy="280" r="2" fill="rgba(255,255,255,0.3)"/>
    </svg>`
  )}`;
const GRAY_CARD_PLACEHOLDER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='800' height='600' fill='%2326282C'/></svg>";
const GRAY_LAYOUT_PLACEHOLDER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1440' height='832'><rect width='1440' height='832' fill='%2326282C'/></svg>";
const GRAY_SQUARE_PLACEHOLDER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'><rect width='800' height='800' fill='%2326282C'/></svg>";
const GRAY_PHONE_PLACEHOLDER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='900' height='1600'><rect width='900' height='1600' fill='%2326282C'/></svg>";

export const projectsData = {
  "terabox-webmaster-center": {
    id: "terabox-webmaster-center",
    title: "Terabox: Webmaster Center",
    color: "#000000",
    hoverColor: "#026DF9",
    hoverGradient: "#026DF9",
    accentColor: "#CF30AA",
    accentAlt: "#402FB5",
    textColor: "#F5F5F7",
    textMuted: "rgba(245, 245, 247, 0.7)",
    textSubtle: "rgba(245, 245, 247, 0.5)",
    panelColor: "rgba(255, 255, 255, 0.06)",
    panelBorder: "rgba(255, 255, 255, 0.12)",
    surfaceColor: "rgba(12, 12, 12, 1)",
    buttonBg: "#F5F5F7",
    buttonText: "#000000",
    nextBg: "#000000",
    nextText: "#F5F5F7",
    nextSubtle: "rgba(245, 245, 247, 0.5)",
    noShadow: true,
    description: "Terabox is a cloud storage and content distribution platform.The Webmaster Center supports webmasters in growth-related activities. This project focuses on the Plan tab, a key entry point for earning and growth actions.",
    services: ["UX", "WEB Design", "Mobile Design"],
    image: "/1.png",
    launchUrl: "https://www.terabox.com/webmaster/new/plan-overview",
    inProgressNotice: "This page is still in progress.",
    layout: "terabox",
    sections: [
      {
        type: "tb-media",
        tone: "dark",
        index: "01",
        title: "What Was Built",
        description: "",
        centerText: true,
        showLaunch: true,
        video: {
          src: "/Terabox/plan-demo.mov",
          poster: "/Terabox5.png",
          offset: {
            top: 5.211,
            left: 11.962
          },
          size: {
            width: 76.453,
            height: 81.228
          }
        }
      },
      {
        type: "tb-layout-started",
        tone: "dark",
        title: "Where It Started",
        first: {
          subtitle: "Aligned from the Start",
          description:
            "This project began with cross-functional alignment across Product, Design, User Research, and Engineering teams. Under mentor guidance, I followed these discussions and contributed to a defined design scope, translating shared goals into actionable design work.",
          cards: [
            {
              title: "Product Manager",
              image: "/Terabox/01Product Manager.png",
              video: "/Terabox/01.mp4",
              description: "• Defined growth priorities • Aligned cross-functional teams • Set success metrics and goals"
            },
            {
              title: "User Researcher",
              image: "/Terabox/02User Researcher.png",
              video: "/Terabox/02.mp4",
              description: "• Provided user insights • Validated design decisions • Conducted usability testing"
            },
            {
              title: "UX Designer (My Role)",
              image: "/Terabox/03UX Designer.png",
              video: "/Terabox/03.mp4",
              description: "• Translated insights into design • Designed wireframes"
            },
            {
              title: "Software Engineer",
              image: "/Terabox/04Software Engineer.png",
              video: "/Terabox/04.mp4",
              description: "• Iterated during development • Ensured technical feasibility • Collaborated on iterations"
            }
          ]
        },
        second: {
          subtitle: "Workflow Overview",
          image: "/Terabox/Workflow Overview.png"
        }
      },
      {
        type: "tb-layout-audience",
        tone: "dark",
        title: "Who We Were Designing For",
        first: {
          cards: [
            {
              cardLabel: "Persona 01",
              infoHeading: "New User",
              portrait: "/Terabox/Persona1.png",
              contextText:
                "This group represents growth potential driven by referrals from experienced webmasters.\nTheir success depends on how quickly they can understand what to do next.",
              implicationText:
                "The redesigned interface shifts toward action-driven guidance, prioritizing clear tasks and next steps to reduce early learning cost and encourage participation.",
              needsHeading: "NEEDS",
              needs: [
                "Clear guidance on first actions",
                "Immediate feedback to reinforce engagement",
                "Action-oriented cues over dense data"
              ]
            },
            {
              cardLabel: "Persona 02",
              infoHeading: "Experienced User",
              portrait: "/Terabox/Persona2.png",
              contextText:
                "This group consists of early adopters who helped establish market presence.\nThey are already familiar with sharing workflows and monetization logic.",
              implicationText:
                "The previous interface emphasized earnings visibility and performance data, supporting efficient monitoring with minimal behavioral guidance.",
              needsHeading: "NEEDS",
              needs: [
                "Quick access to earnings and performance metrics",
                "Clear revenue breakdown and historical data",
                "Efficient overview without interruption"
              ]
            }
          ]
        },
        second: null
      },
      {
        type: "tb-layout-needs",
        tone: "dark",
        title: "Redefining What Matters",
        first: {
          subtitle: "What We Observed",
          description:
            "The analysis revealed a mismatch between user needs and the existing information structure.\nWhile experienced users valued quick access to performance data, first-time users struggled to identify meaningful actions within a data-heavy layout.",
          cards: []
        },
        second: {
          subtitle: "The Trade-Off",
          description:
            "Not all information carries equal value at every stage of the user journey.\nPrioritising data visibility came at the cost of behavioural clarity for new users."
        },
        third: {
          subtitle: "What We Prioritised",
          description:
            "To support growth goals, the experience was restructured to prioritise actions that lead to engagement.\nKey actions were surfaced earlier, while supporting data was progressively revealed as users became more familiar with the system."
        }
      },
      {
        type: "tb-layout-final",
        tone: "dark",
        title: "Layout Design",
        first: {
          subtitle: "Big Screen, Small content",
          description:
            "Dear TeraBox User, welcome to the Webmaster Center. Here, you can check the history of your share links and the rewards you have earned.",
          cards: [
            {
              image: "/Terabox/OLayout1.png",
              label: "check the history",
              status: "x"
            },
            {
              image: "/Terabox/OLayout2.png",
              label: "check the history",
              status: "x"
            },
            {
              image: "/Terabox/OLayout3.png",
              label: "check the history",
              status: "check"
            }
          ]
        },
        second: {
          subtitle: "Simplified ways of layout",
          image: "/Terabox/OLayout4.svg"
        }
      },
      {
        type: "tb-layout-iterate",
        tone: "dark",
        title: "Iterating Through Development",
        steps: [
          {
            title: "Early Validation",
            description:
              "Low-fidelity wireframes were delivered early to support feasibility checks and accelerate development alignment.",
            placeholder: "Wireframe snapshot or flow map"
          },
          {
            title: "Iteration with Engineering",
            description:
              "During implementation, design decisions were refined based on technical constraints and feedback.",
            placeholder: "Dev handoff notes or interaction refinements",
            mediaType: "web-mobile"
          },
          {
            title: "Refinement in Hi-Fi",
            description:
              "High-fidelity UI was developed alongside engineering progress, enhancing clarity, hierarchy, and consistency.",
            placeholder: "Hi-fi screens or UI detail crop",
            mediaType: "phones"
          }
        ],
        quote:
          "The early wireframes helped clarify implementation scope and reduced rework during development.",
        placeholders: {
          wide: GRAY_LAYOUT_PLACEHOLDER,
          square: GRAY_SQUARE_PLACEHOLDER,
          phone: GRAY_PHONE_PLACEHOLDER
        }
      },
      {
        type: "tb-layout-final",
        tone: "dark",
        title: "Reflection & Impact",
        first: {
          subtitle: "Impact",
          description:
            "The interface evolved from a data-first structure to an action-first experience, better aligned with acquisition goals and first-time user needs."
        },
        second: {
          subtitle: "Reflection",
          description:
            "This project highlighted how strategy directly shapes information hierarchy.\nDesign decisions are rarely about removing elements, but about reframing what takes priority."
        }
      }
    ]
  },
  "netease-game-onmyoji": {
    id: "netease-game-onmyoji",
    title: "Netease Game: Onmyoji",
    color: "#000000",
    hoverColor: "#1a1a1a",
    disableSectionMotion: true,
    description: "Netease Game.",
    services: ["Game Design", "User Center design", "UI Design"],
    image: "/2.png",
    launchUrl: "#",
    sections: [
      { type: "full-bleed", image: "/Netease/1.png" },
      { type: "full-bleed", image: "/Netease/2.png" },
      { type: "full-bleed", image: "/Netease/3.png" },
      { type: "full-bleed", image: "/Netease/4.png" },
      { type: "full-bleed", image: "/Netease/5.png" },
      { type: "full-bleed", image: "/Netease/6.png" },
      { type: "full-bleed", image: "/Netease/7.png" },
      { type: "full-bleed", image: "/Netease/8.png" },
      { type: "full-bleed", image: "/Netease/9.png" },
      { type: "full-bleed", image: "/Netease/10.png" },
      { type: "full-bleed", image: "/Netease/11.png" }
    ]
  },
  "bilibili-live": {
    id: "bilibili-live",
    title: "Bilibili: Live",
    color: "#000000",
    hoverColor: "#074dff",
    disableSectionMotion: true,
    description: "Bilibili.",
    services: ["WEB", "DESIGN", "Commercial Design", "LIVE STREAMING"],
    image: "/3.png",
    launchUrl: "#",
    sections: [
      { type: "full-bleed", image: "/Bilibili/Bilibili_full.png" }
    ]
  },
  "ai-graphic-design": {
    id: "ai-graphic-design",
    title: "AI + Design",
    color: "#6FCFA6",
    hoverColor: "rgb(119, 49, 233)", // 浅紫色
    description: "Exploring the future of AI-generated design.",
    services: ["Graphic Design", "AI-driven Design", "Concept", "Imagination"],
    image: "/4.png",
    launchUrl: "#",
    inProgressNotice: "This page is still in progress.",
    sections: []
  },
  "motion-lab": {
    id: "motion-lab",
    title: "Motion Lab",
    color: "#4F6AFF",
    hoverColor: "rgb(255, 114, 37)", // 浅紫色
    description: "An experimental motion lab for UI systems, exploring kinetic patterns, interaction physics, and expressive component behaviors.",
    services: ["Motion", "Micro-Interactions","Coding"],
    image: "/5.png",
    launchUrl: "#",
    inProgressNotice: "This page is still in progress.",
    sections: [
      {
        type: "ui-waterfall",
        title: "Daily Practice",
        description: "A growing collection of motion design explorations — from UI micro-interactions to motion graphics studies.",
        items: [
          {
            id: "motion-dock",
            label: "NAV",
            title: "Motion Dock",
            description: "Focus cue for a primary entry or main action, ideal for home or hub areas.",
            longDescription: "Use case: primary navigation entry, key CTA, or main trigger area. Key focus: keep orbit timing steady, limit radius/count, and circle the primary button without blocking it; use transforms (translate/scale) rather than layout shifts so attention stays focused without stealing the stage.",
            variant: "lottie",
            lottieData: notificationLottie,
            accent: "#4F6AFF",
            accentSoft: "rgba(79, 106, 255, 0.25)",
            meta: { type: "Navigation", system: "Motion Lab", spec: "8s orbit loop" }
          },
          {
            id: "ticker-strip",
            label: "FEED",
            title: "Emoji",
            description: "Lightweight feedback and mood cue for feeds and lists.",
            longDescription: "Use case: likes, saves, micro confirmations, or state feedback. Key focus: keep in/out timings short with soft easing; limit scale to about 1.02–1.08, avoid frequent loops that distract, and provide a static fallback for reduced-motion users.",
            variant: "emoji",
            emoji: "🙂",
            accent: "#8B5CF6",
            accentSoft: "rgba(139, 92, 246, 0.2)",
            meta: { type: "Feed", system: "Motion Lab", spec: "6s ticker loop" }
          },
          {
            id: "magnetic-tags",
            label: "FILTER",
            title: "Magnetic Tags",
            description: "Depth cue for filters or tag groups to emphasize the primary option.",
            longDescription: "Use case: filter bars, tag groups, or layered option stacks. Key focus: keep perspective consistent and the depth spacing small but stable; use subtle translation/tilt to avoid dizziness or text occlusion, preserving readability and hierarchy.",
            variant: "three-d",
            accent: "#F472B6",
            accentSoft: "rgba(244, 114, 182, 0.2)",
            meta: { type: "Depth", system: "Motion Lab", spec: "6s 3D loop" }
          },
          {
            id: "waveform-stream",
            label: "GESTURE",
            title: "Swipe Up",
            description: "Gesture cue for swipe-up or advancing to the next layer.",
            longDescription: "Use case: hero hints, “see more,” or swipe-up to detail. Key focus: keep the path clear (upward arc or straight line), pace it fast-to-slow with a pause; avoid dense looping to reduce anxiety, and match the real gesture direction.",
            variant: "lottie",
            lottieData: swipeUpLottie,
            accent: "#34D399",
            accentSoft: "rgba(52, 211, 153, 0.25)",
            meta: { type: "Data", system: "Motion Lab", spec: "1.4s wave loop" }
          }
        ]
      }
    ]
  },
  "sound-design": {
    id: "sound-design",
    title: "Sungrow: Marketing Visual Design",
    color: "#000000",
    hoverColor: "#000000", 
    description: "Marketing visual system for Sungrow, covering campaign visuals, video direction, and brand-ready graphics.",
    services: ["Marketing Visual", "Videos", "Graphic Design"],
    image: "/6.png",
    launchUrl: "#",
    inProgressNotice: "This page is still in progress.",
    sections: [
      {
        type: "sungrow-overview",
        title: "Visual Design in Marketing",
        kicker: "Hypothetical Strategic Direction",
        heading: "Residential Energy Campaign Strategy",
        body: [
          "Australia presents a strong environment for residential renewable energy adoption. With abundant sunlight and a large proportion of standalone homes, homeowners are well positioned to benefit from integrated solar power, energy storage, and EV charging systems.",
          "Based on this context, it is reasonable to assume that companies like Sungrow Power Supply Co., Ltd. will continue expanding their presence in the residential energy market through increased brand communication and user acquisition efforts.",
          "To support this opportunity, a coordinated visual communication approach is essential across multiple marketing touchpoints. These may include event visuals, exhibition posters, brochures, and short-form marketing videos."
        ],
        fontFamily: "Montserrat",
        fontWeights: ["Light", "Regular", "Medium", "Semibold", "Bold"],
        colorSystem: [
          { name: "#FF7900", value: "#FF7900" },
          { name: "#FF970E", value: "#FF970E" },
          { name: "#222222", value: "#222222" },
          { name: "#949494", value: "#949494" }
        ]
      },
      {
        type: "sungrow-poster",
        image: "/Sungrow/sungrow1.png",
        title: "Sungrow flow into every house",
        location: "SYDNEY",
        footerLeft: "Innovation | reliability | efficiency | support",
        footerCenter: "www.sungrowpower.com",
        footerRight: "Level 7, 1 Elizabeth Plaza, NSW 2060"
      },
      {
        type: "sungrow-compositing",
        title: "IMAGE COMPOSITING",
        items: [
          { image: "/Sungrow/sungrow2.png", label: "Image from website" },
          { image: "/Sungrow/sungrow3.png", label: "AIGC" },
          { image: "/Sungrow/sungrow4.png", label: "Text" }
        ]
      },
      {
        type: "sungrow-hero-image",
        image: "/Sungrow/sungrow1.png",
        topLeft: "EV Charging Solution",
        topCenter: "Efficient and Reliable\nClean Energy",
        topRight: "Sungrow\nPower Supply Co., Ltd.",
        title: "Your Key to True Energy Freedom",
        description: "Larger capacity and faster charging allow your home to achieve true energy freedom. An intelligent system manages the energy of your entire home, ensuring that power stays on anytime, all the time."
      },
      {
        type: "sungrow-brochure",
        title: "BROCHURE",
        caption: "Brochure Design",
        items: [
          { image: "/Sungrow/sungrow5.png", label: "Cover" },
          { image: "/Sungrow/sungrow6.png", label: "Spread 1" },
          { image: "/Sungrow/sungrow7.png", label: "Spread 2" },
          { image: "/Sungrow/sungrow8.png", label: "Detail" }
        ]
      },
      {
        type: "sungrow-duo",
        images: ["/Sungrow/sungrow9.png", "/Sungrow/sungrow10.png"]
      },
      {
        type: "sungrow-posters",
        title: "POSTERS",
        image: "/Sungrow/sungrow11.png"
      },
      {
        type: "sungrow-full",
        images: ["/Sungrow/sungrow12.png", "/Sungrow/sungrow13.png"]
      },
      {
        type: "sungrow-video",
        title: "VIDEO EDITING",
        src: "/Sungrow%20for%20tiktok.mp4"
      }
    ]
  },
  "mima-multi-arts-pavilion": {
    id: "mima-multi-arts-pavilion",
    title: "Mima: Multi-Arts Pavilion",
    color: "#FF9A85",
    hoverColor: "rgb(5, 145, 246)", // 浅紫色
    description: "Public installation and interactive experience design for Mima: Multi-Arts Pavilion, a cultural space dedicated to showcasing multidisciplinary art forms. The project focuses on creating an engaging digital layer that complements the physical exhibits, enhancing visitor interaction and immersion.",
    services: ["HCI", "Public Art", "3D"],
    image: "/7.png",
    launchUrl: "#",
    inProgressNotice: "This page is still in progress.",
    sections: []
  },
  "academic-poster": {
    id: "academic-poster",
    title: "Academic Poster",
    color: "#2b2b2b",
    hoverColor: "#3a3a3a",
    description: "Daily Poster designed for Academic.",
    services: ["Poster", "Layout design", "Academic"],
    image: "/8.png",
    launchUrl: "#",
    sections: [
      {
        type: "poster-wall",
        items: [
          { image: "/Academic%20Poster/City2Surf.png", title: "City2Surf" },
          { image: "/Academic%20Poster/City.png", title: "City" },
          { image: "/Academic%20Poster/FNC.png", title: "FNC" },
          { image: "/Academic%20Poster/Netflix.png", title: "Netflix" }
        ]
      }
    ]
  }
};

export const projectsList = Object.values(projectsData);
