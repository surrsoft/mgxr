import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

export default function BrPortalFCC({children}: any) {
  const [$container] = useState(() => document.createElement('div'))

  useEffect(() => {
    document.body.appendChild($container)
    return () => {
      document.body.removeChild($container)
    }
  }, []);

  return ReactDOM.createPortal(children, $container)
}
