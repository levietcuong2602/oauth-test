import styled from 'styled-components';
import { COLOR } from '@src/styles/color';

export default styled.div`
  .filter_search,
  .date_range_start,
  .date_range_end,
  .MuiSelect-root {
    background: ${COLOR.white};
  }
`;

export const ContainerHeaderStyle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .filter_item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .item {
      margin-right: 5px;
      margin-left: 5px;
    }
  }
`;
