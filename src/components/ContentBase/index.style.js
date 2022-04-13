import styled from 'styled-components';

export default styled.div``;

export const ContainerHeaderStyle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

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
