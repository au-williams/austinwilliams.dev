import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router';

/**
 * The redirect component handles redirecting window locations.
 * @returns
 */
const RouteRedirect = ({ href }: { href: string }) => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-console
  console.log(href);

  React.useEffect(() => {
    window.location.href = href;
  }, [href, navigate]);

  return null;
};

RouteRedirect.propTypes = {
  href: PropTypes.string.isRequired,
};

export default RouteRedirect;
