import { td } from '@/lib/validations'

export function renderDate({ cellData }: { cellData: string }) {
  if (!cellData) {
    return <span></span>
  }
  return <span>{td(cellData, 'short')}</span>
}
