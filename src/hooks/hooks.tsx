import "react";
import { useCallback, useEffect, useState } from "react";


type RefSetter = (ref: HTMLDivElement)=>void

export function useIsVisible(): [RefSetter, boolean] {
    const [ref, setRef] = useState<HTMLDivElement | null>(null)
    const [isVisible, setISVisible] = useState<boolean>(false);
  
    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) =>
        setISVisible(entry.isIntersecting)
      );
      if(ref && ref){
        observer.observe(ref);
        return () => {
            observer.disconnect();
        };
      }
    }, [ref]);

    const refSetter = useCallback((r: HTMLDivElement)=>{
        setRef(r)
    },[])
  
    return [refSetter, isVisible];
  }