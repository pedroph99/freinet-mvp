---
name: Freinet
description: A calm, readable teaching dashboard for grades and attendance.
colors:
  ink: "#1d3438"
  sidebar: "#173139"
  sidebar-active: "#31585c"
  teal: "#28776d"
  teal-deep: "#1c5552"
  mint-panel: "#dbece7"
  mint-soft: "#e8f4f0"
  canvas: "#f7f8f6"
  paper: "#ffffff"
  border: "#e5ebe7"
  muted-text: "#81918f"
  amber: "#ab7841"
  amber-soft: "#fbefdf"
  blue-soft: "#eaf0f6"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "47px"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-.065em"
  headline:
    fontFamily: "Manrope, sans-serif"
    fontSize: "30px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-.045em"
  title:
    fontFamily: "Manrope, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    letterSpacing: "-.025em"
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "13px"
    fontWeight: 400
  label:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "11px"
    fontWeight: 700
rounded:
  badge: "5px"
  field: "7px"
  control: "8px"
  highlight: "9px"
  card: "12px"
  dialog: "14px"
  pill: "30px"
spacing:
  tight: "7px"
  control: "10px"
  grid: "14px"
  panel: "24px"
  page: "40px"
components:
  navigation-active:
    backgroundColor: "{colors.sidebar-active}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "13px 15px"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "#213b3e"
    rounded: "{rounded.card}"
    padding: "{spacing.panel}"
  average-card:
    backgroundColor: "{colors.mint-panel}"
    textColor: "{colors.teal-deep}"
    rounded: "{rounded.card}"
    padding: "21px 24px 18px"
  sort-button:
    backgroundColor: "{colors.paper}"
    textColor: "#5a7470"
    rounded: "{rounded.field}"
    height: "36px"
    padding: "0 11px"
  grade-good:
    backgroundColor: "#e5f3eb"
    textColor: "#267253"
    rounded: "{rounded.badge}"
    padding: "4px 6px"
  grade-attention:
    backgroundColor: "#fff0e5"
    textColor: "#ae7744"
    rounded: "{rounded.badge}"
    padding: "4px 6px"
---

# Design System: Freinet

## Overview

**Creative North Star: "The Teacher's Ledger"**

A composed workspace for a teacher scanning a class, identifying who needs attention, and opening a student's details. The visual language borrows the clarity of a well-kept ledger: structured rows, aligned figures, restrained color, and generous separation between groups of information.

The dark teal rail anchors navigation. A soft neutral canvas holds white information panels, while the mint average panel establishes the main reading point. Teal indicates healthy performance; amber marks attention without making the whole interface feel alarming. The density is deliberate: numbers and labels stay compact so a teacher can compare students quickly.

**Key Characteristics:**
- Quiet, trustworthy color with teal as the main signal.
- Compact, tabular data set in soft bordered panels.
- Strong Manrope figures and headings paired with unobtrusive DM Sans text.
- A custom F mark, responsive navigation, and an accessible student detail dialog with tabs.
- Shared page pills for Visão geral and Gerenciamento de aulas, with the current area highlighted.

## Colors

The palette moves from deep teal navigation through mint emphasis to a warm, nearly white workspace.

### Primary
- **Deep Teal** (`sidebar`): persistent navigation and the strongest frame.
- **Ledger Teal** (`teal`): data emphasis, links, progress, and positive actions.
- **Mint Highlight** (`mint-panel`): the featured average panel; use once to establish the dashboard's main figure.

### Secondary
- **Warm Amber** (`amber`, `amber-soft`): attention states and the approval threshold marker.
- **Cool Blue Mist** (`blue-soft`): a restrained category cue for attendance.

### Neutral
- **Ink** (`ink`): primary text.
- **Canvas** (`canvas`): page background.
- **Paper** (`paper`): cards, toolbar, and dialog surfaces.
- **Soft Border** (`border`): panel and row separation.
- **Muted Text** (`muted-text`): supporting descriptions and metadata.

**The Signal Color Rule.** Teal and amber carry the important performance distinctions; surrounding surfaces stay neutral enough for those signals to read immediately.

## Typography

**Display Font:** Manrope (sans-serif fallback)  
**Body Font:** DM Sans (sans-serif fallback)

**Character:** Manrope gives totals and section headings a firm, modern presence. DM Sans stays compact and legible across controls, descriptions, table cells, and metadata.

### Hierarchy
- **Display** (800, 47px, 1.1): the featured average; use tabular figures and tight tracking.
- **Headline** (800, 30px, 1.2): the page heading; reduces to 26px on small screens.
- **Title** (700, 16px): section headings and grouping labels.
- **Body** (400, 13px): explanations and empty states.
- **Label** (700, 11px): controls, table data, and compact cards; the class selector caption is uppercase at 10px with wider tracking.

