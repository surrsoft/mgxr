interface Props {
  hPx?: number;
  wPx?: number;
}

/**
 * Реализует пустое пространство по вертикали и/или горизонтали.
 * ID [[230626202313]] rev 1 1.0.0 2023-06-26
 */
export function Gap({ hPx = 0, wPx = 0 }: Props) {
  return <div className={'br-info-Gap'} style={{ width: `${wPx}px`, height: `${hPx}px` }}></div>
}