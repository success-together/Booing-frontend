import React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const ImagePlusIcon = (props: SvgProps) => {
  return (
    <Svg width={24} height={24} fill="none" {...props}>
      <Path
        d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7M16 5h6M19 2v6"
        stroke="#C6D2E8"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"
        stroke="#C6D2E8"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ImagePlusIcon;
