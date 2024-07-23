import { Box, ListItem, OrderedList, Spinner, Text, VStack } from "@chakra-ui/react"

import { useWebphone } from "../../../contexts/Webphone"

import QRCode from 'qrcode.react';

export const QRCodeLayoyt = () => {
  const { qrCode } = useWebphone();

  return (
    <>
      <VStack gap={2}>
        <Box>
          {
            qrCode ? (
              <QRCode
                value={qrCode}
                renderAs="canvas"
                includeMargin={true}
                imageSettings={{
                  src: "./whatsapp.png",
                  height: 50,
                  width: 50,
                  excavate: false
                }}
              />
            ) : (
              <Box w="128px" h="128px" bgColor="white" display="flex" justifyContent="center" alignItems="center">
                <Spinner
                  thickness='3px'
                  speed='0.50s'
                  emptyColor='gray.200'
                  color='blue.500'
                  size='md'
                />
              </Box>
            )
          }
        </Box>
        <Text fontSize='lg' color="white">Conectar Whatsapp</Text>

        <OrderedList color="white" fontSize="13px" paddingLeft="35px" paddingRight="20px" paddingBottom={10}>
          <ListItem>Abra o WhatsApp no seu celular.</ListItem>
          <ListItem>Toque em Mais opções ou Configurações e selecione aparelhos conectados.</ListItem>
          <ListItem>Toque em conectar um aparelho.</ListItem>
          <ListItem>Aponte o celular para essa tela para capturar o QRcode.</ListItem>
        </OrderedList>

      </VStack>
    </>
  )
}