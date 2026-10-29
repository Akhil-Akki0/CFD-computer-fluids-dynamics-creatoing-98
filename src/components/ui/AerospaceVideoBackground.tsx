import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Sparkles, Orbit, SunMedium, Globe2 } from 'lucide-react';

export type VideoBackgroundMode = 'frozen_alien_planet' | 'blackhole' | 'rocket';

export interface AerospaceVideoBackgroundProps {
  className?: string;
  theme?: 'light' | 'dark';
  lightTheme?: string;
  overlayOpacity?: number;
  activeVideo?: VideoBackgroundMode;
}

export const AerospaceVideoBackground: React.FC<AerospaceVideoBackgroundProps> = ({
  className = '',
  activeVideo: initialVideo = 'frozen_alien_planet',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeVideo, setActiveVideo] = useState<VideoBackgroundMode>(initialVideo);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [opacityLevel, setOpacityLevel] = useState<'vivid' | 'medium' | 'dim'>('vivid');

  const currentVideoSrc =
    activeVideo === 'frozen_alien_planet'
      ? '/media/frozen_alien_planet_4k_nowatermark.mp4'
      : activeVideo === 'blackhole'
      ? '/media/black_hole_loop.mp4'
      : '/media/metallic-rocket-loading.mp4';

  const currentPoster =
    activeVideo === 'frozen_alien_planet'
      ? '/media/frozen_alien_planet_4k_poster.jpg'
      : activeVideo === 'blackhole'
      ? '/media/black_hole_loop_poster.jpg'
      : '/media/loading-poster.jpg';

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setHasLoaded(false);

    // Browser autoplay policy requires muted
    video.muted = true;
    video.defaultMuted = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
    }
  }, [activeVideo]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const cycleOpacity = () => {
    setOpacityLevel((curr) => {
      if (curr === 'vivid') return 'medium';
      if (curr === 'medium') return 'dim';
      return 'vivid';
    });
  };

  const cycleVideo = () => {
    setActiveVideo((curr) => {
      if (curr === 'frozen_alien_planet') return 'blackhole';
      if (curr === 'blackhole') return 'rocket';
      return 'frozen_alien_planet';
    });
  };

  const videoClasses =
    opacityLevel === 'vivid'
      ? 'opacity-100 brightness-105 contrast-110'
      : opacityLevel === 'medium'
      ? 'opacity-85 brightness-100 contrast-105'
      : 'opacity-70 brightness-95 contrast-100';

  const vignetteOpacity =
    opacityLevel === 'vivid' ? 0.25 : opacityLevel === 'medium' ? 0.45 : 0.65;

  return (
    <div
      className={`fixed inset-0 h-full w-full overflow-hidden pointer-events-none select-none z-0 bg-[#f0f4f8] ${className}`}
      aria-hidden="true"
    >
      {/* Underlying poster fallback */}
      <img
        src={currentPoster}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          hasLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Main Looping 4K Alien Planet Video - Enhanced 4K & No Watermark */}
      <video
        key={currentVideoSrc}
        ref={videoRef}
        src={currentVideoSrc}
        poster={currentPoster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={() => setHasLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover object-center ${videoClasses}`}
      />

      {/* Light Luminous Atmospheric Vignette - Clean, Balanced & Non-Dark */}
      <div
        className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.0) 35%, rgba(224, 242, 254, 0.18) 75%, rgba(186, 230, 253, 0.35) 100%)',
          opacity: vignetteOpacity,
        }}
      />

      {/* Ambient Quick Floating Controls with Light Frosted Styling */}
      <div className="absolute bottom-3 right-4 z-30 pointer-events-auto flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity duration-300">
        {/* Switch Video Scene Button */}
        <button
          type="button"
          onClick={cycleVideo}
          title={`Active: ${activeVideo.replace(/_/g, ' ').toUpperCase()} (Click to cycle scenes)`}
          aria-label="Switch background video scene"
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 hover:bg-white text-slate-800 hover:text-slate-950 border border-slate-200/80 backdrop-blur-md shadow-md transition-all active:scale-95 text-[11px] font-mono cursor-pointer"
        >
          {activeVideo === 'frozen_alien_planet' ? (
            <>
              <Globe2 className="w-3.5 h-3.5 text-cyan-600" />
              <span className="font-semibold">Frozen Alien Planet (4K)</span>
            </>
          ) : activeVideo === 'blackhole' ? (
            <>
              <Orbit className="w-3.5 h-3.5 text-blue-600 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="font-semibold">4K Black Hole</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-semibold">Rocket</span>
            </>
          )}
        </button>

        {/* Video Visibility Intensity: Vivid / Medium / Dim */}
        <button
          type="button"
          onClick={cycleOpacity}
          title={`Video Visibility: ${opacityLevel.toUpperCase()} (Click to change)`}
          aria-label="Adjust background video visibility"
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/85 hover:bg-white text-slate-800 hover:text-slate-950 border border-slate-200/80 backdrop-blur-md shadow-md transition-all active:scale-95 text-[11px] font-mono cursor-pointer"
        >
          <SunMedium className="w-3 h-3 text-emerald-600" />
          <span className="capitalize font-semibold">{opacityLevel}</span>
        </button>

        {/* Play / Pause Toggle */}
        <button
          type="button"
          onClick={togglePlay}
          title={isPlaying ? 'Pause video background' : 'Play video background'}
          aria-label={isPlaying ? 'Pause video background' : 'Play video background'}
          className="p-1.5 rounded-full bg-white/85 hover:bg-white text-slate-800 hover:text-slate-950 border border-slate-200/80 backdrop-blur-md shadow-md transition-all active:scale-95 cursor-pointer"
        >
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
};
