# BuiltByBugs — Unified Theme Profile Implementation Plan

**Target Audience:** Autonomous Coding Agents (Cursor, Claude Code, Aider, Windsurf) & Frontend Engineers  
**Target Repository:** `root/frontend`  
**Specification Reference:** [`theme-specification.md`](./theme-specification.md)  
**Tailwind Engine:** Tailwind CSS v4 (`@tailwindcss/vite` v4.3.3)  
**Status:** Fully Executed & Verified (All 4 Phases Complete)  

---

## 1. Executive Summary & Architectural Grounding

This implementation plan translates the **BuiltByBugs System Theme & Design Vector Specification** into a concrete, phased engineering roadmap for the `root/frontend` React application.

### 1.1 Brand Identity & Spectrum
* **Brand Concept:** High-tech cybernetic developer workspace and live productivity telemetry platform for Piyush Mishra.
* **Core Spectrum:** **Violet (`#8B5CF6`) → Royal Blue (`#3B82F6`) → Turquoise (`#06B6D4`) → Light Green / Emerald (`#10B981`)**, accented by **Metallic Gold (`#D4AF37`)** and **Midnight Purple (`#1E102F`)**.
* **Visual Pillars:**
  1. **Logo Gradient Harmony:** Violet-to-Turquoise transitions across active interactive surfaces.
  2. **High-Tech IDE Ambiance:** Dark translucent cards (`rgba(20, 16, 38, 0.75)`) over a deep midnight violet navy canvas (`#090714`).
  3. **Structured Engineering Precision:** Interlocking diagonal frames, honeycomb lattices, and metallic edge trims.
  4. **Asymmetric Data Composition:** Generous left-side negative space for code logs and telemetry, balanced by geometric vector accents on the upper right.

### 1.2 Technology Stack Adaptation (Tailwind CSS v4)
`theme-specification.md` includes a legacy `tailwind.config.js` snippet. However, `root/frontend` utilizes **Tailwind CSS v4** (`@tailwindcss/vite` v4.3.3) with `@import "tailwindcss";` in `src/styles.css`.
* **Strategy:** Configure design tokens natively inside `src/styles.css` using the `@theme` directive, custom CSS properties, and utility layer overrides.
* **Compatibility Layer:** Map legacy color tokens (`--color-page-bg`, `--color-panel`, `--color-panel-border`, `--color-accent`) to the new brand spectrum to guarantee zero regressions during phased rollout.

---

## 2. Design Token System & Tailwind v4 Configuration

### 2.1 CSS Variables & `@theme` Tokens (`src/styles.css`)

```css
@import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&family=JetBrains+Mono:wght@400;500;700&display=swap');
@import 'tailwindcss';

@theme {
  /* Fonts */
  --font-nunito: 'Nunito', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Brand Palette Tokens */
  --color-brand-bg: #090714;
  --color-brand-card: rgba(20, 16, 38, 0.75);
  --color-brand-border: rgba(139, 92, 246, 0.20);
  --color-brand-border-subtle: rgba(139, 92, 246, 0.12);
  --color-brand-violet: #8B5CF6;
  --color-brand-blue: #3B82F6;
  --color-brand-turquoise: #06B6D4;
  --color-brand-green: #10B981;
  --color-brand-gold: #D4AF37;
  --color-brand-ide: #1E102F;
  --color-brand-card-solid: #141026;

  /* Backward Compatibility Aliases */
  --color-page-bg: #090714;
  --color-panel: rgba(20, 16, 38, 0.75);
  --color-panel-border: rgba(139, 92, 246, 0.20);
  --color-muted: #99A4BE;
  --color-subtle: #78849F;
  --color-accent: #06B6D4;
  --color-accent-strong: #10B981;

  /* Gradients */
  --background-image-logo-gradient: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 50%, #06B6D4 100%);
  --background-image-spectrum-gradient: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 50%, #10B981 100%);
  --background-image-wave-gradient: linear-gradient(180deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.05) 100%);
  --background-image-network-mesh: url('/vectors/network-mesh.svg');
  --background-image-hexagon-lattice: url('/vectors/hexagon-pattern.svg');
  --background-image-wave-strata: url('/vectors/wave-strata.svg');

  /* Custom Glows & Shadows */
  --shadow-glow-violet: 0 0 20px rgba(139, 92, 246, 0.35);
  --shadow-glow-turquoise: 0 0 20px rgba(6, 182, 212, 0.35);
  --shadow-glow-green: 0 0 15px rgba(16, 185, 129, 0.30);
  --shadow-paper-depth: 0 10px 25px -5px rgba(0, 0, 0, 0.50);
  --shadow-metallic-green: 0 0 0 1px #10B981, 0 0 12px rgba(16, 185, 129, 0.25);
  --shadow-metallic-gold: 0 0 0 1px #D4AF37, 0 0 12px rgba(212, 175, 55, 0.25);

  /* Animations */
  --animate-pulse-glow: pulseGlow 3s ease-in-out infinite;

  @keyframes pulseGlow {
    0%, 100% {
      opacity: 0.6;
      filter: drop-shadow(0 0 8px rgba(6, 182, 212, 0.40));
    }
    50% {
      opacity: 1.0;
      filter: drop-shadow(0 0 16px rgba(16, 185, 129, 0.80));
    }
  }
}
```

