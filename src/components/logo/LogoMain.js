import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import mainLogo from 'assets/images/mainLogo.jpeg';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const LogoMain = ({ reverse }) => {
  const theme = useTheme();
  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={theme.palette.mode === 'dark' ? logoDark : logo} alt="Mantis" width="100" />
     *
     */
    <>
      <img style={{ width: 80 }} alt='mainLogo' src={mainLogo}></img>
      {/* <h1 style={{ padding: 10 }}>Sample Tracking System</h1> */}
    </>
  );
};

LogoMain.propTypes = {
  reverse: PropTypes.bool
};

export default LogoMain;
