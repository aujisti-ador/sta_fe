// material-ui
import { Box } from '@mui/material';
import AuthBackgroundImage from './AuthBackgroundImage.jpeg';


// ==============================|| AUTH BLUR BACK SVG ||============================== //

const AuthBackground = () => {
  return (
    <Box sx={{ position: 'absolute', filter: 'blur(8px)', zIndex: -1, bottom: 0 }}>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <img alt='auth-background' style={{ width: '100%', height: '100%' }} src={AuthBackgroundImage} />
      </div>
    </Box>
  );
};

export default AuthBackground;
