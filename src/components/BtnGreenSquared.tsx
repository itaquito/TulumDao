import React from 'react'
import { Button, ButtonProps } from 'react-bootstrap'
import { BtnGreen } from './BtnGreen'

export default function BtnGreenSquared(props: ButtonProps) {
    return (
        <BtnGreen {...props} className={`mb-3 py-3 px-4 rounded-0 box-shadow ${props.className ?? ""}`}/>
    )
}
