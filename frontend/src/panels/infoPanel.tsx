import { useTextorContext } from "../app/context"
import { SafetyButton } from "../components/buttons/SafetyButton"
import Panel from "../components/Panel"
import phosphorIcons from "../static/svg/phosphorIcons"

export function InfoPanel() {

	const { files, system } = useTextorContext()

	return (
		<Panel style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', padding: '3px 5px 3px 5px', color: system.settings.colors.accent }}>
			<p>
				textor is a source text editor combined with a programmable effect section that lets your ideas flow into multiple channels
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
			<div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4 }}>
				<SafetyButton
					onActivate={files.resetStorage}
					icons={[
						<phosphorIcons.Lock color={system.settings.colors.red} />,
						<phosphorIcons.Warning color={system.settings.colors.red} />
					]}
					captions={['fac rst', 'warng']}
				/>
			</div>
		</Panel>

	)
}