**The Comparable Numbers Rule.** Keep grades, attendance, counts, and ranking values in tabular numerals so columns do not shift visually.

## Layout

The desktop shell has a sticky 236px sidebar, a 68px topbar, and a centered content area capped at 1600px with 40px side padding. The opening metric grid gives the average panel more width than each of the three summary cards. A two-column insight row follows; the ranking table occupies the full content width and scrolls horizontally when necessary. Cards use a recurring 14px grid gap and about 24px internal padding.

The lessons area reuses this shell and adds page navigation pills below the topbar. Its opening metrics lead with the registered date range and lesson count. Compact bars compare attendance across recent lessons and classes. A lesson list sits beside its selected attendance roster on desktop and stacks above it on mobile.

At 1180px, the sidebar narrows to 200px and the average spans the first metric row. From 621px to 800px, the sidebar is 150px wide with both icons and text labels visible, while insights stack. At 620px and below, navigation becomes a 56px sticky top strip that keeps the brand and link labels visible; content padding becomes 16px, the metrics use two columns, and toolbar controls reflow. The student dialog becomes a bottom sheet at that width; its grade grid reduces from five to three columns.

**The Scanning Rule.** Keep labels next to their figures and preserve numeric column alignment; allow the ranking table to scroll rather than compressing its data beyond readability.

## Elevation & Depth

The dashboard is largely flat. White cards separate from the neutral canvas through subtle borders; the mint average card uses tone and a border. A deep shadow belongs only to the modal dialog, where elevation marks a genuine change of focus. The backdrop darkens the workspace while details are open.

### Shadow Vocabulary
- **Dialog lift** (`0 24px 70px rgba(8,30,31,.24)`): reserved for the student detail dialog.

**The Quiet Surface Rule.** Resting dashboard cards use borders and tone instead of decorative drop shadows.

## Shapes

Cards have gently rounded 12px corners; the dialog uses 14px. Controls and active navigation use 7–8px corners, compact value badges use 5px, and status labels are full pills. Student photos and highlight icons are circular; photos crop to fill and fall back to initials when unavailable. Fine borders define data groupings without adding visual weight.

## Components

### Buttons
- **Shape:** Compact controls with 7px corners; detail and icon actions remain visually light.
- **Sort control:** White, bordered, 36px tall, with a subtle pale hover background; its label states the current order.
- **Detail action:** Teal text and arrow without a filled background; underline on hover.
- **Focus:** A visible amber outline (3px) and offset (3px) is shared by keyboard-focusable controls.

### Cards / Containers
- **Summary cards:** White with fine borders and 12px corners; the average panel uses mint tone and an internal progress rule.
- **Insight panels:** White, bordered, and padded for chart and highlight comparison.
- **Ranking container:** A single white bordered panel holds heading, controls, horizontally scrollable table, empty state, and footer.

### Inputs / Fields
- **Class selector:** White bordered control with a custom chevron and compact uppercase label.
- **Search:** A 36px bordered field with an inline search icon; the input itself has no inner border.
- **States:** Keyboard focus uses the shared visible outline. Search filters by name or registration number and shows an empty state when no rows match.

### Navigation
- **Sidebar:** Deep teal, sticky, with pale text; active links receive a lighter teal rounded background. Keep icons and text labels together in the narrower 150px sidebar at medium widths. At phone widths, place the brand and labeled links in a short top strip.
- **Brand:** Use the Freinet F mark from `frontend/public/freinet-mark.svg` alongside the lowercase wordmark. The mark replaces the generic graduation cap in navigation, loading, and the favicon.

### Status and Grade Badges
- **Good:** Mint background with dark green text.
- **Attention:** Warm pale amber background with amber text. Every badge includes its numeric grade or a readable status label; color does not carry meaning alone.

### Student Detail Dialog
- **Surface:** White, rounded, shadowed, and capped at 680px on desktop. A dark translucent backdrop separates it from the ranking.
- **Behavior:** Opens from a student row or highlight, traps keyboard focus, closes with Escape, restores focus to its trigger, and moves to a bottom sheet layout on small screens. Respect reduced-motion preferences.
- **Tabs:** Keep overview and annotations in one dialog. The active tab uses a thin teal underline; technical notes use a mint heading and disciplinary notes a warm amber heading. Show an explicit empty state when a category has no records.

## Do's and Don'ts

### Do:
- **Do** use the mint featured panel for the leading class average and keep adjacent summary cards white.
- **Do** keep the table's numeric values aligned and use tabular figures.
- **Do** use the shared amber focus outline on keyboard-focusable controls.
- **Do** preserve the compact mobile navigation and scrollable table behavior.

### Don't:
- **Don't** put modal-strength shadows on ordinary cards.
- **Don't** use color alone to communicate grade or attendance status.
- **Don't** reduce the ranking table to clipped, unreadable columns on narrow screens.
