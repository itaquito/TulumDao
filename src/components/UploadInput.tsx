import React, { useCallback, useMemo, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import BtnGreenSquared from "./BtnGreenSquared";



const UploadInput = ({ onChange, className } : {onChange: (file: File)=>void, className?: string}) => {
    const [file, setFile] = useState(null);
    const ref = useRef(null)
    const ref2 = useRef(null)
    const onDrop = useCallback((acceptedFiles: any[]) => {
            const newFile = acceptedFiles[0];
            setFile(newFile);
            onChange(newFile);
        },
        [onChange]
    );

    const onBtnClick = useCallback(()=>{
        if(ref2.current){
            (ref2.current as any).click()
        }
    },[ref2])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop});
    return (
        <>
            <div ref={ref} className={`justify-content-center text-center user-select-none ${className ? className : ""}`}>
                <div {...(getRootProps())} className={`box ${isDragActive ? "active" : ""}`}>
                    <input {...getInputProps()}  ref={ref2}/>
                    <div className="my-5">
                        {file ? (file as any).name : "Subir"}
                    </div>
                </div>
            </div>
            <BtnGreenSquared onClick={onBtnClick}>Subir</BtnGreenSquared>
        </>
    );
};

export default UploadInput;
