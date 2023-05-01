import React, { PropsWithChildren } from 'react';

import { NavStripeProps } from '../types/types';
import { NavStripe } from '../components/NavStripe';

import { EditableTest } from '../shared/components/lvl-1/EditableText/EditableTest';
import { ButtonWithIcon } from './ButtonWithIcon/ButtonWithIcon';
import { ButtonWithIconExample } from './ButtonWithIcon/ButtonWithIconExample';

export function Main({ children, ...rest }: PropsWithChildren<NavStripeProps>) {

  return <div>
    <NavStripe {...rest} />

    <ButtonWithIconExample />
    <EditableTest value={'hello hello'} />

    <div>
      {children}
    </div>
  </div>;
}
