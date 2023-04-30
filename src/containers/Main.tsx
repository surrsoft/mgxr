import { PropsWithChildren } from 'react';

import { NavStripeProps } from '../types/types';
import { NavStripe } from '../components/NavStripe';
import { EditableTest } from '../shared/components/lvl-1/EditableText/EditableTest';
import { OnVerifyResultType } from '../shared/components/types/OnVerifyResultType';

export function Main({ children, ...rest }: PropsWithChildren<NavStripeProps>) {

  return <div>
    <NavStripe {...rest} />

    <EditableTest value={'hello hello'}/>

    <div>
      {children}
    </div>
  </div>;
}
