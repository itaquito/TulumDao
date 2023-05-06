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

interface UseAPIProps<T> {
  url: string;
  data?: T;
  initialValue?: T;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  disabled?: boolean;
}

export function useAPI<T>({url, data, initialValue, method, disabled}: UseAPIProps<T>): [T, (data?: unknown)=>Promise<T>]{
  const [state, setState] = useState<T>(initialValue as T)
  const fetchFunc = useCallback( async (data: any)=>{
    const init : RequestInit= {
      method: method ?? "GET"
    }
    if(data){
      
      if((data instanceof FormData)){
        init.body = data
      }else{
        init.body = JSON.stringify(data)
        init.headers = {
          'Content-Type': 'application/json'
        }
      }
    }
    console.log(init)
    const res = await fetch(url, init)
    const resData = await res.json()
    setState(resData)
    return resData
  },[method, url])
  useEffect(()=>{
    if(!disabled){
      fetchFunc(data)
    }
  },[disabled, data, fetchFunc])

  return [state, fetchFunc]
}