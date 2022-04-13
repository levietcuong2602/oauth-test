import React, { useMemo, useRef, useState } from 'react';
import { Button, Skeleton, Typography } from '@mui/material';
import Highcharts from 'highcharts';

import { formatNumber } from '@src/utils/formatNumber';
import HightChartReact from '../../HighChart';
import { StyledLegendLine, StyledLineChart } from './index.style';

const LineChart = ({
  title,
  data: dataLineChart,
  colors = Highcharts.defaultOptions.colors,
  unit = '',
}) => {
  if (!dataLineChart) {
    return (
      <StyledLineChart>
        <Skeleton variant="rectangular" height={480} />
      </StyledLineChart>
    );
  }

  const { series, categories } = dataLineChart;

  const ref = useRef(null);
  const [listVisible, setListVisible] = useState(() =>
    Array(series.length).fill(true),
  );

  const optionsMemo = useMemo(
    () => ({
      title: {
        text: '',
      },
      legend: {
        enabled: false,
      },
      xAxis: {
        categories,
      },
      yAxis: {
        title: {
          text: '',
        },
        min: 0,
      },
      tooltip: {
        shared: true,
      },
      colors,
      credits: {
        enabled: false,
      },
      plotOptions: {
        line: {
          marker: {
            enabled: false,
          },
        },
        series: {
          shadow: true,
        },
      },
      series,
    }),
    [title, series, categories],
  );

  const summary = useMemo(() => {
    const data = series.map((ele) => ele.data.reduce((sum, a) => sum + a, 0));
    const total = data.reduce((sum, a) => sum + a, 0);
    return { total, data };
  }, [series]);

  const legendItemClick = (index) => {
    if (!ref || !ref.current) return;
    const { chart } = ref.current;
    const serie = chart.series[index];
    const { visible } = serie;
    if (visible) {
      serie.hide();
    } else {
      serie.show();
    }

    setListVisible((prev) =>
      prev.map((val, i) => (i === index ? !visible : val)),
    );
  };

  return (
    <StyledLineChart>
      <div className="chart">
        <div className="header">
          <Typography className="title">
            {title}: {formatNumber(summary.total)} {unit}
          </Typography>
          {/* <IconButton>
            <img src="/img/switch-icon.svg" alt="switch-icon" />
          </IconButton> */}
        </div>
        <div className="content">
          <HightChartReact ref={ref} options={optionsMemo} />
        </div>
      </div>
      <div className="legend">
        {series.map((item, index) => {
          const { name } = item;
          const { total, data } = summary;
          const amount = data[index];
          const percentage = !total ? 0 : (amount / total) * 100;
          const color = colors[index % colors.length];

          return (
            <Button
              key={index.toString()}
              className={`legend-item ${
                !listVisible[index] && 'legend-item-hidden'
              }`}
              onClick={() => legendItemClick(index)}
            >
              <StyledLegendLine color={color} />
              <Typography className="legend-text">
                {name}: {formatNumber(amount)} ({percentage.toFixed(2)}%)
              </Typography>
            </Button>
          );
        })}
      </div>
    </StyledLineChart>
  );
};

export default LineChart;
