import React from 'react';
import { Composition } from 'remotion';
import { MainVideo } from './MainVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MainVideo"
        component={MainVideo}
        durationInFrames={900} // 30 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Herdr Worker Orchestrator',
          version: 'v0.5.0',
          author: 'Duc Anh (anhnd3005)',
          company: 'Infinity Tech',
        }}
      />
    </>
  );
};
