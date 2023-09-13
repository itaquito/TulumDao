import React, { useEffect, useState } from "react";
import { ipfsBlob, useIPFSSrc } from "../hooks/ipfsFetch";



export default function IPFSImage(
    props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
) {
    const src = useIPFSSrc(props.src)
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} src={src} alt={props.alt ?? "IPFS Image"} />;
}
