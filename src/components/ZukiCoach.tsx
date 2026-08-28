import { Zuki } from '@zukquote/zuki-react'
import type { VimMode } from './Editor'

export type CoachState = 'idle' | 'typing' | 'stuck' | 'solved' | 'finished'

type Props = {
  state: CoachState
  mode: VimMode
}

const LOOKS: Record<CoachState, { pose: string; anim: string; accessory: string }> = {
  idle: { pose: 'idle', anim: 'anim-idle', accessory: 'none' },
  typing: { pose: 'process', anim: 'anim-talk', accessory: 'none' },
  stuck: { pose: 'perplexed', anim: 'anim-curious', accessory: 'none' },
  solved: { pose: 'success', anim: 'anim-excited', accessory: 'none' },
  finished: { pose: 'hello', anim: 'anim-dance', accessory: 'party' },
}

export default function ZukiCoach({ state, mode }: Props) {
  const look = LOOKS[state]
  const theme = state === 'stuck' ? 'purple' : state === 'solved' ? 'green' : 'orange'

  return (
    <div className="flex flex-col items-center">
      <Zuki
        key={`${state}-${mode}`}
        pose={look.pose}
        className={look.anim}
        theme={theme}
        accessory={look.accessory}
        size={150}
      />
    </div>
  )
}
