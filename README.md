<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ET AI Concierge — Team AGI</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #050A14;
    --gold: #F0A500;
    --gold-light: #FFD060;
    --silver: #E8EDF5;
    --mist: #94A3B8;
    --glass: rgba(255,255,255,0.04);
    --glass-border: rgba(255,255,255,0.08);
    --accent-blue: #38BDF8;
    --accent-green: #34D399;
    --accent-rose: #FB7185;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'Outfit', sans-serif;
    background: var(--ink);
    color: var(--silver);
    overflow-x: hidden;
    cursor: none;
  }

  /* Custom cursor */
  .cursor {
    width: 10px; height: 10px;
    background: var(--gold);
    border-radius: 50%;
    position: fixed; top: 0; left: 0;
    pointer-events: none; z-index: 9999;
    transform: translate(-50%, -50%);
    transition: transform 0.08s ease, background 0.2s;
    mix-blend-mode: difference;
  }
  .cursor-ring {
    width: 36px; height: 36px;
    border: 1px solid rgba(240,165,0,0.5);
    border-radius: 50%;
    position: fixed; top: 0; left: 0;
    pointer-events: none; z-index: 9998;
    transform: translate(-50%, -50%);
    transition: transform 0.18s ease, opacity 0.3s;
  }

  /* ======= HERO ======= */
  .hero {
    min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    position: relative;
    padding: 6rem 2rem 4rem;
    overflow: hidden;
  }

  .hero-bg {
    position: absolute; inset: 0; z-index: 0;
    background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(240,165,0,0.12) 0%, transparent 70%),
                radial-gradient(ellipse 60% 40% at 80% 80%, rgba(56,189,248,0.08) 0%, transparent 60%),
                radial-gradient(ellipse 40% 30% at 10% 60%, rgba(52,211,153,0.06) 0%, transparent 50%);
  }

  .hero-grid {
    position: absolute; inset: 0; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 90% 70% at 50% 50%, black 30%, transparent 100%);
  }

  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(240,165,0,0.1);
    border: 1px solid rgba(240,165,0,0.3);
    border-radius: 100px;
    padding: 6px 18px;
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    color: var(--gold);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 2.5rem;
    position: relative; z-index: 1;
    animation: fadeSlide 0.8s ease both;
  }
  .hero-badge::before {
    content: '';
    width: 6px; height: 6px;
    background: var(--gold);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.7); }
  }

  .hero-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    color: var(--mist);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 1.2rem;
    position: relative; z-index: 1;
    animation: fadeSlide 0.9s ease 0.1s both;
  }

  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(3.5rem, 9vw, 8rem);
    font-weight: 900;
    line-height: 0.95;
    text-align: center;
    position: relative; z-index: 1;
    animation: fadeSlide 1s ease 0.2s both;
    letter-spacing: -0.02em;
  }

  .hero-title .et {
    color: var(--gold);
    font-style: italic;
  }

  .hero-title .ai {
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-green));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-subtitle {
    max-width: 560px;
    text-align: center;
    font-size: 1.1rem;
    line-height: 1.75;
    color: var(--mist);
    font-weight: 300;
    margin: 2rem auto 0;
    position: relative; z-index: 1;
    animation: fadeSlide 1s ease 0.35s both;
  }

  .hero-cta-row {
    display: flex; gap: 1rem; flex-wrap: wrap;
    align-items: center; justify-content: center;
    margin-top: 3rem;
    position: relative; z-index: 1;
    animation: fadeSlide 1s ease 0.5s both;
  }

  .btn-primary {
    padding: 14px 32px;
    background: var(--gold);
    color: var(--ink);
    border: none; border-radius: 6px;
    font-family: 'Outfit', sans-serif;
    font-weight: 600; font-size: 0.95rem;
    cursor: none;
    transition: all 0.25s ease;
    letter-spacing: 0.02em;
    box-shadow: 0 0 40px rgba(240,165,0,0.3);
  }
  .btn-primary:hover {
    background: var(--gold-light);
    box-shadow: 0 0 60px rgba(240,165,0,0.5);
    transform: translateY(-2px);
  }

  .btn-ghost {
    padding: 14px 32px;
    background: transparent;
    color: var(--silver);
    border: 1px solid var(--glass-border);
    border-radius: 6px;
    font-family: 'Outfit', sans-serif;
    font-weight: 400; font-size: 0.95rem;
    cursor: none;
    transition: all 0.25s ease;
  }
  .btn-ghost:hover {
    border-color: rgba(255,255,255,0.2);
    background: var(--glass);
  }

  .hero-stats {
    display: flex; gap: 3rem; flex-wrap: wrap;
    align-items: center; justify-content: center;
    margin-top: 4rem;
    position: relative; z-index: 1;
    animation: fadeSlide 1s ease 0.65s both;
  }

  .stat { text-align: center; }
  .stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 2.4rem; font-weight: 700;
    color: var(--gold);
    line-height: 1;
  }
  .stat-label {
    font-size: 0.75rem; color: var(--mist);
    letter-spacing: 0.08em; margin-top: 4px;
    text-transform: uppercase;
  }

  .stat-divider {
    width: 1px; height: 40px;
    background: var(--glass-border);
  }

  /* ======= SCROLL INDICATOR ======= */
  .scroll-hint {
    position: absolute; bottom: 2.5rem;
    left: 50%; transform: translateX(-50%);
    z-index: 1;
    display: flex; flex-direction: column;
    align-items: center; gap: 8px;
    animation: fadeSlide 1s ease 1s both;
  }
  .scroll-hint span {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem; color: var(--mist);
    letter-spacing: 0.15em; text-transform: uppercase;
  }
  .scroll-line {
    width: 1px; height: 40px;
    background: linear-gradient(to bottom, var(--mist), transparent);
    animation: scrollAnim 2s ease-in-out infinite;
  }
  @keyframes scrollAnim {
    0% { transform: scaleY(0); transform-origin: top; }
    50% { transform: scaleY(1); transform-origin: top; }
    51% { transform: scaleY(1); transform-origin: bottom; }
    100% { transform: scaleY(0); transform-origin: bottom; }
  }

  /* ======= SECTION BASE ======= */
  section { padding: 7rem 2rem; }
  .container { max-width: 1200px; margin: 0 auto; }

  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem; color: var(--gold);
    letter-spacing: 0.2em; text-transform: uppercase;
    margin-bottom: 1rem;
    display: flex; align-items: center; gap: 10px;
  }
  .section-label::after {
    content: '';
    flex: 1; max-width: 80px; height: 1px;
    background: rgba(240,165,0,0.4);
  }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 700; line-height: 1.15;
    margin-bottom: 1rem;
  }

  .section-body {
    font-size: 1.05rem; color: var(--mist);
    line-height: 1.8; max-width: 580px;
  }

  /* ======= PROBLEM STRIP ======= */
  .problem-strip {
    background: rgba(251,113,133,0.06);
    border-top: 1px solid rgba(251,113,133,0.15);
    border-bottom: 1px solid rgba(251,113,133,0.15);
    padding: 4rem 2rem;
  }

  .problem-inner {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 4rem; align-items: center;
  }

  .problem-stat-big {
    font-family: 'Playfair Display', serif;
    font-size: clamp(4rem, 9vw, 7rem);
    font-weight: 900; color: var(--accent-rose);
    line-height: 1;
    opacity: 0.9;
  }

  .problem-items {
    display: flex; flex-direction: column; gap: 1.2rem;
  }

  .problem-item {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 1rem 1.2rem;
    background: rgba(251,113,133,0.05);
    border: 1px solid rgba(251,113,133,0.1);
    border-radius: 8px;
    font-size: 0.95rem; line-height: 1.5;
    color: var(--silver);
  }

  .problem-item .icon {
    width: 22px; height: 22px;
    flex-shrink: 0;
    color: var(--accent-rose);
    font-size: 1rem; margin-top: 1px;
  }

  /* ======= FEATURES GRID ======= */
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5px;
    background: var(--glass-border);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    overflow: hidden;
    margin-top: 4rem;
  }

  .feature-card {
    background: var(--ink);
    padding: 2.2rem;
    transition: background 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  .feature-card::before {
    content: '';
    position: absolute; inset: 0;
    background: var(--card-glow, rgba(240,165,0,0.05));
    opacity: 0;
    transition: opacity 0.3s;
  }
  .feature-card:hover::before { opacity: 1; }

  .feature-icon {
    font-size: 1.8rem; margin-bottom: 1.2rem;
    display: block;
  }

  .feature-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem; font-weight: 700;
    color: var(--silver);
    margin-bottom: 0.6rem;
  }

  .feature-body {
    font-size: 0.88rem; color: var(--mist);
    line-height: 1.7;
  }

  .feature-tag {
    display: inline-block;
    margin-top: 1rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    padding: 3px 10px;
    border-radius: 100px;
    background: var(--tag-bg, rgba(240,165,0,0.1));
    color: var(--tag-color, var(--gold));
    border: 1px solid var(--tag-border, rgba(240,165,0,0.2));
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  /* ======= ARCHITECTURE ======= */
  .arch-section {
    background: linear-gradient(180deg, var(--ink) 0%, rgba(5,10,20,0.97) 100%);
  }

  .arch-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 2rem; margin-top: 3rem;
  }

  .arch-box {
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    padding: 2rem;
    background: var(--glass);
    backdrop-filter: blur(10px);
  }

  .arch-box-title {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem; color: var(--gold);
    letter-spacing: 0.15em; text-transform: uppercase;
    margin-bottom: 1.5rem;
    padding-bottom: 0.8rem;
    border-bottom: 1px solid var(--glass-border);
  }

  .layer-item {
    display: flex; align-items: center; gap: 12px;
    padding: 0.75rem 0;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    font-size: 0.88rem;
  }
  .layer-item:last-child { border-bottom: none; }

  .layer-dot {
    width: 8px; height: 8px; border-radius: 50%;
    flex-shrink: 0;
  }

  .layer-name { color: var(--silver); font-weight: 500; min-width: 120px; }
  .layer-desc { color: var(--mist); font-size: 0.82rem; }

  /* ======= FLOW DIAGRAM ======= */
  .flow-diagram {
    margin-top: 4rem;
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    padding: 3rem;
    background: var(--glass);
    position: relative; overflow: hidden;
  }

  .flow-diagram::before {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(56,189,248,0.08), transparent 70%);
    pointer-events: none;
  }

  .flow-title {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem; color: var(--gold);
    letter-spacing: 0.2em; text-transform: uppercase;
    margin-bottom: 2.5rem;
    text-align: center;
  }

  .flow-row {
    display: flex; align-items: center; justify-content: center;
    gap: 0; flex-wrap: wrap;
  }

  .flow-node {
    padding: 1rem 1.5rem;
    border-radius: 10px;
    font-size: 0.82rem; font-weight: 500;
    text-align: center;
    min-width: 120px;
    transition: transform 0.2s;
  }
  .flow-node:hover { transform: translateY(-3px); }

  .flow-node.user {
    background: rgba(52,211,153,0.1);
    border: 1px solid rgba(52,211,153,0.3);
    color: var(--accent-green);
  }
  .flow-node.ai {
    background: rgba(56,189,248,0.1);
    border: 1px solid rgba(56,189,248,0.3);
    color: var(--accent-blue);
  }
  .flow-node.engine {
    background: rgba(240,165,0,0.1);
    border: 1px solid rgba(240,165,0,0.3);
    color: var(--gold);
  }
  .flow-node.output {
    background: rgba(251,113,133,0.1);
    border: 1px solid rgba(251,113,133,0.3);
    color: var(--accent-rose);
  }

  .flow-arrow {
    font-size: 1.2rem; color: var(--mist);
    margin: 0 0.5rem;
  }

  .flow-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem; color: var(--mist);
    text-align: center; margin-top: 4px;
    letter-spacing: 0.05em;
  }

  /* ======= PROFILER TIMELINE ======= */
  .profiler-section {
    position: relative;
    background: linear-gradient(135deg, rgba(240,165,0,0.03) 0%, transparent 60%);
  }

  .timeline {
    margin-top: 3.5rem;
    display: flex; flex-direction: column; gap: 0;
    position: relative;
  }

  .timeline::before {
    content: '';
    position: absolute; left: 28px; top: 0; bottom: 0;
    width: 1px; background: linear-gradient(to bottom, var(--gold), transparent);
  }

  .timeline-item {
    display: flex; gap: 2rem;
    padding: 1.5rem 0;
    position: relative;
  }

  .timeline-dot {
    width: 56px; height: 56px; flex-shrink: 0;
    border-radius: 50%;
    background: rgba(240,165,0,0.1);
    border: 2px solid rgba(240,165,0,0.4);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem; font-weight: 700;
    color: var(--gold);
    position: relative; z-index: 1;
  }

  .timeline-content { padding-top: 12px; }
  .timeline-step {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem; color: var(--gold);
    letter-spacing: 0.15em; text-transform: uppercase;
    margin-bottom: 4px;
  }
  .timeline-heading {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem; font-weight: 700;
    color: var(--silver); margin-bottom: 0.5rem;
  }
  .timeline-desc {
    font-size: 0.88rem; color: var(--mist); line-height: 1.7;
  }

  .track-badges {
    display: flex; gap: 0.6rem; flex-wrap: wrap; margin-top: 0.8rem;
  }

  .track-badge {
    padding: 4px 12px;
    border-radius: 100px;
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem; letter-spacing: 0.1em;
    text-transform: uppercase;
    border: 1px solid;
  }
  .track-badge.cxo { background: rgba(56,189,248,0.1); color: var(--accent-blue); border-color: rgba(56,189,248,0.3); }
  .track-badge.investor { background: rgba(52,211,153,0.1); color: var(--accent-green); border-color: rgba(52,211,153,0.3); }
  .track-badge.pro { background: rgba(240,165,0,0.1); color: var(--gold); border-color: rgba(240,165,0,0.3); }

  /* ======= PRICING ======= */
  .pricing-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-top: 3.5rem;
    align-items: start;
  }

  .price-card {
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    padding: 2.5rem 2rem;
    background: var(--glass);
    transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
    position: relative;
    overflow: hidden;
  }
  .price-card:hover { transform: translateY(-6px); }

  .price-card.featured {
    border-color: rgba(240,165,0,0.5);
    background: linear-gradient(135deg, rgba(240,165,0,0.06), rgba(240,165,0,0.02));
    box-shadow: 0 0 60px rgba(240,165,0,0.1);
  }

  .price-featured-badge {
    position: absolute; top: -1px; left: 50%; transform: translateX(-50%);
    background: var(--gold); color: var(--ink);
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem; font-weight: 500;
    padding: 4px 16px;
    border-radius: 0 0 8px 8px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .price-tier {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem; color: var(--mist);
    letter-spacing: 0.15em; text-transform: uppercase;
    margin-bottom: 0.8rem;
  }

  .price-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem; font-weight: 700;
    color: var(--silver); margin-bottom: 0.5rem;
  }

  .price-amount {
    font-family: 'Playfair Display', serif;
    font-size: 2.8rem; font-weight: 900;
    color: var(--gold); line-height: 1;
    margin: 1.2rem 0 0.3rem;
  }
  .price-amount sup { font-size: 1.2rem; vertical-align: super; }
  .price-amount .per { font-size: 0.9rem; color: var(--mist); font-family: 'Outfit', sans-serif; font-weight: 300; }

  .price-free { font-size: 2rem; font-weight: 900; color: var(--accent-green); margin: 1.2rem 0 0.3rem; font-family: 'Playfair Display', serif; }

  .price-divider {
    height: 1px; background: var(--glass-border); margin: 1.5rem 0;
  }

  .price-feature {
    display: flex; align-items: center; gap: 10px;
    font-size: 0.88rem; color: var(--silver);
    padding: 0.45rem 0;
  }

  .check { color: var(--accent-green); flex-shrink: 0; }
  .cross { color: rgba(255,255,255,0.2); flex-shrink: 0; }

  /* ======= TECH TABLE ======= */
  .tech-table {
    width: 100%; border-collapse: collapse;
    margin-top: 3rem;
    font-size: 0.88rem;
  }

  .tech-table th {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem; color: var(--gold);
    letter-spacing: 0.15em; text-transform: uppercase;
    text-align: left; padding: 0.8rem 1.2rem;
    border-bottom: 1px solid var(--glass-border);
  }

  .tech-table td {
    padding: 0.9rem 1.2rem;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    vertical-align: top;
  }

  .tech-table tr:hover td { background: rgba(255,255,255,0.02); }

  .tech-table td:first-child { color: var(--mist); font-family: 'DM Mono', monospace; font-size: 0.8rem; }
  .tech-table td:nth-child(2) { color: var(--silver); font-weight: 500; }
  .tech-table td:nth-child(3) { color: var(--mist); }

  /* ======= ROADMAP ======= */
  .roadmap-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5px;
    background: var(--glass-border);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    overflow: hidden;
    margin-top: 3.5rem;
  }

  .roadmap-col { background: var(--ink); padding: 2rem; }

  .roadmap-quarter {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem; letter-spacing: 0.15em;
    text-transform: uppercase; margin-bottom: 0.5rem;
  }

  .roadmap-phase {
    font-family: 'Playfair Display', serif;
    font-size: 1rem; font-weight: 700;
    color: var(--silver); margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--glass-border);
  }

  .roadmap-item {
    font-size: 0.82rem; color: var(--mist);
    padding: 0.4rem 0;
    display: flex; align-items: flex-start; gap: 8px;
  }
  .roadmap-item::before { content: '→'; color: var(--gold); flex-shrink: 0; }

  /* ======= TEAM ======= */
  .team-section {
    text-align: center;
    background: radial-gradient(ellipse 60% 40% at 50% 100%, rgba(240,165,0,0.06) 0%, transparent 70%);
  }

  .team-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem; margin-top: 3.5rem;
  }

  .team-card {
    border: 1px solid var(--glass-border);
    border-radius: 12px; padding: 2rem 1.5rem;
    background: var(--glass);
    text-align: center;
    transition: border-color 0.3s, transform 0.3s;
  }
  .team-card:hover {
    border-color: rgba(240,165,0,0.3);
    transform: translateY(-4px);
  }

  .team-avatar {
    width: 64px; height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(240,165,0,0.2), rgba(56,189,248,0.2));
    border: 2px solid rgba(240,165,0,0.2);
    margin: 0 auto 1rem;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem;
  }

  .team-role {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem; color: var(--gold);
    letter-spacing: 0.12em; text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .team-contrib {
    font-size: 0.82rem; color: var(--mist); line-height: 1.6;
  }

  /* ======= CODE TERMINAL ======= */
  .terminal {
    border-radius: 12px; overflow: hidden;
    border: 1px solid rgba(255,255,255,0.08);
    margin-top: 3rem;
  }

  .terminal-bar {
    background: rgba(255,255,255,0.06);
    padding: 0.8rem 1.2rem;
    display: flex; align-items: center; gap: 8px;
  }
  .t-dot { width: 12px; height: 12px; border-radius: 50%; }
  .t-red { background: #FF5F57; }
  .t-yellow { background: #FEBC2E; }
  .t-green { background: #28C840; }

  .terminal-title {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem; color: var(--mist);
    margin-left: 0.5rem;
  }

  .terminal-body {
    background: #0A0F1A;
    padding: 2rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.85rem;
    line-height: 2;
  }

  .t-comment { color: #4A5568; }
  .t-cmd { color: var(--accent-green); }
  .t-path { color: var(--accent-blue); }
  .t-flag { color: var(--gold); }
  .t-out { color: var(--mist); }
  .t-success { color: var(--accent-green); }

  /* ======= FOOTER ======= */
  footer {
    border-top: 1px solid var(--glass-border);
    padding: 4rem 2rem;
    text-align: center;
  }

  .footer-logo {
    font-family: 'Playfair Display', serif;
    font-size: 2rem; font-weight: 900;
    color: var(--gold); margin-bottom: 1rem;
  }

  .footer-tagline {
    color: var(--mist); font-size: 0.9rem;
    margin-bottom: 2rem;
  }

  .footer-links {
    display: flex; gap: 2rem; flex-wrap: wrap;
    align-items: center; justify-content: center;
    margin-bottom: 2.5rem;
  }

  .footer-link {
    font-size: 0.85rem; color: var(--mist);
    text-decoration: none;
    transition: color 0.2s;
  }
  .footer-link:hover { color: var(--gold); }

  .footer-copy {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem; color: rgba(148,163,184,0.5);
    letter-spacing: 0.05em;
  }

  .india-flag { color: #FF9933; }

  /* ======= BADGES ======= */
  .badge-row {
    display: flex; gap: 0.8rem; flex-wrap: wrap;
    margin-top: 2rem;
  }

  .badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 100px;
    padding: 5px 14px;
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem; color: var(--mist);
    letter-spacing: 0.05em;
  }

  .badge .b-dot { width: 6px; height: 6px; border-radius: 50%; }

  /* ======= ANIMATIONS ======= */
  @keyframes fadeSlide {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .reveal {
    opacity: 0; transform: translateY(30px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .reveal.visible {
    opacity: 1; transform: translateY(0);
  }

  /* ======= RESPONSIVE ======= */
  @media (max-width: 900px) {
    .problem-inner { grid-template-columns: 1fr; }
    .arch-grid { grid-template-columns: 1fr; }
    .pricing-grid { grid-template-columns: 1fr; }
    .roadmap-grid { grid-template-columns: 1fr 1fr; }
    .team-grid { grid-template-columns: 1fr 1fr; }
    .hero-stats { gap: 2rem; }
    .stat-divider { display: none; }
  }

  @media (max-width: 600px) {
    .roadmap-grid { grid-template-columns: 1fr; }
    .team-grid { grid-template-columns: 1fr; }
    .features-grid { grid-template-columns: 1fr; }
  }

  /* Shimmer number animation */
  @keyframes countUp { from { opacity: 0; } to { opacity: 1; } }

  /* Highlight stripe on hover */
  .feature-card:nth-child(1) { --card-glow: rgba(240,165,0,0.05); }
  .feature-card:nth-child(2) { --card-glow: rgba(56,189,248,0.05); }
  .feature-card:nth-child(3) { --card-glow: rgba(52,211,153,0.05); }
  .feature-card:nth-child(4) { --card-glow: rgba(251,113,133,0.05); }
  .feature-card:nth-child(5) { --card-glow: rgba(240,165,0,0.05); }
  .feature-card:nth-child(6) { --card-glow: rgba(56,189,248,0.05); }

  /* Accent line nav */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 1rem 2rem;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(5,10,20,0.8);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--glass-border);
    transition: box-shadow 0.3s;
  }

  .nav-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem; font-weight: 900;
    color: var(--gold);
  }

  .nav-logo span { color: var(--silver); }

  .nav-links {
    display: flex; gap: 2rem;
    list-style: none;
  }

  .nav-link {
    font-size: 0.85rem; color: var(--mist);
    text-decoration: none;
    transition: color 0.2s;
    font-weight: 400;
  }
  .nav-link:hover { color: var(--silver); }

  .nav-cta {
    padding: 8px 20px;
    background: rgba(240,165,0,0.15);
    border: 1px solid rgba(240,165,0,0.4);
    border-radius: 6px;
    font-size: 0.85rem; color: var(--gold);
    text-decoration: none;
    transition: all 0.25s;
    font-weight: 500;
  }
  .nav-cta:hover { background: rgba(240,165,0,0.25); }

  /* Glow strip */
  .glow-strip {
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), var(--accent-blue), var(--accent-green), transparent);
    margin-top: 5rem;
    opacity: 0.4;
  }
</style>
</head>
<body>

<div class="cursor" id="cursor"></div>
<div class="cursor-ring" id="cursorRing"></div>

<!-- NAV -->
<nav class="nav">
  <div class="nav-logo">ET <span>AI Concierge</span></div>
  <ul class="nav-links">
    <li><a href="#features" class="nav-link">Features</a></li>
    <li><a href="#architecture" class="nav-link">Architecture</a></li>
    <li><a href="#pricing" class="nav-link">Pricing</a></li>
    <li><a href="#roadmap" class="nav-link">Roadmap</a></li>
  </ul>
  <a href="#setup" class="nav-cta">Get Started →</a>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-bg"></div>
  <div class="hero-grid"></div>

  <div class="hero-badge">🏆 Built at Hackathon · Team AGI</div>

  <p class="hero-eyebrow">Economic Times · Personal Finance Platform</p>

  <h1 class="hero-title">
    <span class="et">ET</span> <span class="ai">AI</span><br>Concierge
  </h1>

  <p class="hero-subtitle">
    An intelligent orchestration platform that maps your financial DNA to India's most powerful investment ecosystem — in under 3 minutes.
  </p>

  <div class="hero-cta-row">
    <button class="btn-primary">Launch Demo →</button>
    <button class="btn-ghost">View on GitHub</button>
  </div>

  <div class="badge-row" style="justify-content:center; margin-top: 2rem;">
    <span class="badge"><span class="b-dot" style="background:#61DAFB"></span>React 18</span>
    <span class="badge"><span class="b-dot" style="background:#646CFF"></span>Vite 5</span>
    <span class="badge"><span class="b-dot" style="background:#34D399"></span>FastAPI</span>
    <span class="badge"><span class="b-dot" style="background:#F0A500"></span>LangGraph</span>
    <span class="badge"><span class="b-dot" style="background:#FB7185"></span>ChromaDB</span>
  </div>

  <div class="hero-stats">
    <div class="stat">
      <div class="stat-num">13+</div>
      <div class="stat-label">Components</div>
    </div>
    <div class="stat-divider"></div>
    <div class="stat">
      <div class="stat-num">15K</div>
      <div class="stat-label">Lines of Code</div>
    </div>
    <div class="stat-divider"></div>
    <div class="stat">
      <div class="stat-num">150M</div>
      <div class="stat-label">Target Users</div>
    </div>
    <div class="stat-divider"></div>
    <div class="stat">
      <div class="stat-num">₹5K Cr</div>
      <div class="stat-label">Market TAM</div>
    </div>
  </div>

  <div class="scroll-hint">
    <span>Scroll</span>
    <div class="scroll-line"></div>
  </div>
</section>

<div class="glow-strip"></div>

<!-- PROBLEM STRIP -->
<div class="problem-strip">
  <div class="problem-inner">
    <div>
      <div class="section-label">The Problem</div>
      <div class="problem-stat-big">80%</div>
      <p style="font-size: 1.15rem; color: var(--silver); line-height: 1.7; margin-top: 1rem; max-width: 420px;">
        of Indian investors lack access to personalized financial advisory — leaving crores on the table.
      </p>
    </div>
    <div class="problem-items">
      <div class="problem-item">
        <span class="icon">⚡</span>
        <div>Complex tax regulations (80C, HRA, Capital Gains) are near-impossible to navigate without expert help.</div>
      </div>
      <div class="problem-item">
        <span class="icon">📊</span>
        <div>IPO decisions require real-time data that fragmented platforms fail to surface in time.</div>
      </div>
      <div class="problem-item">
        <span class="icon">🗺️</span>
        <div>Most ET users discover only <strong style="color:var(--accent-rose)">10%</strong> of what the ecosystem offers — the rest stays hidden.</div>
      </div>
      <div class="problem-item">
        <span class="icon">💎</span>
        <div>Premium advisory tools remain locked behind expertise barriers, excluding retail investors entirely.</div>
      </div>
    </div>
  </div>
</div>

<!-- FEATURES -->
<section id="features">
  <div class="container">
    <div class="reveal">
      <div class="section-label">Core Capabilities</div>
      <h2 class="section-title">Everything you need.<br>In one intelligent platform.</h2>
      <p class="section-body">Eight fully functional modules, orchestrated by AI, designed specifically for the Indian investor's journey.</p>
    </div>

    <div class="features-grid reveal">
      <div class="feature-card">
        <span class="feature-icon">🗣️</span>
        <div class="feature-title">ET Welcome Concierge</div>
        <div class="feature-body">A state-machine driven profiling agent that maps your intent, role, and life stage in a natural 3-minute conversation — no forms, no friction.</div>
        <span class="feature-tag">LangGraph Agent</span>
      </div>
      <div class="feature-card">
        <span class="feature-icon">🧭</span>
        <div class="feature-title">Financial Life Navigator</div>
        <div class="feature-body">ChromaDB vector search matches your unique profile against the entire ET ecosystem, surfacing the exact tools that fit your situation with personalized payoff narratives.</div>
        <span class="feature-tag" style="--tag-bg: rgba(56,189,248,0.1); --tag-color: var(--accent-blue); --tag-border: rgba(56,189,248,0.2)">ChromaDB · RAG</span>
      </div>
      <div class="feature-card">
        <span class="feature-icon">📈</span>
        <div class="feature-title">IPO Command Center</div>
        <div class="feature-body">Live IPO calendar, GMP tracking, category-wise subscription data (Retail/NII/QIB), ASBA simulation, and SEBI-compliant AI recommendations — all in one dashboard.</div>
        <span class="feature-tag" style="--tag-bg: rgba(52,211,153,0.1); --tag-color: var(--accent-green); --tag-border: rgba(52,211,153,0.2)">Real-time Analytics</span>
      </div>
      <div class="feature-card">
        <span class="feature-icon">💰</span>
        <div class="feature-title">Indian Tax Planner</div>
        <div class="feature-body">Complete 80C/80D/HRA/LTCG/STCG calculators with metro vs non-metro HRA logic, ELSS tracker, and section-wise limit visualization built for Indian tax law.</div>
        <span class="feature-tag" style="--tag-bg: rgba(251,113,133,0.1); --tag-color: var(--accent-rose); --tag-border: rgba(251,113,133,0.2)">SEBI Compliant</span>
      </div>
      <div class="feature-card">
        <span class="feature-icon">🎯</span>
        <div class="feature-title">Goal Tracker</div>
        <div class="feature-body">Multi-goal planning (Retirement, Education, Home, Emergency) with visual SIP calculators, inflation-adjusted projections, and milestone celebration triggers.</div>
        <span class="feature-tag">AI Projections</span>
      </div>
      <div class="feature-card">
        <span class="feature-icon">👨‍👩‍👧‍👦</span>
        <div class="feature-title">Family Wealth Center</div>
        <div class="feature-body">Consolidated family portfolio view with role-based access, collaborative goal planning, estate planning calculators, and family-wide insurance gap analysis.</div>
        <span class="feature-tag" style="--tag-bg: rgba(56,189,248,0.1); --tag-color: var(--accent-blue); --tag-border: rgba(56,189,248,0.2)">Elite Tier</span>
      </div>
    </div>
  </div>
</section>

<!-- PROFILER TIMELINE -->
<section class="profiler-section" id="profiler">
  <div class="container">
    <div class="reveal" style="display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: start;">
      <div>
        <div class="section-label">The 3-Minute Profiler</div>
        <h2 class="section-title">From stranger to financial advisor — instantly.</h2>
        <p class="section-body">Our state-machine driven concierge conducts a natural conversation, extracts your intent, and routes you to exactly the right ET product — no search required.</p>

        <div class="timeline" style="margin-top: 2.5rem;">
          <div class="timeline-item">
            <div class="timeline-dot">0</div>
            <div class="timeline-content">
              <div class="timeline-step">Turn 0 · Greeting</div>
              <div class="timeline-heading">Profession Probe</div>
              <div class="timeline-desc">AI asks what keeps you busy. LLM extracts Role, Industry, and Seniority from natural language.</div>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot">1</div>
            <div class="timeline-content">
              <div class="timeline-step">Turn 1 · Branching</div>
              <div class="timeline-heading">Track Selection</div>
              <div class="timeline-desc">Dynamic routing based on profile classification.</div>
              <div class="track-badges">
                <span class="track-badge cxo">CXO Track</span>
                <span class="track-badge investor">Investor Track</span>
                <span class="track-badge pro">Professional</span>
              </div>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot">2</div>
            <div class="timeline-content">
              <div class="timeline-step">Turn 2 · Life Event</div>
              <div class="timeline-heading">Intent Pivot</div>
              <div class="timeline-desc">Detects life events (new job, marriage, inheritance, home purchase) and switches from Content-First to Marketplace-First recommendations.</div>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot">✓</div>
            <div class="timeline-content">
              <div class="timeline-step">Resolution</div>
              <div class="timeline-heading">ChromaDB Match</div>
              <div class="timeline-desc">Vector similarity search against ET Product Knowledge Graph delivers a personalized, narrative-driven product recommendation.</div>
            </div>
          </div>
        </div>
      </div>

      <div style="padding-top: 2rem;">
        <div class="terminal">
          <div class="terminal-bar">
            <div class="t-dot t-red"></div>
            <div class="t-dot t-yellow"></div>
            <div class="t-dot t-green"></div>
            <span class="terminal-title">concierge_session.log</span>
          </div>
          <div class="terminal-body">
<span class="t-comment"># Turn 0 — Greeting</span>
<span class="t-out">🤖 "What kind of work keeps you busy these days?"</span>
<span class="t-cmd">👤 "I'm a fund manager at Motilal Oswal"</span>

<span class="t-comment"># LLM extracts signal</span>
<span class="t-path">→ role: FUND_MANAGER</span>
<span class="t-path">→ track: INVESTOR</span>
<span class="t-path">→ seniority: SENIOR</span>

<span class="t-comment"># Turn 1 — Investor track activated</span>
<span class="t-out">🤖 "Are you looking at any upcoming IPOs or sector rotations?"</span>
<span class="t-cmd">👤 "Just got married, looking to buy a house too"</span>

<span class="t-comment"># Life event detected!</span>
<span class="t-flag">⚡ LIFE_EVENT: MARRIAGE + HOME_PURCHASE</span>
<span class="t-flag">→ switching: CONTENT_FIRST → MARKETPLACE_FIRST</span>

<span class="t-comment"># ChromaDB vector search</span>
<span class="t-path">→ querying ET Product Knowledge Graph...</span>
<span class="t-path">→ top_match: ET_HDFC_HOME_LOAN (0.94)</span>
<span class="t-path">→ top_match: ET_GOAL_TRACKER (0.89)</span>

<span class="t-success">✅ Routing to Marketplace Agent + Goal Setup</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ARCHITECTURE -->
<section class="arch-section" id="architecture">
  <div class="container">
    <div class="reveal">
      <div class="section-label">Technical Architecture</div>
      <h2 class="section-title">Built to scale.<br>Designed to impress.</h2>
    </div>

    <div class="arch-grid reveal">
      <div class="arch-box">
        <div class="arch-box-title">Frontend Stack</div>
        <div class="layer-item"><div class="layer-dot" style="background:#61DAFB"></div><span class="layer-name">React 18</span><span class="layer-desc">Functional components, Context API</span></div>
        <div class="layer-item"><div class="layer-dot" style="background:#646CFF"></div><span class="layer-name">Vite 5</span><span class="layer-desc">HMR, optimized production builds</span></div>
        <div class="layer-item"><div class="layer-dot" style="background:#F0A500"></div><span class="layer-name">React Router</span><span class="layer-desc">15 protected + 2 public routes</span></div>
        <div class="layer-item"><div class="layer-dot" style="background:#94A3B8"></div><span class="layer-name">Lucide React</span><span class="layer-desc">500+ consistent-stroke icons</span></div>
        <div class="layer-item"><div class="layer-dot" style="background:#38BDF8"></div><span class="layer-name">Web Speech API</span><span class="layer-desc">Voice input & synthesis</span></div>
        <div class="layer-item"><div class="layer-dot" style="background:#34D399"></div><span class="layer-name">CSS3 Variables</span><span class="layer-desc">Glassmorphism design system</span></div>
      </div>

      <div class="arch-box">
        <div class="arch-box-title">AI & Backend</div>
        <div class="layer-item"><div class="layer-dot" style="background:#F0A500"></div><span class="layer-name">LangGraph</span><span class="layer-desc">Multi-agent state machine orchestration</span></div>
        <div class="layer-item"><div class="layer-dot" style="background:#FB7185"></div><span class="layer-name">Groq API</span><span class="layer-desc">Llama 3.3 70b · Llama 3.1 8b inference</span></div>
        <div class="layer-item"><div class="layer-dot" style="background:#38BDF8"></div><span class="layer-name">FastAPI</span><span class="layer-desc">Python 3.11, ASGI, WebSocket</span></div>
        <div class="layer-item"><div class="layer-dot" style="background:#34D399"></div><span class="layer-name">ChromaDB</span><span class="layer-desc">ET Product Knowledge Graph embeddings</span></div>
        <div class="layer-item"><div class="layer-dot" style="background:#94A3B8"></div><span class="layer-name">PostgreSQL</span><span class="layer-desc">asyncpg, user profiles, session memory</span></div>
        <div class="layer-item"><div class="layer-dot" style="background:#646CFF"></div><span class="layer-name">FileReader API</span><span class="layer-desc">Document PDF/image analysis</span></div>
      </div>
    </div>

    <!-- Flow diagram -->
    <div class="flow-diagram reveal">
      <div class="flow-title">Data Flow · Profiler Agent Orchestration</div>
      <div class="flow-row" style="gap: 0.5rem; flex-wrap: wrap; justify-content: center; align-items: center;">
        <div>
          <div class="flow-node user">User Input<br><span style="font-size:0.72rem; opacity:0.7">Text / Voice</span></div>
          <div class="flow-label">entry</div>
        </div>
        <div class="flow-arrow">→</div>
        <div>
          <div class="flow-node ai">LangGraph<br><span style="font-size:0.72rem; opacity:0.7">State Machine</span></div>
          <div class="flow-label">orchestration</div>
        </div>
        <div class="flow-arrow">⇆</div>
        <div>
          <div class="flow-node engine">Groq LLM<br><span style="font-size:0.72rem; opacity:0.7">Llama 3.3 70b</span></div>
          <div class="flow-label">inference</div>
        </div>
        <div class="flow-arrow">⇆</div>
        <div>
          <div class="flow-node engine" style="--card-glow: rgba(56,189,248,0.1); background: rgba(56,189,248,0.1); border-color: rgba(56,189,248,0.3); color: var(--accent-blue);">ChromaDB<br><span style="font-size:0.72rem; opacity:0.7">Vector Search</span></div>
          <div class="flow-label">knowledge graph</div>
        </div>
        <div class="flow-arrow">→</div>
        <div>
          <div class="flow-node output">Personalized<br><span style="font-size:0.72rem; opacity:0.7">Recommendation</span></div>
          <div class="flow-label">resolution</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- PRICING -->
<section id="pricing">
  <div class="container">
    <div class="reveal" style="text-align: center;">
      <div class="section-label" style="justify-content: center;">
        <span>Subscription Model</span>
      </div>
      <h2 class="section-title">Choose your financial edge.</h2>
      <p class="section-body" style="margin: 0 auto;">From free access to India's smartest finance tools, to elite private summits and family wealth management.</p>
    </div>

    <div class="pricing-grid reveal">
      <!-- Basic -->
      <div class="price-card">
        <div class="price-tier">Tier 01</div>
        <div class="price-name">ET Basic</div>
        <div class="price-free">Free</div>
        <div style="font-size:0.82rem; color: var(--mist); margin-top: 0.2rem;">Forever free. No credit card.</div>
        <div class="price-divider"></div>
        <div class="price-feature"><span class="check">✓</span> 5 AI queries per day</div>
        <div class="price-feature"><span class="check">✓</span> Basic portfolio tracking</div>
        <div class="price-feature"><span class="check">✓</span> IPO calendar access</div>
        <div class="price-feature"><span class="check">✓</span> Standard market updates</div>
        <div class="price-feature"><span class="cross">✗</span> Portfolio projections</div>
        <div class="price-feature"><span class="cross">✗</span> Real-time alerts</div>
        <div class="price-feature"><span class="cross">✗</span> ET Prime access</div>
        <div style="margin-top: 2rem;">
          <button class="btn-ghost" style="width:100%; cursor:none; border-radius:8px;">Get Started Free</button>
        </div>
      </div>

      <!-- Pro -->
      <div class="price-card featured">
        <div class="price-featured-badge">Most Popular</div>
        <div class="price-tier">Tier 02</div>
        <div class="price-name">ET Pro</div>
        <div class="price-amount"><sup>₹</sup>4,999<span class="per"> /year</span></div>
        <div style="font-size:0.82rem; color: var(--mist); margin-top: 0.2rem;">₹416/month, billed annually</div>
        <div class="price-divider"></div>
        <div class="price-feature"><span class="check">✓</span> 50 AI queries per day</div>
        <div class="price-feature"><span class="check">✓</span> Portfolio projections</div>
        <div class="price-feature"><span class="check">✓</span> Real-time market alerts</div>
        <div class="price-feature"><span class="check">✓</span> ET Prime full access</div>
        <div class="price-feature"><span class="check">✓</span> Advanced tax planning</div>
        <div class="price-feature"><span class="check">✓</span> Gap analysis engine</div>
        <div class="price-feature"><span class="cross">✗</span> Family portfolio</div>
        <div style="margin-top: 2rem;">
          <button class="btn-primary" style="width:100%; cursor:none; border-radius:8px;">Start Pro Trial</button>
        </div>
      </div>

      <!-- Elite -->
      <div class="price-card">
        <div class="price-tier">Tier 03</div>
        <div class="price-name">ET Elite</div>
        <div class="price-amount"><sup>₹</sup>14,999<span class="per"> /year</span></div>
        <div style="font-size:0.82rem; color: var(--mist); margin-top: 0.2rem;">₹1,250/month, billed annually</div>
        <div class="price-divider"></div>
        <div class="price-feature"><span class="check">✓</span> Unlimited AI queries</div>
        <div class="price-feature"><span class="check">✓</span> Family portfolio management</div>
        <div class="price-feature"><span class="check">✓</span> Private summits access</div>
        <div class="price-feature"><span class="check">✓</span> Masterclass sessions</div>
        <div class="price-feature"><span class="check">✓</span> Dedicated hybrid support</div>
        <div class="price-feature"><span class="check">✓</span> Exclusive research reports</div>
        <div class="price-feature"><span class="check">✓</span> Estate planning tools</div>
        <div style="margin-top: 2rem;">
          <button class="btn-ghost" style="width:100%; cursor:none; border-radius:8px; border-color: rgba(240,165,0,0.3); color: var(--gold);">Go Elite</button>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ROADMAP -->
<section id="roadmap" style="padding-bottom: 4rem;">
  <div class="container">
    <div class="reveal">
      <div class="section-label">Implementation Roadmap</div>
      <h2 class="section-title">The path from hackathon to platform.</h2>
    </div>

    <div class="roadmap-grid reveal">
      <div class="roadmap-col" style="border-left: 3px solid var(--accent-green);">
        <div class="roadmap-quarter" style="color: var(--accent-green);">Phase 1 · Complete</div>
        <div class="roadmap-phase">Foundation ✅</div>
        <div class="roadmap-item">React 18 architecture</div>
        <div class="roadmap-item">Glassmorphism design system</div>
        <div class="roadmap-item">13 major components</div>
        <div class="roadmap-item">AI Concierge chat UI</div>
        <div class="roadmap-item">IPO Command Center</div>
        <div class="roadmap-item">Goal Tracker + Tax Planner</div>
        <div class="roadmap-item">Protected routes & auth</div>
      </div>
      <div class="roadmap-col" style="border-left: 3px solid var(--accent-blue);">
        <div class="roadmap-quarter" style="color: var(--accent-blue);">Phase 2 · Q2 2025</div>
        <div class="roadmap-phase">AI Enhancement 🚀</div>
        <div class="roadmap-item">Real-time NSE/BSE data APIs</div>
        <div class="roadmap-item">Predictive portfolio analytics</div>
        <div class="roadmap-item">AI-powered stock screener</div>
        <div class="roadmap-item">Voice assistant (Hindi, Tamil)</div>
        <div class="roadmap-item">React Native mobile app</div>
        <div class="roadmap-item">Zerodha, Upstox integration</div>
      </div>
      <div class="roadmap-col" style="border-left: 3px solid var(--gold);">
        <div class="roadmap-quarter" style="color: var(--gold);">Phase 3 · Q3 2025</div>
        <div class="roadmap-phase">Scale & Intelligence 📊</div>
        <div class="roadmap-item">ML recommendation engine</div>
        <div class="roadmap-item">Risk analysis model</div>
        <div class="roadmap-item">Fraud detection layer</div>
        <div class="roadmap-item">Tax filing assistant</div>
        <div class="roadmap-item">Crypto portfolio tracking</div>
        <div class="roadmap-item">International markets</div>
      </div>
      <div class="roadmap-col" style="border-left: 3px solid var(--accent-rose);">
        <div class="roadmap-quarter" style="color: var(--accent-rose);">Phase 4 · Q4 2025</div>
        <div class="roadmap-phase">Enterprise 🏢</div>
        <div class="roadmap-item">Family Office Suite</div>
        <div class="roadmap-item">AI estate planning</div>
        <div class="roadmap-item">Smart ML notifications</div>
        <div class="roadmap-item">Community Q&A forums</div>
        <div class="roadmap-item">Enterprise API for partners</div>
        <div class="roadmap-item">White-label solutions</div>
      </div>
    </div>
  </div>
</section>

<!-- SETUP -->
<section id="setup" style="padding: 4rem 2rem;">
  <div class="container">
    <div class="reveal" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;">
      <div>
        <div class="section-label">Quick Setup</div>
        <h2 class="section-title">Running in<br>60 seconds.</h2>
        <p class="section-body">Node.js 18+ and npm 9+ is all you need. Clone, install, and your local dev server starts on <span style="font-family:'DM Mono',monospace; color: var(--accent-blue); background: rgba(56,189,248,0.1); padding: 2px 8px; border-radius: 4px;">localhost:5173</span>.</p>
      </div>
      <div class="terminal">
        <div class="terminal-bar">
          <div class="t-dot t-red"></div>
          <div class="t-dot t-yellow"></div>
          <div class="t-dot t-green"></div>
          <span class="terminal-title">bash</span>
        </div>
        <div class="terminal-body">
<span class="t-comment"># Clone the repository</span>
<span class="t-cmd">git clone</span> <span class="t-path">https://github.com/team-agi/et-ai-concierge</span>

<span class="t-cmd">cd</span> et-ai-concierge

<span class="t-comment"># Install dependencies</span>
<span class="t-cmd">npm install</span>

<span class="t-comment"># Start development server</span>
<span class="t-cmd">npm run dev</span>

<span class="t-comment"># Production build</span>
<span class="t-cmd">npm run build</span>

<span class="t-success">✓  http://localhost:5173 ready in 312ms</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- TEAM -->
<section class="team-section">
  <div class="container">
    <div class="reveal">
      <div class="section-label" style="justify-content: center;">The Builders</div>
      <h2 class="section-title">Team AGI</h2>
      <p class="section-body" style="margin: 0 auto;">Built with passion at an intensive hackathon. Four disciplines, one mission: democratize financial intelligence for India.</p>
    </div>

    <div class="team-grid reveal">
      <div class="team-card">
        <div class="team-avatar">⚛️</div>
        <div class="team-role">Frontend Engineers</div>
        <div class="team-contrib">React architecture, state management, UI implementation across 13 production components.</div>
      </div>
      <div class="team-card">
        <div class="team-avatar">🎨</div>
        <div class="team-role">UI/UX Designers</div>
        <div class="team-contrib">Glassmorphism design system, responsive layouts, user experience flows and micro-interactions.</div>
      </div>
      <div class="team-card">
        <div class="team-avatar">🤖</div>
        <div class="team-role">AI Specialists</div>
        <div class="team-contrib">LangGraph orchestration, Groq inference, ChromaDB vector search, and recommendation engine.</div>
      </div>
      <div class="team-card">
        <div class="team-avatar">📊</div>
        <div class="team-role">Finance Experts</div>
        <div class="team-contrib">Indian tax logic, investment algorithms, SEBI compliance, and market data integration.</div>
      </div>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-logo">ET AI Concierge</div>
  <div class="footer-tagline">Revolutionizing Personal Finance for India 🇮🇳</div>

  <div class="footer-links">
    <a href="#" class="footer-link">Features</a>
    <a href="#" class="footer-link">Architecture</a>
    <a href="#" class="footer-link">Pricing</a>
    <a href="#" class="footer-link">Roadmap</a>
    <a href="#" class="footer-link">GitHub</a>
    <a href="#" class="footer-link">Support</a>
  </div>

  <div class="footer-copy">
    © 2024 The Economic Times — Times Internet Limited · Built by Team AGI · Made in India
  </div>
</footer>

<script>
  // Custom cursor
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        // stagger children if grid
        const children = e.target.querySelectorAll('.feature-card, .price-card, .team-card, .roadmap-col, .arch-box');
        children.forEach((c, i) => {
          c.style.transitionDelay = (i * 0.08) + 's';
          c.style.opacity = '0';
          c.style.transform = 'translateY(20px)';
          setTimeout(() => {
            c.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            c.style.opacity = '1';
            c.style.transform = 'translateY(0)';
          }, i * 80);
        });
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => observer.observe(el));
</script>
</body>
</html>
