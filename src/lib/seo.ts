import { useEffect } from 'react'

const SUFFIX = 'JavaLearn | ブラウザで学ぶJava入門'

function setMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * ルートごとに document.title と meta description を更新する。
 * SPA でもタブ名・JSレンダリング時のSEO情報を適切に保つ。
 */
export function useDocumentMeta(title: string | undefined, description: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SUFFIX}` : SUFFIX
    setMeta('description', description)
  }, [title, description])
}
