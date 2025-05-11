export const calculateTaskScore = function(type: 'BOOLEAN'|'LINEAR'|'LINEAR_REF'|'PARABOLIC_REF'|'REFONLY', value: number, maxPoints: number, multiplier: number|null, refVal: number|null) : number{
    if(type === "REFONLY"){
        return 0;
    }else if(type === "BOOLEAN"){
        if(value > 0) return maxPoints;
        return 0;
    }else if(type === "LINEAR"){
        if(multiplier == null) multiplier = 1;
        let val = value * multiplier;
        if(val > maxPoints) val = maxPoints;
        return val;
    }else if(type === "LINEAR_REF"){
        if(refVal === null) throw Error();
        if(refVal === 0) return 0;
        let val = maxPoints * value / refVal;
        if(val > maxPoints) val = maxPoints;
        return val;
    }else if(type === "PARABOLIC_REF"){
        if(refVal === null) throw Error();
        if(refVal === 0) return 0;
        let val = maxPoints * (value / refVal)^2;
        if(val > maxPoints) val = maxPoints;
        return val;
    }
    return 0;
}