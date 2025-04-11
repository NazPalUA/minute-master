import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Control, FieldValues, Path } from 'react-hook-form'

type Props<T extends FieldValues> = {
  className?: string
  type?: React.HTMLInputTypeAttribute
  textarea?: boolean
  name: Path<T>
  placeholder?: string
  label?: string
  description?: string
  control: Control<T>
}

export function FormTextField<T extends FieldValues>({
  name,
  placeholder,
  label,
  type = 'text',
  textarea = false,
  description,
  control,
  className
}: Props<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className ?? ''}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            {textarea ? (
              <Textarea
                {...field}
                value={field.value ?? ''}
                placeholder={placeholder ?? ''}
              />
            ) : (
              <Input
                {...field}
                value={field.value ?? ''}
                type={type}
                placeholder={placeholder ?? ''}
              />
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
