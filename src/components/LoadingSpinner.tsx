import { Loading } from '@geist-ui/core';

const LoadingSpinner = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
      <Loading />
    </div>
  );
};

export default LoadingSpinner;