export function getBlockAt(x: number, y: number, z: number): Block {
    return World.getBlockAt(Math.floor(x), Math.floor(y), Math.floor(z));
}

export function getBlocksInDistance(point: Vec3i, distance: number): Block[] {
    const blocks: Block[] = [];
    for (let x = -distance + point.x; x <= distance + point.x; x++) {
        for (let y = -distance + point.y; y <= distance + point.y; y++) {
            for (let z = -distance + point.z; z <= distance + point.z; z++) {
                let block = getBlockAt(x, y, z)
                if (block.type.getRegistryName() !== "minecraft:air") {
                    blocks.push(block)
                }
            }
        }
    }
    return blocks;
}