import { Buffer } from 'buffer'
global.Buffer = Buffer
global.process = {
  versions: {
    node: 'react-native',
  },
  env: {},
}

const App = require('./src/App').App
export default App
