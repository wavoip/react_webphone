import { Avatar, Box, Button, Text } from "@chakra-ui/react"

import { Phone, PhoneDisconnect } from "@phosphor-icons/react"
import { useWebphone } from "../../../contexts/Webphone"

export const IncomingCallLayout = () => {
  const { name, callStatus, callState, profilePictureURL, acceptCall, rejectCall } = useWebphone();

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Avatar
          size='lg'
          name='Avatar'
          src={profilePictureURL}
        />
        <Text color="white" fontSize="18px" fontWeight={400} marginTop={5}>{name}</Text>
        <Text color="white" fontSize="15px" fontWeight={100}>{callStatus}</Text>
      </Box>

      <Box display="flex" padding={10} gap={5}>
        <Button
          bgColor="green.600"
          height="50px"
          width="50px"
          borderRadius="100%"
          isDisabled={callState !== "offer"}
          onClick={() => {
            acceptCall();
          }}
        >
          <Phone size={15} color="white" />
        </Button>

        <Button
          bgColor="red.500"
          height="50px"
          width="50px"
          borderRadius="100%"
          isDisabled={callState !== "offer"}
          onClick={() => {
            rejectCall();
          }}
        >
          <PhoneDisconnect size={15} color="white" />
        </Button>
      </Box>
    </>
  );
}