import { Avatar, Box, Button, Grid, Text, VStack } from "@chakra-ui/react";

import { Keyboard } from "../../../components/Keyboard";
import { DotsNine, Microphone, MicrophoneSlash, PhoneDisconnect, SpeakerHigh } from "@phosphor-icons/react";
import { useWebphone } from "../../../contexts/Webphone";

export const InProgressLayout = () => {
  const { callStatus, name, endCall, mute, unMute, isMuted, profilePictureURL } = useWebphone();

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
        <Text color="white" fontSize="16px" fontWeight={400} marginTop={5}>{name}</Text>
        <Text as='samp' color="white" fontSize="12px" marginY={2}>{callStatus}</Text>
      </Box>

      <VStack gap={2}>
        <Grid templateColumns='repeat(3, 1fr)' gap={3}>
          <Keyboard title={<SpeakerHigh size={18} />} desc="sound" disabled={true} onClick={() => { }} />
          <Keyboard title={<DotsNine size={18} />} desc=""  disabled={true} onClick={() => {}} />
          {isMuted ? (
            <Keyboard title={<MicrophoneSlash size={18} />} desc="unmute" onClick={unMute} highlighted={true} />
             
          ) : (
            <Keyboard title={<Microphone size={18} />} desc="mute" onClick={mute} />
          )}
        
        </Grid>
      </VStack>

      <Box padding={10}>
        <Button
          bgColor="red.500"
          height="50px"
          width="50px"
          borderRadius="100%"
          onClick={() => {
            endCall();
          }}
        >
          <PhoneDisconnect size={15} color="white" />
        </Button>
      </Box>
    </>
  );
}