import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom'
import styled from '@emotion/styled'

const OverlayContainer = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
`

const Overlay = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: black;
  opacity: 0.4;
  cursor: pointer;
  display: flex;
  align-itmes: center;
`

const ContentContainer = styled('div')`
  position: absolute;
  top: calc(50% - 150px);
  left: calc(50% - 150px);
  background: white;
  border-radius: 3px;
  border: 1px solid white;
`

export default function Modal(props) {
  const [modalRoot] = useState(document.getElementById('root'))
  const [el] = useState(document.createElement('div'))
  useEffect(() => {
    modalRoot.appendChild(el)
    return () => {
      modalRoot.removeChild(el)
    }
  }, [el, modalRoot])

  const subRender = () => {
    return <OverlayContainer>
      <Overlay onClick={props.close} />
      <ContentContainer>
        {props.children}
      </ContentContainer>
    </OverlayContainer>
  }
  return ReactDOM.createPortal(
    subRender(),
    el
  )
}
