import { ChakraProvider } from '@chakra-ui/react'

import { Webphone } from "./pages/Webphone";
import { WebPhoneProvider } from './contexts/Webphone';
import { defaultConfig } from './data/config';

function App() {
  return (
    <ChakraProvider>
      <WebPhoneProvider defaultConfig={defaultConfig}>
        <Webphone />
      </WebPhoneProvider>
    </ChakraProvider>
  )
}

export default App