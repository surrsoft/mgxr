/**
 * Размер ширины и высоты в пикселях.
 *
 * ID hxhg-[[230507102054]] rev 1 1.0.0 2023-05-07
 */
export interface SizesPxType {
  /** задание сразу одинаковой ширины и высоты */
  whPx?: number;
  wPx?: number;
  hPx?: number;
}

/**
 * Интерпретатор для SizexPxType ([230507102054])
 *
 * ID hxhg-[[230507102411]] rev 1 1.0.0 2023-05-07
 *
 * @param sizes см. hxhg-[230507102054]
 */
export const sizesPxInterprete = (sizes: SizesPxType = {}): { wPx: number, hPx: number } => {
  if (sizes.whPx) {
    return { wPx: sizes.whPx, hPx: sizes.whPx };
  }
  if (sizes.wPx && sizes.hPx) {
    return { wPx: sizes.wPx, hPx: sizes.hPx };
  }
  if (sizes.wPx) {
    return { wPx: sizes.wPx, hPx: sizes.wPx };
  }
  if (sizes.hPx) {
    return { wPx: sizes.hPx, hPx: sizes.hPx };
  }
  return { wPx: 32, hPx: 32 };
};