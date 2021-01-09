import React from 'react';
import { BarGroupHorizontal, Bar } from '@vx/shape';
import { Group } from '@vx/group';
import { AxisLeft } from '@vx/axis';
import cityTemperature, { CityTemperature } from '@vx/mock-data/lib/mocks/cityTemperature';
import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale';
import { timeParse, timeFormat } from 'd3-time-format';
import { blue, purple } from '@material-ui/core/colors';
import { schemeDark2, schemePaired, schemeCategory10, schemeAccent } from 'd3-scale-chromatic';
import { uniq } from 'lodash';

export type BarGroupHorizontalProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
  getDate: (d: any) => string
};

type CityName = 'New York' | 'San Francisco' | 'Austin';

const colorScheme = uniq([
  ...schemeDark2,
  ...schemePaired,
  ...schemeCategory10,
  ...schemeAccent
]);

const green = '#e5fd3d';
const background = '#612efb';
const defaultMargin = { top: 20, right: 20, bottom: 20, left: 70 };

const parseDate = timeParse('%Y-%m-%d');
const format = timeFormat('%b %Y');
const formatDate = (date: string) => format(parseDate(date) as Date);
function max<D>(arr: D[], fn: (d: D) => number) {
  return Math.max(...arr.map(fn));
}

const data = cityTemperature.slice(0, 4);
const keys = Object.keys(data[0]).filter(d => d !== 'date') as CityName[];

export default function Example({
  width,
  height,
  margin = defaultMargin,
  events = false,
  getDate
}: BarGroupHorizontalProps) {
  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // scales
  const dateScale = scaleBand({
    domain: data.map(getDate),
    padding: 0.2,
  });
  const cityScale = scaleBand({
    domain: keys,
    padding: 0.1,
  });
  const tempScale = scaleLinear<number>({
    domain: [0, max(data, d => max(keys, key => Number(d[key])))],
  });
  const colorScale = scaleOrdinal<string, string>({
    domain: keys,
    range: colorScheme,
  });

  // update scale output dimensions
  dateScale.rangeRound([0, yMax]);
  cityScale.rangeRound([0, dateScale.bandwidth()]);
  tempScale.rangeRound([0, xMax]);

  console.log(data);

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect x={0} y={0} width={width} height={height} fill={background} rx={14} />
      <Group top={margin.top} left={margin.left}>
        <BarGroupHorizontal
          data={data}
          keys={keys}
          width={xMax}
          y0={getDate}
          y0Scale={dateScale}
          y1Scale={cityScale}
          xScale={tempScale}
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
          scale={dateScale}
          stroke={green}
          tickStroke={green}
          tickFormat={formatDate}
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