import { NullLiteral } from "typescript";

export const calculateTaskScore = function(type: 'BOOLEAN'|'LINEAR'|'LINEAR_REF'|'PARABOLIC_REF', value: number, maxPoints: number, multiplier: number|null) : number{
    if(type === "BOOLEAN"){
        if(value > 0) return maxPoints;
        return 0;
    }else if(type === "LINEAR"){
        if(multiplier == null) multiplier = 1;
        let val = value * multiplier;
        if(val > maxPoints) val = maxPoints;
        return val;
    }
    return 0;
}