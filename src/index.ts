import RenderLibV2 from "../../RenderLibV2"
import { getBlockAt, getBlocksInDistance } from "./blocks"

function posFromBlock(b: Block): Vec3i {
    return new Vec3i(b.x, b.y, b.z)
}

let MAX_RANGE = 10
let MAX_COUNT = 40
let UPDATE_RANGE = 3
let COLOR: [number, number, number] = [0.5, 0.3, 0.6]

// let pPos = new Vec3i(0, 0, 0)
let hlBlock = "minecraft:stone-4"
let blocks: Block[] = []
let hlEnabled = false
let pPos = new Vec3i(0, 0, 0)

register("renderWorld", () => {
    if (!hlEnabled) return;
    const pVec3 = new Vec3i(Player.getX(), Player.getY(), Player.getZ())
    if (pVec3.distance(pPos) > UPDATE_RANGE) {
        pPos = pVec3
        blocks = getBlocksInDistance(pVec3, MAX_RANGE).filter(block => {
            let split = hlBlock.split("-")
            if (split.length == 2) {
                return block.type.getRegistryName() === split[0] && block.getMetadata() == parseInt(split[1])
            } else {
                return block.type.getRegistryName() === split[0]
            }
        }).sort((a, b) => {
            return posFromBlock(a).distance(pVec3) - posFromBlock(b).distance(pVec3)
        })
    }
    blocks.forEach((block, i) => {
        if (i >= MAX_COUNT) return;
        // ChatLib.simulateChat(`Drawing at ${block.getX()}, ${block.getY()}, ${block.getZ()}`)
        RenderLibV2.drawInnerEspBoxV2(block.getX() + 0.5, block.getY(), block.getZ() + 0.5, 1, 1, 1, COLOR[0], COLOR[1], COLOR[1], 1, true, 2);
    })
})

register("command", (enabledStr) => {
    enabledStr = enabledStr.toLowerCase()
    if (enabledStr === "true" || enabledStr === "on") {
        hlEnabled = true
        ChatLib.simulateChat("Highlighting enabled")
    } else if (enabledStr === "false" || enabledStr === "off") {
        hlEnabled = false
    } else {
        ChatLib.simulateChat(`§cUnknown param got ${enabledStr} expected true/false/on/off.`)
        return
    }
    ChatLib.simulateChat(`Highlighting ${hlEnabled ? "§aenabled" : "§cdisabled"}§r.`)
}).setCommandName("hlenabled").setAliases("hl", "hle").setAliases("hlenabled")

register("command", (rangeStr) => {
    const range = parseInt(rangeStr)
    if (isNaN(range)) {
        ChatLib.simulateChat(`§cUnknown param got ${rangeStr} expected number.`)
        return
    }
    MAX_RANGE = range
    ChatLib.simulateChat(`Highlighting range set to §a${range}§r blocks.`)
}).setCommandName("hlrange").setAliases("hlr")

function parseColorString(rStr: string, gStr: string, bStr: string): [number, number, number] {
    const r = parseInt(rStr)
    const g = parseInt(gStr)
    const b = parseInt(bStr)
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
        ChatLib.simulateChat(`§cUnknown param got ${rStr}, ${gStr}, ${bStr} expected numbers.`)
        return COLOR
    }
    ChatLib.simulateChat(`Highlighting color set to §c${r}, §2${g}, §9${b}§r blocks.`)
    return [r / 255, g / 255, b / 255]
}

register("command", (rStr, gStr, bStr) => {
    COLOR = parseColorString(rStr, gStr, bStr)
}).setCommandName("hlcolor").setAliases("hlc")

register("command", (updRangeStr) => {
    const range = parseInt(updRangeStr)
    if (isNaN(range)) {
        ChatLib.simulateChat(`§cUnknown param got ${updRangeStr} expected number.`)
        return
    }
    UPDATE_RANGE = range
    ChatLib.simulateChat(`Highlighting update range set to §a${range}§r blocks.`)
}).setCommandName("hlupdate").setAliases("hlu")

register("command", (hlBlockStr) => {
    hlBlock = hlBlockStr
    ChatLib.simulateChat(`Highlighting block set to §a${hlBlock}§r.`)
}).setCommandName("hl").setAliases("hl")