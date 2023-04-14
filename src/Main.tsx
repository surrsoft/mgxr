import { PropsWithChildren } from 'react';
import { NavStripeProps } from './types/types';
import { NavStripe } from './components/NavStripe';

export function Main({ children, ...rest }: PropsWithChildren<NavStripeProps>) {
  return <div>
    <NavStripe {...rest} />
    <div>
      {children}
    </div>
  </div>;
}