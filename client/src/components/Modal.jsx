import { useRef, useState } from "react"

export default function Modal({ id, children }) {
    const ref = useRef()
    const [visible, setVisible] = useState(false)

    const handleModalClose = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setVisible(false)
        ref.current.checked = false
    }

    const handleModalOpen = (e) => {
        if (e.target.value) {
            setVisible(true)
        }
    }

    return (
        <>
            <input type="checkbox" id={id} hidden ref={ref} onChange={handleModalOpen} />
            {
                visible &&
                <div className="modal-wrapper" onClick={handleModalClose} >
                    <div className="modal" onClick={(e) => { e.stopPropagation()}}>
                        {children}
                    </div>
                </div>
            }
        </>
    )
}