/* eslint-disable @typescript-eslint/no-explicit-any */
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import type eventBus from "bpmn-js/lib/NavigatedViewer"
import type InternalEvent from "bpmn-js/lib/NavigatedViewer"
import { forwardRef, useCallback, useEffect, useRef, useState, useImperativeHandle } from 'react';
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

type BpmnProps = {
	xml: string
	onEventclick?: (e: InternalEvent) => void
}

const Bpmn = forwardRef(({ xml, onEventclick }: BpmnProps, ref) => {
	const bpmnRef = useRef(null)
	const [diagram, setDiagram] = useState("");
	const modeler = useRef<BpmnViewer | null>()


	const handleEventClick = useCallback((e: InternalEvent) => {
		if (onEventclick) {
			onEventclick(e)
		}
	}, [onEventclick])

	useImperativeHandle(ref, () => ({
		handleReset() {
			if (modeler.current) {
				const selection = modeler.current.get("selection") as any
				selection.select([])
			}
		},
	}), [])



	useEffect(() => {
		setDiagram(xml)
	}, [xml])

	useEffect(() => {
		const createModeler = async () => {
			if (bpmnRef.current && diagram) {
				modeler.current = new BpmnViewer({
					container: bpmnRef.current,
					keyboard: {
						bindTo: bpmnRef.current
					}
				})

				try {
					const { warnings } = await modeler.current.importXML(diagram);
					console.log(warnings)

					const eventBus = modeler?.current?.get("eventBus") as eventBus
					eventBus.on("element.click", handleEventClick)



				} catch (error) {
					console.log(error)
				}
			}
		}

		createModeler()

		return () => { modeler.current?.destroy() }
	}, [diagram, handleEventClick])



	return (
		<>

			<div
				ref={bpmnRef}
				style={{
					border: "1px solid #000000",
					height: "90vh",
					width: "90vw",
					margin: "auto"
				}}
			>

			</div>
		</>
	)
})

export default Bpmn 
