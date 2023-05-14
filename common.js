const { faker } = require('@faker-js/faker/locale/ru')
const v8 = require('v8')
const oldLimit = v8.getHeapStatistics().maxOldGenerationSize
const newLimit = oldLimit * 1.5
v8.setFlagsFromString(`--max-old-space-size=${newLimit}`)

/**
 * Generates fake data for the teacher assignment problem.
 *
 * @param {number} n - The number of disciplines.
 * @param {number} m - The number of teachers.
 * @returns {[Array<{name: string, load: number}>, Array<{name: string, load: number, weight: number, preference: Array<number>}>]} - A tuple containing two arrays: an array of discipline objects, where each object has a `name` property (a fake discipline name) and a `load` property (a fake discipline workload); and an array of teacher objects, where each object has a `name` property (a fake teacher name), a `load` property (a fake teacher workload), a `weight` property (a fake teacher weight), and a `preference` property (an array of fake teacher preferences).
 *
 * @example
 * // Generates fake data for the teacher assignment problem.
 * const [disciplines, teachers] = generateData(3, 2);
 * console.log(disciplines); // Output: [{ name: "network", load: 10 }, { name: "interface", load: 12 }, { name: "protocol", load: 14 }]
 * console.log(teachers); // Output: [{ name: "Rosalind Hane", load: 5, weight: 0, preference: [0, 1, -1, 0, -1, 1, -1, 0, 1, 0] }, { name: "Monserrat Hagenes", load: 6.5, weight: 1, preference: [-1, 1, -1, -1, 1, 1, 1, 0, -1, 0] }]
 */

const generateData = (n, m) => {
    const disciplines = []
    const teachers = []
    for (let i = 0; i < n; i++) {
        disciplines.push({
            name: faker.hacker.noun(),
            load: (i + 1) * 2 + 10,
        })
    }
    for (let i = 0; i < m; i++) {
        teachers.push({
            name: faker.name.fullName(),
            load: i * 1.5 + 5,
            weight: i + 1,
            preference: new Array(n)
                .fill(0)
                .map(() => Math.round(Math.random() * 2 - 1)),
        })
    }
    return [disciplines, teachers]
}

/**
 * Generates all possible permutations of length `n` consisting of numbers from 0 to `m-1`.
 *
 * @generator
 * @param {number} n - The length of the permutations.
 * @param {number} m - The maximum value of the numbers in the permutations.
 * @yields {string} - A permutation as a string, where each character represents a number from 0 to `m-1`.
 *
 * @example
 * // Generates all possible permutations of length 2 consisting of numbers from 0 to 1.
 * for (let permutation of generatePermutations(2, 2)) {
 *     console.log(permutation);
 * }
 */
function* generatePermutations(n, m) {
    function* generate(bits) {
        if (bits.length === m) {
            yield bits
            return
        }
        for (let j = 0; j < n; j++) {
            yield* generate([...bits, j])
        }
    }

    yield* generate([])
}

/**
 * Solves the teacher assignment problem using an exhaustive enumeration algorithm.
 *
 * @param {Array<{load: number, weight: number}>} teachers - An array of objects representing teachers, where each object has a `load` property (the minimum workload for the teacher) and a `weight` property (the weight of the teacher in the objective function).
 * @param {Array<{load: number}>} disciplines - An array of objects representing disciplines, where each object has a `load` property (the workload of the discipline).
 * @returns {[number, number[]]} - A tuple containing the minimum value of the objective function and the corresponding teacher assignment as a string (where each character represents a discipline).
 *
 * @example
 * // Solves the teacher assignment problem using an exhaustive enumeration algorithm.
 * const teachers = [
 *     { load: 2, weight: 1 },
 *     { load: 3, weight: 2 },
 *     { load: 2, weight: 3 }
 * ];
 * const disciplines = [
 *     { load: 1 },
 *     { load: 2 },
 *     { load: 1 },
 *     { load: 2 }
 * ];
 * const [result, resultP] = solveExhaustiveEnumeration(teachers, disciplines);
 * console.log(result); // Output: 17
 * console.log(resultP); // Output: "0213"
 */
const solveExhaustiveEnumeration = (teachers, disciplines) => {
    let result = Number.MAX_VALUE
    let resultP = null
    for (let permutation of generatePermutations(
        teachers.length,
        disciplines.length
    )) {
        let valid = true
        let s = 0
        for (let i = 0; i < teachers.length; i++) {
            const { load: needLoad, weight, preference } = teachers[i]
            let load = 0
            let pos = -1
            while ((pos = permutation.indexOf(i, pos + 1)) >= 0) {
                load += disciplines[pos].load
                s += weight * preference[pos]
            }
            if (load < needLoad) {
                valid = false
                break
            }
        }
        if (!valid) continue
        if (resultP === null || s > result) {
            result = s
            resultP = permutation
        }
    }
    if (
        teachers.some((t, tidx) => {
            let ld = t.load
            for (let i = 0; i < resultP.length; i++) {
                if (resultP[i] == tidx) ld -= disciplines[i].load
            }
            if (ld > 0 && result == 5)
                console.log(disciplines, ld, result, resultP, tidx)
            return ld > 0
        })
    )
        return [null, new Array(disciplines.length).fill('-')]
    return [result, resultP]
}

const solveGreedyAlgorithm = (teachers, disciplines) => {
    const sorted = teachers
        .map((t, idx) => ({ ...t, idx }))
        .sort((a, b) => b.weight - a.weight)
    let result = new Array(disciplines.length).fill('-')
    let s = 0
    for (const teacher of sorted) {
        const { load, idx, preference, name, weight } = teacher
        const sortedPreferences = preference
            .map((v, id) => ({ v, id }))
            .sort((a, b) => b.v - a.v)
        let currentLoad = 0
        for (let { id, v } of sortedPreferences) {
            if (result[id] !== '-') continue
            if (currentLoad >= load && sorted[sorted.length - 1].name !== name)
                break
            currentLoad += disciplines[id].load
            s += v * weight
            result[id] = idx
        }
    }
    if (
        teachers.some((t, tidx) => {
            let ld = t.load
            for (let i = 0; i < result.length; i++) {
                if (result[i] == tidx) ld -= disciplines[i].load
            }
            return ld > 0
        })
    )
        return [null, new Array(disciplines.length).fill('-')]
    return [s, result]
}

const measureTime = (callback) => {
    const start = new Date().getTime()
    const result = callback()
    return [new Date().getTime() - start, result]
}

function hammingDistance(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        throw new Error('Arrays must have the same length')
    }

    let distance = 0
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            distance++
        }
    }

    return distance
}

module.exports = {
    generateData,
    generatePermutations,
    solveExhaustiveEnumeration,
    solveGreedyAlgorithm,
    measureTime,
    hammingDistance,
}
