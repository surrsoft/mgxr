import { ButtonWithIcon } from './ButtonWithIcon';

export function ButtonWithIconExample() {
  const handleClick = () => {
    console.log(`!!-!!-!! clicked -> :::::::::::::: () {230501160011}:${Date.now()}`); // del+
  };

  return <ButtonWithIcon onClick={handleClick} />;
}