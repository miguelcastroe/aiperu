import { Loading } from '@carbon/react';

const LoadingSpinner = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
      <Loading withOverlay={false} />
    </div>
  );
};

export default LoadingSpinner;