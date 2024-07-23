import { Text, VStack } from "@chakra-ui/react"
import { ReactElement } from "react"

type PropsType = {
  title: string | ReactElement
  desc?: string
  highlighted?: boolean
  disabled?: boolean
  onClick: () => any
}

export const Keyboard = ({ title, desc, onClick, highlighted = false, disabled = false }: PropsType) => {
  return (
    <VStack
      display="flex"
      justifyContent="center"
      alignItems="center"
      cursor={disabled ? "not-allowed" : "pointer"}
      color={highlighted ? "orange.500" : disabled ? "gray.500" : "white"}
      border="1px"
      borderColor={highlighted ? "orange.500" : disabled ? "gray.500" : "gray.200"}
      borderRadius="100%"
      width="50px"
      height="50px"
      transitionProperty="background"
      transitionDuration="250ms"
      _hover={{
        bgColor: highlighted ? "orange.500" : disabled ? "gray.500" : "white",
        color: highlighted ? "white" : "black"
      }}
      onClick={onClick}
    >
      <Text>{title}</Text>
      {desc && (<Text as='sup' fontSize='8px'>{desc}</Text>)}
    </VStack>
  )
}