import IconButton from "../components/buttons/IconButton"
import { SafetyButton } from "../components/buttons/SafetyButton"
import Panel from "../components/Panel"
import phosphorIcons from "../static/svg/phosphorIcons"
import { useTextorContext } from "./context"
import utils from "./utils"

export const menuCommands = {
	chars: 'chars',
	docs: 'docs',
	images: 'images',
	vault: 'vault',
	textor: 'textor',
}

export default function ({ menuClicked }: { menuClicked: (ix: string) => void }) {
	const { files, editor, system } = useTextorContext()

	function downloadClicked() {
		if (!files.currentDocument) return
		const blob = new Blob([files.currentDocument.editor!.text], { type: "text/plain;charset=utf-8" })
		const link = document.createElement("a")
		link.href = URL.createObjectURL(blob)
		link.download = files.currentDocument.folderName + '-' + files.currentDocument.name + '.txt'
		link.click()
		URL.revokeObjectURL(link.href)
	}

	function copyClicked() {
		if (!files.currentDocument) return
		const text = files.currentDocument.editor!.text.replaceAll('\v', '\n')
		utils.copyToClipboard(text)
	}

	return (
		<Panel>
			<div style={{ display: 'flex', justifyContent: 'space-between', flex: 1, paddingBottom: 0, gap: 1 }}>

				<SafetyButton onActivate={() => editor.setActions([['clear']])} icons={[<phosphorIcons.Backspace color={system.settings.colors.red} />, <phosphorIcons.Warning color={system.settings.colors.red} />]} captions={['clear', 'warng']} />

				<IconButton onActivate={() => editor.setActions([['insert', '.']])} icon={<div style={{ fontSize: 18, lineHeight: '18px', paddingTop: 8 }}>.</div>}>Dot</IconButton>

				<IconButton onActivate={copyClicked} icon={<phosphorIcons.CornersOut color={system.settings.colors.buttonColor} />}>copy</IconButton>
				<IconButton onActivate={downloadClicked} icon={<phosphorIcons.Download color={system.settings.colors.buttonColor} />}>dnload</IconButton>

				<div style={{ display: 'flex', flex: 1, justifyContent: 'left', padding: '4px 3px 0px 7px', color: system.settings.colors.buttonColor, flexDirection: 'column', gap: 1 }}>
					<h3>{files.currentDocument?.folderName}/{files.currentDocument?.name}</h3>
					<div>{utils.textStats(files.currentDocument)}</div>
				</div>

				<IconButton trigger='mousedown' onActivate={() => menuClicked(menuCommands.chars)} icon={<phosphorIcons.SmileyWink color={system.settings.colors.buttonColor} />}>chars</IconButton>
				<IconButton trigger='mousedown' onActivate={() => menuClicked(menuCommands.docs)} icon={<phosphorIcons.Files color={system.settings.colors.buttonColor} />}>docs</IconButton>
				<IconButton trigger='mousedown' onActivate={() => menuClicked(menuCommands.images)} icon={<phosphorIcons.ImagesSquare color={system.settings.colors.buttonColor} />}>imgs</IconButton>
				<IconButton trigger='mousedown' onActivate={() => menuClicked(menuCommands.vault)} icon={<phosphorIcons.Vault color={system.settings.colors.buttonColor} />}>vault</IconButton>
				<IconButton trigger='mousedown' onActivate={() => menuClicked(menuCommands.textor)} icon={<phosphorIcons.QuestionMark color={system.settings.colors.buttonColor} />}>Textor</IconButton>

			</div>

		</Panel>
	)
}
