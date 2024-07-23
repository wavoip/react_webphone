import { WebphoneConfig } from "../types/webphone";

export const defaultConfig: WebphoneConfig = {
  button: {
    position_y: "bottom",
    position_x: "right",
    spacing: "20px",
    color: "#00b06f"
  },
  background: {
    color: "#00b06f",
    gradient_color: ["#00b06f", "#00000050"],
    gradient_direction: "to-tl"
  }
}