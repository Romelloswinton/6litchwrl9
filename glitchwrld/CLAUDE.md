# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a 3D Galaxy visualization project built with React, TypeScript, and Three.js. The project consists of two main parts:

- **Root directory**: Contains dependencies from the original root package.json
- **glitchwrld/**: Main React application with Vite build system

## Commands

### Development Commands (run from glitchwrld/ directory)

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (runs TypeScript compiler then Vite build)
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

### Project Setup

- `cd glitchwrld && npm install` - Install all dependencies
- Dependencies are managed in `glitchwrld/package.json`

## Architecture Overview

### State Management

- **Zustand Store** (`src/stores/galaxyStore.ts`): Central state management for galaxy properties, camera controls, animations, and Spline integration
- Reactive state updates trigger component re-renders and galaxy regeneration

### Component Structure

- **GalaxyScene**: Main scene wrapper with Canvas, controls, and post-processing effects
- **Galaxy**: Core particle system generating spiral galaxy structure with procedural generation
- **SplineModels**: Integration layer for Spline 3D models within the Three.js scene
- **GalaxyControls**: Leva-based real-time parameter controls
- **LoadingScreen/ErrorBoundary**: User experience components

### 3D Graphics Stack

- **React Three Fiber**: React renderer for Three.js
- **@react-three/drei**: Helper components (OrbitControls, Environment, Stars)
- **@react-three/postprocessing**: Bloom, Noise, and Vignette effects
- **Three.js**: Core 3D graphics library for particle systems and lighting

### Spline Integration

- **@splinetool/react-spline**: React component for embedding Spline scenes
- **@splinetool/runtime**: Spline runtime for model loading and interaction
- Custom hooks (`useSplineIntegration`) handle model loading, animation, and event management

### Custom Hooks

- **useGalaxyAnimation**: Manages rotation, pulsing effects, and time-based animations
- **useGalaxyInteraction**: Handles mouse/touch interactions, camera movement, and object selection
- **useSplineIntegration**: Manages Spline model loading, events, and integration with the galaxy scene

### Utilities

- **GalaxyGenerator**: Procedural generation of spiral galaxy particle systems with configurable parameters
- **SplineHelpers**: Utilities for Spline model positioning, preloading, and camera presets

### Galaxy Generation Algorithm

The galaxy uses a spiral arm algorithm:

1. Distributes particles across configurable spiral arms
2. Applies physics-based distance coloring (core → arms → dust lanes)
3. Adds procedural randomness for natural distribution
4. Includes background stars for depth

### Styling

- **Dark space theme** with cosmic color palette (#000011 background, #87ceeb accents)
- **Responsive design** with mobile-friendly Leva controls
- **Full-screen immersive** experience with no default UI chrome
- **Custom scrollbars** and form elements themed for space

## Key Configuration

### Galaxy Parameters (adjustable via Leva)

- Particle count, radius, spiral arms, tightness
- Core size and color gradients
- Rotation speed and animation toggle
- Bloom intensity and visual effects

### Camera System

- OrbitControls with zoom/pan/rotate
- Configurable camera presets
- Smooth camera animations via custom hooks

### Performance Optimizations

- Efficient particle systems with Float32Array buffers
- Conditional Spline model rendering
- Optimized post-processing effects
- Touch-action: none for mobile performance

## Development Notes

### Adding New Spline Models

1. Update `SplineHelpers.DEFAULT_SPLINE_URLS` with new model URLs
2. Use `SplineHelpers.createSplineModelConfig()` for proper positioning
3. Integrate via `useSplineIntegration` hook for events and animations

### Extending Galaxy Features

- Galaxy parameters are centralized in the Zustand store
- New particle effects can be added to the `Galaxy` component
- Camera behaviors extend through `useGalaxyInteraction`

### State Management Pattern

- All UI controls sync with Zustand store via useEffect hooks
- Store updates trigger automatic component re-renders
- Subscribe to specific state slices to avoid unnecessary updates
