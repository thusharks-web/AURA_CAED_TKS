# ✦ Aura CAED — Engineering Drawing Platform

> Browser-based 2D CAD / Engineering Drawing Practice Platform for VTU Students

**Built by Thushar K S** — Computer Science & Engineering, BMSIT&M, Bengaluru (Batch 2026)

## 🚀 Features

- **40+ SolidWorks-Style Drawing Tools** — Line, Circle, Arc, Ellipse, Rectangle, Polygon, Spline, Point, Trim, Fillet, Offset, Mirror, Move, Copy, Rotate, Scale, and more
- **Smart Dimension System** — Linear, Radial, Angular dimensions with ISO arrowheads
- **Snap & Constraint Engine** — Grid snap, endpoint snap, with visual indicators
- **Layer Management** — Named layers with visibility, lock, and color controls
- **Multi-Format Export** — PDF, SVG, PNG export with one click
- **60+ VTU Exercises** — All 10 CAED modules covered with difficulty ratings
- **Supabase Backend** — User auth, drawing save/load, cloud persistence
- **SolidWorks 2019 UI** — Familiar ribbon, toolbar, properties panel, and status bar
- **Keyboard Shortcuts** — Full SolidWorks shortcut mapping (L, C, R, D, T, etc.)
- **Undo/Redo** — Unlimited undo/redo with persistent history

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| State | Zustand |
| Canvas | HTML5 Canvas API |
| Styling | Vanilla CSS (custom design system) |
| Backend | Supabase (Auth + PostgreSQL + RLS) |
| Export | jsPDF, SVG |
| UI | Lucide Icons, Framer Motion |
| Routing | React Router v6 |

## 📦 Setup

```bash
# Clone
git clone https://github.com/thusharks-web/AURA_CAED_TKS.git
cd AURA_CAED_TKS

# Install
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Supabase URL and anon key

# Run dev server
npm run dev
```

## 📐 VTU CAED Modules Covered

1. **Introduction to Engineering Drawing** — Lettering, title block, scales
2. **Curves** — Ellipse, parabola, cycloid, involute, spirals
3. **Projection of Points & Lines** — All quadrants, inclined lines
4. **Projection of Planes** — Regular polygons inclined to planes
5. **Projection of Solids** — Prisms, pyramids, cylinders, cones
6. **Section of Solids** — Cutting planes, true shapes
7. **Development of Surfaces** — Lateral surface development
8. **Isometric Projections** — Isometric scale and views
9. **Orthographic Projections** — First/third angle, multiview
10. **Dimensioning & Annotation** — IS/ISO standards, GD&T

## ⌨️ Keyboard Shortcuts

| Key | Tool |
|-----|------|
| L | Line |
| C | Circle |
| R | Rectangle |
| A | Arc |
| D | Smart Dimension |
| T | Trim |
| O | Offset |
| M | Mirror |
| Q | Construction Mode |
| G | Grid Toggle |
| S | Select |
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |
| Esc | Deselect/Exit Tool |
| Delete | Delete Selected |

## 📄 License

MIT © 2026 Thushar K S
