import styled from "styled-components";

export const QSBackground = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: rgb(10, 2, 29);
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const QSContainer = styled.div`
  background-color: rgb(236, 236, 236);
  height: 150;
  width: 350px;
  border-radius: 25px;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: rgba(255, 255, 255, 0.575) 0px 5px 15px;
`;
export const QSTitle = styled.div`
  font-size: 1.6rem;
  font-weight: 500;
`;
export const QSButtonsContainer = styled.div`
  display: flex;
  margin-top: 15px;
`;
export const QSButton = styled.div`
  background-color: royalblue;
  margin: 10px;
  padding: 15px;
  border-radius: 10px;
  width: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`;
