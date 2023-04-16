import { useEffect, useState } from 'react';

/**
 * Отключает скролл всей страницы в зависимости от (1).
 * ПРИМЕНЕНИЕ: для диалогов и т.п.
 * ID [[220123125256]] rev 1 1.0.0 2022-01-23
 * GROUP [ueur]-copy-library
 * @param toFix (1) -- TRUE - скролл отключает, FALSE - скролл возвращает обратно
 * @return -- функция которой можно напрямую всключать/выключать скролл - TRUE чтобы вкючить, FALSE чтобы выключить
 */
export default function useScrollFix(toFix: boolean) {
  const [$overflow, $overflowSet] = useState('');

  const scrollFix = (isFix: boolean) => {
    /**
     * Если (2) is TRUE то отключаем скролл всей страницы, иначе наоборот включаем
     * @param tagName
     * @param isFix
     */
    const fnScrollFix = (tagName: string, isFix: boolean) => {
      const node = document.getElementsByTagName(tagName)
      const node0 = node.item(0)
      const style = (node0 as any)?.style
      if (style) {
        if (isFix) {
          // сохраняем существовавшее значение, чтобы его же потом и вернуть когда скролл снова нужно будет включить
          $overflowSet(style.overflow)
          style.overflow = 'hidden';
        } else {
          style.overflow = $overflow;
        }
      }
    }

    ['html', 'body'].forEach(el => fnScrollFix(el, isFix))
  }

  useEffect(() => {
    scrollFix(toFix)
  }, [toFix]);

  return scrollFix;

}
