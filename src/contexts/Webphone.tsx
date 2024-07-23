import { createContext, useContext, useState, useEffect, useMemo } from "react";

import WavoipInstance from "wavoip-api";
import parsePhoneNumber from "libphonenumber-js";
import useSound from 'use-sound';

import SoundCalling from '../assets/sounds/calling.mp3';
import SoundRinging from '../assets/sounds/ring.mp3';
import { DeviceStatus, ScreenStateType, WebphoneConfig, WebphoneContextProps, WebphoneContextType } from "../types/webphone";

export const WebPhone = createContext<WebphoneContextType | null>(null);

export const WebPhoneProvider = ({ children, defaultConfig }: WebphoneContextProps) => {
  const screensState = {
    AVAILABLE_SCREEN: 0,
    CALL_SCREEN: 1,
    CONNECTING_DEVICE: 2,
    QRCODE_SCREEN: 3,
    INCOMING_CALL_SCREEN: 4,
    NO_INTERNET: 5,
    TOKEN_INCORRECT: 6
  } as ScreenStateType;

  const [config, setConfig] = useState<WebphoneConfig>(defaultConfig);
  const [token, setToken] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [screenState, setScreenState] = useState<number>(screensState.AVAILABLE_SCREEN);
  const [Wavoip, setWavoip] = useState<any>(null);
  const [callState, setCallState] = useState<string>("");
  const [phone, setPhone] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [device_status, setDeviceStatus] = useState<DeviceStatus>("connecting");
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [intervalCallDuration, setIntervalCallDuration] = useState<any>();
  const [intervalTerminating, setIntervalTerminating] = useState<any>();
  const [qrCode, setQRCode] = useState<string>("");
  const [callError, setCallError] = useState<string>("");
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [profilePictureURL, setProfilePictureURL] = useState<string>("");

  const [playPhoneCalling, { stop: stopPhoneCalling }] = useSound(SoundCalling, { volume: 0.40, loop: true });
  const [playPhoneRinging, { stop: stopPhoneRinging }] = useSound(SoundRinging, { volume: 1.00, loop: true });

  const duration = useMemo(() => {
    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    const seconds = durationSeconds % 60;

    const formatTime = (num: number) => (num < 10 ? `0${num}` : num);

    return `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;

  }, [durationSeconds]);

  const callStatus = useMemo(() => {
    switch (callState) {
      case "offer":
        playPhoneRinging();
        setIsOpen(true);

        return "Chamando..."
      case "call-start":
        playPhoneCalling();

        return "Ligando..."
      case "relaylatency":
      case "preaccept":
        return "Chamando..."
      case "mute_v2":
      case "accept":
        stopPhoneRinging();
        stopPhoneCalling();

        return `${duration}`
      case "accept_elsewhere":
        stopPhoneRinging();

        return "Aceito por outro usuário"
      case "reject_elsewhere":
        stopPhoneRinging();

        return "Rejeitado por outro usuário"
      case "reject":
        stopPhoneRinging();
        stopPhoneCalling();

        return "Chamada rejeitada"
      case "terminate":
        stopPhoneRinging();
        stopPhoneCalling();

        return "Chamada finalizada"
      default:
        return "Status não identificado"
    }
  }, [duration, callState]);

  const resetStates = () => {
    setIsMuted(false);
    setCallState("");
    setProfilePictureURL("");

    setDurationSeconds(0);
    clearInterval(intervalCallDuration);
  }

  const getCurrentQRCode = () => {
    Wavoip.getCurrentQRCode()
      .then((qrcode: string) => {
        setQRCode(qrcode);
      })
  }

  const getCurrentDeviceStatus = () => {
    Wavoip.getCurrentDeviceStatus()
      .then((status: any) => {
        setDeviceStatus(status);
      })
  }

  const startDevice = async (token: string) => {
    try {
      setToken(token);

      const Device = new WavoipInstance();
      const WhatsappInstance = await Device.connect(token);

      // WhatsappInstance?.socket?.on('connect', () => {
      // });

      WhatsappInstance.socket.io.on("error", () => {
        setScreenState(screensState.NO_INTERNET);
      });

      setWavoip(WhatsappInstance);
    } catch (error) {
      console.error("[*] - Error to start webphone", error);
    }
  }

  const startCall = async (phone: string) => {
    try {
      let phoneParsed = parsePhoneNumber(`+${phone}`)?.formatInternational() ?? phone;

      setPhone(phone);
      setName(phoneParsed);

      await Wavoip.callStart({
        whatsappid: phone
      })
        .then((response: any) => {
          if (response.type === "success") {
            setCallState("call-start")
            setScreenState(screensState.CALL_SCREEN);
            setProfilePictureURL(response?.result?.profile_picture)
          }
          else {
            setCallError(response?.result);
            setTimeout(() => {
              setCallError("");
            }, 3000);
          }
        })
        .catch((response: any) => {
          setCallError(response?.result);
        });
    } catch (error) {
      console.error("[*] - Error to start call", error);
    }
  }

  const mute = async () => {
    try {
      let response = await Wavoip.mute();
      setIsMuted(true);

      return response;
    } catch (error) {
      console.error("[*] - Error to mute", error);
    }
  }

  const unMute = async () => {
    try {
      let response = await Wavoip.unMute();
      setIsMuted(false);

      return response;
    } catch (error) {
      console.error("[*] - Error to unmute", error);
    }
  }

  const endCall = async () => {
    try {
      let response = await Wavoip.endCall();

      return response;
    } catch (error) {
      console.error("[*] - Error to end call", error);
    }
  }

  const acceptCall = async () => {
    try {
      let response = await Wavoip.acceptCall();

      setCallState("accept")
      setScreenState(screensState.CALL_SCREEN);

      return response;
    } catch (error) {
      console.error("[*] - Error to accept call", error);
    }
  }

  const rejectCall = async () => {
    try {
      let response = await Wavoip.rejectCall();

      stopPhoneRinging();
      setScreenState(screensState.AVAILABLE_SCREEN);
      resetStates();

      return response;
    } catch (error) {
      console.error("[*] - Error to reject call", error);
    }
  }

  useEffect(() => {
    if (Wavoip) {
      Wavoip.socket.off("signaling");
      Wavoip.socket.off("device_status");
      Wavoip.socket.off("qrcode");

      Wavoip.socket.on("signaling", (...args: any) => {
        const data = args[0];
        if (data?.tag === "offer") {
          const phone = data?.content?.from_tag;
          const profile_picture = data?.content?.profile_picture;
          let phoneParsed = parsePhoneNumber(`+${phone}`)?.formatInternational() ?? phone;

          setPhone(phone);
          setName(phoneParsed);
          setProfilePictureURL(profile_picture);
        }

        setCallState(data?.tag)
      });
      Wavoip.socket.on("device_status", (data: any) => {
        setDeviceStatus(data)
      });
      Wavoip.socket.on("qrcode", (data: string) => {
        setQRCode(data)
      });

      getCurrentQRCode();
      getCurrentDeviceStatus();
    }
  }, [Wavoip]);

  useEffect(() => {
    clearInterval(intervalTerminating);

    switch (callState) {
      case "offer":
        setScreenState(screensState.INCOMING_CALL_SCREEN);

        break;
      case "accept_elsewhere":
        if (screenState == screensState.INCOMING_CALL_SCREEN) {
          let intervalAcceptElseWhere = setTimeout(() => {
            setScreenState(screensState.AVAILABLE_SCREEN);
            resetStates();
          }, 2000);

          setIntervalTerminating(intervalAcceptElseWhere);
        }

        break
      case "reject_elsewhere":
        if (screenState == screensState.INCOMING_CALL_SCREEN) {
          let intervalRejectElseWhere = setTimeout(() => {
            setScreenState(screensState.AVAILABLE_SCREEN);
            resetStates();
          }, 2000);

          setIntervalTerminating(intervalRejectElseWhere);
        }

        break

        break
      case "terminate":
        let intervalTerminate = setTimeout(() => {
          setScreenState(screensState.AVAILABLE_SCREEN);
          resetStates();
        }, 2500);

        setIntervalTerminating(intervalTerminate);

        clearInterval(intervalCallDuration);

        break;
      case "reject":
        let intervalReject = setTimeout(() => {
          setScreenState(screensState.AVAILABLE_SCREEN);
          resetStates();
        }, 2500);

        setIntervalTerminating(intervalReject);

        clearInterval(intervalCallDuration);

        break;
      case "relaylatency":
      case "preaccept":
        break
      case "accept":
        setDurationSeconds(0);

        const intervalId = setInterval(() => {
          setDurationSeconds(seconds => seconds + 1);
        }, 1000);

        setIntervalCallDuration(intervalId)

        break;
    }
  }, [callState]);

  useEffect(() => {
    if (device_status === "connecting") {
      setScreenState(screensState.QRCODE_SCREEN);
    }
    else if (device_status === "open") {
      setScreenState(screensState.AVAILABLE_SCREEN);
    }
  }, [device_status]);

  useEffect(() => {
    startDevice("169709d6-149c-4877-bc18-ff789db4a11a");
  }, []);

  useEffect(() => {
    window.wavoip_webphone = {
      startCall: startCall,
      mute: mute,
      unMute: unMute,
      endCall: endCall,
      acceptCall: acceptCall,
      rejectCall: rejectCall,
      setIsOpen: (is_open: boolean) => {
        setIsOpen(is_open);
      },
      setConfig: (config: WebphoneConfig) => {
        setConfig({
          ...defaultConfig,
          ...config
        })
      }
    }
  }, [startCall, mute, unMute, endCall, acceptCall, setIsOpen, setConfig]);

  return (
    <WebPhone.Provider value={{
      token,
      config,
      isOpen,
      setIsOpen,
      screensState,
      screenState,
      setScreenState,
      duration,
      callState,
      startCall,
      acceptCall,
      rejectCall,
      endCall,
      mute,
      unMute,
      phone,
      name,
      callStatus,
      qrCode,
      callError,
      isMuted,
      profilePictureURL
    }}>
      {children}
    </WebPhone.Provider>
  );
}

export const useWebphone = () => {
  const content = useContext(WebPhone);

  if (!content) {
    throw new Error("Trying to use useCall but don't have a WebPhoneProvider");
  }

  return content;
}