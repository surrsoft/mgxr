import TempCar from '../TempCar/TempCar';
import { useCallback, useState } from 'react';

export default function TempCars({cars}: any) {
  console.log(`!!-!!-!! 1807- -> :::::::::::::: TempCars {220223180704}:${Date.now()}`) // del+
  debugger; // del+

  const [$numb, $numbSet] = useState(0);

  const onCarClick = useCallback((car: any) => {
    console.log(car.name)
  }, [])

  return (
    <div>
      <button onClick={() => $numbSet($numb + 1)}>{$numb}</button>
      <div>{
        cars.map((el: any) => {
          debugger; // del+
          return (<TempCar id={el.id} car={el} onCarClick={onCarClick}/>)
        })
      }</div>
    </div>
  )
}
