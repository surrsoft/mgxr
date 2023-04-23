import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components/macro';

import { ApiKeyStorageCls } from '../../utils/ApiKeyStorageCls';
import { randomExcept } from '../../utils/app-utils';
import { CardViewContainer } from './components/CardViewContainer';
import { CardsCls } from './entries/CardsCls';
import { MAirtable } from './entries/MAirtable';
import { CardFtType } from './types/CardFtType';

const ErrStringStyled = styled.div`
  color: red;
`;

export function PageNews() {

  // --- states

  // все карточки (записи)
  const [cards, setCards] = useState<CardsCls | undefined>(undefined);
  // индексы уже показанных карточек
  const [showedIndexes, setShowedIndexes] = useState<number[]>([]);
  // сколько было просмотрено карточек
  const [countShowed, setCountShowed] = useState(0);
  // текущая карточка
  const [currentCard, setCurrentCard] = useState<CardFtType | null>(null);
  // сколько всего карточек (записей)
  const [countAll, setCountAll] = useState(0);
  //
  const [isApiKeySetted, setIsApiKeySetted] = useState(false);
  // true если сейчас идёт загрузка всех карточек
  const [isLoading, setIsLoading] = useState(true);
  //
  const [errorStr, setErrorStr] = useState('');

  // --- получение всех записей

  useEffect(() => {
    (async () => {
      const apiKey = ApiKeyStorageCls.apiKeyGet();
      if (apiKey) {
        try {
          setIsApiKeySetted(true);
          // --- получаем вообще ВСЕ записи
          // [[210222113321]]
          const records = await MAirtable.recordsGet();
          // ---
          const cardsNext = new CardsCls(records);
          setCards(cardsNext);
          setIsLoading(false);
          setCountAll(cardsNext.countAllGet());
        } catch (err: any) {
          if (err.statusCode === 401 && err.message.includes('provide valid api key')) {
            setErrorStr('invalid Airtable API Key');
          } else {
            throw new Error(err);
          }
        }
      }
    })();
  }, []);

  // ---

  async function handleShow() {
    const randomIndex = randomExcept(countAll - 1, showedIndexes);
    if (randomIndex !== -1) {
      const showedIndexesLocal = [...showedIndexes, randomIndex];
      if (cards) {
        const card: CardFtType = cards.getByIndex(randomIndex);
        console.log('!!-!!-!!  card {230423121019}\n', card); // del+
        setCurrentCard(card);
        setCountShowed((prev) => prev + 1);
        setShowedIndexes(showedIndexesLocal);
        // ---
        const card0 = { ...card, [CardsCls.FIELD_SHOW_DATE_LAST]: dayjs().format('YYYY-MM-DD') };
        CardsCls.update(card.tid || '', card0)
          .catch((e: any) => {
            console.log(`230415124650 - при обновлении карточки произошла ошибка; err [${e}]`);
          });
      }
    }
  }

  // ---

  return (
    <div>{
      errorStr
        ? <ErrStringStyled>{errorStr}</ErrStringStyled>
        : (
          isLoading
            ? <div>{
              isApiKeySetted
                ? <div>Loading...</div>
                : <div>please provide "Airtable API Key" at "Settings"</div>
            }</div>
            : <CardViewContainer
              countAll={countAll}
              countShowed={countShowed}
              card={currentCard}
              handleShow={handleShow}
            />
        )
    }
    </div>
  );

}
