import { Magi } from '@aioha/magi'
import { aioha } from './aioha'

export const magi = new Magi()
magi.setAioha(aioha)

const apiOverride = import.meta.env.VITE_MAGI_API
if (apiOverride) magi.setApi(apiOverride)
