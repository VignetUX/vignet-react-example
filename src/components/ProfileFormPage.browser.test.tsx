import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from 'vitest-browser-react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ProfileFormPage } from './ProfileFormPage'

const SAMPLE_DATA = {
  name: 'Jane Doe',
  birthdate: '1990-06-15',
  occupation: 'Software Engineer',
}

const ProfileFormPageStory = ({ id }: { id?: string }) => (
  <MemoryRouter initialEntries={id ? [`/userform/${id}`] : ['/userform']}>
    <Routes>
      <Route path="/userform/:id" element={<ProfileFormPage />} />
      <Route path="/userform" element={<ProfileFormPage />} />
    </Routes>
  </MemoryRouter>
)

function renderAtRoute(id?: string) {
  return render(<ProfileFormPageStory id={id} />)
}

function mockFetch(ok: boolean, data: unknown) {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok,
    json: async () => data,
  } as Response)
}

describe('ProfileFormPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the header', { meta: { vignet: { name: 'Header' } } }, async () => {
    const screen = await renderAtRoute()

    await expect.element(screen.getByRole('heading', { name: 'Acme' })).toBeInTheDocument()
  })

  it('shows an empty form when no id is in the url', { meta: { vignet: { name: 'Empty form' } } }, async () => {
    const screen = await render(<ProfileFormPage />)

    await expect.element(screen.getByRole('progressbar')).not.toBeInTheDocument()
    await expect.element(screen.getByLabelText('Name')).toHaveValue('')
    await expect.element(screen.getByLabelText('Occupation')).toHaveValue('')
  })

  it('shows a loading spinner while fetching', async () => {
    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}))
    const screen = await renderAtRoute('123')

    await expect.element(screen.getByRole('progressbar')).toBeInTheDocument()
    await expect.element(screen.getByLabelText('Name')).not.toBeInTheDocument()
  })

  it('pre-fills the form with data returned from the backend', { meta: { vignet: { name: 'Pre-filled form' } } }, async () => {
    mockFetch(true, SAMPLE_DATA)
    const screen = await renderAtRoute('123')

    await expect.element(screen.getByRole('progressbar')).not.toBeInTheDocument()
    await expect.element(screen.getByLabelText('Name')).toHaveValue('Jane Doe')
    await expect.element(screen.getByLabelText('Occupation')).toHaveValue('Software Engineer')
    await expect.element(screen.getByLabelText('Birthdate')).toHaveValue('1990-06-15')
  })

  it('shows an empty form when the backend returns 404', async () => {
    mockFetch(false, { error: 'User not found' })
    const screen = await renderAtRoute('999')

    await expect.element(screen.getByRole('progressbar')).not.toBeInTheDocument()
    await expect.element(screen.getByLabelText('Name')).toHaveValue('')
    await expect.element(screen.getByLabelText('Occupation')).toHaveValue('')
  })

  it('shows an empty form when the fetch throws', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))
    const screen = await renderAtRoute('123')

    await expect.element(screen.getByRole('progressbar')).not.toBeInTheDocument()
    await expect.element(screen.getByLabelText('Name')).toHaveValue('')
  })

  it('updates fields as the user types', async () => {
    const screen = await renderAtRoute()

    await screen.getByLabelText('Name').fill('John Smith')
    await screen.getByLabelText('Occupation').fill('Designer')
    await expect.element(screen.getByLabelText('Name')).toHaveValue('John Smith')
    await expect.element(screen.getByLabelText('Occupation')).toHaveValue('Designer')
  })

  it('renders the submit button', async () => {
    const screen = await renderAtRoute()

    await expect.element(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })
})
