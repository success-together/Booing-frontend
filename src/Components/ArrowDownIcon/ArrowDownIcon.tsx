import React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const SortListIcon = (props: SvgProps) => {
  return (
    <Svg width={18} height={21} fill="none" {...props}>
      <Path
        d="m16.142 7.03-7.07 6.03L2 7.03M9.071 1v12.06"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default SortListIcon;
