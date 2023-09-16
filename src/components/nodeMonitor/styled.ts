import styled from "styled-components";

export const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  postition: absolute;
`;

export const InnerContainer = styled.div`
  width: 75%;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

export const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const MachinesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  overflow-y: auto;
  max-height: calc(100vh - 150px);
`;

export const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.div`
background-color: rgb(0, 0, 0);
  padding: 20px;
  border-radius: 5px;
`;

export const CloseButtonContainer = styled.div`
  display: flex;
  top: 0;
  left: 0;
`;
