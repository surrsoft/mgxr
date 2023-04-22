import { PropsWithChildren } from 'react';

import { NavStripeProps } from '../types/types';
import { NavStripe } from '../components/NavStripe';
import { EditableText } from '../shared/components/lvl-1/EditableText';
import { OnVerifyResultType } from '../shared/types/OnVerifyResultType';

export function Main({ children, ...rest }: PropsWithChildren<NavStripeProps>) {

  const handleOnVerify = async (valueIn: string) => {
    return new Promise<OnVerifyResultType>((resolve, reject) => {
      setTimeout(() => {
        resolve({
          isSuccess: valueIn.length === 5,
          valueOut: valueIn,
        });
      }, 2000);
    });
  };

  return <div>
    <NavStripe {...rest} />

    <EditableText value={'hello hello'} onConfirm={handleOnVerify} maxLength={10} />

    <div>
      {children}
    </div>
  </div>;
}