import * as React from 'react';
import type {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { useController } from 'react-hook-form';

import type { NInputProps } from './text-field';
import { TextField } from './text-field';

type TRule = Omit<
  RegisterOptions,
  'valueAsNumber' | 'valueAsDate' | 'setValueAs'
>;

export type RuleType<T> = { [name in keyof T]: TRule };

export type InputControllerType<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: TRule;
};

interface PriceControlledInputProps<T extends FieldValues>
  extends NInputProps,
    InputControllerType<T> {}

// only used with react-hook-form
export function PriceControlledInput<T extends FieldValues>(
  props: PriceControlledInputProps<T>
) {
  const { name, control, rules, ...inputProps } = props;

  // @ts-ignore
  const { field, fieldState } = useController({ control, name, rules });

  // Handle change event
  const handleChange = (value: string) => {
    // Remove dollar sign and any non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    field.onChange(numericValue);
  };

  // Construct value with a dollar sign as a placeholder
  const displayedValue = `$ ${field.value || ''}`;

  return (
    <TextField
      ref={field.ref}
      autoCapitalize="none"
      onChangeText={handleChange}
      value={displayedValue}
      {...inputProps}
      error={fieldState.error?.message}
    />
  );
}
