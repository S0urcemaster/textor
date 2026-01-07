'use client'
import '../static/css/globals.css'
import App from './app'
import { TextorContextProvider } from './context'

export default function Page() {
	return (
		<div className='page' style={{ position: 'relative' }}>
			<TextorContextProvider>
				<App />
			</TextorContextProvider>
		</div>
	)
}