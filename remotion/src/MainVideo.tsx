import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, Audio, staticFile } from 'remotion';
import { Scene1_Intro } from './Scene1_Intro';
import { Scene2_Architecture } from './Scene2_Architecture';
import { Scene3_Superpowers } from './Scene3_Superpowers';
import { Scene4_Outro } from './Scene4_Outro';

export const MainVideo: React.FC<{
  title: string;
  version: string;
  author: string;
  company: string;
}> = (props) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#030712',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Background Subtle Grid & Particles */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Ambient Background Music */}
      <Audio src={staticFile('audio/bg_music.mp3')} volume={0.3} />

      {/* Scene 1: The Problem & The Vision (0 - 210 frames) */}
      <Sequence from={0} durationInFrames={210}>
        <Audio src={staticFile('audio/scene1.mp3')} volume={1.0} />
        <Scene1_Intro {...props} />
      </Sequence>

      {/* Scene 2: 3-Layer Architecture (210 - 460 frames) */}
      <Sequence from={210} durationInFrames={250}>
        <Audio src={staticFile('audio/scene2.mp3')} volume={1.0} />
        <Scene2_Architecture {...props} />
      </Sequence>

      {/* Scene 3: 4 Superpowers in Action (460 - 700 frames) */}
      <Sequence from={460} durationInFrames={240}>
        <Audio src={staticFile('audio/scene3.mp3')} volume={1.0} />
        <Scene3_Superpowers {...props} />
      </Sequence>

      {/* Scene 4: Creator & 1-Click Install Outro (700 - 900 frames) */}
      <Sequence from={700} durationInFrames={200}>
        <Audio src={staticFile('audio/scene4.mp3')} volume={1.0} />
        <Scene4_Outro {...props} />
      </Sequence>
    </AbsoluteFill>
  );
};