### 2.2 Global Canvas & Ambient Lighting
Update `body` in `src/styles.css`:
* Primary canvas background: `#090714` (Midnight Violet Navy).
* Ambient radial light fields:
  * Top-Left (12% 4%): `rgba(139, 92, 246, 0.12)` (Brand Violet glow, 32rem radius).
  * Top-Right (88% 18%): `rgba(6, 182, 212, 0.09)` (Brand Turquoise glow, 30rem radius).
  * Center Section Accent: `rgba(59, 130, 246, 0.06)` (Brand Royal Blue glow, 36rem radius).

---

## 3. Vector Asset Pipeline (`public/vectors/`)

The design specification requires three dedicated vector files located in `public/vectors/`:

### 3.1 `public/vectors/hexagon-pattern.svg` (Honeycomb Lattice)
* **Visual Mechanics:** Geometric SVG tile with 40px hexagonal cells.
* **Palette:** `stroke="#06B6D4"`, `stroke-opacity="0.15"`, `stroke-width="1"`.
* **Luminous Vertices:** Key junction circles (`r="2"`, `fill="#06B6D4"`, `opacity="0.6"`) with embedded `drop-shadow` simulating live compiler/telemetry circuits.
* **Usage:** Background overlay on AST Compiler Pipeline, Coding Telemetry, and real-time feeds.

### 3.2 `public/vectors/network-mesh.svg` (Node Mesh Overlay)
* **Visual Mechanics:** Node-graph topology with interconnecting diagonal data lines.
* **Palette:** Dual-spectrum nodes transitioning from `#8B5CF6` to `#06B6D4`.
* **Usage:** Virtual workspace panels, background behind LeetCode / GitHub network graphs.

### 3.3 `public/vectors/wave-strata.svg` (Paper-Art Depth Wave Strata)
* **Visual Mechanics:** Multi-tiered organic curves stacked with `rgba(0, 0, 0, 0.45)` soft drop shadows to create physical paper-cut tactile depth.
* **Palette:** Stratified layers progressing from Midnight Violet (`#141026`), Deep Royal Blue (`#1e2850`), to Cyan mist (`rgba(6, 182, 212, 0.15)`).
* **Usage:** Section transitions in `Home.jsx`, header-to-body divider, and left-hand margin accents.

---

## 4. 4-Phase Iterative Execution Roadmap

Following Section 6 of `theme-specification.md`, implementation must proceed through four discrete, verified phases:

```
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: Token Engine & Tailwind v4 Configuration                     │
│ ── Setup styles.css @theme, CSS vars, gradients, and utility classes. │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 2: Global Canvas, Structural Wave Strata & Negative Space        │
│ ── Canvas #090714, generate SVGs, layout grid & header/footer theme.   │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 3: Component Cards, Interlocking Frames & Data Telemetry         │
│ ── Refactor WidgetShell, AST Compiler widget, GitHub repos, bento.     │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 4: Status States, Glowing Nodes, Metallic Trims & Polish        │
│ ── Pulse animations, metallic trims, drawers, MascotBot & audit.       │
└────────────────────────────────────────────────────────────────────────┘
```

