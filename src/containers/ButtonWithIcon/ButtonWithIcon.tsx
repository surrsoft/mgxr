import React from 'react';
import { ReactComponent as IconEdit } from './IconEdit.svg';
import styled from 'styled-components/macro';

const ButtonStyled = styled.button`
  border: 0;
  width: 16px;
  height: 16px;
`;

interface Props {
  onClick?: any;
}

export function ButtonWithIcon(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <ButtonStyled {...props}>
      <IconEdit />
    </ButtonStyled>
  );
}
