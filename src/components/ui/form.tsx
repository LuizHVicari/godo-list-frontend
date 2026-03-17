import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface BaseFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  id,
  ...inputProps
}: BaseFieldProps<T> & { id: string } & React.ComponentProps<typeof Input>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <Input id={id} aria-invalid={fieldState.invalid} {...field} {...inputProps} />
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}

export function FormPasswordInput<T extends FieldValues>({
  control,
  name,
  label,
  id,
  ...inputProps
}: BaseFieldProps<T> & { id: string } & React.ComponentProps<typeof PasswordInput>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <PasswordInput id={id} aria-invalid={fieldState.invalid} {...field} {...inputProps} />
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}

export function FormTextarea<T extends FieldValues>({
  control,
  name,
  label,
  id,
  ...textareaProps
}: BaseFieldProps<T> & { id: string } & React.ComponentProps<typeof Textarea>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <Textarea id={id} aria-invalid={fieldState.invalid} {...field} {...textareaProps} />
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}

interface FormSelectOption {
  value: string;
  label: string;
}

export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
}: BaseFieldProps<T> & { options: FormSelectOption[] }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>{label}</FieldLabel>
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger aria-invalid={fieldState.invalid}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}

export function FormCheckbox<T extends FieldValues>({
  control,
  name,
  label,
  id,
}: BaseFieldProps<T> & { id: string }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field>
          <div className="flex items-center gap-2">
            <Checkbox checked={field.value} id={id} onCheckedChange={field.onChange} />
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
          </div>
        </Field>
      )}
    />
  );
}