---

### Phase 1: Token Engine & Tailwind v4 Setup

#### Objective
Establish all CSS tokens, color variables, gradients, and utility definitions without breaking any existing component styles.

#### Tasks & Directives
1. **Update `src/styles.css`**:
   - Add Google Font `JetBrains Mono` for code telemetry.
   - Insert the `@theme` block containing `--color-brand-*`, `--color-page-bg`, `--color-panel`, `--color-accent`, etc.
   - Configure `--shadow-glow-*`, `--shadow-paper-depth`, and `@keyframes pulseGlow`.
   - Update `body` styles to `#090714` with the Violet/Turquoise ambient radial gradient system.
2. **Add Custom Utility Classes in `@layer utilities`**:
   - `.text-gradient-logo`: `bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent`.
   - `.text-gradient-spectrum`: `bg-gradient-to-r from-[#8B5CF6] via-[#06B6D4] to-[#10B981] bg-clip-text text-transparent`.
   - `.border-metallic-green`: `border border-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.30)]`.
   - `.border-metallic-gold`: `border border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.30)]`.
3. **Verification**:
   - Run `cmd /c npm run build` to confirm Tailwind v4 compiles all `@theme` tokens cleanly.

---

### Phase 2: Background Canvas, Structural Waves & Negative Space

#### Objective
Apply the `#090714` canvas, generate vector SVG assets in `public/vectors/`, update page shells, and enforce asymmetric left-side negative space.

#### Tasks & Directives
1. **Generate Vector Assets**:
   - Create `public/vectors/hexagon-pattern.svg` (transparent honeycomb lattice with glowing vertices).
   - Create `public/vectors/network-mesh.svg` (interconnected node graph).
   - Create `public/vectors/wave-strata.svg` (multi-layered blue/violet paper-art strata).
2. **Update Application Shell (`src/App.jsx`)**:
   - Replace ambient top blur circles:
     - Change green circle (`border-accent/10`) to Violet (`border-brand-violet/20 bg-brand-violet/[0.03]`).
     - Change light-blue circle (`border-[#93c5fd]/10`) to Turquoise (`border-brand-turquoise/20 bg-brand-turquoise/[0.03]`).
   - Add backdrop layer for subtle wave strata accenting left margins.
3. **Header Modernization (`src/components/miscellaneous/Header.jsx`)**:
   - Update border to `border-brand-border-subtle`.
   - Update logo typography and hover state with logo-gradient text sheen.
   - Update navigation pill active state: `bg-brand-violet/15 text-white border border-brand-violet/30`.
   - Update Live status indicator: `bg-brand-green` with `shadow-glow-green`.
4. **Footer Modernization (`src/components/miscellaneous/Footer.jsx`)**:
   - Replace `bg-black border-white/10` with `bg-brand-bg/95 border-t border-brand-border-subtle backdrop-blur-md`.
   - Apply brand hover colors (`hover:text-brand-turquoise`).
5. **Enforce Asymmetrical Data Composition (`src/pages/Home.jsx` & `AlternatingStoryRow.jsx`)**:
   - Maintain generous left negative space for titles, code telemetry, and timestamps.
   - Position geometric vector accents (`hexagon-lattice` or decorative line glyphs) on the upper-right corner of alternating rows.
   - Tint numeric watermarks (`01`, `02`, `03`) to `text-brand-violet/10`.

---

### Phase 3: Component Cards, Interlocking Frames & Data Telemetry

#### Objective
Refactor all widget containers, coding telemetry displays, GitHub repo cards, and the tech stack showcase to match the translucent dark violet surface and diagonal interlocking geometry.

#### Tasks & Directives
1. **Unified Widget Container (`src/components/miscellaneous/WidgetShell.jsx`)**:
   - Replace `border-[#9eaedb]/16 bg-linear-to-br from-[#11172a]/78 to-[#0d111f]/52` with:
     `rounded-2xl border border-brand-border bg-brand-card backdrop-blur-md p-6 shadow-paper-depth transition-all duration-300 hover:border-brand-violet/40`.
   - Apply subtle top-right corner vector accent geometry (`stroke-brand-turquoise/20`).
