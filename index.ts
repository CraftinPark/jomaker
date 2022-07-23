import { sampleList } from "./sample";

export type sex = "male" | "female";

export type member = {
    name: string;
    year: number;
    sex: sex;
    leader: boolean;
};

// score system. minimize score.
// AGE:
// two people that share the same age is a point
// SEX:
// two people that share the same sex is a point
// LEADER:
// having more than a single leader in a group is a 2 point deduction.
// REPETITION:
// add point for each similar member from a previous grouping.
// point multiplier decays as previoius grouping is from longer ago. (e.g. the same grouping from 20 groupings ago will not add much score)

// create an algorithm that minimizes this score.

let list: member[] = sampleList;

function createJos(n: number, list: member[]) {
    // split list into n groups as evenly as possible.

    // initialize jos.
    let jos: member[][] = [];
    for (let i = 0; i < n; i++) jos.push([]);

    // sequentially assign members in list to jos in non-optimal order.
    let joToJoin: number = 0;
    for (let i = 0; i < list.length; i++) {
        jos[joToJoin].push(list[i]);
        if (joToJoin + 1 !== n) joToJoin++;
        else joToJoin = 0;
    }
    console.log(jos);
    calculateTotalScore(jos);
}

function calculateTotalScore(jos: member[][]) {
    let sum: number = 0;
    for (let i = 0; i < jos.length; i++) {
        console.log("calculating score for jo #" + i);
        sum += calculateJoScore(jos[i]);
    }
}

function calculateJoScore(jo: member[]): number {
    let score: number = 0;
    score += ageScore(jo);
    score += sexScore(jo);

    return score;
}

function ageScore(jo: member[]): number {
    let score: number = 0;
    for (let i = 0; i < jo.length - 1; i++) {
        for (let j = i + 1; j < jo.length; j++) {
            if (jo[i].year === jo[j].year) score++;
        }
    }
    console.log("age score is " + score);
    return score;
}
function sexScore(jo: member[]): number {
    let score: number = 0;
    for (let i = 0; i < jo.length - 1; i++) {
        for (let j = i + 1; j < jo.length; j++) {
            if (jo[i].sex === jo[j].sex) score++;
        }
    }
    console.log("sex score is " + score);
    return score;
}

createJos(3, list);
