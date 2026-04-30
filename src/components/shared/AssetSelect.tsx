import { Asset as AiohaAsset } from '@aioha/aioha'
import { Asset as MagiAsset } from '@aioha/magi'
import { Field, Select } from './FormCard'

export const AiohaAssetSelect = ({ value, onChange }: { value: AiohaAsset; onChange: (v: AiohaAsset) => void }) => (
  <Field label="Asset">
    <Select value={value} onChange={(e) => onChange(e.target.value as AiohaAsset)}>
      {(Object.values(AiohaAsset) as AiohaAsset[]).map((a) => (
        <option key={a} value={a}>
          {a}
        </option>
      ))}
    </Select>
  </Field>
)

export const MagiAssetSelect = ({ value, onChange }: { value: MagiAsset; onChange: (v: MagiAsset) => void }) => (
  <Field label="Asset">
    <Select value={value} onChange={(e) => onChange(e.target.value as MagiAsset)}>
      {(Object.values(MagiAsset) as MagiAsset[]).map((a) => (
        <option key={a} value={a}>
          {a}
        </option>
      ))}
    </Select>
  </Field>
)
