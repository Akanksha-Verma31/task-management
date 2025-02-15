import { createElement } from 'react';

interface Props {
  value: string;
  min: string;
  onChange: (value: string) => void;
}

export default function DateTimePicker({ value, onChange, min }: Props) {
  return createElement('input', {
    type: 'date',
    value: value,
    min: min,
    onInput: (event: React.FormEvent<HTMLInputElement>) => onChange(event.currentTarget.value),
  });
}
