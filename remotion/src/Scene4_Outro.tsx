import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const Scene4_Outro: React.FC<{
  title: string;
  author: string;
  company: string;
}> = ({ title, author, company }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const mainSpring = spring({ frame: frame - 10, fps, config: { damping: 12 } });
  const installSpring = spring({ frame: frame - 25, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill
      style={{
        opacity: fadeIn,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 80px',
      }}
    >
      {/* Title */}
      <div
        style={{
          transform: `scale(${Math.max(0, mainSpring)})`,
          opacity: mainSpring,
          marginBottom: 35,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: '#fff',
            letterSpacing: '-1.5px',
            marginBottom: 12,
          }}
        >
          Supercharge Your Multi-Agent Flow
        </div>
        <div style={{ fontSize: 26, color: '#94a3b8' }}>
          Crafted by <strong style={{ color: '#06b6d4' }}>{author}</strong> @{' '}
          <strong style={{ color: '#818cf8' }}>{company}</strong>
        </div>
      </div>

      {/* 1-Click Install Terminal Code Box */}
      <div
        style={{
          transform: `translateY(${(1 - installSpring) * 50}px)`,
          opacity: installSpring,
          backgroundColor: '#090d16',
          border: '2px solid rgba(99, 102, 241, 0.4)',
          borderRadius: 20,
          padding: '24px 48px',
          maxWidth: 1200,
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
          fontFamily: 'monospace',
          textAlign: 'left',
          marginBottom: 30,
        }}
      >
        <div
          style={{
            fontSize: 16,
            color: '#64748b',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span># Install in Claude Code in 1 second:</span>
          <span style={{ color: '#10b981' }}>● READY</span>
        </div>
        <div style={{ fontSize: 24, color: '#818cf8', fontWeight: 700 }}>
          /plugin install herdr-worker-orchestrator@herdr-worker-orchestrator-marketplace
        </div>
      </div>

      {/* GitHub Call to Action */}
      <div
        style={{
          display: 'flex',
          gap: 20,
          fontSize: 20,
          fontWeight: 700,
          color: '#cbd5e1',
        }}
      >
        <span>⭐ Star on GitHub: github.com/anhnd3005-infinity/herdr-worker-orchestrator</span>
      </div>
    </AbsoluteFill>
  );
};