2. **Foundation Card (`src/components/miscellaneous/FoundationCard.jsx`)**:
   - Match `WidgetShell` styling with `bg-brand-card border-brand-border backdrop-blur-md`.
3. **Coding Cadence & Telemetry Cards (`src/components/coding/CodingTracker.jsx` & `CodingSummary.jsx`)**:
   - Overlay `bg-hexagon-lattice` in container backgrounds.
   - Update language badges to strict specification colors:
     * **TypeScript:** `#8B5CF6` (Brand Violet)
     * **JavaScript:** `#3B82F6` (Brand Blue)
     * **Automation / Config / JSON:** `#06B6D4` (Brand Turquoise)
     * **Live Uptime / Activity:** `#10B981` (Brand Green)
   - Refactor progress bar fill to `bg-gradient-to-r from-brand-violet via-brand-blue to-brand-turquoise`.
   - Update telemetry metric stat boxes to `bg-brand-bg/60 border border-brand-border-subtle`.
4. **GitHub Repository Widgets & Showcases (`src/components/github/`)**:
   - `GithubWidget.jsx` & `GitHubShowcase.jsx`:
     - Stat cards updated to `bg-brand-bg/60 border border-brand-border-subtle hover:border-brand-violet/40`.
   - `RepositoryGrid.jsx`:
     - Apply interlocking diagonal card appearance: subtle 1-degree offset accent borders, rounded corners, and `shadow-paper-depth`.
     - Highlight active repositories (e.g., `BuiltByBugs`, `DEE`) with **1px Metallic Emerald/Gold Trims** (`border-metallic-green` / `border-metallic-gold`).
   - `ContributionHeatmap.jsx`:
     - Harmonize cell color levels: level 0 = `bg-brand-bg/80`, level 1 = `#06B6D4/30`, level 2 = `#06B6D4/60`, level 3 = `#10B981/70`, level 4 = `#10B981`.
5. **Tech Stack Bento Grid (`src/components/tech/TechStackBento.jsx`)**:
   - Update card backgrounds to `bg-brand-card backdrop-blur-md border border-brand-border-subtle`.
   - Update interactive mouse-spotlight radial gradient from dark green to:
     `radial-gradient(280px circle at var(--mouse-x) var(--mouse-y), rgba(139, 92, 246, 0.25), rgba(6, 182, 212, 0.15), transparent 80%)`.
   - Subtitle accents styled with `text-brand-turquoise`.
6. **AST Compiler Pipeline Widget Integration (Section 5.1)**:
   - Provide a dedicated presentation module / state-mapping in `CodingTracker` or `BulletinWidget`:
     * **Queued / Parsing:** Violet indicator badge (`#8B5CF6`, `bg-brand-violet/10 text-brand-violet border border-brand-violet/30`).
     * **Active Execution:** Turquoise pulse glow (`#06B6D4` with `animate-pulse-glow` class).
     * **Build Success:** Crisp Light Green badge (`#10B981`) framed with a 1px metallic emerald border trim.
7. **Antigravity IDE & Virtual Workspace Panel (Section 5.3)**:
   - Apply Midnight Purple container background (`#1E102F`) with `shadow-glow-violet`.
   - Add floating window header with turquoise focus cursor and emerald uptime pill.

---

### Phase 4: Status States, Glowing Nodes, Metallic Trims & Interaction Polish

#### Objective
Wire the dynamic state animations, polish secondary pages (`Library.jsx`, `Project.jsx`), modernize drawers, and harmonize MascotBot without breaking mobile responsiveness.

#### Tasks & Directives
1. **Interactive Drawers (`src/components/drawer/GlobalDrawer.jsx` & `Drawer.jsx`)**:
   - Modernize drawer container: `bg-[#0e0a1e]/95 backdrop-blur-xl border-l border-brand-border shadow-2xl`.
   - Form inputs: `bg-brand-bg/80 border border-brand-border-subtle text-white focus:ring-1 focus:ring-brand-turquoise focus:border-brand-turquoise`.
   - Action buttons: `bg-gradient-to-r from-brand-violet to-brand-turquoise text-white hover:opacity-95 shadow-glow-turquoise`.
