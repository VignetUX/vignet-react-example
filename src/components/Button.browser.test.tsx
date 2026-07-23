import { test, expect } from 'vitest'
import { render } from 'vitest-browser-react'
import { Button } from './Button.js'
import { param } from '@vignet/vignet'

test('primary', { meta: { vignet: { name: 'Primary Button' } } }, async () => {
  const label = param('label', 'Click me', { label: 'Label' })
  const variant = param('variant', 'primary' as 'primary' | 'danger' | 'ghost', {
    label: 'Variant',
    options: ['primary', 'danger', 'ghost'],
  })
  const disabled = param('disabled', false, { label: 'Disabled' })
  const screen = await render(<Button label={label} variant={variant} disabled={disabled} />)

  await expect.element(screen.getByRole('button', { name: label })).toBeInTheDocument()
})

test('danger', { meta: { vignet: { name: 'Danger Button' } } }, async () => {
  const label = param('label', 'Delete', { label: 'Label' })
  const screen = await render(<Button label={label} variant="danger" />)

  await expect.element(screen.getByRole('button', { name: label })).toBeInTheDocument()
})

test('ghost / disabled', { meta: { vignet: { name: 'Ghost Button' } } }, async () => {
  const label = param('label', 'Cancel', { label: 'Label' })
  const screen = await render(<Button label={label} variant="ghost" disabled />)

  await expect.element(screen.getByRole('button', { name: label })).toBeDisabled()
})
