import type { Step } from '../types'

interface Props {
  steps: Step[]
  currentIndex: number
  isDone: (index: number) => boolean
  onJump: (index: number) => void
  color: string
}

/**
 * レッスン内の全ステップを横並びのドット/セグメントで表示する目次。
 * スライド/演習をアイコンで識別し、完了・現在を視覚化、クリックでジャンプできる。
 */
export function StepIndicator({
  steps,
  currentIndex,
  isDone,
  onJump,
  color,
}: Props) {
  return (
    <nav
      className="step-indicator"
      aria-label="レッスンのステップ"
      style={{ ['--accent' as string]: color }}
    >
      {steps.map((step, i) => {
        const done = isDone(i)
        const current = i === currentIndex
        const kindLabel =
          step.type === 'slide'
            ? 'スライド'
            : step.type === 'quiz'
              ? '問題'
              : '演習'
        const label = `${i + 1}. ${step.title}（${kindLabel}）`
        const icon =
          step.type === 'slide' ? i + 1 : step.type === 'quiz' ? '?' : '{ }'
        return (
          <button
            key={step.id}
            type="button"
            className={
              'step-dot' +
              (current ? ' current' : '') +
              (done ? ' done' : '') +
              ' ' +
              step.type
            }
            onClick={() => onJump(i)}
            aria-label={label}
            aria-current={current ? 'step' : undefined}
            title={label}
          >
            <span className="step-dot-icon" aria-hidden="true">
              {done ? '✓' : icon}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
