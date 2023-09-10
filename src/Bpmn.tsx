/* eslint-disable @typescript-eslint/no-explicit-any */
import BpmnViewer from 'bpmn-js/lib/Viewer';
import type eventBus from "bpmn-js/lib/Viewer"
import type InternalEvent from "bpmn-js/lib/Viewer"
import { useCallback, useEffect, useRef, useState } from 'react';
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

type BpmnProps = {
	xml: string
	onEventclick?: (e: InternalEvent) => void
}

export default function Bpmn({ xml, onEventclick }: BpmnProps) {
	const ref = useRef(null)
	const [diagram, setDiagram] = useState("");


	const handleEventClick = useCallback((e: InternalEvent) => {
		if (onEventclick) {
			onEventclick(e)
		}
	}, [onEventclick])

	useEffect(() => {
		setDiagram(xml)
	}, [xml])

	useEffect(() => {
		let modeler: BpmnViewer | null = null
		const createModeler = async () => {
			if (ref.current && diagram) {
				modeler = new BpmnViewer({
					container: ref.current,
					keyboard: {
						bindTo: ref.current
					}
				})

				try {
					const { warnings } = await modeler.importXML(diagram);
					console.log(warnings)

					const eventBus = modeler.get("eventBus") as eventBus
					eventBus.on("element.click", handleEventClick)

				} catch (error) {
					console.log(error)
				}
			}
		}

		createModeler()

		return () => { modeler?.destroy() }
	}, [diagram, handleEventClick])



	return (
		<div
			ref={ref}
			style={{
				border: "1px solid #000000",
				height: "90vh",
				width: "90vw",
				margin: "auto"
			}}
		>

		</div>
	)
}
