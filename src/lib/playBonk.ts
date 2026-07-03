let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  audioCtx ??= new AudioContext();
  return audioCtx;
}

export function playBonk() {
  const ctx = getAudioContext();
  if (!ctx) return;

  void ctx.resume();

  const t = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(280, t);
  osc.frequency.exponentialRampToValueAtTime(90, t + 0.07);

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(0.45, t + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(t);
  osc.stop(t + 0.17);
}
