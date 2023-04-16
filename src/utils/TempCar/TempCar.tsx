export default function TempCar({car, onCarClick}: any) {
  return (
    <div onClick={() => onCarClick(car)}>
      {car.name}
    </div>
  )
}
