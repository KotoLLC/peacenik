import styled from 'styled-components'

export const MessagesWrapper = styled.div`
  position: relative;
  width: 1140px;
  min-height: calc(100vh - 150px);
  background: #FFFFFF;
  margin: 0 auto 31px auto;
  display: flex;

  @media (max-width: 770px) {
    width: calc(100% - 30px);
    padding: 15px 0 0 0;
    min-height: calc(100vh - 100px);
  }
`
export const MessagesSideBarWrapper = styled.div`
  width: 460px;
  z-index: 1;
  top: 0;
  left: 0;
  overflow-x: hidden;
  padding: 15px 30px;
  background: #AAAAAA;
  `
export const MessagesContentWrapper = styled.div`
  flex: 1 0 auto;
  background: #e8edf3;
`

export const SendOutlineIconWrapper = styled.div`
  width: 200px;
  height: 200px;
  padding: 45px;
  background: #fff;
  border-radius: 35px;
  margin-bottom: 70px;
  svg {
    fill: #e9ecee;
  }
`;
export const SendOutlineWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;