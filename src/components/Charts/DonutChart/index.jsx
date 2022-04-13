import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Skeleton, Typography } from '@mui/material';
import Highcharts from 'highcharts';

import { formatNumber } from '@src/utils/formatNumber';
import HightChartReact from '../../HighChart';
import { StyledDonutChart, StyledLegendIcon } from './index.style';

const LegendIcon = (props) => (
  <StyledLegendIcon {...props} viewBox="0 0 27 20">
    <path d="M7.76167 0C5.30092 2.46075 3.34894 5.38209 2.01719 8.59722C0.685442 11.8123 -5.2547e-07 15.2583 0 18.7383L26.5 18.7383L7.76167 0Z" />
  </StyledLegendIcon>
);

const DonutChart = ({
  title,
  series,
  pieColors = Highcharts.defaultOptions.colors,
}) => {
  if (!series) {
    return (
      <StyledDonutChart>
        <Skeleton variant="circular" width={200} height={200} />
        <Skeleton variant="text" height={30} />
        <Skeleton variant="text" height={30} />
      </StyledDonutChart>
    );
  }
  const ref = useRef(null);
  const [listVisible, setListVisible] = useState(() =>
    Array(series.length).fill(true),
  );

  useEffect(() => {
    setListVisible(() => Array(series.length).fill(true));
  }, [series]);

  const optionsMemo = useMemo(
    () => ({
      chart: {
        renderTo: 'container',
        type: 'pie',
        width: 250,
        height: 250,
      },
      title: {
        text: null,
      },
      tooltip: {
        pointFormat: '<b>{point.y}</b> ({point.percentage:.2f}%)<br/>',
        shared: true,
      },
      accessibility: {
        point: {
          valueSuffix: '%',
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          colors: pieColors,
          dataLabels: {
            enabled: false,
          },
          showInLegend: true,
        },
      },
      series: [
        {
          type: 'pie',
          innerSize: '50%',
          data: series,
        },
      ],
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
    }),
    [series, listVisible],
  );

  const summary = useMemo(() => {
    let total = 0;
    let totalValue = 0;
    for (let index = 0; index < series.length; index += 1) {
      const item = series[index];
      const visible = listVisible[index];
      total += item.y;
      if (visible) {
        totalValue += item.y;
      }
    }

    return { total, totalValue };
  }, [series, listVisible]);

  const legendItemClick = (index) => {
    if (!ref || !ref.current) return;
    const { chart } = ref.current;
    const serie = chart.series[0];
    const item = serie.data[index];
    const { visible } = item;
    item.setVisible(!visible);

    setListVisible((prev) =>
      prev.map((val, i) => (i === index ? !visible : val)),
    );
  };

  return (
    <StyledDonutChart>
      <Typography className="label">
        {title}: {formatNumber(summary.total)}
      </Typography>
      <div className="container">
        <HightChartReact ref={ref} options={optionsMemo} />
        <Typography className="total-value">
          {formatNumber(summary.totalValue)}
        </Typography>
      </div>
      <div className="legend">
        {series.map((item, index) => {
          const { name, y } = item;
          const visible = listVisible[index];
          const { totalValue } = summary;
          const percentage =
            !visible || !totalValue ? 0 : (y / totalValue) * 100;
          const color = pieColors[index % pieColors.length];

          return (
            <Button
              key={index.toString()}
              className={`legend-item ${
                !listVisible[index] && 'legend-item-hidden'
              }`}
              onClick={() => legendItemClick(index)}
            >
              <LegendIcon color={color} />
              <Typography className="legend-text">
                {name}: {formatNumber(y)} ({percentage.toFixed(2)}%)
              </Typography>
            </Button>
          );
        })}
      </div>
    </StyledDonutChart>
  );
};

export default DonutChart;
