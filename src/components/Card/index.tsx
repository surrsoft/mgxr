import { Component } from 'react';
import './card.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isBetween from 'dayjs/plugin/isBetween';
import { CardCls } from '../../utils/CardCls';
import styled from 'styled-components/macro';

const COLOR_1 = '#f2f7f8';
const COLOR_2 = '#56686d';
const COLOR_3 = '#eff3f4';

const TagsContainerStyled = styled.div`
  display: flex;
  gap: 10px;
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

export interface Props {
  card: CardCls,
  handleLinkClick: (card: CardCls) => void
}

function DateFieldShow(name: string, dateSt?: string) {
  return (<div>
    {name}: {dateSt ?
    (`${dateSt} (прошло дней: ${dayjs().diff(dateSt, 'day')})`)
    : '-'}
  </div>);
}

export class Card extends Component<Props, any> {

  constructor(props: Props) {
    super(props);
    this.handleLinkPress = this.handleLinkPress.bind(this);
    dayjs.extend(relativeTime);
    dayjs.extend(isBetween);
  }

  // @ts-ignore
  async handleLinkPress(e) {
    const { card, handleLinkClick } = this.props;
    handleLinkClick(card);
  }

  render() {
    const { card } = this.props;
    console.log('!!-!!-!!  card {230415090118}\n', card); // del+
    if (!card) {
      return <div>card is null</div>;
    }
    const { trans_date_last, title, url, show_date_last, trans_count, body, comm, tags } = card;

    const tagsNext = tags?.map(tag => {
      return tag.replace('[', '').replace(']', '');
    });

    // ---
    return (<div className="card">
      <div className="card__title">{title}</div>
      <div className="card__link">
        <a
          href={url}
          onClick={this.handleLinkPress}
          target="_blank"
          rel="noopener noreferrer">
          {url}
        </a>
      </div>
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
    </div>);
  }

}
