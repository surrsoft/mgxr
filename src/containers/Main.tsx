import { PropsWithChildren } from 'react';
import { NavStripeProps } from '../types/types';
import { NavStripe } from '../components/NavStripe';
import { EditableText } from '../shared/components/EditableText';

export function Main({ children, ...rest }: PropsWithChildren<NavStripeProps>) {

  const handleOnVerify = (valueIn: string) => {
    return {
      isSuccess: valueIn.length === 5,
      valueOut: valueIn,
    };
  };

  return <div>
    <NavStripe {...rest} />

    <EditableText value={'hello hello'} onVerify={handleOnVerify} />

    <div>
      {children}
    </div>
  </div>;
}