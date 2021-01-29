import React from 'react'
import { 
  NavigationWrapper, 
  NavigationItem,
} from './styles'

export const PageNavigation = () => (
    <NavigationWrapper>
      <NavigationItem to="/friends">FRIENDS</NavigationItem>
      <NavigationItem to="/messages">MESSAGES</NavigationItem>
    </NavigationWrapper>
)
