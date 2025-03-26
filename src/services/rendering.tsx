import { td } from '@/lib/validations'

export function renderDate({ cellData }: { cellData: string }) {
  if (!cellData) {
    // @ts-ignore
    return <span></span>
  }
  // @ts-ignore
  return <span>{td(cellData, 'short')}</span>
}
