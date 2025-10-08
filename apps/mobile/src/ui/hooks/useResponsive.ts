import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { 
  getDeviceType, 
  isLargeScreen, 
  isTablet, 
  isMobile,
  getMaxContentWidth,
  getHorizontalPadding,
  getVerticalSpacing,
  getGridColumns,
  shouldShowSidebar,
  shouldShowBottomTabs,
  getResponsiveClasses
} from '../utils/responsive';

export const useResponsive = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const deviceType = getDeviceType();
  const isLarge = isLargeScreen();
  const isTabletDevice = isTablet();
  const isMobileDevice = isMobile();
  const maxContentWidth = getMaxContentWidth();
  const horizontalPadding = getHorizontalPadding();
  const verticalSpacing = getVerticalSpacing();
  const gridColumns = getGridColumns();
  const showSidebar = shouldShowSidebar();
  const showBottomTabs = shouldShowBottomTabs();

  const getResponsiveValue = <T>(values: {
    mobile?: T;
    tablet?: T;
    desktop?: T;
  }): T | undefined => {
    switch (deviceType) {
      case 'desktop':
        return values.desktop ?? values.tablet ?? values.mobile;
      case 'tablet':
        return values.tablet ?? values.mobile;
      case 'mobile':
      default:
        return values.mobile;
    }
  };

  const getResponsiveStyle = (styles: {
    mobile?: any;
    tablet?: any;
    desktop?: any;
  }) => {
    return getResponsiveValue(styles) || {};
  };

  const getResponsiveClassName = (classes: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  }) => {
    return getResponsiveClasses(classes);
  };

  return {
    dimensions,
    deviceType,
    isLarge,
    isTablet: isTabletDevice,
    isMobile: isMobileDevice,
    maxContentWidth,
    horizontalPadding,
    verticalSpacing,
    gridColumns,
    showSidebar,
    showBottomTabs,
    getResponsiveValue,
    getResponsiveStyle,
    getResponsiveClassName,
  };
};
