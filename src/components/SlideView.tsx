import type { SlideStep } from '../types'
import { MiniMarkdown } from './MiniMarkdown'
import { CodeBlock } from './CodeBlock'

export function SlideView({ step }: { step: SlideStep }) {
  return (
    <div className="slide">
      <div className="slide-kind">スライド</div>
      <h2 className="slide-title">{step.title}</h2>
      <div className="slide-body">
        <MiniMarkdown text={step.body} />
      </div>
      {step.code && <CodeBlock code={step.code} />}
    </div>
  )
}
