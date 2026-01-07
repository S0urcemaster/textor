import { useEffect, useState } from "react"
import { Document, Instruction } from "../model"

export default function () {

	const [effects, setEffects] = useState<Instruction[][]>()

	const [selectedId, setSelectedId] = useState<number>()

	const [reloader, setReloader] = useState(0)

	useEffect(() => {

	}, [effects])

	function isManual(id: number): boolean {
		return effects![id].find(instruction => instruction.manual) !== undefined
	}

	return { setSelectedId, reloader, setReloader, selectedId, isManual, effects, setEffects }
}