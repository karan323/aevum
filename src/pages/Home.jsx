import React, { useEffect, useMemo, useRef, useState } from 'react'

export default function Home() {
  const sectionsRef = useRef([])
  const scrollRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const posters = useMemo(() => ([
    {
      // Oversize tee hero with image → video on hover
      title: 'Aevum Flow Tee',
      // Using available assets: image '/oversize-hero.png' and video '/oversize-poster.mp4'
      // (Note: names provided were image: oversize-poster, video: oversize-hero; assets exist reversed.)
      img: '/oversize-hero.png',
      video: {
        mp4: '/oversize-poster.mp4',
        poster: '/oversize-hero.png',
      },
      hAlign: 'right',
      vAlign: 'bottom',
      overlay: 'right',
      // Bottom-right label content
      label: {
        line1: 'Aevum Flow Tee',
        line2: 'Comfort-first drape. Premium knit. Everyday performance.',
      },
      // Refined brand gradient for label text
      labelStyle: 'brandElegance',
    },
    {
      title: 'Hoodie: Pullover | Zip-Up | Full-Zip',
      // Use the provided hoodie poster image by default, and switch to video on hover
      img: '/hoodie-poster.png',
      video: {
        webm: '/hoodie-hero.webm',
        mp4: '/hoodie-hero.mp4',
        poster: '/hoodie-poster.png',
      },
      objectPosition: '55% 40%',
      // Position the label at the bottom-right, slightly above the bottom
      hAlign: 'right',
      vAlign: 'bottom',
      overlay: 'right',
      // Custom two-line label for hoodie poster
      label: {
        line1: 'Beyond Basic Hoodie',
        line2: 'Aevum Core Pullover Hoodie',
      },
    },
    {
      title: 'Crewneck | V-Neck | Henley',
      img: '/tshirt-poster.png',
      hAlign: 'left',
      vAlign: 'bottom',
      overlay: 'bottom',
      label: {
        line1: 'Crewneck | V-Neck | Henley',
        line2: 'The Classic Crew – Timeless fit, clean lines, effortless style',
      },
      // Use default hoodie-like label gradient (no explicit labelStyle)
      // Use Sharp font for both lines, with bold weight on line 1
      labelFont1: 'Sharp, Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      labelFont2: 'Sharp, Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    },
    {
      title: 'Short Sleeve | Long Sleeve | Tank',
      img: '/regular-poster.png',
      hAlign: 'center',
      vAlign: 'bottom',
      overlay: 'bottom',
      label: {
        line1: 'Short Sleeve | Long Sleeve | Tank',
        line2: 'Wear Your Comfort, Your Way.',
      },
      labelStyle: 'solidWhite',
      labelFont1: 'Sharp, Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      labelFont2: 'Sharp, Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    },
    {
      title: 'Fit: Regular | Slim | Oversized',
      img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop',
      hAlign: 'left',
      vAlign: 'bottom',
      overlay: 'left',
    },
    {
      title: 'Timeless Essentials',
      img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
      hAlign: 'right',
      vAlign: 'center',
      overlay: 'right',
    },
  ]), [])

  useEffect(() => {
    // Focus the scroll container so it receives keyboard events
    scrollRef.current?.focus()

    // Observe which section is in view
    const rootEl = scrollRef.current
    if (!rootEl) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-index'))
            if (!Number.isNaN(idx)) setActiveIndex(idx)
          }
        })
      },
      { root: rootEl, threshold: 0.55 }
    )
    sectionsRef.current.forEach((el, i) => {
      if (el) {
        el.setAttribute('data-index', String(i))
        observer.observe(el)
      }
    })
    return () => observer.disconnect()
  }, [])

  const handleKey = (e) => {
    const current = document.activeElement === scrollRef.current ? scrollRef.current : scrollRef.current
    if (!current) return
    const idx = sectionsRef.current.findIndex((el) => {
      if (!el) return false
      const rect = el.getBoundingClientRect()
      // Section considered active if it starts near the top
      return rect.top >= 0 && rect.top < (window.innerHeight * 0.5)
    })

    const to = (nextIdx) => {
      const el = sectionsRef.current[nextIdx]
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault()
      to(Math.min((idx >= 0 ? idx + 1 : 1), posters.length - 1))
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault()
      to(Math.max((idx >= 0 ? idx - 1 : 0), 0))
    }
  }

  const scrollToIndex = (i) => {
    const el = sectionsRef.current[i]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div
      ref={scrollRef}
      tabIndex={0}
      onKeyDown={handleKey}
      className="h-[100svh] overflow-y-auto snap-y snap-mandatory scroll-smooth focus:outline-none no-scrollbar"
    >
      {/* Side progress indicator */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3 opacity-80 select-none">
        {posters.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to section ${i + 1}`}
            aria-current={activeIndex === i ? 'true' : 'false'}
            className={`transition-all duration-300 ${
              activeIndex === i
                ? 'w-2 h-6 md:h-8 bg-black/80 rounded-full'
                : 'w-2 h-2 bg-black/40 hover:bg-black/60 rounded-full'
            }`}
          />
        ))}
      </div>

      {posters.map((item, index) => {
        const hAlign = { left: 'justify-start', center: 'justify-center', right: 'justify-end' }[item.hAlign || 'center']
        const vAlign = { top: 'items-start', center: 'items-center', bottom: 'items-end' }[item.vAlign || 'center']
        const overlayDir =
          item.overlay === 'left'
            ? 'bg-gradient-to-r from-black/50 via-transparent to-transparent'
            : item.overlay === 'right'
            ? 'bg-gradient-to-l from-black/50 via-transparent to-transparent'
            : item.overlay === 'top'
            ? 'bg-gradient-to-b from-black/45 via-transparent to-transparent'
            : item.overlay === 'bottom'
            ? 'bg-gradient-to-t from-black/45 via-transparent to-transparent'
            : ''
        const textAlign = { left: 'text-left', center: 'text-center', right: 'text-right' }[item.hAlign || 'center']
        return (
          <section
            key={index}
            ref={(el) => (sectionsRef.current[index] = el)}
            className={`group relative w-full min-h-[100svh] snap-start flex ${vAlign} ${hAlign} p-6 md:p-12 bg-gray-200`}
          >
            {/* Background media: for hoodie show image by default and crossfade to video on hover */}
            {item.video && item.img ? (
              <>
                <img
                  src={item.img}
                  alt=""
                  loading={index <= 1 ? 'eager' : 'lazy'}
                  fetchpriority={index === 0 ? 'high' : 'auto'}
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0"
                  style={item.objectPosition ? { objectPosition: item.objectPosition } : undefined}
                  aria-hidden="true"
                />
                <video
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                  style={item.objectPosition ? { objectPosition: item.objectPosition } : undefined}
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={item.video.poster || undefined}
                  preload="auto"
                >
                  {item.video.webm && (
                    <source src={item.video.webm} type="video/webm" />
                  )}
                  {item.video.mp4 && (
                    <source src={item.video.mp4} type="video/mp4" />
                  )}
                </video>
              </>
            ) : item.video ? (
              <video
                className="absolute inset-0 w-full h-full object-cover"
                style={item.objectPosition ? { objectPosition: item.objectPosition } : undefined}
                autoPlay
                muted
                loop
                playsInline
                poster={item.video.poster || undefined}
                preload="auto"
              >
                {item.video.webm && (
                  <source src={item.video.webm} type="video/webm" />
                )}
                {item.video.mp4 && (
                  <source src={item.video.mp4} type="video/mp4" />
                )}
              </video>
            ) : (
              <img
                src={item.img}
                alt=""
                loading={index <= 1 ? 'eager' : 'lazy'}
                fetchpriority={index === 0 ? 'high' : 'auto'}
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
                style={item.objectPosition ? { objectPosition: item.objectPosition } : undefined}
                aria-hidden="true"
              />
            )}

            {/* Directional gradient overlay for readability */}
            <div className={`absolute inset-0 pointer-events-none ${overlayDir}`} aria-hidden="true" />

            {/* Title with gradient text, positioned per section */}
            <div
              className={`relative z-10 ${item.label ? `mb-6 md:mb-10 ${textAlign}` : ''}`}
            >
              {item.label ? (
                <div className="space-y-1">
                  <div
                    className={
                      item.labelStyle === 'solidWhite'
                        ? 'text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]'
                        : item.labelStyle === 'charcoalWhite'
                        ? 'text-4xl md:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-b from-white via-white/85 to-neutral-800 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]'
                        : item.labelStyle === 'brandElegance'
                        ? 'text-4xl md:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-white via-aevumGold to-white/80 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]'
                        : 'text-4xl md:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-b from-white/95 via-white/70 to-white/20 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)]'
                    }
                    style={{ fontFamily: item.labelFont1 || 'Share, Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}
                  >
                    {item.label.line1}
                  </div>
                  <div
                    className={
                      item.labelStyle === 'solidWhite'
                        ? 'text-2xl md:text-4xl font-medium tracking-tight leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]'
                        : item.labelStyle === 'charcoalWhite'
                        ? 'text-2xl md:text-4xl font-medium tracking-tight leading-tight bg-gradient-to-b from-white via-white/80 to-neutral-700 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]'
                        : item.labelStyle === 'brandElegance'
                        ? 'text-2xl md:text-4xl font-medium tracking-tight leading-tight bg-gradient-to-b from-neutral-200 via-white/85 to-white bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]'
                        : 'text-2xl md:text-4xl font-medium tracking-tight leading-tight bg-gradient-to-b from-white/95 via-white/70 to-white/20 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)]'
                    }
                    style={{ fontFamily: item.labelFont2 || 'Sharp, Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}
                  >
                    {item.label.line2}
                  </div>
                  {/* Try Now CTA removed */}
                </div>
              ) : (
                <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-white via-aevumGold to-aevumNavy bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)]">
                  {item.title}
                </h1>
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
