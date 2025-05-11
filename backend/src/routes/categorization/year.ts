import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";
import redis from "../../utils/redis";

const prisma = new PrismaClient();

export const getCategorizationYearId = async (skipCache?: boolean) => {
    let idString = await redis.get('currentCategorizationYearId');
    if(idString === null || skipCache === true){
        const year = await prisma.categorizationYear.findMany({
            where: {
                state: "OPEN",
            },
            select: {
                id: true,
            }
        });
        if(year.length > 1) throw new Error('two active categorization years found');
        if(year.length > 0){
            idString = year[0].id.toString();
            const expires = 60 * 60;
            await redis.set('currentCategorizationYearId', idString);
            await redis.expire('currentCategorizationYearId', expires);
        }
    }

    if(idString !== null) return Number.parseInt(idString);
    return null;
};