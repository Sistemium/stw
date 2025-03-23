import mapValues from 'lodash/mapValues'
import Dexie, { type EntityTable } from 'dexie'

interface Setting {
  id: string
  value: string
}

Dexie.debug = true
export const db = new Dexie('stw-store') as Dexie & {
  setting: EntityTable<Setting, 'id'>
  offset: EntityTable<{ entity: string, offset: string }, 'entity'>
}

console.log('Using Dexie v' + Dexie.semVer)

db.version(1).stores({ settings: '' })
db.version(2).stores({
  setting: 'id,value',
  settings: null,
})
db.version(3).stores({ setting: 'id' })
db.version(4).stores(storesV4())
db.version(5).stores(storesV5())
db.version(6).stores(storesV6())
db.version(7).stores({
  ...storesV6(),
  offset: 'entity',
})
db.version(8).stores({})
  .upgrade(async (trans) => {
    await trans
      .table('offset')
      .delete('ClientData')
    await trans
      .table('ClientData')
      .clear()
  })

function storesV5() {
  return mapValues(storesV4(), (value) => `${value},ts`)
}

function storesV6() {
  return mapValues(storesV4(), (value) => `${value},x_offset`)
}

function storesV4() {
  return {
    Site: 'id',
    Article: 'id',
    Employee: 'id,siteId',
    Storage: 'id',
    Picture: 'id',
    Pricing: 'id',
    ArticleProp: 'id',
    PropOption: 'id,propId',
    Configuration: 'id',
    ClientData: 'id',
    User: 'id',
    ServiceTask: 'id',
    ServiceTaskHistory: 'id,serviceTaskId',
  }
}

export async function cleanup() {
  return db.delete()
}