2. **LeetCode & Library Polish (`LeetcodeStats.jsx`, `ArticleCard.jsx`, `DocumentCard.jsx`)**:
   - LeetCode difficulty badges:
     * Easy: `#10B981` (Brand Green)
     * Medium: `#06B6D4` (Brand Turquoise)
     * Hard: `#8B5CF6` (Brand Violet)
   - Article & Document cards: `bg-brand-card border-brand-border hover:border-brand-turquoise/40 hover:-translate-y-1`.
   - Read & View links: `text-brand-turquoise hover:text-brand-green`.
3. **MascotBot Hologram & LED Harmonization (`MascotBot.jsx`, `MascotFace.jsx`, `MascotChassis.jsx`)**:
   - Verify LED visor gradients: `#eyeLedCyan` aligned to `#06B6D4`, `#eyeLedAmber` for Easter eggs.
   - Ensure the SVG `#hologlow` filter harmonizes with the brand turquoise drop-shadow.
4. **Mobile Responsiveness Preservation (Skill Audit)**:
   - Verify that the mobile tab bar in `src/pages/Project.jsx` retains `sticky z-20 top-[84px] bg-[#090714]/90 backdrop-blur-md` and active tab `bg-brand-violet/20 border-brand-violet/40 text-white`.
   - Check that `RepositoryGrid` mobile compact view retains the `limit={4}` constraint.
   - Ensure no horizontal overflow on 320px screens.
5. **Accessibility & Contrast Verification**:
   - Check contrast ratios: white/slate-100 headers on `#090714` (> 12:1), `#99A4BE` muted text on `#141026` (> 4.8:1, exceeding WCAG AA 4.5:1).

---

## 5. File-by-File Impact Matrix

| File Path | Nature of Edits | Tokens / Vectors Used | Risk Level |
| :--- | :--- | :--- | :--- |
| `src/styles.css` | Define Tailwind v4 `@theme`, CSS variables, body background, keyframes | Palette, gradients, shadows, `pulseGlow` | Low (Aliased) |
| `public/vectors/*.svg` | Create 3 new vector files (`hexagon`, `network`, `wave`) | `#06B6D4`, `#8B5CF6`, `#10B981`, `#141026` | Low (New files) |
| `src/App.jsx` | Update ambient glow rings, inject wave backdrop layer | `border-brand-violet/20`, `border-brand-turquoise/20` | Low |
| `src/components/miscellaneous/Header.jsx` | Logo gradient hover, nav active state, live green pill | `text-gradient-logo`, `brand-violet`, `brand-green` | Low |
| `src/components/miscellaneous/Footer.jsx` | Dark violet background, subtle border, brand hover links | `bg-brand-bg/95`, `border-brand-border-subtle` | Low |
| `src/components/miscellaneous/WidgetShell.jsx` | Card surface, 1px violet border, backdrop-blur, paper shadow | `bg-brand-card`, `border-brand-border`, `shadow-paper-depth` | Medium |
| `src/components/miscellaneous/FoundationCard.jsx` | Translucent card styling | `bg-brand-card`, `border-brand-border` | Low |
| `src/components/layout/AlternatingStoryRow.jsx` | Tinted watermarks, right-hand vector hook, left negative space | `text-brand-violet/10`, `text-brand-turquoise` | Low |
| `src/pages/Home.jsx` | Hero typography gradients, wave strata section dividers | `text-gradient-spectrum`, `wave-strata` | Medium |
| `src/pages/Project.jsx` | Mobile tab bar colors, tab active indicators | `bg-brand-violet/20`, `border-brand-violet/40` | Low |
| `src/pages/Library.jsx` | Section headers and layout card alignment | `bg-brand-card`, `border-brand-border` | Low |
| `src/components/coding/CodingTracker.jsx` | Language color tags (TS/JS/JSON/Uptime), progress bar gradient | `#8B5CF6`, `#3B82F6`, `#06B6D4`, `#10B981` | Medium |
| `src/components/github/GithubWidget.jsx` | Card surfaces, follower stat boxes, brand links | `bg-brand-card`, `border-brand-border` | Low |
| `src/components/github/RepositoryGrid.jsx` | Interlocking diagonal frame, metallic trim on key repos | `border-metallic-green`, `border-metallic-gold` | Medium |
| `src/components/github/ContributionHeatmap.jsx` | Heatmap scale mapped to turquoise-to-emerald spectrum | Level 1-4 turquoise/emerald | Low |
| `src/components/tech/TechStackBento.jsx` | Interactive mouse glow gradient, card surfaces, subtitle text | Violet/Turquoise radial spotlight | Medium |
| `src/components/bulletin/BulletinWidget.jsx` | Slide dots (`brand-turquoise`), milestone metallic trim | `shadow-glow-turquoise`, `border-metallic-green` | Low |
| `src/components/drawer/GlobalDrawer.jsx` | Drawer panel, form inputs, submit button gradient & glow | `bg-[#0e0a1e]/95`, `from-brand-violet to-brand-turquoise` | Low |
| `src/components/mascot/` | Verify LED fill and hologram filter consistency | `hologlow`, `#06B6D4` | Low |

