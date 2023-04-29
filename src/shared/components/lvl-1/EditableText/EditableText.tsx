import styled from 'styled-components/macro';

import { EditableEntry } from '../../lvl-0/EditableEntry/EditableEntry';
import { useCallback, useRef, useState } from 'react';
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
  /**
   * Должен проверить значение valueIn, и если оно валидное, выполнить нужные действия и вернуть { isSuccess: true, ... }.
   * valueOut может быть таким же как valueIn или отличаться от него если нужно.
   */
  onConfirm?: OnVerifyType;
  /** Компонент должен не позволять вводить строку длиной больше указанной здесь. Если здесь falsy, то это правило
   * должно игнорироваться. Значение по умолчанию - 0, что означает "не ограничено" */
  maxLength?: number;
}

/** Редактируемый текст. Справа от текста показывается иконка "редактировать", при нажатию накоторую текст
 * переключается в режим редактирования */
export function EditableText(props: Props) {
  const { value: valueProp = '', onConfirm, maxLength = 0 } = props;
  const [valueLocal, setValueLocal] = useState(valueProp);
  // значение на момент начала редактирования, чтобы вернуться к нему в случае cancel
  const [valueMemo, setValueMemo] = useState(valueLocal);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleOnConfirm = useCallback(async (): Promise<OnVerifyResultType> => {
    const valueIn = inputRef.current?.value || '';
    if (onConfirm) {
      const confirmResult = await onConfirm(valueIn);
      const { isSuccess, valueOut } = confirmResult;
      if (isSuccess) {
        setValueLocal(valueOut);
        setValueMemo(valueOut);
      }
      return confirmResult;
    } else {
      setValueMemo(valueIn);
      return { isSuccess: true, valueOut: '', errorText: '' };
    }
  }, [inputRef?.current, onConfirm]);

  const handleOnCancel = () => {
    setValueLocal(valueMemo);
  };

  const handleOnChange = async (val?: string) => {
    if (maxLength && val && val.length > maxLength) return;
    setValueLocal(val || '');
  };

  const handleOnValue = (val: string) => {
    setValueLocal(val)
    setValueMemo(val)
  }

  return <TestAreaStyled>
    <EditableEntry
      componentInitial={<InitialStyled>{valueLocal}</InitialStyled>}
      componentEdit={<InputStyled ref={inputRef} defaultValue={valueLocal} autoFocus/>}
      inputRef={inputRef}
      onCancel={handleOnCancel}
      onConfirm={onConfirm}
      onChange={handleOnChange}
      onValue={handleOnValue}
      gapPx={6}
    />
  </TestAreaStyled>;
}
