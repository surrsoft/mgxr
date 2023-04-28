import styled from 'styled-components/macro';

import { EditableEntry, EditableRefType, StandingEnum } from '../../lvl-0/EditableEntry/EditableEntry';
import { useCallback, useRef, useState } from 'react';
import { OnVerifyType } from './types/OnVerifyType';
import { OnVerifyResultType } from './types/OnVerifyResultType';

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
  const { value = '', onConfirm, maxLength = 0 } = props;
  const [valueLocal, setValueLocal] = useState(value);
  const [valueMemo, setValueMemo] = useState(valueLocal);
  const [inputScrollWithOnStart, setInputScrollWithOnStart] = useState(0);

  const editableRef = useRef<EditableRefType>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleOnChange = (ev: any) => {
    editableRef.current?.setIsErrShowed(false);
    const val = ev.target.value;
    if (maxLength && val && val.length > maxLength) return;
    setValueLocal(val || '');
    // --- подгонка ширины инпута под содержимое
    const input = inputRef.current;
    if (input?.scrollWidth && !inputScrollWithOnStart) {
      setInputScrollWithOnStart(input.scrollWidth);
    }
    if (input && input.scrollWidth > inputScrollWithOnStart) {
      input.style.width = `${input.scrollWidth}px`;
    }
  };

  const cancelLogic = useCallback(() => {
    setValueLocal(valueMemo);
    editableRef.current?.changeStanding(StandingEnum.INITIAL);
  }, [valueMemo]);

  const confirmLogic = useCallback(async (): Promise<OnVerifyResultType> => {
    if (onConfirm) {
      const confirmResult = await onConfirm(valueLocal);
      const { isSuccess, valueOut } = confirmResult;
      // ---
      if (isSuccess) {
        setValueLocal(valueOut);
        setValueMemo(valueOut);
      }
      return confirmResult;
    } else {
      setValueMemo(valueLocal);
      return { isSuccess: true, valueOut: '', errorText: '' };
    }
  }, [valueLocal, onConfirm]);

  const handleOnCancel = () => {
    cancelLogic(); // TODO
  };

  const handleOnStartEdit = () => {
    setTimeout(() => {
      const input = inputRef.current;
      setInputScrollWithOnStart(input?.scrollWidth ?? 0);
      if (input?.scrollWidth) {
        input.style.width = `${input.scrollWidth}px`;
      }
    }, 0);

  };

  const handleOnConfirm = () => {
    return confirmLogic();
  };

  return <TestAreaStyled>
    <EditableEntry
      componentInitial={
        <InitialStyled>{valueLocal}</InitialStyled>
      }
      componentEdit={
        <InputStyled
          ref={inputRef}
          value={valueLocal}
          onChange={handleOnChange}
          autoFocus
        />
      }
      ref={editableRef}
      onCancel={handleOnCancel}
      onStartEdit={handleOnStartEdit}
      onConfirm={handleOnConfirm}
      gapPx={6}
      aInputRef={inputRef}
    />
  </TestAreaStyled>;
}
