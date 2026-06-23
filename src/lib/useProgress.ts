import { useSyncExternalStore } from 'react'
import { getProgress, subscribe, type ProgressState } from './progress'

/** 進捗ストアを購読する React フック */
export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, getProgress, getProgress)
}
