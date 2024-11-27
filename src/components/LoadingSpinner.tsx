import { CircularProgress, Box } from '@mui/material';

const LoadingSpinner = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
      <CircularProgress sx={{ color: '#1b1d1a' }} />
    </Box>
  );
};

export default LoadingSpinner;