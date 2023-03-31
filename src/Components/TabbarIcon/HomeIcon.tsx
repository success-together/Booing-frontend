import React from 'react';
import Svg, {Path} from 'react-native-svg';

const HomeIcon = (props: any) => {
  return (
    <Svg width="25" height="24" viewBox="0 0 25 24" fill={props.active?"white":"none"} xmlns="http://www.w3.org/2000/svg">
      <Path d="M3.5 9L12.5 2L21.5 9V20C21.5 20.5304 21.2893 21.0391 20.9142 21.4142C20.5391 21.7893 20.0304 22 19.5 22H5.5C4.96957 22 4.46086 21.7893 4.08579 21.4142C3.71071 21.0391 3.5 20.5304 3.5 20V9Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M10 19.9287V12.9287H15V19.9287" stroke={props.active?"#33a1f9":"white"} strokeOpacity="0.8" strokeWidth="3" strokeLinecap="square" strokeLinejoin="round"/>
    </Svg>
  );
};

export default HomeIcon;
