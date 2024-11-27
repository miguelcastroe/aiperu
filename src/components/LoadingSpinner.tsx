import { CircularProgress, Box } from '@mui/material';

const LoadingSpinner = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
      <CircularProgress />
    </Box>
  );
};

export default LoadingSpinner;