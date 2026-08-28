declare module '@zukquote/zuki-react' {
  import type { FC } from 'react'

  export type ZukiProps = {
    pose?: string
    className?: string
    isAnimating?: boolean
    theme?: string
    accessory?: string
    accessoryColor?: string
    size?: number
  }

  export const Zuki: FC<ZukiProps>
  export const ZukiFavicon: FC<Pick<ZukiProps, 'theme' | 'size' | 'className'>>
}

declare module '@zukquote/zuki-react/style.css'
