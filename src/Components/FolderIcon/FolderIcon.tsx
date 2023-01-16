import React from 'react';
import Svg, {Path} from 'react-native-svg';

const FolderIcon = () => {
  return (
    <Svg width={51} height={45} fill="none">
      <Path
        d="M43.887 6H8.52c-2.865-.005-5.192 2.46-5.197 5.504 0 .248.015.495.046.74.074.606.596 1.033 1.165.955a.996.996 0 0 0 .393-.143c.46-.284.982-.43 1.513-.424h7.406c1.337.004 2.524.907 2.959 2.25l.176.606c.716 2.25 2.7 3.769 4.937 3.775h24.05a2.98 2.98 0 0 1 1.554.442c.16.1.341.151.526.15.574 0 1.04-.494 1.04-1.105v-7.224c0-3.052-2.328-5.526-5.2-5.526Z"
        fill="#FFB110"
      />
      <Path
        d="M47.836 14.8a4.938 4.938 0 0 0-2.607-.748h-24.05c-1.336-.004-2.524-.907-2.958-2.25l-.177-.606c-.716-2.251-2.7-3.769-4.937-3.775H5.701a4.753 4.753 0 0 0-2.546.714C1.515 9.11.5 10.95.5 12.947v26.527C.5 42.526 2.829 45 5.701 45h39.528c2.872 0 5.2-2.474 5.2-5.526V19.579c.007-1.973-.983-3.798-2.593-4.78Z"
        fill="#FFDE6C"
      />
    </Svg>
  );
};

export default FolderIcon;