import { useTextorContext } from "../app/context"
import { SafetyButton } from "../components/buttons/SafetyButton"
import ToggleButton from "../components/buttons/ToggleButton"
import Panel from "../components/Panel"
import phosphorIcons from "../static/svg/phosphorIcons"

export function InfoPanel() {

	const { files, system } = useTextorContext()

	return (
		<Panel style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1', color: system.settings.colors.accent }}>

			<div style={{ display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'flex-start', alignItems: 'start' }}>
				<div>
					<ToggleButton
						title="layout"
						value={system.settings.horizontalLayout}
						onToggle={() => system.updateSettings({ horizontalLayout: !system.settings.horizontalLayout })}
						icons={[
							<phosphorIcons.SplitVertical color={system.settings.colors.buttonColor} />,
							<phosphorIcons.SplitHorizontal color={system.settings.colors.buttonColor} />
						]}
					/>
				</div>
				<SafetyButton
					onActivate={files.resetStorage}
					icons={[
						<phosphorIcons.Lock color={system.settings.colors.red} />,
						<phosphorIcons.Warning color={system.settings.colors.red} />
					]}
					captions={['fac rst', 'warng']}
				/>
			</div>
			<div>
				<p>
					Textor is text workstation with a programmable effect section
				</p>
				<table style={{ width: '100%', borderCollapse: 'collapse', }}>
					<tbody>
						<tr>
							<td>Idea<br />Design<br />Programming</td>
							<td>
								<a href="https://digi-craft.de" target="_blank" rel="noopener noreferrer">
									Digi Craft
								</a>
							</td>
						</tr>
						<tr>
							<td>Buy me a coffee</td>
							<td>
								<a href="https://coff.ee/sebastianteister" target="_blank" rel="noopener noreferrer">
									coff.ee/sebastianteister
								</a>
							</td>
						</tr>
						<tr>
							<td>Donate at Paypal</td>
							<td>
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
