import styled from 'styled-components/macro';
import { EditableEntry, EditableRef, StandingEnum } from './EditableEntry/EditableEntry';
import { useCallback, useRef, useState } from 'react';
import { OnVerifyResultType } from '../types/OnVerifyResultType';
import { OnVerifyType } from '../types/OnVerifyType';

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
  /** Должен вызываться если успешно пройден onVeriry() (см. подробнее в описании onVerify()) */
  onConfirm?: (value: string) => void;
  /** Должен проверить значение valueIn, и если оно валидное вернуть { isSuccess: true, ... }.
   * valueOut может быть таким же как valueIn или отличаться если нужно.
   * Должен вызываться перед onConfirm(), и если { isSuccess: false, ... } то
   * onConfirm() не должен вызываться. В onConfirm() должен быть передан valueOut */
  onVerify?: OnVerifyType;
}

export function EditableText(props: Props) {
  const { value: valueInit = '', onVerify } = props;
  const [value, setValue] = useState(valueInit);
  const [valueMemo, setValueMemo] = useState(value);
  const [inputScrollWithOnStart, setInputScrollWithOnStart] = useState(0);
  console.log('!!-!!-!!  valueMemo {230422101104}\n', { valueMemo, value }); // del+

  const editableRef = useRef<EditableRef>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleOnChange = (ev: any) => {
    setValue(ev.target.value || '');
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

  const confirmLogic = useCallback(() => {
    if (onVerify) {
      const { isSuccess, valueOut } = onVerify(value);
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
  }, [value, onVerify]);

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      // ^ если нажат Enter
      const isSuccess = confirmLogic();
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
      console.log('!!-!!-!!  input?.width {230422095600}\n', {
        width: input?.width,
        scrollWidth: input?.scrollWidth,
      }); // del+
      setInputScrollWithOnStart(input?.scrollWidth ?? 0);
      if (input?.scrollWidth) {
        input.style.width = `${input.scrollWidth}px`;
      }
    }, 0);

  };

  const handleOnConfirm = () => {
    confirmLogic();
  };

  const handleOnVerify = () => {
    if (!onVerify) return true;
    const { isSuccess } = onVerify(value);
    return isSuccess;
  };

  return <TestAreaStyled>
    <EditableEntry
      componentInitial={<InitialStyled>{value}</InitialStyled>}
      componentEdit={<InputStyled
        ref={inputRef}
        value={value}
        onChange={handleOnChange}
        onKeyDown={handleKeyDown}
        autoFocus
      />}
      ref={editableRef}
      onCancel={handleOnCancel}
      onStartEdit={handleOnStartEdit}
      onConfirm={handleOnConfirm}
      onVerify={handleOnVerify}
    />
  </TestAreaStyled>;
}