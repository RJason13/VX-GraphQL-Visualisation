import React from 'react';
import { BarGroupHorizontal, Bar } from '@vx/shape';
import { Group } from '@vx/group';
import { AxisLeft } from '@vx/axis';
import cityTemperature from '@vx/mock-data/lib/mocks/cityTemperature';
import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale';
import { schemeDark2, schemePaired, schemeCategory10, schemeAccent } from 'd3-scale-chromatic';
import { uniq } from 'lodash';

export type BarGroupHorizontalProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
  getGroup: (d: any) => string;
  subgroupDomain: string[];
  scoreDomain: [number, number];
  data: any[]
};

const colorScheme = uniq([
  ...schemeDark2,
  ...schemePaired,
  ...schemeCategory10,
  ...schemeAccent
]);

const green = '#e5fd3d';
const background = '#612efb';
const defaultMargin = { top: 20, right: 20, bottom: 20, left: 70 };

const data = cityTemperature.slice(0, 4);
console.log(data)

const HorizontalBarGroupChart = ({
  width,
  height,
  margin = defaultMargin,
  events = false,
  getGroup,
  subgroupDomain,
  scoreDomain,
  data
}: BarGroupHorizontalProps) => {
  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // scales
  const groupScale = scaleBand({
    domain: data.map(getGroup),
    padding: 0.2,
  });
  const subgroupScale = scaleBand({
    domain: subgroupDomain,
    padding: 0.1,
  });
  const scoreScale = scaleLinear<number>({
    domain: scoreDomain,
  });
  const colorScale = scaleOrdinal<string, string>({
    domain: subgroupDomain,
    range: colorScheme,
  });

  // update scale output dimensions
  groupScale.rangeRound([0, yMax]);
  subgroupScale.rangeRound([0, groupScale.bandwidth()]);
  scoreScale.rangeRound([0, xMax]);

  console.log(data);

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
          color={colorScale}
        >
          {barGroups =>
            barGroups.map(barGroup => (
              <Group
                key={`bar-group-horizontal-${barGroup.index}-${barGroup.y0}`}
                top={barGroup.y0}
              >
                {barGroup.bars.map(bar => (
                  <Bar
                    key={`${barGroup.index}-${bar.index}-${bar.key}`}
                    x={bar.x}
                    y={bar.y}
                    width={bar.width}
                    height={bar.height}
                    fill={bar.color}
                    rx={4}
                    onClick={() => {
                      if (events) alert(`${bar.key} (${bar.value}) - ${JSON.stringify(bar)}`);
                    }}
                  />
                ))}
              </Group>
            ))
          }
        </BarGroupHorizontal>
        <AxisLeft
          scale={groupScale}
          stroke={green}
          tickStroke={green}
          hideAxisLine
          tickLabelProps={() => ({
            fill: green,
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