import React from "react";
import { Spinner } from "react-bootstrap";

type LoadingContainerProps = { children?: React.ReactNode; style?: React.CSSProperties; isLoading?: boolean };

export default function LoadingContainer({ children, style, isLoading }: LoadingContainerProps) {
    if (isLoading) {
        return (
            <div className="w-100 text-center" style={style}>
                <Spinner />
            </div>
        );
    }
    return <React.Fragment>{children}</React.Fragment>;
}
