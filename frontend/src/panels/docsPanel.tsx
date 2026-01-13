import { useEffect, useState } from "react"
import { useTextorContext } from "../app/context"
import FolderSelect from "../components/FolderSelect"
import FileManager from "../components/FileManager"
import Panel from "../components/Panel"
import { lib } from "../static/lib"
import { dlog, log } from "../static/log"

export default function () {

	const { files } = useTextorContext()

	const [availableFiles, setAvailableFiles] = useState<string[]>([])
	const [availableFolders, setAvailableFolders] = useState<string[]>([])
	const [currentFile, setCurrentFile] = useState<string>(files.currentDocument?.name ?? '')
	const [currentFolder, setCurrentFolder] = useState<string>(files.currentDocument?.folderName ?? '')

	useEffect(() => {
		if (files.documents) {
			setAvailableFolders(lib.extractFolders(files.documents))
		}
	}, [files.documents])

	useEffect(() => {
		if (!files.currentDocument) return
		setCurrentFolder(files.currentDocument.folderName)
		setCurrentFile(files.currentDocument.name)
	}, [files.currentDocument?.folderName, files.currentDocument?.name])

	useEffect(() => {
		const currentDocFolder = files.currentDocument?.folderName
		if (currentDocFolder && availableFolders.includes(currentDocFolder)) {
			setCurrentFolder(currentDocFolder)
			return
		}
		if (!currentFolder || !availableFolders.includes(currentFolder)) {
			setCurrentFolder(availableFolders[0] ?? '')
		}
	}, [availableFolders, files.currentDocument?.folderName])

	useEffect(() => {
		if (currentFolder) {
			setAvailableFiles(lib.getFilesByFolder(files.documents, currentFolder))
		} else {
			setAvailableFiles([])
		}
	}, [currentFolder])

	useEffect(() => {
		if (!currentFolder) return
		if (files.currentDocument && files.currentDocument.folderName === currentFolder) {
			setCurrentFile(files.currentDocument.name)
			return
		}
		setCurrentFile('')
	}, [availableFiles, currentFolder, files.currentDocument?.folderName, files.currentDocument?.name])



	function duplicateFile(newFilename: string) {
		if (!files.currentDocument) return
		const ix = files.documents.findIndex(doc => doc.folderName === files.currentDocument.folderName && doc.name === files.currentDocument.name)
		const dupl = { ...structuredClone(files.documents[ix]), name: newFilename, editable: true, deletable: true }
		files.documents.splice(ix + 1, 0, dupl)
		if (!currentFolder) return
		const filesLoc = lib.getFilesByFolder(files.documents, currentFolder)
		setAvailableFiles(filesLoc)
		files.setCurrentDocument(files.documents[ix + 1])
		setCurrentFile(newFilename)
	}

	function fileChanged(file: string) {
		setCurrentFile(file)
		if (!currentFolder) return
		const doc = lib.findDoc(files.documents, currentFolder, file)
		if (doc) {
			files.setCurrentDocument(doc)
		}
	}

	function fileRenamed(text: string) {
		log([dlog.tpanels], 'fileRenamed()', text)
		if (!text) return
		if (text !== currentFile) duplicateFile(text)
	}

	function deleteFileClicked() {
		if (currentFolder === 'User') {
			if (currentFile !== 'Default') {
				if (!files.currentDocument) return
				const ix = files.documents.findIndex(doc => doc.folderName === files.currentDocument.folderName && doc.name === files.currentDocument.name)
				files.documents.splice(ix, 1)
				const filesLoc = lib.getFilesByFolder(files.documents, currentFolder)
				setAvailableFiles(filesLoc)
				files.setCurrentDocument(files.documents[ix - 1])
			}
		}
	}

	return (
		<Panel style={{ display: 'grid', gridTemplateColumns: '4fr 12fr', gap: 1, height: 117 }}>

				<div style={{}}>
					<FolderSelect options={availableFolders} value={currentFolder} onChange={setCurrentFolder} style={{ width: '100%', height: '100%' }} />
				</div>

				<div style={{ overflowY: 'scroll' }} >
					<FileManager onChange={fileChanged} style={{ width: '100%', height: '100%' }} renamed={fileRenamed} files={availableFiles} value={currentFile} deleteClicked={deleteFileClicked} />
				</div>
		</Panel>
	)
}
