import { forwardRef, ReactNode, Ref, useEffect, useImperativeHandle, useState } from 'react';
import styled from 'styled-components/macro';
import { IconButton } from '@primer/react';
import { CheckIcon, HeartIcon, PencilIcon, XIcon } from '@primer/octicons-react';
import { OnVerifyType } from '../../types/OnVerifyType';

/*
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

const ButtonsContainerStyled = styled.div`
  display: flex;
`;

const ButtonEditStyled = styled(IconButton).attrs({ icon: PencilIcon, 'aria-label': 'Default' })`
`;

const ButtonSaveStyled = styled(IconButton).attrs({ icon: CheckIcon, 'aria-label': 'Default' })`
`;

const ButtonCancelStyled = styled(IconButton).attrs({ icon: XIcon, 'aria-label': 'Default' })`
`;

export enum StandingEnum {
  INITIAL = 'INITIAL',
  EDIT = 'EDIT'
}

interface BtnStateType {
  disabled: boolean;
  invisible: boolean;
}

interface Props {
  componentInitial: ReactNode;
  componentEdit: ReactNode;
  btnEditDisabled?: boolean;
  btnSaveDisabled?: boolean;
  btnCancelDisabled?: boolean;
  onCancel?: () => void;
  onStartEdit?: () => void;
  onConfirm?: () => void;
  /** Должен вернуть TRUE если можно переходитьт из состояния EDIT в INITIAL */
  onVerify?: () => boolean;
}

export interface EditableRef {
  changeStanding: (standing: StandingEnum) => void;
}

export const EditableEntry = forwardRef(function EditableEntry(props: Props, ref: Ref<EditableRef>) {
  const {
    componentInitial,
    componentEdit,
    onCancel,
    onStartEdit,
    onConfirm,
    onVerify,
    btnEditDisabled,
    btnCancelDisabled,
    btnSaveDisabled,
  } = props;
  const [standingLocal, setStandingLocal] = useState<StandingEnum>(StandingEnum.INITIAL);

  const isInitial = standingLocal === StandingEnum.INITIAL;
  const isEdit = standingLocal === StandingEnum.EDIT;

  useImperativeHandle(ref, () => {
    return {
      changeStanding: (standing: StandingEnum) => {
        setStandingLocal(standing);
      },
    };
  });

  const handleBtnEdit = () => {
    setStandingLocal(StandingEnum.EDIT);
    onStartEdit?.();
  };
  const handleBtnSave = () => {
    if (!onVerify || onVerify?.()) {
      setStandingLocal(StandingEnum.INITIAL);
      onConfirm?.();
    }
  };
  const handleBtnCancel = () => {
    setStandingLocal(StandingEnum.INITIAL);
    onCancel?.();
  };

  console.log('!!-!!-!!  isEdit {230421212125}\n', isEdit); // del+

  return <ContainerStyled>
    <ComponentWrapperStyled>
      {isInitial && componentInitial}
      {isEdit && componentEdit}
    </ComponentWrapperStyled>
    <ButtonsContainerStyled>
      {isInitial && <ButtonEditStyled onClick={handleBtnEdit} disabled={btnEditDisabled} />}
      {isEdit && <ButtonSaveStyled onClick={handleBtnSave} disabled={btnSaveDisabled} />}
      {isEdit && <ButtonCancelStyled onClick={handleBtnCancel} disabled={btnCancelDisabled} />}
    </ButtonsContainerStyled>
  </ContainerStyled>;
});
