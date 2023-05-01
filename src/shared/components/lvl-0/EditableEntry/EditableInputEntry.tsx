import {
  Dispatch,
  forwardRef,
  ReactNode,
  Ref,
  RefObject,
  SetStateAction, useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components/macro';
import { IconButton, Spinner } from '@primer/react';
import { CheckIcon, PencilIcon, XIcon } from '@primer/octicons-react';
import { useEventListener } from 'usehooks-ts';

import { OnVerifyType } from '../../types/OnVerifyType';

const ContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

const BaseLineStyled = styled.div`
  display: flex;
`;

const ErrorsLineStyled = styled.div`
  display: flex;
  color: red;
  font-size: 12px;
`;

const ComponentWrapperStyled = styled.div`
  display: flex;
`;

const ButtonsContainerStyled = styled.div<{ gap: number }>`
  display: flex;
  padding-left: ${({ gap }) => gap}px;
`;

const ButtonEditStyled = styled(IconButton).attrs({ icon: PencilIcon, 'aria-label': 'Default' })``;

const ButtonSaveStyled = styled(IconButton).attrs({ icon: CheckIcon, 'aria-label': 'Default' })``;

const ButtonCancelStyled = styled(IconButton).attrs({ icon: XIcon, 'aria-label': 'Default' })``;

const SpinnerStyled = styled.div`
  display: flex;
  align-items: center;
`;

export enum StandingEnum {
  INITIAL = 'INITIAL',
  EDIT = 'EDIT'
}

interface Props {
  /** JSX для состояния {@link StandingEnum.INITIAL} */
  jsxInitial: ReactNode;
  /** JSX для состояния {@link StandingEnum.EDIT} */
  jsxEdit: ReactNode;
  /** клиент может указать здесь ref на инпут из jsxEdit */
  inputRef?: RefObject<HTMLInputElement>;
  isBtnEditDisabled?: boolean;
  isBtnSaveDisabled?: boolean;
  isBtnCancelDisabled?: boolean;
  isBtnEditHidden?: boolean;
  isBtnSaveHidden?: boolean;
  isBtnCancelHidden?: boolean;
  /** исполнитель должен вызвать это когда компонент переходит из состояния EDIT в состояние INITIAL не в результате
   * успешного завершения редактирования */
  onCancel?: () => void;
  /** исполнитель должен вызывать этот колбэк при каждом начале редактирования */
  onStartEdit?: () => void;
  /**
   * клиент олжен проверить значение valueIn, и если оно валидное, выполнить нужные действия и вернуть { isSuccess: true, ... }.
   * valueOut может быть таким же как valueIn или отличаться от него если нужно.
   */
  onConfirm?: OnVerifyType;
  /**
   * клиент должен проверить val и вернуть пустую строку если всё хорошо, иначе должен вернуть текст, который
   * исполнитель должен показать как ошибку
   * @param val
   */
  onChange?: (val?: string) => Promise<string>;
  /** исполнитель должен вызывать это при успешном завершении редактирования, передавая valueOut полученный по
   * результатам onConfirm() */
  onValue?: (val: string) => void;
  /** клиент может указать здесь зазор между "телом" и кнопками */
  gapPx?: number;
}

export interface EditableRefType {
  changeStanding: (standing: StandingEnum) => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsErrShowed: Dispatch<SetStateAction<boolean>>;
  setErrText: Dispatch<SetStateAction<string | undefined | null>>;
}

/**
 * Редактируемый текст. Справа от jsxInitial показывается кнопка "редактировать", при нажатии на которую
 * компонент переходит в режим редактирования, в котором пользователь может сделать необходимые правки текста.
 *
 * Переключает между двумя компонентами - jsxInitial и jsxEdit.
 * jsxEdit должен содержать внутри себя элемент input, ref на который нужно передать в пропс inputRef.
 *
 * Рисует кнопки "редактировать", "сохранить", "отменить".
 * Подгоняет длину input под содержимое.
 */
export const EditableInputEntry = forwardRef(function EditableEntry(props: Props, ref: Ref<EditableRefType>) {
  const {
    jsxInitial,
    jsxEdit,
    onCancel,
    onStartEdit,
    onConfirm,
    onChange,
    onValue,
    isBtnEditDisabled,
    isBtnCancelDisabled,
    isBtnSaveDisabled,
    isBtnEditHidden,
    isBtnCancelHidden,
    isBtnSaveHidden,
    gapPx = 0,
    inputRef,
  } = props;
  const [standingLocal, setStandingLocal] = useState<StandingEnum>(StandingEnum.INITIAL);
  const [isLoading, setIsLoading] = useState(false);
  const [isErrShowed, setIsErrShowed] = useState(false);
  const [errText, setErrText] = useState<string | undefined | null>('');
  const [inputScrollWithOnStart, setInputScrollWithOnStart] = useState(0);
  // значение на момент начала редактирования, чтобы вернуться к нему в случае cancel
  const [valueMemo, setValueMemo] = useState<string>('');

  const isInitial = standingLocal === StandingEnum.INITIAL;
  const isEdit = standingLocal === StandingEnum.EDIT;

  useEffect(() => {
    if (inputRef?.current?.defaultValue && !valueMemo) {
      setValueMemo(inputRef.current.defaultValue);
    }
  }, [inputRef?.current?.defaultValue]);

  useImperativeHandle(ref, () => {
    return {
      changeStanding: (standing: StandingEnum) => {
        setStandingLocal(standing);
      },
      setIsLoading,
      setIsErrShowed,
      setErrText,
    };
  });

  const handleBtnEdit = () => {
    setIsErrShowed(false);
    setStandingLocal(StandingEnum.EDIT);
    onStartEdit?.();
    // --- управление длиной (шириной) инпута
    setTimeout(() => {
      const input = inputRef?.current;
      setInputScrollWithOnStart(input?.scrollWidth ?? 0);
      if (input?.scrollWidth) {
        input.style.width = `${input.scrollWidth}px`;
      }
    }, 0);
  };

  const handleBtnSave = async () => {
    setIsErrShowed(false);
    const input = inputRef?.current;

    // --- onConfirm
    if (!onConfirm) return true;
    setIsLoading(true);
    inputRef?.current?.setAttribute('disabled', 'true');
    const { isSuccess, errorText, valueOut } = await onConfirm(inputRef?.current?.value || '');
    inputRef?.current?.removeAttribute('disabled');
    setIsLoading(false);

    // ---
    if (isSuccess) {
      setStandingLocal(StandingEnum.INITIAL);
      if (inputRef?.current) {
        inputRef.current.value = valueOut;
        inputRef.current.defaultValue = valueOut;
        setValueMemo(valueOut);
      }
      onValue?.(valueOut);
    } else {
      setErrText(errorText);
      setIsErrShowed(true);
    }
  };

  const handleBtnCancel = () => {
    setIsErrShowed(false);
    debugger; // del+ 230430113845
    if (inputRef?.current) {
      inputRef.current.value = valueMemo;
    }
    setStandingLocal(StandingEnum.INITIAL);
    onCancel?.();
  };

  const handleOnKeyDown = async (event: KeyboardEvent) => {
    console.log('!!-!!-!! event {230428063944}\n', event); // del+
    switch (event.code) {
      case 'Enter':
        await handleBtnSave();
        break;
      case 'Escape':
        await handleBtnCancel();
        break;
    }
  };

  const handleOnChange = async (event: any) => {
    setIsErrShowed(false);
    const val = (event.target as any)?.value;
    const errString = await onChange?.(val);
    if (errString) {
      setIsErrShowed(true);
      setErrText(errString);
    }

    // --- подгонка ширины инпута под содержимое
    const input = inputRef?.current;
    if (input?.scrollWidth && !inputScrollWithOnStart) {
      setInputScrollWithOnStart(input.scrollWidth);
    }
    if (input && input.scrollWidth > inputScrollWithOnStart) {
      input.style.width = `${input.scrollWidth}px`;
    }
  };

  const defaultRef = useRef(null);
  useEventListener('keydown', handleOnKeyDown, inputRef || defaultRef);
  useEventListener('input', handleOnChange, inputRef || defaultRef);

  return <ContainerStyled>
    <BaseLineStyled>
      <ComponentWrapperStyled>
        {isInitial && jsxInitial}
        {isEdit && jsxEdit}
      </ComponentWrapperStyled>
      <ButtonsContainerStyled gap={gapPx}>
        {!isLoading && isInitial && !isBtnEditHidden &&
          <ButtonEditStyled onClick={handleBtnEdit} disabled={isBtnEditDisabled || isLoading} />}
        {!isLoading && isEdit && !isBtnSaveHidden &&
          <ButtonSaveStyled onClick={handleBtnSave} disabled={isBtnSaveDisabled || isLoading || isErrShowed} />}
        {!isLoading && isEdit && !isBtnCancelHidden &&
          <ButtonCancelStyled onClick={handleBtnCancel} disabled={isBtnCancelDisabled || isLoading} />}
        {isLoading && <SpinnerStyled><Spinner size={'small'} /></SpinnerStyled>}
      </ButtonsContainerStyled>
    </BaseLineStyled>
    {isErrShowed && errText && !isInitial && <ErrorsLineStyled>{errText}</ErrorsLineStyled>}
  </ContainerStyled>;
});
