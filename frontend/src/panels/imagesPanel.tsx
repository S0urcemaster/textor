import { useTextorContext } from "../app/context"
import Panel from "../components/Panel"

export default function () {

	const { system } = useTextorContext()

	return (
		<Panel style={{ display: 'grid', gridTemplateColumns: '4fr 12fr', gap: 1, height: 117 }}>
			<div>
				image list +functions
			</div>
			<div>
				image preview /current
			</div>
		</Panel>

	)
}