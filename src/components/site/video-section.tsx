"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Film,
  LoaderCircle,
  Maximize,
  Minimize,
  Pause,
  Play,
  VolumeX,
  Waves,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "./language";
import { FadeUp } from "./fade-up";
import { SectionHeading } from "./section-heading";
import { WaveDivider } from "./wave-divider";

const VIDEO_SRC = "/videos/gym-promo.mp4";
const VIDEO_WEBM_SRC = "/videos/gym-promo.webm";
const POSTER_SRC = "/videos/gym-promo-poster.jpg";

/** Formats raw seconds as M:SS for the player time readout. */
function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Cinematic promo video section — a fully custom premium player:
 * a living poster with a pulsing play invitation, silent auto-preview
 * when the film scrolls into view, buffered-range seek bar with a hover
 * time tooltip, buffering spinner, keyboard shortcuts and a floating
 * control bar that auto-hides while the film rolls.
 */
export function VideoSection() {
  const { t } = useLang();
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Distinguishes touch taps from mouse clicks for the controls-reveal pattern. */
  const touchRef = useRef(false);
  /** Guarantees the ambient auto-preview fires at most once per page load. */
  const ambientFiredRef = useRef(false);

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  /** True while the film auto-plays silently as a preview (before the user takes control). */
  const [ambient, setAmbient] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [buffered, setBuffered] = useState(0); // 0..1
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  /** Seek-bar hover position (0..1) — drives the time tooltip; null = not hovering. */
  const [hoverRatio, setHoverRatio] = useState<number | null>(null);

  // Auto-hide the control bar a moment after the pointer goes idle while playing.
  const scheduleHide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setControlsVisible(true);
    hideTimer.current = setTimeout(() => {
      const video = videoRef.current;
      if (video && !video.paused) setControlsVisible(false);
    }, 2600);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  const startPlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setStarted(true);
    setAmbient(false);
    setControlsVisible(true);
    void video.play();
  }, []);

  /** Silent auto-preview the first time the stage scrolls into view. */
  useEffect(() => {
    const stage = stageRef.current;
    const video = videoRef.current;
    if (!stage || !video) return;
    // Respect reduced-motion users — no surprise motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || ambientFiredRef.current) continue;
          ambientFiredRef.current = true;
          video.muted = true;
          setStarted(true);
          setAmbient(true);
          video.play().catch(() => {
            // Autoplay blocked — fall back to the poster splash.
            setStarted(false);
            setAmbient(false);
          });
          break;
        }
      },
      { threshold: 0.45 }
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  /** Stage-level click — touch gets a controls-reveal first tap, mouse toggles play. */
  const onStageClick = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (touchRef.current && !video.paused && !controlsVisible) {
      setControlsVisible(true);
      scheduleHide();
      return;
    }
    if (!started) startPlayback();
    else if (video.paused) {
      setAmbient(false);
      void video.play();
    } else video.pause();
  }, [started, controlsVisible, scheduleHide, startPlayback]);

  const toggleFullscreen = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void stage.requestFullscreen();
  }, []);

  // Track fullscreen changes (Esc key exits without hitting our button).
  useEffect(() => {
    const onFullscreenChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const updateBuffered = useCallback(() => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    const end = video.buffered.length > 0 ? video.buffered.end(video.buffered.length - 1) : 0;
    setBuffered(Math.min(1, end / video.duration));
  }, []);

  /**
   * Keeps the duration state in sync — metadata can finish loading before
   * hydration attaches the onLoadedMetadata handler, so media events
   * cheaply re-check it.
   */
  const syncDuration = useCallback(() => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    setDuration((current) => (current === video.duration ? current : video.duration));
  }, []);

  const onSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    const rect = event.currentTarget.getBoundingClientRect();
    // Seek bar is dir="ltr" — the ratio maps straight to time.
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    video.currentTime = ratio * video.duration;
    updateBuffered();
    scheduleHide();
  };

  const onSeekHover = (event: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setHoverRatio(Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)));
  };

  /** Keyboard shortcuts — space/K play, F fullscreen, arrows seek ±5s. */
  const onStageKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;
    switch (event.key) {
      case " ":
      case "k":
      case "K":
        event.preventDefault();
        if (!started) startPlayback();
        else if (video.paused) {
          setAmbient(false);
          void video.play();
        } else video.pause();
        break;
      case "f":
      case "F":
        event.preventDefault();
        toggleFullscreen();
        break;
      case "ArrowLeft":
        event.preventDefault();
        video.currentTime = Math.max(0, video.currentTime - 5);
        scheduleHide();
        break;
      case "ArrowRight":
        event.preventDefault();
        video.currentTime = Math.min(video.duration, video.currentTime + 5);
        scheduleHide();
        break;
      default:
        return;
    }
  };

  const percent = Math.round(progress * 100);

  return (
    <section
      id="video"
      aria-labelledby="video-title"
      className="bg-deep relative scroll-mt-24 py-16 md:py-24"
    >
      {/* Shoreline from the gallery band above */}
      <WaveDivider variant={1} className="text-background" />
      {/* Living aurora + stage light keep the deep band alive */}
      <div aria-hidden="true" className="beam-top pointer-events-none absolute inset-x-0 top-0 h-44" />
      <div aria-hidden="true" className="aurora pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          kicker={t.video.kicker}
          headingId="video-title"
          ghostNumber="08"
          title={
            <>
              {t.video.titlePre}
              <span className="text-gradient-ocean text-glow">{t.video.titleGradient}</span>
              {t.video.titlePost}
            </>
          }
          subtitle={t.video.subtitle}
        />

        <FadeUp>
          {/* Ambient glow halo breathing behind the stage — intensifies while the film rolls */}
          <div aria-hidden="true" className="relative">
            <div
              className={cn(
                "pointer-events-none absolute -inset-10 -z-10 rounded-[40px] bg-primary/10 blur-3xl transition-opacity duration-1000",
                playing ? "opacity-100" : "opacity-50"
              )}
            />
            <div
              aria-hidden="true"
              className="animate-pulse-glow pointer-events-none absolute -inset-6 -z-10 rounded-[36px] bg-[#1e6fe8]/10 blur-2xl [animation-duration:4.5s]"
            />

            <div
              ref={stageRef}
              role="group"
              aria-label={t.video.stageLabel}
              tabIndex={0}
              onMouseMove={scheduleHide}
              onMouseLeave={() => {
                const video = videoRef.current;
                if (video && !video.paused) setControlsVisible(false);
                setHoverRatio(null);
              }}
              onTouchStart={() => {
                touchRef.current = true;
              }}
              onClick={onStageClick}
              onDoubleClick={toggleFullscreen}
              onKeyDown={onStageKeyDown}
              className="lux-frame group/stage relative aspect-video w-full cursor-pointer overflow-hidden rounded-3xl bg-card shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)] focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
            >
              {/* The film itself — dual sources: browsers pick what they can decode */}
              <video
                ref={videoRef}
                poster={POSTER_SRC}
                preload="metadata"
                playsInline
                loop
                className={cn(
                  "absolute inset-0 size-full object-cover transition-transform duration-700 ease-out",
                  !started && "poster-drift"
                )}
                onClick={(e) => {
                  // The film covers the whole stage — route its clicks through
                  // the shared stage handler (stopPropagation avoids double-toggle).
                  e.stopPropagation();
                  onStageClick();
                }}
                onPlay={() => {
                  setPlaying(true);
                  syncDuration();
                  scheduleHide();
                }}
                onPause={() => {
                  setPlaying(false);
                  setAmbient(false);
                  setControlsVisible(true);
                  if (hideTimer.current) clearTimeout(hideTimer.current);
                }}
                onTimeUpdate={() => {
                  const video = videoRef.current;
                  if (!video || !Number.isFinite(video.duration)) return;
                  setProgress(video.currentTime / video.duration);
                  setCurrentTime(video.currentTime);
                  updateBuffered();
                  syncDuration();
                }}
                onProgress={() => {
                  updateBuffered();
                  syncDuration();
                }}
                onLoadedMetadata={syncDuration}
                onWaiting={() => setWaiting(true)}
                onStalled={() => setWaiting(true)}
                onPlaying={() => setWaiting(false)}
                onCanPlay={() => setWaiting(false)}
                onSeeked={() => setWaiting(false)}
                aria-label={t.video.play}
              >
                <source src={VIDEO_SRC} type="video/mp4" />
                <source src={VIDEO_WEBM_SRC} type="video/webm" />
              </video>

              {/* Cinematic overlay tint — always on, deepens toward the controls */}
              <div
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/30 transition-opacity duration-500",
                  started && playing && !controlsVisible ? "opacity-40" : "opacity-100"
                )}
              />

              {/* Pre-start splash — living poster + pulsing play invitation */}
              {!started ? (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-5">
                  <span className="glass ocean-ring absolute start-4 top-4 flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold text-primary">
                    <Waves className="size-3.5" aria-hidden="true" />
                    {t.video.durationChip}
                    {duration > 0 ? (
                      <span dir="ltr" className="tabular-nums">• {formatTime(duration)}</span>
                    ) : null}
                  </span>
                  <span className="relative flex size-24 items-center justify-center">
                    <span className="absolute inset-0 animate-ping rounded-full bg-primary/30 [animation-duration:2.4s]" aria-hidden="true" />
                    <span className="glass glow-cyan-strong relative flex size-24 items-center justify-center rounded-full text-primary shadow-2xl transition-transform duration-300 group-hover/stage:scale-105">
                      <Play className="size-10 -translate-x-0.5 fill-current" aria-hidden="true" />
                    </span>
                  </span>
                  <span className="glass rounded-full px-5 py-2 text-sm font-black text-foreground drop-shadow-lg">
                    {t.video.ctaHint}
                  </span>
                </div>
              ) : null}

              {/* Silent auto-preview pill — tells the visitor the film started on its own */}
              {ambient && playing ? (
                <div className="pointer-events-none absolute inset-x-0 bottom-16 z-10 flex justify-center md:bottom-[4.75rem]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAmbient(false);
                      scheduleHide();
                    }}
                    className="glass pointer-events-auto flex items-center gap-2 rounded-full border border-primary/25 px-4 py-1.5 text-xs font-bold text-foreground shadow-lg transition-colors duration-200 hover:border-primary/50 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
                  >
                    <VolumeX className="size-3.5 text-primary" aria-hidden="true" />
                    {t.video.ambientChip}
                  </button>
                </div>
              ) : null}

              {/* Buffering spinner — appears while the film catches up */}
              {started && playing && waiting ? (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="glass glow-cyan flex size-16 items-center justify-center rounded-full text-primary shadow-2xl">
                    <LoaderCircle className="size-8 animate-spin" aria-hidden="true" />
                  </span>
                  <span className="sr-only" aria-live="polite">{t.video.loading}</span>
                </div>
              ) : null}

              {/* Center pulse when paused mid-film */}
              {started && !playing && !waiting ? (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="glass glow-cyan flex size-20 items-center justify-center rounded-full text-primary shadow-2xl">
                    <Play className="size-9 -translate-x-0.5 fill-current" aria-hidden="true" />
                  </span>
                </div>
              ) : null}

              {/* Floating control bar — video-player convention: always LTR geometry */}
              <div
                dir="ltr"
                onClick={(e) => e.stopPropagation()}
                onDoubleClick={(e) => e.stopPropagation()}
                className={cn(
                  "absolute inset-x-3 bottom-3 z-10 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/55 px-3 py-2 backdrop-blur-xl transition-all duration-300 md:inset-x-4 md:bottom-4",
                  controlsVisible || !playing
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-3 opacity-0"
                )}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!started) startPlayback();
                    else if (videoRef.current?.paused) {
                      setAmbient(false);
                      void videoRef.current.play();
                    } else videoRef.current?.pause();
                  }}
                  aria-label={playing ? t.video.pause : t.video.play}
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
                >
                  {playing ? (
                    <Pause className="size-5 fill-current" aria-hidden="true" />
                  ) : (
                    <Play className="size-5 fill-current" aria-hidden="true" />
                  )}
                </button>

                {/* Seek track — buffered range + progress + hover cue + time tooltip */}
                <div
                  role="slider"
                  aria-label={t.video.seekLabel}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percent}
                  tabIndex={0}
                  onClick={onSeek}
                  onMouseMove={onSeekHover}
                  onMouseLeave={() => setHoverRatio(null)}
                  onKeyDown={(e) => {
                    const video = videoRef.current;
                    if (!video || !Number.isFinite(video.duration)) return;
                    if (e.key === "ArrowRight") video.currentTime = Math.min(video.duration, video.currentTime + 2);
                    else if (e.key === "ArrowLeft") video.currentTime = Math.max(0, video.currentTime - 2);
                    else return;
                    e.preventDefault();
                    e.stopPropagation();
                    updateBuffered();
                    scheduleHide();
                  }}
                  className="group/seek relative mx-1 h-5 min-w-0 flex-1 cursor-pointer items-center"
                >
                  {/* Track */}
                  <span className="block h-1.5 w-full rounded-full bg-white/20 transition-all duration-200 group-hover/seek:h-2.5" />
                  {/* Buffered range ahead of the playhead */}
                  <span
                    className="absolute left-0 top-1/2 block h-1.5 -translate-y-1/2 rounded-full bg-white/30 transition-all duration-300 group-hover/seek:h-2.5"
                    style={{ width: `${Math.round(buffered * 100)}%` }}
                  />
                  {/* Watched progress */}
                  <span
                    className="absolute left-0 top-1/2 block h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary to-[#7dd8f0] shadow-[0_0_12px_rgba(56,199,232,0.6)] transition-[height] duration-200 group-hover/seek:h-2.5"
                    style={{ width: `${percent}%` }}
                  />
                  {/* Hover cue line */}
                  {hoverRatio !== null ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-1/2 block h-3 w-px -translate-y-1/2 bg-white/70"
                      style={{ left: `${Math.round(hoverRatio * 100)}%` }}
                    />
                  ) : null}
                  {/* Playhead thumb */}
                  <span
                    className="absolute top-1/2 block size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-md transition-transform duration-200 group-hover/seek:scale-125"
                    style={{ left: `${percent}%` }}
                  />
                  {/* Time tooltip following the cursor */}
                  {hoverRatio !== null && Number.isFinite(duration) && duration > 0 ? (
                    <span
                      aria-hidden="true"
                      className="glass pointer-events-none absolute bottom-full mb-1.5 -translate-x-1/2 rounded-md px-2 py-0.5 text-[10px] font-black tabular-nums text-white"
                      style={{ left: `${Math.round(hoverRatio * 100)}%` }}
                    >
                      {formatTime(hoverRatio * duration)}
                    </span>
                  ) : null}
                </div>

                <span className="shrink-0 text-[11px] font-bold tabular-nums text-white/90 md:text-xs">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                  aria-label={isFullscreen ? t.video.exitFullscreen : t.video.fullscreen}
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
                >
                  {isFullscreen ? (
                    <Minimize className="size-5" aria-hidden="true" />
                  ) : (
                    <Maximize className="size-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Cinematic caption row under the stage — studio brand + quality readout */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span
                dir="ltr"
                className="glass flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-black tracking-[0.18em] text-foreground/85"
              >
                <Waves className="size-3.5 text-primary" aria-hidden="true" />
                OCEAN GYM FILMS
              </span>
              <span
                dir="ltr"
                className="glass flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold tabular-nums text-muted-foreground"
              >
                <Film className="size-3.5 text-primary/80" aria-hidden="true" />
                1080p{duration > 0 ? ` • ${formatTime(duration)}` : ""}
              </span>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
