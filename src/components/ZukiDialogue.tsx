import { Zuki } from '@zukquote/zuki-react'
import { useI18n } from '../i18n/useI18n'
import type { VimMode } from './Editor'

export type DialoguePhase = 'idle' | 'typing' | 'stuck' | 'checking' | 'solved' | 'finished'

type Props = {
  phase: DialoguePhase
  mode: VimMode
  /** What Zuki says right now. */
  message: string
  /** Extra line shown under the message, used for the hint. */
  aside?: string | null
  /** 0 to 1, drives the gauge while the solution is being checked. */
  checkProgress: number
}

const LOOKS: Record<DialoguePhase, { pose: string; anim: string; accessory: string; theme: string }> =
  {
    idle: { pose: 'idle', anim: 'anim-idle', accessory: 'beanie', theme: 'orange' },
    typing: { pose: 'process', anim: 'anim-talk', accessory: 'beanie', theme: 'orange' },
    stuck: { pose: 'perplexed', anim: 'anim-curious', accessory: 'beanie', theme: 'purple' },
    checking: { pose: 'process', anim: 'anim-wobble', accessory: 'beanie', theme: 'blue' },
    solved: { pose: 'success', anim: 'anim-excited', accessory: 'beanie', theme: 'green' },
    finished: { pose: 'hello', anim: 'anim-dance', accessory: 'party', theme: 'green' },
  }

export default function ZukiDialogue({ phase, mode, message, aside, checkProgress }: Props) {
  const { t } = useI18n()
  const look = LOOKS[phase]

  return (
    <div className="flex items-start gap-3 sm:gap-4">
      <div className="shrink-0">
        <Zuki
          key={`${phase}-${mode}`}
          pose={look.pose}
          className={look.anim}
          theme={look.theme}
          accessory={look.accessory}
          size={96}
        />
      </div>

      <div className="relative min-w-0 flex-1 rounded-2xl border border-slate-700 bg-slate-900/80 p-3 text-sm leading-relaxed text-slate-200">
        {/* Speech bubble tail pointing at Zuki. */}
        <span
          aria-hidden
          className="absolute top-6 -left-2 h-3 w-3 rotate-45 border-b border-l border-slate-700 bg-slate-900/80"
        />
        <p>{message}</p>
        {aside && <p className="mt-2 border-t border-slate-700/70 pt-2 text-slate-400">{aside}</p>}
        {phase === 'checking' && (
          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-700"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(checkProgress * 100)}
            aria-label={t('zuki.checking')}
          >
            <div
              className="h-full rounded-full bg-emerald-400 transition-[width] duration-100 ease-linear"
              style={{ width: `${Math.round(checkProgress * 100)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
