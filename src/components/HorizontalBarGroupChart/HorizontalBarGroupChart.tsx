import React, { useCallback } from 'react';
import { BarGroupHorizontal, Bar } from '@vx/shape';
import { Group } from '@vx/group';
import { Text } from '@vx/text';
import { AxisLeft } from '@vx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale';
import { schemeDark2, schemePaired, schemeCategory10, schemeAccent } from 'd3-scale-chromatic';
import { round, uniq } from 'lodash';
import { useTheme } from 'styled-components';
import { defaultStyles, Tooltip, withTooltip } from '@vx/tooltip';
import { localPoint } from '@vx/event';

export type GroupData = {
  group: string;
  [k: string]: number | string;
}

type TooltipData = {
  label: string;
  color: string;
  group: string;
  score: number;
};

type BarGroupHorizontalProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
  getGroup: (d: any) => string;
  subgroupDomain: string[];
  scoreDomain: [number, number];
  data: any[];
  getLabel: (key: string, index: number) => string;
  colorDomain: string[];
};

const colorScheme = uniq([
  ...schemeDark2,
  ...schemePaired,
  ...schemeCategory10,
  ...schemeAccent
]);

const axisColor = '#e5fd3d';
const background = '#612efb';
const defaultMargin = { top: 20, right: 20, bottom: 20, left: 70 };
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: 'rgba(0,0,0,0.9)',
  color: 'white',
};
  
let tooltipTimeout: number;

const HorizontalBarGroupChart = withTooltip<BarGroupHorizontalProps, TooltipData>(({
  width,
  height,
  margin = defaultMargin,
  events = false,
  getGroup,
  getLabel,
  subgroupDomain,
  scoreDomain,
  data,
  colorDomain,
  tooltipOpen,
  tooltipLeft,
  tooltipTop,
  tooltipData,
  hideTooltip,
  showTooltip
}) => {
  const theme = useTheme();

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // scales
  const groupScale = scaleBand({ domain: data.map(getGroup), padding: 0.1 });
  const subgroupScale = scaleBand({ domain: subgroupDomain, padding: 0.1 });
  const scoreScale = scaleLinear<number>({ domain: scoreDomain });
  const colorScale = scaleOrdinal<string, string>({ domain: colorDomain, range: colorScheme });

  // update scale output dimensions
  groupScale.rangeRound([0, yMax]);
  subgroupScale.rangeRound([0, groupScale.bandwidth()]);
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
      const subgroupBand = subgroupScale.step();

      const groupIndex = Math.floor(correctedY / groupBand);
      const group = groupScale.domain()[groupIndex];
      const subgroupIndex = Math.floor((correctedY - (groupScale(group) as number)) / subgroupBand);
      const subgroup = subgroupScale.domain()[subgroupIndex];
      
      if (!subgroup) return;

      const label = getLabel(subgroup, groupIndex);

      if (!label) return;
      
      const barColor = colorScale(label);
      showTooltip({
        tooltipData: {
          label,
          color: barColor,
          group,
          score: data[groupIndex][subgroup]
        },
        tooltipLeft: x,
        tooltipTop: y,
      });
    },
    [colorScale, data, getLabel, groupScale, margin.top, showTooltip, subgroupScale],
  );

  return width < 10 ? null : (
    <div>
      <svg width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill={background} rx={14} />
        <Group top={margin.top} left={margin.left}>
          <BarGroupHorizontal<GroupData, string>
            data={data}
            keys={subgroupDomain}
            width={xMax}
            y0={getGroup}
            y0Scale={groupScale}
            y1Scale={subgroupScale}
            xScale={scoreScale}
            color={(key) => key}
          >
            {barGroups =>
              barGroups.map((barGroup, groupIndex) => (
                <Group
                  key={`bar-group-horizontal-${barGroup.index}-${barGroup.y0}`}
                  top={barGroup.y0}
                >
                  {
                    barGroup.bars.map(bar => {
                      const label = getLabel(bar.key, groupIndex);
                      const barColor = colorScale(label);
                      return (
                      <React.Fragment key={`${barGroup.index}-${bar.index}-${bar.key}`}>
                        <Bar
                          x={bar.x}
                          y={bar.y}
                          width={bar.width}
                          height={bar.height}
                          fill={barColor}
                          rx={4}
                          onClick={() => {
                            if (events) alert(`${bar.key} (${bar.value}) - ${JSON.stringify(bar)}`);
                          }}
                          onTouchStart={handleTooltip}
                          onTouchMove={handleTooltip}
                          onMouseMove={handleTooltip}
                          onMouseLeave={timeoutHideTooltip}
                        />
                        
                        <Text
                          x={bar.x}
                          y={bar.y}
                          dx={5}
                          dy={bar.height/2}
                          width={bar.width}
                          verticalAnchor="middle"
                          textAnchor="start"
                          fill={theme.palette.getContrastText(barColor)}
                        >
                          {label}
                        </Text>
                      </React.Fragment>
                      )
                    })
                  }
                </Group>
              ))
            }
          </BarGroupHorizontal>
          <AxisLeft
            scale={groupScale}
            hideTicks
            hideAxisLine
            tickLabelProps={() => ({
              fill: axisColor,
              fontSize: 11,
              textAnchor: 'end',
              dy: '0.33em',
            })}
          />
        </Group>
      </svg>
      {tooltipOpen && tooltipData && (
        <Tooltip top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
          <div style={{ color: colorScale(tooltipData.color) }}>
            <strong>{tooltipData.label}</strong>
          </div>
          <div>{`score: ${round(tooltipData.score, 2)}`}</div>
          <div>
            <small>{tooltipData.group}</small>
          </div>
        </Tooltip>
      )}
    </div>
  );
});

export default HorizontalBarGroupChart;