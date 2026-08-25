import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const Scene3_Superpowers: React.FC = () => {
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

  const item1 = spring({ frame: frame - 5, fps, config: { damping: 12 } });
  const item2 = spring({ frame: frame - 20, fps, config: { damping: 12 } });
  const item3 = spring({ frame: frame - 35, fps, config: { damping: 12 } });
  const item4 = spring({ frame: frame - 50, fps, config: { damping: 12 } });

  const features = [
    {
      title: 'Git Worktree Isolation',
      desc: 'No more shared directory clashes. Workers get isolated trees on task/TASK-xxx branches.',
      icon: '🔒',
      color: '#06b6d4',
      spring: item1,
    },
    {
      title: 'Stateful Task Ledger',
      desc: 'JSON-backed lifecycle state machine. Recovers automatically after crashes or compactions.',
      icon: '📋',
      color: '#6366f1',
      spring: item2,
    },
    {
      title: 'Diff-Based Review Policy',
      desc: 'Reviewers inspect raw git diffs & run tests. Never blindly trust worker self-reports.',
      icon: '🔍',
      color: '#10b981',
      spring: item3,
    },
    {
      title: 'Stalled = UNKNOWN Protocol',
      desc: 'Transcript delivery marker confirmation prevents premature failures on slow startups.',
      icon: '⚡',
      color: '#a855f7',
      spring: item4,
    },
  ];

  return (
    <AbsoluteFill
      style={{
        opacity: fadeIn * fadeOut,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 120px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 50 }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: '#a855f7',
            letterSpacing: 3,
            textTransform: 'uppercase',
            marginBottom: 10,
          }}
        >
          Engineered for Extreme Reliability
        </div>
        <div style={{ fontSize: 56, fontWeight: 900, color: '#ffffff' }}>
          4 Built-in Safety Superpowers
        </div>
      </div>

      {/* Grid 2x2 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 30,
          width: '100%',
          maxWidth: 1500,
        }}
      >
        {features.map((feat, idx) => (
          <div
            key={idx}
            style={{
              transform: `scale(${Math.max(0, feat.spring)})`,
              opacity: feat.spring,
              backgroundColor: 'rgba(14, 20, 36, 0.85)',
              border: `1.5px solid ${feat.color}40`,
              borderRadius: 20,
              padding: '30px 40px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 24,
            }}
          >
            <div
              style={{
                fontSize: 38,
                backgroundColor: `${feat.color}20`,
                padding: '16px 20px',
                borderRadius: 18,
                border: `1px solid ${feat.color}50`,
              }}
            >
              {feat.icon}
            </div>
            <div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: '#fff',
                  marginBottom: 8,
                }}
              >
                {feat.title}
              </div>
              <div style={{ fontSize: 18, color: '#94a3b8', lineHeight: 1.5 }}>
                {feat.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
