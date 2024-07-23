import { useWebphone } from "../../contexts/Webphone"

import { Box, Button, HStack, ScaleFade, VStack } from "@chakra-ui/react";
import Draggable from 'react-draggable';
import { DotsNine, DotsSix, X } from "@phosphor-icons/react";

import { AvailableLayout } from "../../layouts/Webphone/Available";
import { InProgressLayout } from "../../layouts/Webphone/InProgress";
import { QRCodeLayoyt } from "../../layouts/Webphone/QRCode";
import { IncomingCallLayout } from "../../layouts/Webphone/IncomingCall";
import { ConnectionLayout } from "../../layouts/Webphone/NoConnection";
import { DeviceNotFound } from "../../layouts/Webphone/DeviceNotFound";

export const Webphone = () => {
  const { config, isOpen, setIsOpen, screenState, screensState } = useWebphone();
  

  return (
    <>
      <ScaleFade initialScale={0.9} in={isOpen}>
        <Draggable
          handle=".handle"
          defaultPosition={{ 
            x: config.button.position_x === "left" ? (250 + 40) : (window.innerWidth - 250 - 20),
            y: config.button.position_y === "top" ? (0 + 60 + 10) : (window.innerHeight - 394 - 60 - 40)
          }}
          // grid={[25, 25]}
          bounds="html"
          scale={1}

        >
          <VStack
            // height="full"
            width="250px"
            bgGradient={config.background.gradient_color ? `linear(${config.background.gradient_direction} ${config.background.gradient_color.join(", ")})` : undefined}
            backgroundColor={config.background.color}
            borderRadius="30px"
            opacity={0.9}
          >
            <HStack>
              <DotsSix size={24} color="white" className="handle" cursor="move" />
            </HStack>

            {screenState === screensState.AVAILABLE_SCREEN && (<AvailableLayout />)}
            {screenState === screensState.INCOMING_CALL_SCREEN && (<IncomingCallLayout />)}
            {screenState === screensState.CALL_SCREEN && (<InProgressLayout />)}
            {screenState === screensState.QRCODE_SCREEN && (<QRCodeLayoyt />)}
            {screenState === screensState.NO_INTERNET && (<ConnectionLayout />)}
            {screenState === screensState.TOKEN_INCORRECT && (<DeviceNotFound />)}
          </VStack>
        </Draggable>

      </ScaleFade>

      <Box
        position="fixed"
        top={config.button.position_y === "top" ? config.button.spacing : undefined}
        bottom={config.button.position_y === "bottom" ?  config.button.spacing : undefined}
        left={config.button.position_x === "left" ?  config.button.spacing : undefined}
        right={config.button.position_x === "right" ?  config.button.spacing : undefined}
      >
        <Button
          bgColor={config.button.color}
          height="60px"
          width="60px"
          borderRadius="100%"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? <X size={20} color="white" /> : <DotsNine size={20} color="white" />}
        </Button>
      </Box >
    </>
  );
}