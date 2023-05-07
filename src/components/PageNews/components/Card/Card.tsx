import styled from 'styled-components/macro';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isBetween from 'dayjs/plugin/isBetween';

import { CardFtType } from '../../types/CardFtType';
import { EditableTest } from '../../../../shared/components/L2/EditableText/EditableTest';
import { useEffectOnce } from 'usehooks-ts';
import { CardsCls } from '../../entries/CardsCls';
import { EditableValue } from './EditableValue';

const COLOR_1 = '#f2f7f8';
const COLOR_2 = '#56686d';
const COLOR_3 = '#eff3f4';
const COLOR_4_LINK_HOVER = 'red';
const COLOR_5_TITLE_BROKEN_BG = 'red';
const COLOR_6_TITLE_BROKEN_COLOR = 'yellow';

const TagsContainerStyled = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
  padding: 4px 0;
`;

const TagsValuesStyled = styled.div`
  display: flex;
  gap: 10px;
`;

const TagStyled = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${COLOR_3};
  padding: 0 6px;
  border-radius: 999em 999em 999em 999em;
  background-color: ${COLOR_1};
  color: ${COLOR_2};
  font-size: 12px;
  font-weight: 600;
`;

const TitleContainerStyled = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const TitleStyled = styled.div`
  font-size: 20px;
  text-shadow: 1px 1px silver;
`;

const LinkStyled = styled.div`
  margin-top: 14px;

  a {
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  a:hover {
    color: ${COLOR_4_LINK_HOVER};
  }
`;

const BrokenNpStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 16px;
  font-size: 12px;
`;

const CommNpStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 16px;
  font-size: 12px;
`;

const CardStyled = styled.div`
  border: 1px solid black;
  border-radius: 4px;
  padding: 18px 20px 32px 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  background-color: white;
`;

const CardInfosStyled = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  font-size: 12px;
`;

function DateFieldShow(name: string, dateSt?: string) {
  return (<div>
    {name}: {dateSt ?
    (`${dateSt} (прошло дней: ${dayjs().diff(dateSt, 'day')})`)
    : '-'}
  </div>);
}

export interface Props {
  card: CardFtType,
  handleLinkClick: (card: CardFtType) => void
}

export function Card(props: Props) {
  const { card, handleLinkClick } = props;

  useEffectOnce(() => {
    dayjs.extend(relativeTime);
    dayjs.extend(isBetween);
  });

  // @ts-ignore
  const handleLinkPress = async (e) => {
    handleLinkClick(card);
  };

  const handleBrokenOnConfirm = async (valueIn: string) => {
    let ret = { isSuccess: false, valueOut: valueIn };
    if (!card.tid) return ret;
    try {
      await CardsCls.brokenUpdate(card.tid, valueIn);
      ret = { isSuccess: true, valueOut: valueIn };
      return ret;
    } catch (err) {
      return ret;
    }
  };

  const handleCommOnConfirm = async (valueIn: string) => {
    let ret = { isSuccess: false, valueOut: valueIn };
    if (!card.tid) return ret;
    try {
      await CardsCls.commUpdate(card.tid, valueIn);
      ret = { isSuccess: true, valueOut: valueIn };
      return ret;
    } catch (err) {
      return ret;
    }
  };

  if (!card) {
    return <div>card is null</div>;
  }
  const { trans_date_last, title, url, show_date_last, trans_count, body, comm, tags, broken } = card;

  const tagsNext = tags?.map(tag => {
    return tag.replace('[', '').replace(']', '');
  });

  // ---
  return (<CardStyled>
    <TitleContainerStyled>
      <TitleStyled>{title}</TitleStyled>
    </TitleContainerStyled>
    <LinkStyled>
      <a
        href={url}
        onClick={handleLinkPress}
        target="_blank"
        rel="noopener noreferrer">
        {url}
      </a>
    </LinkStyled>
    <CommNpStyled>
      <div>комментарий:</div>
      <EditableValue value={comm || ''} onConfirm={handleCommOnConfirm} />
    </CommNpStyled>
    <div>{body}</div>
    {/* // --- теги */}
    {tagsNext && <TagsContainerStyled>
      <TagsValuesStyled>{
        tagsNext.map(tag => (<TagStyled>{tag}</TagStyled>))
      }</TagsValuesStyled>
    </TagsContainerStyled>}
    {/* // --- */}
    <CardInfosStyled>
      <div>Число переходов: {trans_count}</div>
      {DateFieldShow('Дата последнего перехода: ', trans_date_last)}
      {DateFieldShow('Дата последнего показа: ', show_date_last)}
    </CardInfosStyled>
    <BrokenNpStyled>
      <div>признак недействительности:</div>
      <EditableValue value={broken || ''} onConfirm={handleBrokenOnConfirm} />
    </BrokenNpStyled>
  </CardStyled>);
}
