# Copilot Instructions for AI Coding Agents

## Project Overview
This is a TypeScript/React web application for tracking scores in a multi-round, trick-taking card game. The app is built with Vite and uses Tailwind CSS for styling. It features dynamic game setup, round-by-round bidding and trick entry, score calculation, and results display.

## Architecture & Key Patterns
- **Entry Point:** `src/main.tsx` bootstraps the app; `src/App.tsx` is the root component.
- **Pages:** Main logic is in `src/pages/Index.tsx`, which manages game state and orchestrates rounds, scoring, and navigation.
- **Components:** Game phases are modularized in `src/components/` (e.g., `GameSetup`, `BiddingRound`, `TricksRound`, `ScoreDisplay`, `ResultsPage`). UI primitives are in `src/components/ui/`.
- **State Management:** Uses React hooks (`useState`) for local state. Game state transitions are managed in `Index.tsx`.
- **Custom Hooks:** Found in `src/hooks/` (e.g., `use-mobile.tsx`, `use-toast.ts`).
- **Utilities:** Shared logic in `src/lib/utils.ts`.
- **Styling:** Tailwind CSS config in `tailwind.config.ts`; global styles in `src/App.css` and `src/index.css`.

## Developer Workflows
- **Install dependencies:** `npm i` or `bun install`
- **Start dev server:** `npm run dev` or `bun run dev`
- **Build for production:** `npm run build` or `bun run build`
- **No explicit test setup detected** (add details if test files are introduced)

## Project-Specific Conventions
- **Game Logic:** All game state and transitions are handled in `Index.tsx` using clear state enums (`setup`, `bidding`, `tricks`, `scores`, `results`).
- **Component Communication:** Props are used for data flow between parent and child components. Example: `BiddingRound` and `TricksRound` receive player data and callbacks for updating state.
- **Round Structure:** The game uses a fixed round structure and trump suit rotation, defined in arrays in `Index.tsx`.
- **Scoring:** Score calculation logic is encapsulated in helper functions within `Index.tsx`.
- **UI Primitives:** All buttons, dialogs, and other UI elements use custom components from `src/components/ui/` for consistency.

## Integration Points & External Dependencies
- **Vite:** Fast build and dev server (`vite.config.ts`).
- **Tailwind CSS:** Utility-first styling (`tailwind.config.ts`, `postcss.config.js`).
- **Lucide-react:** Used for icons (see imports in `Index.tsx`).

## Examples
- To add a new game phase, create a component in `src/components/`, update state logic in `Index.tsx`, and pass necessary props.
- To update scoring rules, modify the helper functions in `Index.tsx`.
- To add a new UI element, use or extend primitives in `src/components/ui/`.

## Key Files & Directories
- `src/pages/Index.tsx`: Main game logic and state
- `src/components/`: Game phase and UI components
- `src/components/ui/`: UI primitives
- `src/hooks/`: Custom hooks
- `src/lib/utils.ts`: Shared utilities
- `tailwind.config.ts`, `vite.config.ts`: Configuration

---
For unclear or missing conventions, ask the user for clarification before making assumptions. Always follow the patterns found in the above files unless directed otherwise.
