import React, { useCallback, useMemo } from 'react';
import { Line, LinePath } from '@vx/shape';
import { Group } from '@vx/group';
import { AxisBottom } from '@vx/axis';
import { scaleLinear, scaleOrdinal, scalePoint } from '@vx/scale';
import { schemeDark2, schemePaired, schemeCategory10, schemeAccent } from 'd3-scale-chromatic';
import { round, uniq } from 'lodash';
import styled, { DefaultTheme } from 'styled-components';
import { defaultStyles, Tooltip, useTooltip } from '@vx/tooltip';
import { localPoint } from '@vx/event';
import { max, merge } from 'd3-array';
import { useMediaQuery } from '@material-ui/core';

// sub components
const PositionRelativeDiv = styled.div`
  position: relative;
`;

const LinesContainer = styled(Group)`
  pointer-events: none;
`;

// main component

type TooltipData = {
  label: string;
  detail: Array<{ series: string; score: number; color: string; }>
};

type LineChartProps<T> = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  getX: (d: T) => string;
  getY: (d: T) => number;
  data: { [series: string]: T[] };
  colorDomain?: string[];
  background?: string;
};

const colorScheme = uniq([
  ...schemeDark2,
  ...schemePaired,
  ...schemeCategory10,
  ...schemeAccent
]);

const axisColor = 'black';
const accentColorDark = '#ccc';
const defaultMargin = { top: 20, right: 50, bottom: 50, left: 50 };
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: 'rgba(0,0,0,0.9)',
  color: 'white'
};
  
let tooltipTimeout: number;

const LineChart = <T extends object>({
  width,
  height,
  margin = defaultMargin,
  getX,
  getY,
  data,
  colorDomain,
  background = 'transparent'
}: LineChartProps<T>) => {
  const isMdUp = useMediaQuery((theme: DefaultTheme) => theme.breakpoints.up('md'));

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
  const yMax = height - margin.top - margin.bottom - (isMdUp ? 0 : 50);

  // scales
  const xScale = useMemo(() => scalePoint({ domain: merge<string>(Object.values(data).map((seriesData) => seriesData.map(getX))) }), [data, getX]);
  xScale.rangeRound([0, xMax]);
  const yScale = useMemo(() => scaleLinear<number>({ domain: [0, max(Object.values(data).flat().map(getY)) || 0] }), [data, getY]);
  yScale.rangeRound([0, yMax]);
  const colorScale = useMemo(() => scaleOrdinal<string, string>({ domain: colorDomain || Object.keys(data), range: colorScheme }), [colorDomain, data]);
  
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

      const correctedX = (x - margin.left);

      const xPoints = xScale.step();

      const indexOfNearestX = Math.round(correctedX / xPoints);
      const nearestX = xScale.domain()[indexOfNearestX];
      
      if (!nearestX) return;

      const tooltipSeriesData = Object.entries(data).map(([series, seriesData]) => ({
        series,
        color: colorScale(series),
        score: getY(seriesData.find(seriesMonthData => getX(seriesMonthData) === nearestX) as T)
      }))
      
      showTooltip({
        tooltipData: {
          label: nearestX,
          detail: tooltipSeriesData
        },
        tooltipLeft: xScale(nearestX),
        tooltipTop: y,
      });
    },
    [colorScale, data, getX, getY, margin.left, showTooltip, xScale],
  );

  return width < 10 ? null : (
    <PositionRelativeDiv>
      <svg width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill={background} rx={14}
                    onTouchStart={handleTooltip}
                    onTouchMove={handleTooltip}
                    onMouseMove={handleTooltip}
                    onMouseLeave={timeoutHideTooltip} />
        <LinesContainer top={margin.top} left={margin.left}>
        {
          Object.entries(data).map(([series, lineData], i) => {
              return (
              <Group key={`lines-${i}`}>
                  <LinePath<T>
                    data={lineData}
                    x={d => xScale(getX(d)) || 0}
                    y={d => yScale(getY(d)) || 0}
                    stroke={colorScale(series)}
                    strokeWidth={1}
                    strokeOpacity={1}
                    shapeRendering="geometricPrecision"
                    markerMid="url(#marker-circle)" />
              </Group>
              );
          })
        }
        {tooltipData && (
          <g>
            <Line
              from={{ x: tooltipLeft, y: 0 }}
              to={{ x: tooltipLeft, y: yMax }}
              stroke={accentColorDark}
              strokeWidth={2}
              pointerEvents="none"
              strokeDasharray="5,2"
            />
            {
              Object.entries(data).map(([, lineData], i) =>
                lineData.map((d, j) => tooltipData.label !== getX(d) ? null : (
                  <circle
                    key={i + j}
                    r={2}
                    cx={xScale(getX(d))}
                    cy={yScale(getY(d))}
                    fill="#555" />
                ))
              )
            }
          </g>
        )}
        <AxisBottom
          top={yMax}
          scale={xScale}
          hideTicks
          hideAxisLine
          tickLabelProps={() => ({
            fill: axisColor,
            fontSize: 11,
            textAnchor: isMdUp ? 'middle' : 'start',
            dy: '0.33em',
            writingMode: isMdUp ? 'horizontal-tb' : 'vertical-rl'
          })}
          />
        </LinesContainer>
      </svg>
      {tooltipOpen && tooltipData && (
        <Tooltip top={(tooltipTop || 0) - 12} left={(tooltipLeft || 0) + 62} style={tooltipStyles}>
          <div>
            <strong>{tooltipData.label}</strong>
          </div>
          {
            tooltipData.detail.map(({ series, color, score }) => 
              <div style={{textAlign: 'left'}}>
                <span style={{color}}>{series}</span>: <span>{round(score, 2)}</span>
              </div>
            )
          }
        </Tooltip>
      )}
    </PositionRelativeDiv>
  );
};

export default LineChart;