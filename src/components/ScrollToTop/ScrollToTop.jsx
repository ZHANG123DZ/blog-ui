import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * ScrollToTop component that scrolls the window to the top when the route changes
 * This is especially important in SPAs where the default browser behavior of
 * scrolling to top on page navigation doesn't happen automatically
 */
const ScrollToTop = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return children;
};

ScrollToTop.propTypes = {
  children: PropTypes.node.isRequired
};

export default ScrollToTop;
