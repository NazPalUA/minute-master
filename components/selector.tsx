import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { LoadingSpinner } from './loading-spinner'

type Item<T extends string> = {
  label: string
  value: T
}

type Props<T extends string> = {
  placeholder: string
  defaultValue: T
  isLoading: boolean
  value: T
  setValue: (value: T) => void
  items: Item<T>[]
}

export function Selector<T extends string>({
  placeholder,
  defaultValue,
  value,
  setValue,
  items,
  isLoading
}: Props<T>) {
  return (
    <Select
      disabled={isLoading}
      value={value}
      defaultValue={defaultValue}
      onValueChange={value => setValue(value as T)}
    >
      <SelectTrigger
        className="flex w-[170px] items-center justify-between gap-2"
        showChevron={!isLoading}
      >
        <SelectValue placeholder={placeholder} />
        {isLoading && <LoadingSpinner size="xs" noContainer />}
      </SelectTrigger>
      <SelectContent>
        {items.map(item => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
