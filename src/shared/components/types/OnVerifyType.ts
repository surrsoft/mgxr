import { OnVerifyResultType } from './OnVerifyResultType';

export interface OnVerifyType {
  (valueIn: string): Promise<OnVerifyResultType>
}