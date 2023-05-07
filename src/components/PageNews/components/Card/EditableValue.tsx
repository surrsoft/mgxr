import { useRef, useState } from 'react';

import { EditableInputEntry } from '../../../../shared/components/L1/EditableEntry/EditableInputEntry';
import { OnVerifyType } from '../../../../shared/components/types/OnVerifyType';
import styled from 'styled-components/macro';

const InitialStyled = styled.div`
  display: flex;
  align-items: center;
  padding: 0 8px;
`;

const InputStyled = styled.input`
  min-width: 100px;
`;

interface Props {
  value: string;
  onConfirm: OnVerifyType;
}

export function EditableValue({ value, onConfirm }: Props) {
  const [valueLocal, setValueLocal] = useState(value);
  const inputRef = useRef(null);

  const handleOnValue = (val: string) => {
    setValueLocal(val);
  };

  return <EditableInputEntry
    jsxInitialInterpolation={(val: string) => (<InitialStyled>{val}</InitialStyled>)}
    jsxEdit={<InputStyled ref={inputRef} defaultValue={valueLocal} autoFocus />}
    initialValue={valueLocal}
    onDone={handleOnValue}
    onConfirm={onConfirm}
    inputRef={inputRef}
  />;
}