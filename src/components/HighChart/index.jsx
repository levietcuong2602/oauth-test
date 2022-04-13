import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const HighChart = React.forwardRef(
  ({ options, constructorType = 'chart' }, ref) => (
    <HighchartsReact
      ref={ref}
      highcharts={Highcharts}
      options={options}
      constructorType={constructorType}
      allowChartUpdate
      immutable={false}
      updateArgs={[true, true, true]}
      containerProps={{ className: 'chartContainer' }}
    />
  ),
);

export default HighChart;
