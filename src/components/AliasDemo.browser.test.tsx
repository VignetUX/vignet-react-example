import { test, expect } from 'vitest'
import { render } from 'vitest-browser-react'
import { AliasDemo } from '@/components/AliasDemo.js'

test('renders', { meta: { vignet: { name: 'Alias Demo' } } }, async () => {
  const screen = await render(<AliasDemo />)

  await expect.element(screen.getByRole('button', { name: 'Resolved via @ alias' })).toBeInTheDocument()
})
