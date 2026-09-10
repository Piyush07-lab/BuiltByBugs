---
name: mobile-responsive-overhaul
description: Algorithmic guide and solution model for resolving mobile responsiveness issues in UI frontend tasks, specifically tackling layout shifts, excessive vertical density, horizontal overflow, and dense list layouts.
---

# Mobile Responsiveness Overhaul Skill

## Context
Use this skill when you are tasked with fixing a web application that looks fine on desktop viewports but breaks, shifts, or becomes excessively long and unwieldy on mobile viewports.

## The Audit Algorithm
When approaching a mobile responsiveness task, run through this diagnostic checklist:

1. **Height/Shift Analysis**: Do dynamic components (carousels, sliders, conditional renders) cause the page length to jump?
2. **Vertical Density Analysis**: Does stacking all desktop sections vertically result in an unmanageable infinite scroll on mobile?
3. **Horizontal Overflow Analysis**: Do grids, tables, or charts overflow the `100vw` boundary, requiring horizontal scrolling or causing clipping?
4. **Information Density Analysis**: Are list items (e.g., cards) showing too much secondary information for a narrow screen?
5. **Cramping Analysis**: Do inline flex elements (like navigation headers) lack breathing room on 320px screens?

## The Solution Matrix

Apply the following architectural patterns based on the diagnostic results above.

### Pattern A: The "Fixed-Min Constraint" (Solves Layout Shifts)
* **Problem**: Dynamic content changing heights causes the container to shrink/grow, shifting the viewport.
* **Solution**: Find the maximum possible height of the dynamic content and apply it as a `min-height` specifically for mobile.
* **Implementation (Tailwind)**: `min-h-[Xpx] md:h-auto`

### Pattern B: The "Mobile Tab Bar" (Solves Vertical Density)
* **Problem**: Too many heavy sections stacked vertically.
* **Solution**: Convert linear vertical sections into a sticky, horizontal tab bar exclusively for mobile.
* **Implementation**:
    1. Define tabs and an active state (`useState`).
    2. Sync state with the URL hash (`window.location.hash`) so the browser back button works and links are shareable.
    3. Render the tab bar with `sticky top-[header_height] z-20 backdrop-blur`.
    4. Conditionally render the heavy sections based on the active tab using `md:hidden` wrappers.
    5. Keep the desktop view intact using `hidden md:grid` wrappers.

### Pattern C: The "Fluid Auto-Scale Grid" (Solves Horizontal Overflow)
* **Problem**: Fixed-pixel grids (like heatmaps or charts) break out of the viewport.
* **Solution**: Replace fixed measurements with relative units, aspect ratios, and clamped gaps.
* **Implementation (Tailwind)**:
    1. Remove `overflow-x-auto` and `w-max`.
    2. Set parent to `w-full`.
    3. Make cells `aspect-square` instead of fixed `h-X w-X`.
    4. Use `clamp(min, preferred, max)` for the grid gap.

### Pattern D: The "Dual-Render Compact List" (Solves Information Density)
* **Problem**: Large cards look great in a 3-column desktop grid, but take up too much vertical space when forced into a 1-column mobile stack.
* **Solution**: Render two different UI structures based on breakpoints, and apply a cap to the number of items shown on mobile.
* **Implementation (React + Tailwind)**:
    1. Pass a `limit` prop.
    2. Add an `expanded` state and a "Show All" toggle button.
    3. **Desktop (`hidden md:grid`)**: Map items to rich, multi-line cards.
    4. **Mobile (`flex flex-col md:hidden`)**: Map items to compact, single-line rows (e.g., Title, Badge, Icon) with smaller text.

### Pattern E: The "Micro-Scaling Polish" (Solves Cramping)
* **Problem**: Headers or toolbars feel tight on 320px screens.
* **Solution**: Scale down paddings and font sizes strictly below the `sm:` breakpoint.
* **Implementation (Tailwind)**: `px-2.5 sm:px-3.5 text-[0.8rem] sm:text-[0.9rem]`
