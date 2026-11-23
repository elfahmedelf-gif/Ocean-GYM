"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume2,
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
 * poster stage with a pulsing glass play button, then a floating
 * control bar (play/pause, seek, time, mute, fullscreen) that
 * auto-hides while the film rolls.
 */
export function VideoSection() {
  const { t } = useLang();
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const startPlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setStarted(true);
    setControlsVisible(true);
    void video.play();
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }, []);

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

  const onSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    const rect = event.currentTarget.getBoundingClientRect();
    // Seek bar is dir="ltr" — the ratio maps straight to time.
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    video.currentTime = ratio * video.duration;
    scheduleHide();
  };

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
          <div
            ref={stageRef}
            onMouseMove={scheduleHide}
            onMouseLeave={() => {
              const video = videoRef.current;
              if (video && !video.paused) setControlsVisible(false);
            }}
            className="lux-frame group/stage relative aspect-video w-full cursor-pointer overflow-hidden rounded-3xl bg-card shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)]"
            onClick={started ? togglePlay : startPlayback}
          >
            {/* The film itself — dual sources: browsers pick what they can decode */}
            <video
              ref={videoRef}
              poster={POSTER_SRC}
              preload="metadata"
              playsInline
              loop
              className="absolute inset-0 size-full object-cover"
              onClick={(e) => {
                // Clicks land on the stage handler; keep the video from double-toggling.
                e.stopPropagation();
                if (started) togglePlay();
                else startPlayback();
              }}
              onPlay={() => {
                setPlaying(true);
                scheduleHide();
              }}
              onPause={() => {
                setPlaying(false);
                setControlsVisible(true);
                if (hideTimer.current) clearTimeout(hideTimer.current);
              }}
              onTimeUpdate={() => {
                const video = videoRef.current;
                if (!video || !Number.isFinite(video.duration)) return;
                setProgress(video.currentTime / video.duration);
                setCurrentTime(video.currentTime);
              }}
              onLoadedMetadata={() => {
                const video = videoRef.current;
                if (video && Number.isFinite(video.duration)) setDuration(video.duration);
              }}
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

            {/* Pre-start splash — poster + pulsing play invitation */}
            {!started ? (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-5">
                <span className="glass ocean-ring absolute start-4 top-4 flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold text-primary">
                  <Waves className="size-3.5" aria-hidden="true" />
                  {t.video.durationChip}
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

            {/* Center pulse when paused mid-film */}
            {started && !playing ? (
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
              className={cn(
                "absolute inset-x-3 bottom-3 z-10 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/55 px-3 py-2 backdrop-blur-xl transition-all duration-300 md:inset-x-4 md:bottom-4",
                controlsVisible || !playing
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-3 opacity-0"
              )}
            >
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? t.video.pause : t.video.play}
                className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
              >
                {playing ? (
                  <Pause className="size-5 fill-current" aria-hidden="true" />
                ) : (
                  <Play className="size-5 fill-current" aria-hidden="true" />
                )}
              </button>

              {/* Seek track */}
              <div
                role="slider"
                aria-label={t.video.play}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
                tabIndex={0}
                onClick={onSeek}
                onKeyDown={(e) => {
                  const video = videoRef.current;
                  if (!video || !Number.isFinite(video.duration)) return;
                  if (e.key === "ArrowRight") video.currentTime = Math.min(video.duration, video.currentTime + 2);
                  else if (e.key === "ArrowLeft") video.currentTime = Math.max(0, video.currentTime - 2);
                  else return;
                  e.preventDefault();
                  scheduleHide();
                }}
                className="group/seek relative mx-1 h-4 min-w-0 flex-1 cursor-pointer items-center"
              >
                <span className="block h-1.5 w-full rounded-full bg-white/20 transition-all duration-200 group-hover/seek:h-2.5" />
                <span
                  className="absolute left-0 top-1/2 block h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary to-[#7dd8f0] shadow-[0_0_12px_rgba(56,199,232,0.6)] transition-[height] duration-200 group-hover/seek:h-2.5"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
                <span
                  className="absolute top-1/2 block size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-md transition-transform duration-200 group-hover/seek:scale-125"
                  style={{ left: `${Math.round(progress * 100)}%` }}
                />
              </div>

              <span className="shrink-0 text-[11px] font-bold tabular-nums text-white/90 md:text-xs">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? t.video.unmute : t.video.mute}
                className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
              >
                {muted ? (
                  <VolumeX className="size-5" aria-hidden="true" />
                ) : (
                  <Volume2 className="size-5" aria-hidden="true" />
                )}
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
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
        </FadeUp>
      </div>
    </section>
  );
}
