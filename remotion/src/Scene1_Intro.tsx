import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const Scene1_Intro: React.FC<{
  title: string;
  version: string;
}> = ({ title, version }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  const subtitleOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const badgeScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 10 },
  });

  const fadeOut = interpolate(frame, [180, 205], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        opacity: fadeOut,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 80px',
      }}
    >
      {/* Top Badge */}
      <div
        style={{
          transform: `scale(${Math.max(0, badgeScale)})`,
          marginBottom: 30,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          padding: '8px 24px',
          borderRadius: 999,
          backgroundColor: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          color: '#818cf8',
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: '#06b6d4',
            boxShadow: '0 0 12px #06b6d4',
          }}
        />
        <span>Deterministic Multi-Agent Runtime {version}</span>
      </div>

      {/* Main Big Headline */}
      <div
        style={{
          transform: `translateY(${(1 - titleSpring) * 60}px)`,
          opacity: titleSpring,
          fontSize: 84,
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: '-2px',
          background:
            'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #818cf8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 30,
        }}
      >
        Stop Letting AI Agents <br />
        <span
          style={{
            background: 'linear-gradient(135deg, #f43f5e 0%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Hallucinate Success.
        </span>
      </div>

      {/* Subtitle */}
      <div
        style={{
          opacity: subtitleOpacity,
          fontSize: 32,
          color: '#94a3b8',
          maxWidth: 1100,
          lineHeight: 1.5,
          fontWeight: 400,
        }}
      >
        Orchestrate <strong style={{ color: '#fff' }}>Claude Code</strong> as
        the brain, <strong style={{ color: '#06b6d4' }}>Herdr</strong> as the
        pane layer, and isolated <strong style={{ color: '#a855f7' }}>agy / codex</strong> workers
        with verified diff-based reviews.
      </div>
    </AbsoluteFill>
  );
};
