import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Magi, Wallet, BtcClient } from '@aioha/magi'
import { useConnectorClient } from 'wagmi'
import { AiohaContext } from '@aioha/providers/react'

export const MagiContext = createContext<
  | {
      magi: Magi
      user?: string
      wallet?: Wallet
    }
  | undefined
>(undefined)

interface Props {
  magi: Magi
  btcClient?: BtcClient
  children: ReactNode
}

export const MagiProvider = ({ magi, btcClient, children }: Props) => {
  const aiohaCtx = useContext(AiohaContext)
  const { data: walletClient } = useConnectorClient()
  const [user, setUser] = useState<string | undefined>(magi.getUser())
  const [wallet, setWallet] = useState<Wallet | undefined>(magi.getWallet())

  const update = () => {
    setUser(magi.getUser())
    setWallet(magi.getWallet())
  }

  useEffect(() => {
    magi.on('wallet_changed', update)
    return () => {
      magi.off('wallet_changed', update)
    }
  }, [magi])

  useEffect(() => {
    if (aiohaCtx?.user) {
      magi.setWallet(Wallet.Hive)
    } else if (magi.getWallet() === Wallet.Hive) {
      magi.setWallet()
    }
    update()
  }, [aiohaCtx?.user])

  useEffect(() => {
    if (walletClient) {
      magi.setViem(walletClient)
      magi.setWallet(Wallet.Ethereum)
    } else if (magi.getWallet() === Wallet.Ethereum) {
      magi.setWallet()
    }
    update()
  }, [walletClient])

  useEffect(() => {
    if (btcClient) {
      magi.setBitcoin(btcClient)
      magi.setWallet(Wallet.Bitcoin)
    } else if (magi.getWallet() === Wallet.Bitcoin) {
      magi.setWallet()
    }
    update()
  }, [btcClient])

  return <MagiContext.Provider value={{ magi, user, wallet }}>{children}</MagiContext.Provider>
}

export const useMagi = () => {
  const ctx = useContext(MagiContext)
  if (!ctx) throw new Error('useMagi must be used within a MagiProvider')
  return ctx
}
