# Victor Ironali Portfolio

A modern, dark-themed portfolio website showcasing the work of Victor Ironali, Senior Product Designer and UX Engineer with 6+ years of experience in SaaS, fintech, and EdTech.

## About Victor

Victor Ironali is a product designer and UX engineer based in Dublin, Ireland. With over 6 years of experience, he specializes in creating intuitive digital experiences that bridge business goals with user needs. Currently working as Lead UX/Product Designer at Jobin.cloud.

### Experience

- **Jobin.cloud** (Jan 2024 - Present) — Lead UX/Product Designer, Dublin
- **ERCAS** (Aug 2015 - Mar 2024) — Product Designer, London
- **NaliTech Consults** (Apr 2020 - Dec 2023) — Web Designer, Remote

## Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite 8
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Styling:** CSS with custom properties

## Design System

The portfolio features a cohesive dark theme design:

- **Background:** #050505 (primary), #0a0a0a (secondary)
- **Text:** #fafafa (primary), #a3a3a3 (secondary), #525252 (tertiary)
- **Typography:** Space Grotesk (headings), Inter (body)
- **Components:** Glass panels with backdrop blur, pill buttons, smooth animations

## Features

- Responsive design with mobile-first approach
- Dark/Light theme toggle with localStorage persistence
- Smooth scroll navigation
- Animated section reveals on scroll
- Image hover animations
- CV download functionality

## Sections

1. **Hero** — Introduction with profile photo and call-to-action
2. **Services** — Four core offerings (UI/UX Design, Front-End Dev, Design Systems, Product Strategy)
3. **Projects** — 10 selected works split into Live Projects and Concept Projects
4. **Skills** — Grid of 12 tools and technologies
5. **Footer** — Contact links and social profiles

## Projects

### Live Projects
- **Jobin.cloud** — B2B recruitment platform redesign (50K+ companies)
- **KoloFund** — B2C fintech micro-investment app for Gen Z
- **Governance Resource Hub** — EdTech platform with AI-powered content summaries
- **NaliTech Consults** — Custom WordPress solutions for SMEs

### Concept Projects
- EduFlow, HealthTrack, EcoConnect, TaskMaster AI, FinWiz, TravelBuddy

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
portfolio/
├── src/
│   ├── assets/           # Images and static assets
│   ├── components/       # React components
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── Services.jsx
│   │   ├── Projects.jsx
│   │   ├── Skills.jsx
│   │   └── Footer.jsx
│   ├── App.jsx           # Main app component
│   ├── index.css         # Global styles
│   └── main.jsx          # Entry point
├── index.html
└── vite.config.js
```

## Customization

### Updating Content

- **Personal Info:** Edit `Hero.jsx` for bio and introduction
- **Services:** Modify the `SERVICES` array in `Services.jsx`
- **Projects:** Update `LIVE_PROJECTS` and `CONCEPT_PROJECTS` in `Projects.jsx`
- **Skills:** Edit the `SKILLS` array in `Skills.jsx`
- **Contact Links:** Update links in `Footer.jsx`

### Assets

- **Logo:** `src/assets/VI_Logo_White.png`
- **Profile Image:** `src/assets/Ironali.png`
- **CV PDF:** `src/assets/Victor Ironali (2).pdf`

### Theme

The site uses CSS custom properties for theming. Toggle between dark and light themes using the sun/moon button in the navbar. Theme preference is saved to localStorage.

## License

This portfolio is created for Victor Ironali. All rights reserved.
