import { Dispatch, SetStateAction } from "react";

export interface WebphoneConfig {
  button: {
    position_y: "top" | "bottom";
    position_x: "left" | "right";
    spacing: string;
    color: string;
  }

  background: {
    color: string;
    gradient_color: string[];
    gradient_direction: "to-t" | "to-tr" | "to-r" | "to-br" | "to-b" | "to-bl" | "to-l" | "to-tl";
  }
}

export type WebphoneContextType = {
  token: string;
  config: WebphoneConfig;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  screensState: ScreenStateType,
  screenState: number,
  setScreenState: React.Dispatch<React.SetStateAction<number>>
  callState: any,
  startCall: (phone: string) => Promise<any>,
  acceptCall: () => Promise<any>,
  rejectCall: () => Promise<any>,
  endCall: () => Promise<any>,
  mute: () => Promise<any>,
  unMute: () => Promise<any>,
  phone: string | null,
  name: string | null,
  duration: string,
  callStatus: string,
  qrCode: string,
  callError: string,
  isMuted: boolean,
  profilePictureURL: string
}

export type WebphoneContextProps = {
  children: React.ReactNode,
  defaultConfig: WebphoneConfig
}

export type ScreenStateType = {
  [key: string]: number
}

export  type ConnectionStatus = "connecting" | "connected" | "error";

export type DeviceStatus = "connecting" | "open" | "error";


export interface WavoipWebphoneApi {
  startCall: (phone: string) => Promise<void>,
  mute: () => Promise<void>,
  unMute: () => Promise<void>,
  endCall: () => Promise<void>,
  acceptCall: () => Promise<void>,
  rejectCall: () => Promise<void>,
  setIsOpen: (isOpen: boolean) => any,
  setConfig: (config: WebphoneConfig) => any,
}