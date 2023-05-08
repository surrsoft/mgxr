import styled from 'styled-components/macro';

import { EditableInputEntry } from '../../L1/EditableEntry/EditableInputEntry';
import { useRef, useState } from 'react';
import { OnVerifyTypeR1 } from '../../../hxhg/types/L2/OnVerifyType/OnVerifyTypeR1';
import { OnVerifyResultTypeR1 } from '../../../hxhg/types/L1/OnVeriryResultType/OnVerifyResultTypeR1';

const TestAreaStyled = styled.div`
  display: flex;
  border-radius: 8px;
`;

const InitialStyled = styled.div`
  display: flex;
  align-items: center;
  padding: 0 8px;
`;

const InputStyled = styled.input`
  min-width: 100px;
`;

interface Props {
  /** Здесь должно быть начальное значение */
  value?: string;
}

const MAX_LENGTH = 30;

/** Редактируемый текст. Справа от текста показывается иконка "редактировать", при нажатию накоторую текст
 * переключается в режим редактирования */
export function EditableTest(props: Props) {
  const { value = '' } = props;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleOnChange = async (val?: string) => {
    if (!val || val.length < 1) {
      return 'поле не должно быть пустым';
    }
    if (val && val.length > MAX_LENGTH) {
      return `длина должна быть не более ${MAX_LENGTH}`;
    }
    return '';
  };

  const handleOnConfirm = async (valueIn: string) => {
    return new Promise<OnVerifyResultTypeR1>((resolve, reject) => {
      setTimeout(() => {
        if (valueIn.length < 6) {
          resolve({
            isSuccess: false,
            valueOut: valueIn,
            errorText: 'длина должна быть >= 6',
          });
        } else if (valueIn.length >= 6) {
          resolve({
            isSuccess: true, valueOut: valueIn, errorText: '',
          });
        } else {
          resolve({ isSuccess: false, valueOut: valueIn, errorText: 'что-то пошло не так' });
        }
      }, 2000);
    });
  };

  return <TestAreaStyled>
    <EditableInputEntry
      jsxInitialInterpolation={(val: string) => (<InitialStyled>{val}</InitialStyled>)}
      jsxEdit={<InputStyled ref={inputRef} defaultValue={value} autoFocus />}
      initialValue={value}
      inputRef={inputRef}
      onConfirm={handleOnConfirm}
      onChange={handleOnChange}
      options={{ gapPx: 6 }}
    />
  </TestAreaStyled>;
}
