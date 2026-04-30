import { KeyTypes } from '@aioha/aioha'
import { Field, Select } from './FormCard'

interface Props {
  value: KeyTypes
  onChange: (v: KeyTypes) => void
  label?: string
  exclude?: KeyTypes[]
}

export const KeyTypeSelect = ({ value, onChange, label = 'Key type', exclude = [] }: Props) => {
  const options = (Object.values(KeyTypes) as KeyTypes[]).filter((k) => !exclude.includes(k))
  return (
    <Field label={label}>
      <Select value={value} onChange={(e) => onChange(e.target.value as KeyTypes)}>
        {options.map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </Select>
    </Field>
  )
}
