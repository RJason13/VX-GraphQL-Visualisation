import React, { useCallback } from 'react';
import { BarGroupHorizontal, Bar } from '@vx/shape';
import { Group } from '@vx/group';
import { Text } from '@vx/text';
import { AxisLeft } from '@vx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale';
import { schemeDark2, schemePaired, schemeCategory10, schemeAccent } from 'd3-scale-chromatic';
import { round, uniq } from 'lodash';
import styled, { useTheme } from 'styled-components';
import { defaultStyles, Tooltip, useTooltip, withTooltip } from '@vx/tooltip';
import { localPoint } from '@vx/event';
import { max } from 'd3-array';

// sub components
const PositionRelativeDiv = styled.div`
  position: relative;
`;

type TooltipData = {
  label: string;
  color: string;
  group: string;
  score: number;
};

type BarHorizontalProps<T> = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  getGroup: (d: T) => string;
  getValue: (d: T) => number;
  data: T[];
};

const colorScheme = uniq([
  ...schemeDark2,
  ...schemePaired,
  ...schemeCategory10,
  ...schemeAccent
]);

const axisColor = '#e5fd3d';
const background = '#612efb';
const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 };
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: 'rgba(0,0,0,0.9)',
  color: 'white',
};
  
let tooltipTimeout: number;

const HorizontalBarGroupChart = <T extends object>({
  width,
  height,
  margin = defaultMargin,
  getGroup,
  getValue,
  data
}: BarHorizontalProps<T>) => {
  const theme = useTheme();
  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip
  } = useTooltip<TooltipData>();

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // scales
  const groupScale = scaleBand({ domain: data.map(getGroup), padding: 0.2 });
  const scoreScale = scaleLinear<number>({ domain: [0, max(data, getValue) || 0] });
  const colorScale = scaleOrdinal<string, string>({ domain: data.map(getGroup), range: colorScheme });

  // update scale output dimensions
  groupScale.rangeRound([0, yMax]);
  scoreScale.rangeRound([0, xMax]);

  // callbacks
  const timeoutHideTooltip = useCallback(() => {
    tooltipTimeout = window.setTimeout(() => {
      hideTooltip();
    }, 300);
  }, [hideTooltip]);
  const handleTooltip = useCallback(
    (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
      if (tooltipTimeout) clearTimeout(tooltipTimeout);
      const { x, y } = localPoint(event) || { x: 0, y: 0 };

      const correctedY = (y-margin.top);

      const groupBand = groupScale.step();

      const groupIndex = Math.floor(correctedY / groupBand);
      const group = groupScale.domain()[groupIndex];
      
      if (!group) return;
      
      const barColor = colorScale(group);
      showTooltip({
        tooltipData: {
          label: group,
          color: barColor,
          group,
          score: getValue(data[groupIndex])
        },
        tooltipLeft: x,
        tooltipTop: y,
      });
    },
    [colorScale, data, getValue, groupScale, margin.top, showTooltip],
  );

  return width < 10 ? null : (
    <PositionRelativeDiv>
      <svg width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill={background} rx={14} />
        <Group top={margin.top} left={margin.left}>
          {
            data.map((entry, i) => {
              const group = getGroup(entry);
              const y0 = groupScale(group);
              const barWidth = scoreScale(getValue(entry));
              const barHeight = groupScale.bandwidth();
              const barColor = colorScale(group);
              return (
                <Group key={`bar-horizontal-${i}-${y0}`} top={y0}>
                  <Bar
                    x={0}
                    y={0}
                    width={scoreScale(getValue(entry))}
                    height={barHeight}
                    fill={barColor}
                    rx={4}
                    onTouchStart={handleTooltip}
                    onTouchMove={handleTooltip}
                    onMouseMove={handleTooltip}
                    onMouseLeave={timeoutHideTooltip}
                  />
                  
                  <Text
                    x={0}
                    y={0}
                    dx={5}
                    dy={barHeight/2}
                    width={barWidth}
                    verticalAnchor="middle"
                    textAnchor="start"
                    fill={theme.palette.getContrastText(barColor)}
                  >
                    {group}
                  </Text>
                </Group>
              )
            })
          }
        </Group>
      </svg>
      {tooltipOpen && tooltipData && (
        <Tooltip top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
          <div style={{ color: colorScale(tooltipData.color) }}>
            <strong>{tooltipData.label}</strong>
          </div>
          <div>{`score: ${round(tooltipData.score, 2)}`}</div>
        </Tooltip>
      )}
    </PositionRelativeDiv>
  );
};

export default HorizontalBarGroupChart;