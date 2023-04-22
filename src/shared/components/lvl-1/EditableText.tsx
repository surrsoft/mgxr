import styled from 'styled-components/macro';

import { EditableEntry, EditableRefType, StandingEnum } from '../lvl-0/EditableEntry';
import { useCallback, useRef, useState } from 'react';
import { OnVerifyResultType } from '../../types/OnVerifyResultType';
import { OnVerifyType } from '../../types/OnVerifyType';

const TestAreaStyled = styled.div`
  display: flex;
  border: 1px solid red;
  border-radius: 8px;
  padding: 8px;
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
   * должно игнорироваться. Значение по умолчанию - 256 */
  maxLength?: number;
}

export function EditableText(props: Props) {
  const { value: valueInit = '', onConfirm, maxLength = 256 } = props;
  const [value, setValue] = useState(valueInit);
  const [valueMemo, setValueMemo] = useState(value);
  const [inputScrollWithOnStart, setInputScrollWithOnStart] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const editableRef = useRef<EditableRefType>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleOnChange = (ev: any) => {
    const val = ev.target.value;
    if (maxLength && val && val.length > maxLength) return;
    setValue(val || '');
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
    setValue(valueMemo);
    editableRef.current?.changeStanding(StandingEnum.INITIAL);
  }, [valueMemo]);

  const confirmLogic = useCallback(async () => {
    if (onConfirm) {
      setIsLoading(true);
      editableRef.current?.setIsLoading(true);
      const { isSuccess, valueOut } = await onConfirm(value);
      editableRef.current?.setIsLoading(false);
      setIsLoading(false);
      // ---
      if (isSuccess) {
        setValue(valueOut);
        setValueMemo(valueOut);
        return true;
      } else {
        return false;
      }
    } else {
      setValueMemo(value);
      return true;
    }
  }, [value, onConfirm]);

  const handleKeyDown = async (event: any) => {
    if (event.key === 'Enter') {
      // ^ если нажат Enter
      const isSuccess = await confirmLogic();
      if (isSuccess) {
        editableRef.current?.changeStanding(StandingEnum.INITIAL);
      }
    } else if (event.keyCode === 27) {
      // ^ если нажат Esc
      cancelLogic();
    }
  };

  const handleOnCancel = () => {
    cancelLogic();
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
    confirmLogic().then();
  };

  const handleOnVerify = async () => {
    if (!onConfirm) return true;
    setIsLoading(true);
    const { isSuccess } = await onConfirm(value);
    setIsLoading(false);
    return isSuccess;
  };

  return <TestAreaStyled>
    <EditableEntry
      componentInitial={
        <InitialStyled>{value}</InitialStyled>
      }
      componentEdit={
        <InputStyled
          ref={inputRef}
          value={value}
          onChange={handleOnChange}
          onKeyDown={handleKeyDown}
          autoFocus
          disabled={isLoading}
        />
      }
      ref={editableRef}
      onCancel={handleOnCancel}
      onStartEdit={handleOnStartEdit}
      onConfirm={handleOnConfirm}
      onVerify={handleOnVerify}
      gapPx={6}
    />
  </TestAreaStyled>;
}