/** Decorative video lifecycle. Reduced motion displays the existing poster. */
export function setupBackgroundVideo(video, rootMargin = '0px') {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const events = new AbortController();
  let nearViewport = false;
  let disposed = false;
  const canPlay = () => !disposed && nearViewport && !motion.matches && !document.hidden;

  const play = () => {
    if (!canPlay()) return;
    video.play()?.then(() => {
      // A preference or route change can occur while play() is pending.
      if (!canPlay()) video.pause();
    }).catch(() => {});
  };
  const sync = () => {
    if (motion.matches) {
      video.pause();
      if (video.hasAttribute('src')) {
        video.removeAttribute('src');
        video.load();
      }
      return;
    }
    if (!canPlay()) { video.pause(); return; }
    if (!video.hasAttribute('src') && video.dataset.src) {
      video.muted = true;
      video.defaultMuted = true;
      video.src = video.dataset.src;
      video.load();
    }
    play();
  };
  const observer = new IntersectionObserver(([entry]) => {
    nearViewport = entry.isIntersecting;
    sync();
  }, { rootMargin });
  observer.observe(video);
  motion.addEventListener('change', sync, { signal: events.signal });
  document.addEventListener('visibilitychange', sync, { signal: events.signal });
  video.addEventListener('loadeddata', play, { signal: events.signal });
  window.addEventListener('pointerdown', play, { passive: true, signal: events.signal });
  window.addEventListener('keydown', play, { signal: events.signal });
  sync();

  return () => {
    disposed = true;
    observer.disconnect();
    events.abort();
    video.pause();
  };
}
