import { initAioha } from '@aioha/aioha'

const hivesignerApp = import.meta.env.VITE_HIVESIGNER_APP || 'ipfsuploader.app'

export const aioha = initAioha({
  hivesigner: {
    app: hivesignerApp,
    callbackURL: window.location.origin + '/hivesigner',
    scope: ['login', 'vote', 'comment', 'custom_json', 'transfer']
  },
  hiveauth: {
    name: 'Aioha Playground'
  },
  metamasksnap: true
})

aioha.registerViewOnly()
