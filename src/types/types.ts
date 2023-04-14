export interface NavStripeProps {
  rootEventKey: string | null;
  onSelect: (eventKey: string | null) => void;
  dropdownTitle: string;
  dropdownIsActive: boolean;
}