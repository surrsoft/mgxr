import { useRef, useState } from 'react';

import { EditableInputEntryR1 } from '../../../../shared/hxhg/components/EditableInputEntry/EditableInputEntryR1';
import { OnVerifyTypeR1 } from '../../../../shared/hxhg/types/L2/OnVerifyType/OnVerifyTypeR1';
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
  onConfirm: OnVerifyTypeR1;
}

export function EditableValue({ value, onConfirm }: Props) {
  const [valueLocal, setValueLocal] = useState(value);
  const inputRef = useRef(null);

  const handleOnValue = (val: string) => {
    setValueLocal(val);
  };

  return <EditableInputEntryR1
    jsxInitialInterpolation={(val: string) => (<InitialStyled>{val}</InitialStyled>)}
    jsxEdit={<InputStyled ref={inputRef} defaultValue={valueLocal} autoFocus />}
    initialValue={valueLocal}
    onDone={handleOnValue}
    onConfirm={onConfirm}
    inputRef={inputRef}
  />;
}