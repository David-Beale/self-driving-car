import styled from "styled-components";

export const ContentsContainer = styled.div`
  margin-left: 300px;
  width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const ContentsSubContainer = styled.div`
  min-width: 600px;
  max-width: 740px;
  min-height: calc(100vh - 64px);
  margin: 32px 0;
  padding: 32px 50px;
  border: 1px solid grey;
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  background-color: white;
`;
export const MainSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
export const SectionTitle = styled.div`
  font-size: 2rem;
  color: rgb(24, 90, 188);
  font-weight: 500;
  margin: 16px 0;
  text-transform: capitalize;
`;
