import styled from 'styled-components'

export const Viewport = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 2000;
  background: rgba(38, 38, 38, 0.8);
`

export const DialogWrapper = styled.div`
  width: 555px;
  min-height: 258px;
  padding: 18px 45px 30px;
  background: #fff;
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 2100;
  transform: translate(-50%, -50%);
`