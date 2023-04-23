import { PropsWithChildren } from 'react';

import { NavStripeProps } from '../types/types';
import { NavStripe } from '../components/NavStripe';
import { EditableText } from '../shared/components/lvl-1/EditableText/EditableText';
import { OnVerifyResultType } from '../shared/components/lvl-1/EditableText/types/OnVerifyResultType';

export function Main({ children, ...rest }: PropsWithChildren<NavStripeProps>) {

  const handleOnConfirm = async (valueIn: string) => {
    return new Promise<OnVerifyResultType>((resolve, reject) => {
      setTimeout(() => {
        if (valueIn.length !== 5) {
          resolve({
            isSuccess: false,
            valueOut: valueIn,
            errorText: 'длина должна быть ровно 5',
          });
        } else {
          resolve({ isSuccess: false, valueOut: valueIn, errorText: 'что-то пошло не так' });
        }
      }, 2000);
    });
  };

  return <div>
    <NavStripe {...rest} />

    <EditableText value={'hello hello'} onConfirm={handleOnConfirm} />

    <div>
      {children}
    </div>
  </div>;
}