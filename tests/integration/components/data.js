/**
 * Helper module for defining the data to give to the table
 */

export const columns = [
  {
    className: 'name-col',
    label: 'Name',
    propertyName: 'name'
  },
  {
    className: 'real-name-col',
    label: 'Real Name',
    propertyName: 'realName'
  }
]

export const fixedColumns = [
  {
    className: 'name-col',
    frozen: true,
    label: 'Name',
    propertyName: 'name'
  },
  {
    className: 'real-name-col',
    label: 'Real Name',
    propertyName: 'realName'
  },
  {
    className: 'real-name-col',
    label: 'Real Name',
    propertyName: 'realName'
  },
  {
    className: 'real-name-col',
    label: 'Real Name',
    propertyName: 'realName'
  },
  {
    className: 'real-name-col',
    label: 'Real Name',
    propertyName: 'realName'
  },
  {
    className: 'universe-col',
    frozen: true,
    label: 'Universe',
    propertyName: 'universe'
  }
]

export const fixedColumnsWithCustomRenderers = [
  {
    className: 'name-col',
    frozen: true,
    headerRenderer: 'text-input-renderer',
    label: 'Name',
    propertyName: 'name',
    renderer: 'text-input-renderer'
  },
  {
    className: 'real-name-col',
    headerRenderer: 'text-input-renderer',
    label: 'Real Name',
    propertyName: 'realName',
    renderer: 'text-input-renderer'
  },
  {
    className: 'real-name-col',
    headerRenderer: 'text-input-renderer',
    label: 'Real Name',
    propertyName: 'realName',
    renderer: 'text-input-renderer'
  },
  {
    className: 'universe-col',
    frozen: true,
    headerRenderer: 'text-input-renderer',
    label: 'Universe',
    propertyName: 'universe',
    renderer: 'text-input-renderer'
  }
]

export const heroes = [
  {
    name: 'Superman',
    realName: 'Clark Kent (Kal-El)',
    teamAffiliations: ['JLA'],
    universe: 'DC'
  },
  {
    name: 'Batman',
    realName: 'Bruce Wayne',
    teamAffiliations: ['JLA'],
    universe: 'DC'
  },
  {
    name: 'Wonder Woman',
    realName: 'Diana Prince',
    teamAffiliations: ['JLA'],
    universe: 'DC'
  },
  {
    name: 'Aquaman',
    realName: 'Arthur Curry',
    teamAffiliations: ['JLA'],
    universe: 'DC'
  },
  {
    name: 'Flash',
    realName: 'Barry Allen',
    teamAffiliations: ['JLA'],
    universe: 'DC'
  }
]
