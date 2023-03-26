// import { darken, lighten } from '@theme-ui/color'

import colors from './Theme_colors'
import buttons from './Theme_buttons'
import styles from './Theme_styles'
import typography from './Theme_typography'
import cards from './Theme_cards'
import forms from './Theme_forms'

import config from './Theme_config'
import { Theme } from 'theme-ui'

const theme: any = {
  ...config,
  ...typography,
  colors,
  cards,
  buttons,
  styles,
  forms,
}
export default theme