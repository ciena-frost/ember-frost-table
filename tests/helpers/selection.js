/* global $ */
import {expect} from 'chai'
import {$hook} from 'ember-hook'

function createRangeSelectEvent () {
  const e = $.Event('click')
  e.shiftKey = true
  return e
}

export function assertRowsSelected (rowHook, ...rowNumbers) {
  const rows = $hook(rowHook)
  let remainingRows = rows
  for (let rowNumber of rowNumbers) {
    const row = rows.eq(rowNumber)
    expect(row).to.have.class('is-selected')
    remainingRows = remainingRows.not(row)
  }

  // ensure remaining rows aren't selected
  expect(remainingRows).to.not.have.class('is-selected')
}

export function rowBodyRangeSelect (rowHook, row1, row2) {
  $hook(rowHook, {row: row1}).trigger(createRangeSelectEvent())
  $hook(rowHook, {row: row2}).trigger(createRangeSelectEvent())
}

export function rowBodySingleSelect (rowHook, row) {
  $hook(rowHook, {row}).click()
}

export function rowCheckboxRangeSelect (rowHook, row1, row2) {
  $hook(`${rowHook}-selectionCell`, {row: row1}).trigger(createRangeSelectEvent())
  $hook(`${rowHook}-selectionCell`, {row: row2}).trigger(createRangeSelectEvent())
}

export function rowCheckboxSingleSelect (rowHook, row) {
  $hook(`${rowHook}-selectionCell`, {row}).click()
}
