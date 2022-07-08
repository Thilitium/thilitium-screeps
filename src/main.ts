import {Behaviors, Creeps} from 'thilitium-screeps-lib';
import * as _ from 'lodash'

const environment = 'dev';
/** @type {string[]} */
Memory.tombstonesTakenCareOfIds = Memory.tombstonesTakenCareOfIds || [];

//module.exports.loop = function () {
console.debug = (msg) => environment === 'dev' ? console.log(`🛑${msg}`) : false;
console.info = (msg) => environment === 'dev' ? console.log(`🔵${msg}`) : false;
console.warn = (msg) => environment !== 'prod' ? console.log(`🟠${msg}`) : false;
console.error = (msg) => console.log(`🔴${msg}`);


Memory.noMoreSpawns = false;
const spawnerName: string = Object.keys(Game.spawns)[0]; // always at least 1 spawn
const spawner: StructureSpawn = Game.spawns[spawnerName];
Memory.tombstonesIds = spawner.room.find(FIND_TOMBSTONES, {filter : t=> t.store[RESOURCE_ENERGY] > 0}).map(t => t.id);

if (Memory.tombstonesIds.length || Memory.tombstonesTakenCareOfIds.length) {
    // console.debug(`tombs : ${Memory.tombstonesIds} | taken care of : ${Memory.tombstonesTakenCareOfIds}`);

    // housekeeping, I don't want this to happen but it does.
    if (Memory.tombstonesIds.length < Memory.tombstonesTakenCareOfIds.length)
        Memory.tombstonesTakenCareOfIds = Memory.tombstonesTakenCareOfIds.filter(t => Memory.tombstonesIds.includes(t));
}


clearMemory();
//console.log(spawner.room.energyCapacityAvailable);
//structureSpawner.checkNumberOfCreepsAndSpawn(spawner, 'harvester', 5, 2);
// checkNumberOfCreepsAndSpawn(spawner: StructureSpawn, role: string, limitOfWorker: number, level: number): void;
const maxEnergyToAllocate = spawner.room.energyCapacityAvailable - 50;
Behaviors.Structures.Spawn.checkNumberOfCreepsAndSpawn(
    spawner, 'miner', 7, Creeps.Miner.bodyParts(maxEnergyToAllocate)
);

Behaviors.Structures.Spawn.checkNumberOfCreepsAndSpawn(
    spawner, 'transporter', 5, Creeps.Transporter.bodyParts(maxEnergyToAllocate)
);
Behaviors.Structures.Spawn.checkNumberOfCreepsAndSpawn(spawner, 'reparator', 2, 5);

Behaviors.Structures.Spawn.checkNumberOfCreepsAndSpawn(spawner, 'builder', 4, 5);
Behaviors.Structures.Spawn.checkNumberOfCreepsAndSpawn(spawner, 'upgrader', 5, 5);

/*structureSpawner.checkNumberOfCreepsAndSpawn(spawner, 'harvester', 2, 2);
structureSpawner.checkNumberOfCreepsAndSpawn(spawner, 'builder', 6, 2);
structureSpawner.checkNumberOfCreepsAndSpawn(spawner, 'upgrader', 10, 2);*/


for (const name in Game.creeps) {
    const creep = Game.creeps[name];

    /*if (creep.memory.role === 'harvester') {
            Creeps.Harvester.run(creep, spawner);
    }*/

    if (creep.memory.role === 'upgrader') {
        Creeps.Upgrader.run(creep);
    }

    if (creep.memory.role === 'builder') {
        Creeps.Builder.run(creep);
    }

    if (creep.memory.role === 'reparator') {
        Creeps.Reparator.run(creep);
    }

    if (creep.memory.role === 'transporter') {
        Creeps.Transporter.run(creep);
    }

    if (creep.memory.role === 'miner') {
        Creeps.Miner.run(creep);
    }
}

function clearMemory() {
    for (const i in Memory.creeps) {
        if (!Game.creeps[i]) {
            const deadCreepRole = Memory.creeps[i].role;
            const remainingCreepsInSameRole = _.filter(Game.creeps, c => c.memory.role === deadCreepRole).length;
            console.info(`💀 A very unlucky ${deadCreepRole} has been purged by the v̸͂͜͠ơ̵͈̘ï̶̡̲͆ď̸̯̀.. ${remainingCreepsInSameRole} left.`);
            delete Memory.creeps[i];
        }
    }
}
/*function claimRoom(roomId) {
    Game.creeps['claimer'].claimController(Game.rooms['SOMEROOM'].controller);
}*/
//}