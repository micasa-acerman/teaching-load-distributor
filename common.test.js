const {
    generateData,
    generatePermutations,
    solveExhaustiveEnumeration,
    solveGreedyAlgorithm,
    measureTime,
    hammingDistance,
} = require('./common')

describe('generateData', () => {
    it('returns an array of disciplines with length equal to n', () => {
        const [disciplines] = generateData(3, 2)
        expect(disciplines).toHaveLength(3)
    })

    it("should don't exist zero for weight property", () => {
        const [, teachers] = generateData(3, 2)
        expect(teachers.some((t) => t.weight === 0)).toBeFalsy()
    })

    it('returns an array of teachers with length equal to m', () => {
        const [, teachers] = generateData(3, 2)
        expect(teachers).toHaveLength(2)
    })

    it('returns an array of discipline objects with properties "name" and "load"', () => {
        const [disciplines] = generateData(3, 2)
        expect(disciplines).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: expect.any(String),
                    load: expect.any(Number),
                }),
            ])
        )
    })

    it('returns an array of teacher objects with properties "name", "load", "weight", and "preference"', () => {
        const [, teachers] = generateData(3, 2)
        expect(teachers).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: expect.any(String),
                    load: expect.any(Number),
                    weight: expect.any(Number),
                    preference: expect.arrayContaining([expect.any(Number)]),
                }),
            ])
        )
    })
})

describe('generatePermutations', () => {
    it('should generate all permutations with N = 2 and M = 2', () => {
        const permutations = Array.from(generatePermutations(2, 2))
        expect(permutations).toHaveLength(4)
        expect(permutations).toContainEqual([0, 0])
        expect(permutations).toContainEqual([0, 1])
        expect(permutations).toContainEqual([1, 0])
        expect(permutations).toContainEqual([1, 1])
    })

    it('should generate all permutations with N = 3 and M = 2', () => {
        const permutations = Array.from(generatePermutations(3, 2))
        expect(permutations).toHaveLength(9)
        expect(permutations).toContainEqual([0, 0])
        expect(permutations).toContainEqual([0, 1])
        expect(permutations).toContainEqual([0, 2])
        expect(permutations).toContainEqual([1, 0])
        expect(permutations).toContainEqual([1, 1])
        expect(permutations).toContainEqual([1, 2])
        expect(permutations).toContainEqual([2, 0])
        expect(permutations).toContainEqual([2, 1])
        expect(permutations).toContainEqual([2, 2])
    })

    it('should generate all permutations with N = 1 and M = 3', () => {
        const permutations = Array.from(generatePermutations(1, 3))
        expect(permutations).toHaveLength(1)
        expect(permutations).toContainEqual([0, 0, 0])
    })

    it('should generate no permutations with N = 0 and M = 5', () => {
        const permutations = Array.from(generatePermutations(0, 5))
        expect(permutations).toHaveLength(0)
    })
})

describe('solveExhaustiveEnumeration', () => {
    test('should solve the problem for a small dataset', () => {
        const teachers = [
            { load: 2, weight: 1, preference: [0, 0, 0, 0] },
            { load: 3, weight: 2, preference: [1, 1, 0, 0] },
            { load: 2, weight: 3, preference: [-1, 1, 0, 0] },
        ]
        const disciplines = [{ load: 2 }, { load: 2 }, { load: 1 }, { load: 2 }]
        const [result, resultP] = solveExhaustiveEnumeration(
            teachers,
            disciplines
        )
        expect(result).toEqual(5)
        expect(resultP).toEqual([1, 2, 1, 0])
    })

    test('should solve the problem for a larger dataset', () => {
        const [disciplines, teachers] = generateData(5, 4)
        const [result, resultP] = solveExhaustiveEnumeration(
            teachers,
            disciplines
        )
        expect(result).toBeDefined()
        expect(resultP).toBeDefined()
    })
})

describe('solveGreedyAlgorithm', () => {
    it('should return correct result with N=3 and M=5', () => {
        const teachers = [
            {
                load: 2,
                weight: 1,
                name: 'John',
                preference: [1, 1, 1, 0, 0, 0],
            },
            {
                load: 3,
                weight: 2,
                name: 'James',
                preference: [-1, 0, 1, 1, -1, -1],
            },
            {
                load: 2,
                weight: 3,
                name: 'Linda',
                preference: [-1, 1, 1, -1, -1, -1],
            },
        ]
        const disciplines = [
            { load: 3 },
            { load: 2 },
            { load: 1 },
            { load: 2 },
            { load: 4 },
            { load: 4 },
        ]
        const [result, p] = solveGreedyAlgorithm(teachers, disciplines)
        expect(p).toEqual([0, 2, 1, 1, 0, 0])
        expect(result).toBe(8)
    })
})

describe('measureTime', () => {
    it('should return zero if call empty function', () => {
        expect(measureTime(() => {})[0]).toBe(0)
    })
})
describe('hammingDistance', () => {
    test('should calculate the correct distance', () => {
        expect(hammingDistance([0, 1, 0, 1], [1, 0, 1, 0])).toBe(4)
        expect(hammingDistance([1, 0, 1, 0], [1, 0, 1, 0])).toBe(0)
        expect(hammingDistance([1, 1, 1], [0, 0, 0])).toBe(3)
    })

    test('should throw an error for arrays of different length', () => {
        expect(() => {
            hammingDistance([1, 2, 3], [4, 5])
        }).toThrow('Arrays must have the same length')
    })
})
