import { useEffect, useRef } from 'react'
import hljs from 'highlight.js/lib/core'
import java from 'highlight.js/lib/languages/java'
import 'highlight.js/styles/atom-one-dark.css'

hljs.registerLanguage('java', java)

/** highlight.js で Java コードをシンタックスハイライト表示する読み取り専用ブロック */
export function CodeBlock({ code }: { code: string }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.removeAttribute('data-highlighted')
      hljs.highlightElement(ref.current)
    }
  }, [code])

  return (
    <pre className="code-block">
      <code ref={ref} className="language-java">
        {code}
      </code>
    </pre>
  )
}
