import TempCar from '../TempCar/TempCar';
import { useCallback, useState } from 'react';

export default function TempCars({cars}: any) {
  const [$numb, $numbSet] = useState(0);

  const onCarClick = useCallback((car: any) => {
    console.log(car.name)
  }, [])

  return (
    <div>
      <button onClick={() => $numbSet($numb + 1)}>{$numb}</button>
      <div>{
        cars.map((el: any) => {
          return (<TempCar id={el.id} car={el} onCarClick={onCarClick}/>)
        })
      }</div>
    </div>
  )
}
