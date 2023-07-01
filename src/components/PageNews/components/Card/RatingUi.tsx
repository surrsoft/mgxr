import styled from 'styled-components/macro';
import { useState } from 'react';
import { Gap } from '../../../../shared/hxhg/components/Gap';
import { CardsCls } from '../../entries/CardsCls';

const ContainerStyled = styled.div`
  display: flex;
`;

const ButtonStyled = styled.button`
  border: none;
`;

interface Props {
  tid: string;
  rating: number;
}

export function RatingUi({ tid, rating }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [ratingLocal, setRatingLocal] = useState(rating);

  const handlePlus = async () => {
    setIsLoading(true);
    await CardsCls.ratingUpdate(tid, ratingLocal + 1);
    setRatingLocal(ratingLocal + 1);
    setIsLoading(false);
  };

  const handleMinus = async () => {
    if (ratingLocal < 1) {
      return;
    }
    setIsLoading(true);
    await CardsCls.ratingUpdate(tid, ratingLocal - 1);
    setRatingLocal(ratingLocal - 1);
    setIsLoading(false);
  };

  return <ContainerStyled>
    <div>рейтинг:</div>
    <Gap wPx={8} />
    <div>{ratingLocal}</div>
    <Gap wPx={8} />
    <ButtonStyled onClick={handlePlus} disabled={isLoading}>+</ButtonStyled>
    <Gap wPx={8} />
    <ButtonStyled onClick={handleMinus} disabled={isLoading}>-</ButtonStyled>
    <Gap wPx={8} />
    {isLoading && <div>updating...</div>}
  </ContainerStyled>;
}