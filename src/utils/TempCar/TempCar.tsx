export default function TempCar({car, onCarClick}: any) {
  console.log(`!!-!!-!! 1807- -> :::::::::::::: TempCar {220223180714}:${Date.now()}`) // del+
  return (
    <div onClick={() => onCarClick(car)}>
      {car.name}
    </div>
  )
}
