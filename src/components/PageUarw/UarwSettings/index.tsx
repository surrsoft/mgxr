import './styles.scss';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

export function UarwSettings() {
  const [count, setCount] = useState(0);
  let history = useHistory();

  return (
    <div>
      <p>Вы кликнули {count} раз</p>
      <button onClick={() => setCount(count + 1)}>
        Нажми на меня
      </button>
    </div>
  );
}
