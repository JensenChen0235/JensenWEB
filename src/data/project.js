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

export const projectsData = {
  "devin_ai": {
    id: "devin_ai",
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
    image: "/Terabox1.png",
    launchUrl: "https://www.terabox.com/webmaster/new/plan-overview",
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
          subtitle: "A sparse baseline",
          description:
            "We inherited a layout that was heavy on empty space and light on hierarchy. The core task existed, but it was visually buried and slow to scan.",
          cards: [
            {
              title: "Product Manager",
              image: "/Terabox/01Product Manager.png",
              video: "/Terabox/01.mp4",
              description: "Set product goals for next version"
            },
            {
              title: "User Researcher",
              image: "/Terabox/02User Researcher.png",
              video: "/Terabox/02.mp4",
              description: "Set product goals for next version"
            },
            {
              title: "UX Designer (My Role)",
              image: "/Terabox/03UX Designer.png",
              video: "/Terabox/03.mp4",
              description: "Set product goals for next version"
            },
            {
              title: "Software Engineer",
              image: "/Terabox/04Software Engineer.png",
              video: "/Terabox/04.mp4",
              description: "Set product goals for next version"
            }
          ]
        },
        second: {
          subtitle: "First-pass structure",
          image: GRAY_LAYOUT_PLACEHOLDER
        }
      },
      {
        type: "tb-layout-audience",
        tone: "dark",
        title: "Who We Were Designing For",
        first: {
          subtitle: "Creators and operators",
          description:
            "The primary users needed quick access to rewards, link history, and performance. The layout had to reduce hunting and make the next action obvious.",
          cards: [
            {
              image: GRAY_CARD_PLACEHOLDER,
              label: "primary tasks",
              status: "check"
            },
            {
              image: GRAY_CARD_PLACEHOLDER,
              label: "secondary tasks",
              status: "x"
            },
            {
              image: GRAY_CARD_PLACEHOLDER,
              label: "edge cases",
              status: "x"
            }
          ]
        },
        second: {
          subtitle: "Audience-first layout",
          image: GRAY_LAYOUT_PLACEHOLDER
        }
      },
      {
        type: "tb-layout-needs",
        tone: "dark",
        title: "What Users Needed Most",
        first: {
          subtitle: "Clarity over clutter",
          description:
            "Users prioritized status at a glance: totals, recent actions, and a single clear call-to-action. Everything else should support that flow, not compete with it.",
          cards: [
            {
              image: GRAY_CARD_PLACEHOLDER,
              label: "primary CTA",
              status: "check"
            },
            {
              image: GRAY_CARD_PLACEHOLDER,
              label: "quick stats",
              status: "check"
            },
            {
              image: GRAY_CARD_PLACEHOLDER,
              label: "low-priority",
              status: "x"
            }
          ]
        },
        second: {
          subtitle: "Priority-based layout",
          image: GRAY_LAYOUT_PLACEHOLDER
        }
      },
      {
        type: "tb-layout-structure",
        tone: "dark",
        title: "Understanding the Existing Structure",
        first: {
          subtitle: "Mapping the system",
          description:
            "We audited the old page to find repeating patterns and dead ends. This surfaced which regions could compress and which needed more space.",
          cards: [
            {
              image: GRAY_CARD_PLACEHOLDER,
              label: "modules",
              status: "check"
            },
            {
              image: GRAY_CARD_PLACEHOLDER,
              label: "unused space",
              status: "x"
            },
            {
              image: GRAY_CARD_PLACEHOLDER,
              label: "flow gaps",
              status: "x"
            }
          ]
        },
        second: {
          subtitle: "Structural refactor",
          image: GRAY_LAYOUT_PLACEHOLDER
        }
      },
      {
        type: "tb-layout-priorities",
        tone: "dark",
        title: "Prioritizing What Matters",
        first: {
          subtitle: "Clean focus lines",
          description:
            "We rebalanced the grid so the Program Overview anchors the left rail while the right side delivers action and data without visual noise.",
          cards: [
            {
              image: GRAY_CARD_PLACEHOLDER,
              label: "overview anchor",
              status: "check"
            },
            {
              image: GRAY_CARD_PLACEHOLDER,
              label: "action panel",
              status: "check"
            },
            {
              image: GRAY_CARD_PLACEHOLDER,
              label: "supporting data",
              status: "x"
            }
          ]
        },
        second: {
          subtitle: "Final hierarchy",
          image: GRAY_LAYOUT_PLACEHOLDER
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
      }
    ]
  },
  "porsche_dream_machine": {
    id: "porsche_dream_machine",
    title: "Porsche: Dream Machine",
    color: "#E07B6C",
    hoverColor: "rgb(98, 20, 34)", // 浅紫色
    description: "An immersive digital journey for Porsche, allowing users to interact with their dream configurations in a beautifully rendered 3D environment.",
    services: ["CONCEPT", "3D ILLUSTRATION", "MOGRAPH", "VIDEO"],
    image: "/2.png",
    launchUrl: "#",
    sections: [
      {
        type: "app",
        title: "A Personal Drive",
        description: "Mobile-first flows designed for fast configuration and effortless personalization on the go.",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80"
      },
      {
        type: "app",
        title: "Gesture-Led Control",
        description: "Natural touch gestures replace UI weight, turning complex decisions into simple, guided steps.",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
      },
      {
        type: "app",
        title: "Focused Detail Views",
        description: "Product details are layered with restraint, revealing depth without overwhelming the user.",
        image: "https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=1200&q=80"
      },
      {
        type: "app",
        title: "Handoff Across Devices",
        description: "Seamless continuity ensures the experience feels consistent from phone to larger screens.",
        image: "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80"
      },
      {
        type: "app",
        title: "Designed for the Moment",
        description: "Contextual surfaces adapt to user intent, keeping every action within reach.",
        image: "https://images.unsplash.com/photo-1512499617640-c2f999fe7f5a?auto=format&fit=crop&w=1200&q=80"
      }
    ]
  },
  "synthetic_human": {
    id: "synthetic_human",
    title: "Synthetic Human",
    color: "#9B8CFF",
    hoverColor: "rgb(202, 221, 255)", // 浅紫色
    description: "We developed a system in Houdini FX to optimize the high quality 3D assets and built the interactive front-end layer for this AI product launch.",
    services: ["WEB", "DESIGN", "DEVELOPMENT", "3D"],
    image: "/3.png",
    launchUrl: "#"
  },
  "meta_spatial_audio": {
    id: "meta_spatial_audio",
    title: "Meta: Spatial Fusion",
    color: "#6FCFA6",
    hoverColor: "rgb(119, 49, 233)", // 浅紫色
    description: "Exploring the future of sound with Meta. Interface and 3D integrations for an immersive spatial audio experiment.",
    services: ["WEB", "DESIGN", "DEVELOPMENT", "3D"],
    image: "/4.png",
    launchUrl: "#"
  },
  "spaace_nft": {
    id: "spaace_nft",
    title: "Motion Lab",
    color: "#4F6AFF",
    hoverColor: "rgb(255, 114, 37)", // 浅紫色
    description: "An experimental motion lab for UI systems, exploring kinetic patterns, interaction physics, and expressive component behaviors.",
    services: ["WEB", "DESIGN", "DEVELOPMENT", "3D", "WEB3"],
    image: "/5.png",
    launchUrl: "#",
    sections: [
      {
        type: "ui-waterfall",
        title: "Motion Components",
        description: "A three-column motion library of reusable UI interactions, each card looping a focused animation study.",
        items: [
          {
            id: "motion-dock",
            label: "NAV",
            title: "Motion Dock",
            description: "Orbital cues gather around a core action, highlighting the primary entry point.",
            longDescription: "A dock-style motion study that uses orbiting nodes to reinforce hierarchy and attract attention to the primary action.",
            variant: "lottie",
            lottieData: notificationLottie,
            accent: "#4F6AFF",
            accentSoft: "rgba(79, 106, 255, 0.25)",
            meta: { type: "Navigation", system: "Motion Lab", spec: "8s orbit loop" }
          },
          {
            id: "pulse-radar",
            label: "STATUS",
            title: "Pulse Radar",
            description: "Breathing status pulses for real-time feedback moments.",
            longDescription: "A soft, rhythmic pulse that communicates live system status without demanding attention.",
            variant: "pulse",
            accent: "#38BDF8",
            accentSoft: "rgba(56, 189, 248, 0.25)",
            meta: { type: "Status", system: "Motion Lab", spec: "2.8s pulse loop" }
          },
          {
            id: "waveform-stream",
            label: "GESTURE",
            title: "Swipe Up",
            description: "A minimal swipe cue for upward navigation.",
            longDescription: "A hand-and-arrow gesture that rises in a smooth arc to signal an upward swipe.",
            variant: "lottie",
            lottieData: swipeUpLottie,
            accent: "#34D399",
            accentSoft: "rgba(52, 211, 153, 0.25)",
            meta: { type: "Data", system: "Motion Lab", spec: "1.4s wave loop" }
          },
          {
            id: "stacked-alerts",
            label: "ALERT",
            title: "Stacked Alerts",
            description: "Layered alert cards create a calm cadence.",
            longDescription: "A stacking pattern that adds depth to notification trays and supports quick prioritization.",
            variant: "stack",
            accent: "#F97316",
            accentSoft: "rgba(249, 115, 22, 0.2)",
            meta: { type: "Alert", system: "Motion Lab", spec: "3.6s stack loop" }
          },
          {
            id: "scan-list",
            label: "SCAN",
            title: "Scan List",
            description: "A scanning line sweeps rows to focus attention.",
            longDescription: "A diagnostic scan motion for lists and logs, guiding the eye through structured content.",
            variant: "scan",
            accent: "#F43F5E",
            accentSoft: "rgba(244, 63, 94, 0.2)",
            meta: { type: "Utility", system: "Motion Lab", spec: "2.4s scan loop" }
          },
          {
            id: "ticker-strip",
            label: "FEED",
            title: "Emoji",
            description: "",
            longDescription: "",
            variant: "emoji",
            emoji: "🙂",
            accent: "#8B5CF6",
            accentSoft: "rgba(139, 92, 246, 0.2)",
            meta: { type: "Feed", system: "Motion Lab", spec: "6s ticker loop" }
          },
          {
            id: "focus-grid",
            label: "GRID",
            title: "Focus Grid",
            description: "A highlight jumps across the grid to invite exploration.",
            longDescription: "A roaming focus tile animates across a grid to signal active modules or recommendations.",
            variant: "grid",
            accent: "#14B8A6",
            accentSoft: "rgba(20, 184, 166, 0.2)",
            meta: { type: "Discovery", system: "Motion Lab", spec: "3s grid loop" }
          },
          {
            id: "loop-progress",
            label: "PROGRESS",
            title: "Loop Progress",
            description: "Rotating progress feedback for async moments.",
            longDescription: "A kinetic progress ring that pairs with a pulsing bar for background tasks.",
            variant: "progress",
            accent: "#111827",
            accentSoft: "rgba(17, 24, 39, 0.18)",
            meta: { type: "Progress", system: "Motion Lab", spec: "6s spin loop" }
          },
          {
            id: "hover-surface",
            label: "HOVER",
            title: "Hover Surface",
            description: "Soft floating cards signal hover depth.",
            longDescription: "A gentle card stack that lifts on focus, designed for editorial and content grids.",
            variant: "stack",
            accent: "#0EA5E9",
            accentSoft: "rgba(14, 165, 233, 0.2)",
            meta: { type: "Surface", system: "Motion Lab", spec: "3.6s float loop" }
          },
          {
            id: "aurora-toggle",
            label: "CONTROL",
            title: "Aurora Toggle",
            description: "A reactive pulse that hints at state change.",
            longDescription: "An ambient glow that transitions between modes while staying calm and refined.",
            variant: "pulse",
            accent: "#22D3EE",
            accentSoft: "rgba(34, 211, 238, 0.22)",
            meta: { type: "Control", system: "Motion Lab", spec: "2.8s pulse loop" }
          },
          {
            id: "magnetic-tags",
            label: "FILTER",
            title: "Magnetic Tags",
            description: "A stacked 3D panel floats in depth.",
            longDescription: "A layered 3D card cluster tilts in space to imply depth and hierarchy.",
            variant: "three-d",
            accent: "#F472B6",
            accentSoft: "rgba(244, 114, 182, 0.2)",
            meta: { type: "Depth", system: "Motion Lab", spec: "6s 3D loop" }
          },
          {
            id: "depth-cards",
            label: "DEPTH",
            title: "Depth Cards",
            description: "Stacked depth for layered content views.",
            longDescription: "A depth-focused stack that brings editorial blocks forward in a soft rhythm.",
            variant: "stack",
            accent: "#FBBF24",
            accentSoft: "rgba(251, 191, 36, 0.22)",
            meta: { type: "Layout", system: "Motion Lab", spec: "3.6s stack loop" }
          },
          {
            id: "signal-orbit",
            label: "SIGNAL",
            title: "Signal Orbit",
            description: "Signals circle the core for system awareness.",
            longDescription: "Orbiting signal points create a constant sense of uptime and availability.",
            variant: "orbit",
            accent: "#60A5FA",
            accentSoft: "rgba(96, 165, 250, 0.2)",
            meta: { type: "System", system: "Motion Lab", spec: "8s orbit loop" }
          },
          {
            id: "rhythm-bars",
            label: "MUSIC",
            title: "Rhythm Bars",
            description: "Audio-like bars keep beat and energy.",
            longDescription: "A waveform-inspired bar set that reinforces tempo, ideal for media players.",
            variant: "wave",
            accent: "#A78BFA",
            accentSoft: "rgba(167, 139, 250, 0.2)",
            meta: { type: "Media", system: "Motion Lab", spec: "1.4s wave loop" }
          },
          {
            id: "focus-sweep",
            label: "FOCUS",
            title: "Focus Sweep",
            description: "Scanning light sweeps key rows.",
            longDescription: "A scanning highlight that guides attention across structured lists and tables.",
            variant: "scan",
            accent: "#FB7185",
            accentSoft: "rgba(251, 113, 133, 0.2)",
            meta: { type: "Focus", system: "Motion Lab", spec: "2.4s scan loop" }
          }
        ]
      }
    ]
  },
  "ddd_2024": {
    id: "ddd_2024",
    title: "DDD 2024",
    color: "#251C45",
    hoverColor: "#4FF0E1", // 浅紫色
    description: "Official digital experience for the Digital Design Days 2024, showcasing forward-thinking design trends.",
    services: ["WEB", "DESIGN", "DEVELOPMENT", "3D"],
    image: "/6.png",
    launchUrl: "#"
  },
  "choo_choo_world": {
    id: "choo_choo_world",
    title: "Choo Choo World",
    color: "#FF9A85",
    hoverColor: "rgb(5, 145, 246)", // 浅紫色
    description: "A whimsical 3D game environment designed to showcase the power of real-time web-based rendering.",
    services: ["WEB", "DESIGN", "DEVELOPMENT", "3D"],
    image: "/7.png",
    launchUrl: "#"
  },
  "soda_experience": {
    id: "soda_experience",
    title: "Soda Experience",
    color: "#E8D9A8",
    hoverColor: "#rgb(244, 0, 9)", // 浅紫色
    description: "An AR-powered campaign for a premium beverage brand, focusing on interactive product visualization.",
    services: ["AR", "DEVELOPMENT", "3D"],
    image: "/8.png",
    launchUrl: "#"
  }
};

export const projectsList = Object.values(projectsData);
