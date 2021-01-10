import React, { FC } from 'react';
import { BarGroupHorizontal, Bar } from '@vx/shape';
import { Group } from '@vx/group';
import { Text } from '@vx/text';
import { AxisLeft } from '@vx/axis';
import cityTemperature from '@vx/mock-data/lib/mocks/cityTemperature';
import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale';
import { schemeDark2, schemePaired, schemeCategory10, schemeAccent } from 'd3-scale-chromatic';
import { uniq } from 'lodash';
import { BarProps } from '@vx/shape/lib/shapes/Bar';
import { useTheme } from 'styled-components';

export type BarGroupHorizontalProps = {
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

const HorizontalBarGroupChart: FC<BarGroupHorizontalProps> = ({
  width,
  height,
  margin = defaultMargin,
  events = false,
  getGroup,
  getLabel,
  subgroupDomain,
  scoreDomain,
  data,
  colorDomain
}) => {
  const theme = useTheme();

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // scales
  const groupScale = scaleBand({ domain: data.map(getGroup), padding: 0.2 });
  const subgroupScale = scaleBand({ domain: subgroupDomain, padding: 0.1 });
  const scoreScale = scaleLinear<number>({ domain: scoreDomain });
  const colorScale = scaleOrdinal<string, string>({ domain: colorDomain, range: colorScheme });

  // update scale output dimensions
  groupScale.rangeRound([0, yMax]);
  subgroupScale.rangeRound([0, groupScale.bandwidth()]);
  scoreScale.rangeRound([0, xMax]);

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect x={0} y={0} width={width} height={height} fill={background} rx={14} />
      <Group top={margin.top} left={margin.left}>
        <BarGroupHorizontal
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
                    const barColor = colorScale(getLabel(bar.key, groupIndex));
                    return (
                    <>
                      <Bar
                        key={`${barGroup.index}-${bar.index}-${bar.key}`}
                        x={bar.x}
                        y={bar.y}
                        width={bar.width}
                        height={bar.height}
                        fill={barColor}
                        rx={4}
                        onClick={() => {
                          if (events) alert(`${bar.key} (${bar.value}) - ${JSON.stringify(bar)}`);
                        }}
                      />
                      
                      <Text
                        key={`label-${barGroup.index}-${bar.index}-${bar.key}`}
                        x={bar.x}
                        y={bar.y}
                        dx={5}
                        dy={bar.height/2}
                        width={bar.width}
                        verticalAnchor="middle"
                        textAnchor="start"
                        fill={theme.palette.getContrastText(barColor)}
                      >
                        {getLabel(bar.key, groupIndex)}
                      </Text>
                    </>
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
  );
}

export default HorizontalBarGroupChart;