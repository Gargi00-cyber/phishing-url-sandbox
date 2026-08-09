import { ParticlesProvider, Particles } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

// Defined OUTSIDE the component so it's a stable reference across renders
// (the library requires this — recreating it each render throws an error)
const initParticles = async (engine) => {
  await loadSlim(engine)
}

const options = {
  fullScreen: { enable: false },
  background: { color: 'transparent' },
  fpsLimit: 60,
  particles: {
    number: { value: 45, density: { enable: true, area: 900 } },
    color: { value: ['#c084fc', '#f472b6', '#818cf8'] },
    opacity: { value: 0.4 },
    size: { value: { min: 1, max: 2.5 } },
    links: {
      enable: true,
      distance: 140,
      color: '#a78bfa',
      opacity: 0.2,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.6,
      outModes: { default: 'out' },
    },
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: 'grab' },
    },
    modes: {
      grab: { distance: 150, links: { opacity: 0.5 } },
    },
  },
  detectRetina: true,
}

function ParticleBackground() {
  return (
    <ParticlesProvider init={initParticles}>
      <Particles
        id="tsparticles"
        options={options}
        className="absolute inset-0 z-0 pointer-events-none"
      />
    </ParticlesProvider>
  )
}

export default ParticleBackground