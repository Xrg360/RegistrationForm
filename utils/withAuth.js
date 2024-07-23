import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/app/providers/context';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { currentUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!currentUser) {
        router.push('/login');
      }
    }, [currentUser]);

    if (!currentUser) {
      return null; 
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
