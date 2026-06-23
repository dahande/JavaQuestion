/** 進捗率(0-100)を表示する横棒。color でアクセント色を指定可能 */
export function ProgressBar({
  rate,
  color = '#2563eb',
}: {
  rate: number
  color?: string
}) {
  return (
    <div className="progress-track" aria-hidden="true">
      <div
        className="progress-fill"
        style={{ width: `${rate}%`, backgroundColor: color }}
      />
    </div>
  )
}
