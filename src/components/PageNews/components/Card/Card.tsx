import { Component } from 'react';
import styled from 'styled-components/macro';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isBetween from 'dayjs/plugin/isBetween';
import { Button } from 'react-bootstrap';

import { CardFtType } from '../../types/CardFtType';
import './card.css';
import { EditableText } from '../../../../shared/components/lvl-1/EditableText/EditableText';

const COLOR_1 = '#f2f7f8';
const COLOR_2 = '#56686d';
const COLOR_3 = '#eff3f4';
const COLOR_4_LINK_HOVER = 'red';
const COLOR_5_TITLE_BROKEN_BG = 'red';
const COLOR_6_TITLE_BROKEN_COLOR = 'yellow';

const TagsContainerStyled = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 12px;
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

const TitleBrokenStyled = styled.div`
  color: ${COLOR_6_TITLE_BROKEN_COLOR};
  background-color: ${COLOR_5_TITLE_BROKEN_BG};
  padding: 0 6px;
  border-radius: 999em;
  font-size: 12px;
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
  gap: 12px;
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

export class Card extends Component<Props, any> {

  constructor(props: Props) {
    super(props);
    this.handleLinkPress = this.handleLinkPress.bind(this);
    this.handleBrokenOnConfirm = this.handleBrokenOnConfirm.bind(this);
    dayjs.extend(relativeTime);
    dayjs.extend(isBetween);
  }

  // @ts-ignore
  async handleLinkPress(e) {
    const { card, handleLinkClick } = this.props;
    handleLinkClick(card);
  }

  async handleBrokenOnConfirm(valueIn: string) {
    return {
      isSuccess: true,
      valueOut: valueIn,
    };
  }

  render() {
    const { card } = this.props;
    if (!card) {
      return <div>card is null</div>;
    }
    const { trans_date_last, title, url, show_date_last, trans_count, body, comm, tags, broken } = card;

    const tagsNext = tags?.map(tag => {
      return tag.replace('[', '').replace(']', '');
    });

    // ---
    return (<div className="card">
      <TitleContainerStyled>
        <TitleStyled>{title}</TitleStyled>
        {broken && <TitleBrokenStyled>{broken}</TitleBrokenStyled>}
      </TitleContainerStyled>
      <LinkStyled>
        <a
          href={url}
          onClick={this.handleLinkPress}
          target="_blank"
          rel="noopener noreferrer">
          {url}
        </a>
      </LinkStyled>
      <div>{comm}</div>
      <div>{body}</div>
      {/* // --- tags */}
      {tagsNext && <TagsContainerStyled>
        <TagsValuesStyled>{
          tagsNext.map(tag => (<TagStyled>{tag}</TagStyled>))
        }</TagsValuesStyled>
      </TagsContainerStyled>}
      {/* // --- */}
      <div className="card__infos">
        <div>Число переходов: {trans_count}</div>
        {DateFieldShow('Дата последнего перехода: ', trans_date_last)}
        {DateFieldShow('Дата последнего показа: ', show_date_last)}
      </div>
      <BrokenNpStyled>
        <div>признак недействительности:</div>
        <EditableText value={broken} onConfirm={this.handleBrokenOnConfirm} />
      </BrokenNpStyled>
    </div>);
  }

}
