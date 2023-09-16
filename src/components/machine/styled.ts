import styled from 'styled-components';

export const MachineContainer = styled.div`
  display: flex;
  color: white;
  flex-direction: column;
  align-items: center;
  margin: 50px 0;
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  width: 150px;
  background-color: rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    border-color:  #646cff; 

  }
`;

export const StatusIndicator = styled.div<{ catchingUp: boolean | null }>`
  height: 10px;
  width: 10px;
  border-radius: 5px;
  padding: 10px;
  margin: 5px;
  background-color: ${({ catchingUp }) =>
    catchingUp === true
      ? 'yellow'
      : catchingUp === false
      ? 'green'
      : 'red'};
`;