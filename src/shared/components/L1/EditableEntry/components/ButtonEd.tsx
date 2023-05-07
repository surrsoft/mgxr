import React from 'react';
import styled from 'styled-components/macro';
import { SvgButtonBaseStyled } from '../../../../hxhg/components/SvgButtonBaseStyled';
import { ButtonColorsType } from '../../../../hxhg/types/L2/ButtonColorsType';
import { ReactComponent as SvgIconEdit } from './IconEdit.svg';
import { ReactComponent as SvgIconCheck } from './IconCheck.svg';
import { ReactComponent as SvgIconClose } from './IconClose.svg';

const sizePx = '240px';

const ButtonIn = styled.button`
  ${SvgButtonBaseStyled};
  
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: ${sizePx};
  min-height: ${sizePx};
  background-color: transparent;
`;

interface Props {
  icon: 'edit' | 'confirm' | 'cancel';
  onClick: () => void;
  disabled: boolean;
  isLoading?: boolean;
}

const colors: ButtonColorsType = {
  normal: 'black',
  disabled: 'silver',
  hover: 'red',
  click: 'yellow'
}

export function ButtonEd({ icon, onClick, isLoading, disabled }: Props) {
  return <ButtonIn
    colors={colors}
    svgSizesPx={{whPx: 140}}
    onClick={onClick}
    isLoading={isLoading}
    disabled={disabled}
  >
    {icon === 'edit' && <SvgIconEdit />}
    {icon === 'confirm' && <SvgIconCheck />}
    {icon === 'cancel' && <SvgIconClose />}
  </ButtonIn>;
}