import React from 'react';
import Svg, {Rect, SvgProps} from 'react-native-svg';

const SortListIcon = (props: SvgProps) => {
  return (
    <Svg width={12} height={14} fill="none" {...props}>
      <Rect y={12} width={6} height={2} rx={1} fill="#000" />
      <Rect y={6} width={9} height={2} rx={1} fill="#000" />
      <Rect width={12} height={2} rx={1} fill="#000" />
    </Svg>
  );
};

export default SortListIcon;
