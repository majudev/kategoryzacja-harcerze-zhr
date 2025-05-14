export function floatToString(n: number | undefined | null): string {
    if(n === undefined || n === null) return "0";
    // toFixed(1) → string like "2.0" or "2.5"
    // + converts it back to number, dropping any unnecessary “.0”
    // .toString() then gives "2" or "2.5"
    return (+n.toFixed(1)).toString();
}