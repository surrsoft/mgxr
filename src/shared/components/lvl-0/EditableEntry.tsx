import { Dispatch, forwardRef, ReactNode, Ref, SetStateAction, useImperativeHandle, useState } from 'react';
import styled from 'styled-components/macro';
import { IconButton, Spinner } from '@primer/react';
import { CheckIcon, HeartIcon, PencilIcon, XIcon } from '@primer/octicons-react';

/*
- переключатель между двумя компонентами. Рисует кнопки редактировать, сохранить, отменить
- состояния (standings):
  - 'initial' -
  - 'edit' -

 */

const ContainerStyled = styled.div`
  display: flex;
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
  onConfirm?: () => void;
  /** Должен вернуть TRUE если можно переходитьт из состояния EDIT в INITIAL */
  onVerify?: () => Promise<boolean>;
  /** Зазор между "телом" и кнопками */
  gapPx?: number;
}

export interface EditableRefType {
  changeStanding: (standing: StandingEnum) => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export const EditableEntry = forwardRef(function EditableEntry(props: Props, ref: Ref<EditableRefType>) {
  const {
    componentInitial,
    componentEdit,
    onCancel,
    onStartEdit,
    onConfirm,
    onVerify,
    isBtnEditDisabled,
    isBtnCancelDisabled,
    isBtnSaveDisabled,
    isBtnEditHidden,
    isBtnCancelHidden,
    isBtnSaveHidden,
    gapPx = 0,
  } = props;
  const [standingLocal, setStandingLocal] = useState<StandingEnum>(StandingEnum.INITIAL);
  const [isLoading, setIsLoading] = useState(false);

  const isInitial = standingLocal === StandingEnum.INITIAL;
  const isEdit = standingLocal === StandingEnum.EDIT;

  useImperativeHandle(ref, () => {
    return {
      changeStanding: (standing: StandingEnum) => {
        setStandingLocal(standing);
      },
      setIsLoading,
    };
  });

  const handleBtnEdit = () => {
    setStandingLocal(StandingEnum.EDIT);
    onStartEdit?.();
  };
  const handleBtnSave = async () => {
    if (!onVerify) return true;

    setIsLoading(true);
    const isSuccess = await onVerify();
    setIsLoading(false);
    if (isSuccess) {
      setStandingLocal(StandingEnum.INITIAL);
      onConfirm?.();
    }
  };
  const handleBtnCancel = () => {
    setStandingLocal(StandingEnum.INITIAL);
    onCancel?.();
  };

  return <ContainerStyled>
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
  </ContainerStyled>;
});
