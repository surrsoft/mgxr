import { ColorType } from '../L1/ColorType';

/**
 * Цвета для разных состояний кнопки
 *
 * ID hxhg-[[230507102921]] rev 1 1.0.0 2023-05-07
 *
 * Зависимости: ColorType (см. hxhg-[230507102606])
 */
export interface ButtonColorsType {
  normal?: ColorType;
  hover?: ColorType;
  disabled?: ColorType;
  click?: ColorType;
}