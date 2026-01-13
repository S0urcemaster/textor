import { useTextorContext } from "../app/context"
import { SafetyButton } from "../components/buttons/SafetyButton"
import Panel from "../components/Panel"
import phosphorIcons from "../static/svg/phosphorIcons"

export function InfoPanel() {

	const { files, system } = useTextorContext()

	return (
		<Panel style={{
			display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1',
			color: system.settings.colors.accent
		}}>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'flex-start', alignItems: 'start' }}>
				<SafetyButton
					onActivate={files.resetStorage}
					icons={[
						<phosphorIcons.Lock color={system.settings.colors.red} />,
						<phosphorIcons.Warning color={system.settings.colors.red} />
					]}
					captions={['fac rst', 'warng']}
				/>
			</div>
			<div className="font-noto-sans" style={{ color: system.settings.colors.accent, paddingBottom: 5 }}>
				<h1>
					Textor Text Workstation
				</h1>
				<table style={{ width: '100%', borderCollapse: 'collapse', color: system.settings.colors.dark }}>
					<tbody>
						<tr>
							<td>Idea, Design, Programming</td>
							<td style={{ fontWeight: 'bold' }}>
								<a href="https://digi-craft.de" target="_blank" rel="noopener noreferrer">
									Sebastian Teister
								</a>
							</td>
						</tr>
						<tr>
							<td>Buy me a coffee</td>
							<td style={{ fontWeight: 'bold' }}>
								<a href="https://coff.ee/sebastianteister" target="_blank" rel="noopener noreferrer">
									coff.ee/sebastianteister
								</a>
							</td>
						</tr>
						<tr>
							<td>Donate at Paypal</td>
							<td style={{ fontWeight: 'bold' }}>
								<a href="https://paypal.me/snteister" target="_blank" rel="noopener noreferrer">
									paypal.me/snteister
								</a>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</Panel>

	)
}
