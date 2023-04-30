import styled from 'styled-components/macro';

import { EditableInputEntry } from '../../lvl-0/EditableEntry/EditableInputEntry';
import { useRef, useState } from 'react';
import { OnVerifyType } from '../../types/OnVerifyType';
import { OnVerifyResultType } from '../../types/OnVerifyResultType';

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

const MAX_LENGTH = 10;

/** Редактируемый текст. Справа от текста показывается иконка "редактировать", при нажатию накоторую текст
 * переключается в режим редактирования */
export function EditableTest(props: Props) {
  const { value: valueProp = ''} = props;
  const [valueLocal, setValueLocal] = useState(valueProp);

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

  const handleOnValue = (val: string) => {
    setValueLocal(val);
  };

  const handleOnConfirm = async (valueIn: string) => {
    return new Promise<OnVerifyResultType>((resolve, reject) => {
      setTimeout(() => {
        if (valueIn.length !== 5) {
          resolve({
            isSuccess: false,
            valueOut: valueIn,
            errorText: 'длина должна быть ровно 5',
          });
        } else if (valueIn === 'hellm') {
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
      jsxInitial={<InitialStyled>{valueLocal}</InitialStyled>}
      jsxEdit={<InputStyled ref={inputRef} defaultValue={valueLocal} autoFocus />}
      inputRef={inputRef}
      onConfirm={handleOnConfirm}
      onChange={handleOnChange}
      onValue={handleOnValue}
      gapPx={6}
    />
  </TestAreaStyled>;
}
