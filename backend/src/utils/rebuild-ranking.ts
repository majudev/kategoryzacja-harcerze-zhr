import { PrismaClient } from "@prisma/client";
import { rebuildRanking } from "./rankingbuilder";

const prisma = new PrismaClient();

const main = async () => {
    const years = await prisma.categorizationYear.findMany({
        where: {
            ranking: null,
        },
        select: {
            id: true,
            name: true,
        }
    });

    await Promise.all(years.map(async (year) => {
        console.log('Rebuilding ranking for year ' + year.name);

        await rebuildRanking(year.id);

        console.log('Ranking for year ' + year.name + ' finished.');
    }));

    process.exit();
};
main();