import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTextorContext } from '../app/context'

type Editor = {

}

export default function () {

	const { editor } = useTextorContext()

	const [text, setText] = useState(editor.text)

	return (
		<div>Editor</div>
	)
}