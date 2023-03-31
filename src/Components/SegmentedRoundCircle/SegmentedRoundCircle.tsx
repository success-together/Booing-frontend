import React, {useCallback, useState} from 'react';
import {StyleProp, Text, TextStyle, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';

const polarToCartesian = (x: number, y: number, r: number, degrees: number) => {
  const radians = (degrees * Math.PI) / 180.0;
  return [x + r * Math.cos(radians), y + r * Math.sin(radians)];
};

const segmentPath = (
  x: number,
  y: number,
  r0: number,
  r1: number,
  d0: number,
  d1: number,
) => {
  const arc = Math.abs(d0 - d1) > 180 ? 1 : 0;
  const point = (radius: number, degree: number) =>
    polarToCartesian(x, y, radius, degree)
      .map(n => n.toPrecision(5))
      .join(',');
  return [
    `M${point(r0, d0)}`,
    `A${r0},${r0},0,${arc},1,${point(r0, d1)}`,
    `L${point(r1, d1)}`,
    `A${r1},${r1},0,${arc},0,${point(r1, d0)}`,
    'Z',
  ].join('');
};

const segment = ({
  n,
  size,
  segments,
  margin,
  radius,
  width,
  fill,
}: {
  n: number;
  size: number;
  segments: number;
  margin: number;
  radius: number;
  width: number;
  fill: string;
}) => {
  const center = size / 2;
  const degrees = 360 / segments;
  const start = degrees * n;
  const end = degrees * (n + 1 - margin) + (margin === 0 ? 1 : 0);
  const path = segmentPath(center, center, radius, radius - width, start, end);
  return <Path d={path} fill={fill} stroke="none" key={n} />;
};

interface SegmentedRoundCircleProps {
  size: number;
  strokeWidth: number;
  margin: number;
  stats: {color: string; percent: number; label: string}[];
  globalPercent: number;
  globalPercentStyles: StyleProp<TextStyle>;
  onPress?: () => void;
}

const SegmentedRoundCircle = ({
  size,
  strokeWidth,
  margin,
  stats,
  globalPercent,
  globalPercentStyles,
}: SegmentedRoundCircleProps) => {
  const [showStats, setShowStats] = useState(false);

  const segments = [];
  for (const {percent, color} of stats) {
    if (percent === 0) {
      continue;
    }
    for (let i = 0; i < percent; i++) {
      segments.push({
        n: segments.length,
        size,
        segments: 100,
        margin: 0,
        radius: size / 2,
        width: strokeWidth,
        fill: color,
      });
    }

    if (segments.length !== 0 && segments[segments.length - 1].fill === color) {
      segments[segments.length - 1].margin = margin;
    }
  }

  const toggleStats = useCallback(() => {
    setShowStats(prev => !prev);
  }, [setShowStats]);

  return (
    <Svg
      width={size}
      height={size}
      fill="none"
      style={{position: 'relative', zIndex: 999}}
      onPress={toggleStats}>
      {showStats && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 80,
            backgroundColor: '#FAFAFA',
            padding: 10,
            borderRadius: 10,
            width: 150,
          }}>
          {stats.map(({label, color, percent}, index) => (
            <Text
              style={{
                color,
                textTransform: 'capitalize',
            fontFamily: 'Rubik', fontSize: 15,
                fontWeight: '600',
              }}
              key={index}>
              {label} : {percent}%
            </Text>
          ))}
        </View>
      )}
      {segments.map(segmentProps => segment(segmentProps))}
      <View
        style={{
          position: 'absolute',
          top: 28,
          left: 28,
        }}>
        <Text style={globalPercentStyles}>{globalPercent}%</Text>
      </View>
    </Svg>
  );
};

export default SegmentedRoundCircle;
