import { useAnims } from '../lib/motion'

export default {
  initialColorModeName: "dark", // initialColorModeName should not be wrapped in the config object
  config: {
    useBorderBox: true,
    useRootStyles: true,
    useCustomProperties: true,
    useColorSchemeMediaQuery: true,
    useLocalStorage: true,
  },
  space: [0, 2, 4, 8, 16, 24, 32, 40, 48, 64, 128, 256, 512],
  radii: [0, 2, 4, 6, 12, 24, 48],
  zIndeces: [0, 1, 2, 3, 4, 5],
  breakpoints: ["40em", "56em", "64em"],
  transitions: useAnims ? ["0", ".2s", ".5s", "1s"] : '0',
  shadows: {
    card: "0 4px 4px 2px rgba(0, 0, 0, .07)",
    card_lift: "0 8px 8px 4px rgba(0, 0, 0, .13)",
    sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    outline: "0 0 0 3px rgba(66, 153, 225, 0.6)",
    inner: "inset 0 2px 4px 0 rgba(0,0,0,0.06)",
    none: "none",
  },
  sizes: {
    container: "100%",
  },
};
