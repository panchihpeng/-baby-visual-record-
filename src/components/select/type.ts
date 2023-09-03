export interface ISelectItem {
  text: string;
  value: string | number;
}

export interface ISelectProps {
  placeholder?: string;
  options?: ISelectItem[];
  disabled?: boolean;
  multiple?: boolean;
  value: ISelectItem["value"] | Array<ISelectItem["value"]>;
}
