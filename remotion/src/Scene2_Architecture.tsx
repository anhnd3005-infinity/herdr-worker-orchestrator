import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const Scene2_Architecture: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const fadeOut = interpolate(frame, [230, 255], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const card1Spring = spring({ frame: frame - 10, fps, config: { damping: 12 } });
  const card2Spring = spring({ frame: frame - 25, fps, config: { damping: 12 } });
  const card3Spring = spring({ frame: frame - 40, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill
      style={{
        opacity: fadeIn * fadeOut,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 100px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: '#06b6d4',
            letterSpacing: 3,
            textTransform: 'uppercase',
            marginBottom: 10,
          }}
        >
          Battle-Tested Architecture
        </div>
        <div style={{ fontSize: 60, fontWeight: 900, color: '#ffffff' }}>
          Decouple Planning from Heavy Execution
        </div>
      </div>

      {/* 3 Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 40,
          width: '100%',
          maxWidth: 1600,
        }}
      >
        {/* Layer 1 */}
        <div
          style={{
            transform: `translateY(${(1 - card1Spring) * 80}px)`,
            opacity: card1Spring,
            backgroundColor: 'rgba(14, 20, 36, 0.9)',
            border: '2px solid rgba(99, 102, 241, 0.4)',
            borderRadius: 24,
            padding: 40,
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: 999,
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              color: '#818cf8',
              fontSize: 16,
              fontWeight: 800,
              marginBottom: 20,
            }}
          >
            LAYER 1 • BRAIN
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 14 }}>
            Claude Code
          </div>
          <div style={{ fontSize: 20, color: '#94a3b8', lineHeight: 1.6 }}>
            Orchestrates milestones, writes briefings, coordinates task state machine, and never writes blind code.
          </div>
        </div>

        {/* Layer 2 */}
        <div
          style={{
            transform: `translateY(${(1 - card2Spring) * 80}px)`,
            opacity: card2Spring,
            backgroundColor: 'rgba(14, 20, 36, 0.9)',
            border: '2px solid rgba(6, 182, 212, 0.4)',
            borderRadius: 24,
            padding: 40,
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: 999,
              backgroundColor: 'rgba(6, 182, 212, 0.2)',
              color: '#06b6d4',
              fontSize: 16,
              fontWeight: 800,
              marginBottom: 20,
            }}
          >
            LAYER 2 • RUNTIME
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 14 }}>
            Herdr Multiplexer
          </div>
          <div style={{ fontSize: 20, color: '#94a3b8', lineHeight: 1.6 }}>
            Spawns &amp; manages persistent terminal panes, polls process lifecycle, handles mid-task approvals.
          </div>
        </div>

        {/* Layer 3 */}
        <div
          style={{
            transform: `translateY(${(1 - card3Spring) * 80}px)`,
            opacity: card3Spring,
            backgroundColor: 'rgba(14, 20, 36, 0.9)',
            border: '2px solid rgba(168, 85, 247, 0.4)',
            borderRadius: 24,
            padding: 40,
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: 999,
              backgroundColor: 'rgba(168, 85, 247, 0.2)',
              color: '#c084fc',
              fontSize: 16,
              fontWeight: 800,
              marginBottom: 20,
            }}
          >
            LAYER 3 • WORKERS
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 14 }}>
            Isolated Workers
          </div>
          <div style={{ fontSize: 20, color: '#94a3b8', lineHeight: 1.6 }}>
            <strong>agy, codex</strong> operate in dedicated Git Worktrees. Reviewers verify raw diffs before merge.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
