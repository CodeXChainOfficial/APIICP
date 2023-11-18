import { UseControllerProps } from "react-hook-form";

type Radio = {
  value: string | boolean;
  label?: string;
};

export type InputProps = {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  radio?: [Radio, Radio];
} & UseControllerProps<any>;

// type FieldList<T> = ({ name: keyof T } & Omit<InputProps, "name">)[];

/** Usage of FieldList<T>
 * 
 * const list: FieldList<FormData> = [
  { name: "name", placeholder: "Name", required: true },
  { name: "logo", placeholder: "JPG, PNG, GIF, or SVG of no more than 3MB. We recommend 1024x1024px." },
  { name: "description", placeholder: "Description" },
];
 */
