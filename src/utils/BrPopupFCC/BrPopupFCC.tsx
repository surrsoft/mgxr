import { ReactNode } from 'react';
import BrPortalFCC from '../BrPortalFCC';
import './styles.scss';
import useScrollFix from '../useScrollFix';

interface Props {
  children?: ReactNode | undefined
  onClose: () => void
  isOpened: boolean
  overlayColor?: string
}


export default function BrPopupFCC({
                                     children,
                                     onClose,
                                     isOpened,
                                     overlayColor = '#918C8C99'
                                   }: Props) {
  const scrollFix = useScrollFix(isOpened)

  if (!isOpened) {
    scrollFix(false)
    return null;
  }

  return (
    <BrPortalFCC>
      <div className="br-popup" role="dialog">
        <div
          className="br-popup__overlay"
          tabIndex={0}
          onClick={onClose}
          role="button"
          style={{backgroundColor: overlayColor}}
        />
        <div className="br-popup__content">{children}</div>
      </div>
    </BrPortalFCC>
  )
}
