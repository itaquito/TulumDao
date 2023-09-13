import React, { useEffect, useState } from "react";
export async function ipfsFetch(url: string) {
    url = url.replace("ipfs://", "https://ipfs.io/ipfs/");
    return await fetch(url);
}

export async function ipfsBlob(url: string) {
    const res = await ipfsFetch(url);
    const blob = await res.blob();
    return URL.createObjectURL(blob);
}

const GRAY_IMG =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN89B8AAskB44g04okAAAAASUVORK5CYII=";

export function useIPFSSrc(src?: string) {
    const [_src, setSrc] = useState("");
    useEffect(() => {
        if (src) {
            ipfsBlob(src)
                .then((url) => setSrc(url))
                .catch(() => setSrc(GRAY_IMG));
        } else {
            setSrc(GRAY_IMG);
        }
    }, [src]);
    return _src
}
