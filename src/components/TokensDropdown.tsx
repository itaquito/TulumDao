import React, { useCallback, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Address } from "wagmi";
import { useERC20Tokens } from "../providers/ERC20TokensProvider";

export type TokenState = { pid: number; symbol: string; address?: Address };

type Props = {
  label: string;
  onChange?: (state: TokenState) => void;
};

type Dict = {[key: number]: TokenState}

export default function TokensDropdown({ label, onChange }: Props) {
  const [state, setState] = useState<TokenState>({ pid: 0, symbol: "" });
  const { contracts, getRead } = useERC20Tokens();
  const [mappedContracts, setMappedContracts] = useState<Dict>({});
  const onChangeCallback = useCallback((e: any)=>{
    const pid = e.target.value
    onChange && mappedContracts[pid] && onChange(mappedContracts[pid])
  },[mappedContracts, onChange]) 
  useEffect(() => {
    const run = async () => {
        const arr : Dict = {}
        for(let pid = 0; pid < contracts.length; pid++){
            const address = contracts[pid]
            const read = getRead(address)
            if(!read) continue;
            try{
                const symbol = await read("symbol")
                arr[pid] = {pid: pid, symbol: `${symbol}`, address: address}
                if(pid === 0){
                    
                }
            }catch(e){
                console.error(e)
            }
        }
        setMappedContracts(arr)
    };
    run();
  }, [contracts, getRead]);
  
  useEffect(()=>{
    onChangeCallback({target: {value: 0}})
  },[onChangeCallback])

  return (
    <Form.Group>
      <Form.Label className="fw-bold">{label}</Form.Label>
      <Form.Select onChange={onChangeCallback} disabled={Object.keys(mappedContracts).length <= 0} >
        {Object.values(mappedContracts).map((t) => (
          <option key={t.pid} value={t.pid}>{t.symbol}</option>
        ))}
      </Form.Select>
    </Form.Group>
  );
}
