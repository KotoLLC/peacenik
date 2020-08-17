import React from 'react'
import { PreloaderViewport } from './styles'
import CircularProgress from '@material-ui/core/CircularProgress'

export const Fallback = () => (
  <PreloaderViewport>
    <CircularProgress/>
  </PreloaderViewport>
)