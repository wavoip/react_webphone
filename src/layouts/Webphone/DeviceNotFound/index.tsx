import { Box, Text, VStack } from "@chakra-ui/react"
import { WarningOctagon } from "@phosphor-icons/react"
import { useWebphone } from "../../../contexts/Webphone"

export const DeviceNotFound = () => {
  const { token } = useWebphone();

  return (
    <>
      <VStack gap={2} paddingX={2} paddingBottom={20}>
        <Box paddingTop={10}>
          <WarningOctagon size={64} color="white" />
        </Box>

        <Text color="white" size="xl">Token incorreto</Text>
        <Text as="small" color="whitesmoke" size="xs" textAlign="center">Token do dispositivos {token} não existe, caso tenha dúvidas entre em contato com o suporte.</Text>
      </VStack>
    </>
  )
}