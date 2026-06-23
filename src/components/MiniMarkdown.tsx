import React from 'react'

// スライド本文用の簡易マークダウン描画。
// 対応: 段落（空行区切り）、- 箇条書き、**強調**、`インラインコード`。

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  // **bold** と `code` を分割して装飾する
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return tokens
    .filter((t) => t.length > 0)
    .map((token, i) => {
      const key = `${keyPrefix}-${i}`
      if (token.startsWith('**') && token.endsWith('**')) {
        return <strong key={key}>{token.slice(2, -2)}</strong>
      }
      if (token.startsWith('`') && token.endsWith('`')) {
        return <code key={key}>{token.slice(1, -1)}</code>
      }
      return <React.Fragment key={key}>{token}</React.Fragment>
    })
}

export function MiniMarkdown({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/)
  return (
    <>
      {blocks.map((block, bi) => {
        const lines = block.split('\n')
        const isList = lines.every((l) => l.trim().startsWith('- '))
        if (isList) {
          return (
            <ul key={bi} className="md-list">
              {lines.map((l, li) => (
                <li key={li}>{renderInline(l.replace(/^\s*-\s/, ''), `${bi}-${li}`)}</li>
              ))}
            </ul>
          )
        }
        return (
          <p key={bi} className="md-p">
            {lines.map((l, li) => (
              <React.Fragment key={li}>
                {li > 0 && <br />}
                {renderInline(l, `${bi}-${li}`)}
              </React.Fragment>
            ))}
          </p>
        )
      })}
    </>
  )
}
