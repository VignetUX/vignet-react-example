import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from 'vitest-browser-react'
import { WeatherWidget } from './WeatherWidget'
import { getCurrentWeather } from '../services/weatherService'
import { param } from '@vignet/vignet'

vi.mock('../services/weatherService')

describe('WeatherWidget', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('shows loading state', { meta: { vignet: { name: 'Loading Weather Widget' } } }, async () => {
    vi.mocked(getCurrentWeather).mockReturnValue(new Promise(() => {}))
    const screen = await render(<WeatherWidget city="London" />)

    await expect.element(screen.getByRole('progressbar')).toBeInTheDocument()
    await expect.element(screen.getByText('Fetching weather for London…')).toBeInTheDocument()
  })

  it('shows weather data', { meta: { vignet: { name: 'Weather Widget with data' } } }, async () => {
    const city = param('city', 'London', { label: 'City' })
    const temperatureC = param('temperatureC', 18, { label: 'Temperature (°C)' })
    const description = param('description', 'Partly cloudy', { label: 'Description' })
    vi.mocked(getCurrentWeather).mockResolvedValue({ city, temperatureC, description })
    const screen = await render(<WeatherWidget city={city} />)

    await expect.element(screen.getByText(city)).toBeInTheDocument()
    await expect.element(screen.getByText(`${temperatureC}°C`)).toBeInTheDocument()
    await expect.element(screen.getByText(description)).toBeInTheDocument()
  })

  it('shows error message', async () => {
    vi.mocked(getCurrentWeather).mockRejectedValue(new Error('Network error'))
    const screen = await render(<WeatherWidget city="London" />)

    await expect.element(screen.getByText(/Failed to load weather/)).toBeInTheDocument()
    await expect.element(screen.getByText(/Network error/)).toBeInTheDocument()
  })
})
