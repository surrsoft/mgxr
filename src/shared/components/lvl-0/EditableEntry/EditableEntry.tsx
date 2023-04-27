import {
  ComponentType,
  Dispatch,
  forwardRef,
  ReactNode,
  Ref,
  SetStateAction,
  useImperativeHandle,
  useState,
} from 'react';
import styled from 'styled-components/macro';
import { IconButton, Spinner } from '@primer/react';
import { CheckIcon, HeartIcon, PencilIcon, XIcon } from '@primer/octicons-react';
import { OnVerifyRsType } from './types/OnVerifyRsType';
import { useEffectOnce } from 'usehooks-ts';

/*
- переключатель между двумя компонентами. Рисует кнопки редактировать, сохранить, отменить
- состояния (standings):
  - 'initial' -
  - 'edit' -

 */

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

const ButtonEditStyled = styled(IconButton).attrs({ icon: PencilIcon, 'aria-label': 'Default' })`
`;

const ButtonSaveStyled = styled(IconButton).attrs({ icon: CheckIcon, 'aria-label': 'Default' })`
`;

const ButtonCancelStyled = styled(IconButton).attrs({ icon: XIcon, 'aria-label': 'Default' })`
`;

const SpinnerStyled = styled.div`
  display: flex;
  align-items: center;
`;

export enum StandingEnum {
  INITIAL = 'INITIAL',
  EDIT = 'EDIT'
}

interface Props {
  componentInitial: ReactNode;
  componentEdit: ReactNode;
  isBtnEditDisabled?: boolean;
  isBtnSaveDisabled?: boolean;
  isBtnCancelDisabled?: boolean;
  isBtnEditHidden?: boolean;
  isBtnSaveHidden?: boolean;
  isBtnCancelHidden?: boolean;
  onCancel?: () => void;
  onStartEdit?: () => void;
  onConfirm?: () => Promise<OnVerifyRsType>;
  /** Зазор между "телом" и кнопками */
  gapPx?: number;
  onGetOnKeyDownHandler?: (pr: (event: any) => any) => void
}

export interface EditableRefType {
  changeStanding: (standing: StandingEnum) => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsErrShowed: Dispatch<SetStateAction<boolean>>;
  setErrText: Dispatch<SetStateAction<string | undefined | null>>;
}

export const EditableEntry = forwardRef(function EditableEntry(props: Props, ref: Ref<EditableRefType>) {
  const {
    componentInitial,
    componentEdit,
    onCancel,
    onStartEdit,
    onConfirm,
    isBtnEditDisabled,
    isBtnCancelDisabled,
    isBtnSaveDisabled,
    isBtnEditHidden,
    isBtnCancelHidden,
    isBtnSaveHidden,
    gapPx = 0,
    onGetOnKeyDownHandler
  } = props;
  const [standingLocal, setStandingLocal] = useState<StandingEnum>(StandingEnum.INITIAL);
  const [isLoading, setIsLoading] = useState(false);
  const [isErrShowed, setIsErrShowed] = useState(false);
  const [errText, setErrText] = useState<string | undefined | null>('');

  const isInitial = standingLocal === StandingEnum.INITIAL;
  const isEdit = standingLocal === StandingEnum.EDIT;

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
  };

  const handleBtnSave = async (event: any) => {
    setIsErrShowed(false);

    if (!onConfirm) return true;

    if (event.key === 'Enter') {
      // ^ если нажат Enter
      setIsLoading(true);
      const { isSuccess, errorText } = await onConfirm();
      setIsLoading(false);
      if (isSuccess) {
        setStandingLocal(StandingEnum.INITIAL);
      } else {
        setErrText(errorText);
        setIsErrShowed(true);
      }
    } else if (event.keyCode === 27) {
      // ^ если нажат Esc
      setIsErrShowed(false);
      setStandingLocal(StandingEnum.INITIAL);
      onCancel?.();
    }
  };

  useEffectOnce(() => {
    onGetOnKeyDownHandler?.(handleBtnSave)
  })

  const handleBtnCancel = () => {
    setIsErrShowed(false);
    setStandingLocal(StandingEnum.INITIAL);
    onCancel?.();
  };

  return <ContainerStyled>
    <BaseLineStyled>
      <ComponentWrapperStyled>
        {isInitial && componentInitial}
        {isEdit && componentEdit}
      </ComponentWrapperStyled>
      <ButtonsContainerStyled gap={gapPx}>
        {!isLoading && isInitial && !isBtnEditHidden &&
          <ButtonEditStyled onClick={handleBtnEdit} disabled={isBtnEditDisabled || isLoading} />}
        {!isLoading && isEdit && !isBtnSaveHidden &&
          <ButtonSaveStyled onClick={handleBtnSave} disabled={isBtnSaveDisabled || isLoading} />}
        {!isLoading && isEdit && !isBtnCancelHidden &&
          <ButtonCancelStyled onClick={handleBtnCancel} disabled={isBtnCancelDisabled || isLoading} />}
        {isLoading && <SpinnerStyled><Spinner size={'small'} /></SpinnerStyled>}
      </ButtonsContainerStyled>
    </BaseLineStyled>
    {isErrShowed && errText && !isInitial && <ErrorsLineStyled>{errText}</ErrorsLineStyled>}
  </ContainerStyled>;
});
