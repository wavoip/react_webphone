import { WavoipWebphoneApi } from "../webphone";

declare global {
    interface Window {
        wavoip_webphone: WavoipWebphoneApi
    }
}
