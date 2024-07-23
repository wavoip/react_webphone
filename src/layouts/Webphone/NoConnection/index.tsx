import { Box, Text, VStack } from "@chakra-ui/react"
import { WifiSlash } from "@phosphor-icons/react"

export const ConnectionLayout = () => {

  return (
    <>
      <VStack gap={2} paddingX={2} paddingBottom={20}>
        <Box paddingTop={10}>
          <WifiSlash size={64} color="white" />
        </Box>

        <Text color="white" size="xl">Sem conexão</Text>
        <Text as="small" color="whitesmoke" size="xs" textAlign="center">Por favor verifique sua conexão com a internet, ou entre em contato com suporte.</Text>
      </VStack>
    </>
  )
}