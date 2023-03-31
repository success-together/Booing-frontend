import React from 'react';
import Svg, {Path} from 'react-native-svg';

const HomeIcon = (props: any) => {
  return (
    <Svg width={25} height={26} viewBox="0 0 25 26" fill={props.active?"white":"none"} xmlns="http://www.w3.org/2000/Svg">
      <Path d="M3.06006 9.44995H11.7301H20.4001V21C20.4001 21.5569 20.1971 22.091 19.8358 22.4849C19.4744 22.8787 18.9844 23.1 18.4734 23.1H4.98673C4.47574 23.1 3.98569 22.8787 3.62437 22.4849C3.26305 22.091 3.06006 21.5569 3.06006 21V9.44995Z" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M7.14001 8.4001V6.6901C7.14001 4.15511 9.19503 2.1001 11.73 2.1001V2.1001C14.265 2.1001 16.32 4.15511 16.32 6.6901V8.4001" stroke="white" strokeOpacity="0.8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill='none'/>
    </Svg>
  );
};

export default HomeIcon;
