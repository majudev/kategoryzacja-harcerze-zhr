import { PrismaClient } from "@prisma/client";
import { getTasks } from "../routes/tasks";
import { getCategory } from "../routes/categorization";
import { getInitialTasks } from "../routes/tasks/initial";
import redis from "./redis";

const prisma = new PrismaClient();

export const rebuildRanking = async (categorizationYearId: number, skipDatabase?: boolean) => {
    // If DB entry exists - do not rebuild
    if(!skipDatabase){
        const catYear = await prisma.categorizationYear.findUnique({
            where: {
                id: categorizationYearId,
            },
            select: {
                ranking: {
                    select: {
                        JSON: true,
                    }
                }
            }
        });
        if(catYear !== null && catYear.ranking !== null) return catYear.ranking.JSON;
    }
    console.log('Rebuilding...');

    const teams = await prisma.team.findMany({
        where: {
            shadow: false,
        },
        select: {
            id: true,
            name: true,
            district: {
                select: {
                    name: true,
                }
            }
        }
    });

    const teamsWithInitialState = await Promise.all(teams.map(async (team) => {
        const initialTasks = await getInitialTasks(team.id, categorizationYearId);
        const initialTasksDone = initialTasks.reduce((prev, task) => {
            if(task.value) return prev+1;
            return prev;
        }, 0);

        return {
            ...team,
            initialTasksDone: initialTasksDone === initialTasks.length,
        };
    }));

    const teamsWithInitialTasksDone = teamsWithInitialState.filter((team) => team.initialTasksDone);

    const teamsCategories = await Promise.all(teamsWithInitialTasksDone.map(async (team) => {
        const categorizationYear = await prisma.categorizationYear.findUnique({
            where: {
              id: categorizationYearId,
            },
            select: {
              id: true,
              name: true,
        
              lesnaLesneThreshold: true,
              lesnaPuszczanskieThreshold: true,
              puszczanskaLesnaThreshold: true,
              puszczanskaPuszczanskieThreshold: true,
            }
        });
        if(categorizationYear === null){ // should never happen
            return null;
        }

        const tasks = await getTasks(team.id, categorizationYearId);
        
        const polowa = tasks.filter((taskGroup) => taskGroup.achievedSymbol === 'POLOWA').length;
        const lesna = tasks.filter((taskGroup) => taskGroup.achievedSymbol === 'LESNA').length;
        const puszczanska = tasks.filter((taskGroup) => taskGroup.achievedSymbol === 'PUSZCZANSKA').length;
        
        const result = await getCategory(polowa, lesna, puszczanska, categorizationYear.lesnaLesneThreshold, categorizationYear.lesnaPuszczanskieThreshold, categorizationYear.puszczanskaLesnaThreshold, categorizationYear.puszczanskaPuszczanskieThreshold);

        return {
            name: team.name,
            district: team.district.name,
            points: tasks.reduce((prev, val) => prev + val.collectedSplitPoints, 0),
            ...result,
        };
    }));

    const sortingCriteria = (a: any, b: any) => {
        if(a.category === 'PUSZCZANSKA' && b.category !== 'PUSZCZANSKA') return -1;
        else if(a.category === 'LESNA' && b.category === 'PUSZCZANSKA') return 1;
        else if(a.category === 'LESNA' && b.category === 'POLOWA') return -1;
        else if(a.category === 'POLOWA' && b.category !== 'POLOWA') return 1;
        else{
            if(a.points > b.points) return -1;
            else if(a.points < b.points) return 1;
        }

        return (a.name as string).localeCompare(b.name as string);
    };

    const sorted = teamsCategories.filter((x) => x !== null).sort(sortingCriteria);
    
    const expires = 24 * 60 * 60;   
    const entry = JSON.stringify(sorted);
    await redis.set('ranking.' + categorizationYearId, entry);
    await redis.expire('ranking.' + categorizationYearId, expires);

    return entry;
};

export const getRanking = async (categorizationYearId: number) => {
    console.log('Getting ranking for ' + categorizationYearId);
    let ranking = await redis.get('ranking.' + categorizationYearId);
    console.log('REDIS returned ' + ranking);
    if(ranking === null){
        console.log('Probing builder');
        ranking = await rebuildRanking(categorizationYearId);
        console.log('builder returned ' + ranking);
    }
    
    return ranking;
};