---

## 6. Execution & Verification Protocol

Coding agents executing this plan should follow this verification sequence after each phase:

1. **Static Analysis & Linting:**
   ```bash
   cmd /c npm run lint
   ```
2. **Production Bundle Compilation:**
   ```bash
   cmd /c npm run build
   ```
3. **Format Integrity Check:**
   ```bash
   cmd /c npm run format:check
   ```
4. **Visual & Responsive Inspection:**
   - Verify layout on **Desktop (1440px / 1120px)**: Confirm asymmetric balance, right-corner geometries, and crystal-clear left negative space.
   - Verify layout on **Mobile (375px / 320px)**: Confirm sticky tab bar on `/project`, zero horizontal scroll, and touch targets $\ge 44\text{px}$.
   - Verify state triggers: Active pulse-glow on running pipelines, emerald metallic trim on passing/milestone cards.

---
## 7. Rollout & Verification Summary

All four phases have been systematically executed and verified against both `theme-specification.md` and repository standards:

1. **Phase 1 (Theme Foundation & CSS Variables):** Integrated `@theme` in `src/styles.css` with Google Fonts (`Nunito`, `JetBrains Mono`), core palette tokens, backward-compatible aliases, custom glows, paper depth, and metallic utility borders.
2. **Phase 2 (Structural Geometry & Global Layout):** Created SVG vector files (`hexagon-pattern.svg`, `network-mesh.svg`, `wave-strata.svg`) in `public/vectors/`; refactored `App.jsx`, `Header.jsx`, `Footer.jsx`, `AlternatingStoryRow.jsx`, and `Home.jsx`.
3. **Phase 3 (Component Cards & Data Telemetry):** Updated `WidgetShell.jsx`, `FoundationCard.jsx`, `CodingTracker.jsx`, `CodingSummary.jsx`, `GithubWidget.jsx`, `GitHubShowcase.jsx`, `RepositoryGrid.jsx`, `ContributionHeatmap.jsx`, `TechStackBento.jsx`, and `BulletinWidget.jsx` with AST Compiler Pipeline badges and metallic trims.
4. **Phase 4 (Pages, Status States & Interactive Polish):** Polished `Project.jsx`, `Library.jsx`, `ArticleCard.jsx`, `DocumentCard.jsx`, `LeetcodeStats.jsx`, `Services.jsx` (`AutoSwitchHireTag`), `Drawer.jsx`, `GlobalDrawer.jsx`, and `MascotBot` components.
5. **Testing & QA Verification:**
   - `cmd /c npm run lint`: Passed with 0 errors and 0 warnings.
   - `cmd /c npm run build`: Vite v8.2.2 compiled client bundle cleanly with 0 errors in ~470ms.
   - Mobile responsiveness constraints preserved intact across all breakpoints.

---
*End of Implementation Plan.*
