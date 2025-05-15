import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router';

/**
 * The redirect component handles redirecting window locations.
 * TODO: Google analytics!
 * @returns
 */
const PageRedirect = ({ href }: { href: string }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    window.location.href = href;
  }, [href, navigate]);

  return null;
};

PageRedirect.propTypes = {
  href: PropTypes.string.isRequired,
};

export default PageRedirect;
