import './styles.scss';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

export function UarwSettings() {
  const [count, setCount] = useState(0);
  let history = useHistory();
  console.log('!!-!!-!! history {210308225445}\n', history); // del+

  return (
    <div>
      <p>Вы кликнули {count} раз</p>
      <button onClick={() => setCount(count + 1)}>
        Нажми на меня
      </button>
    </div>
  );
}
