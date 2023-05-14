const {
    solveExhaustiveEnumeration,
    solveGreedyAlgorithm,
    generateData,
    measureTime,
    hammingDistance,
} = require('./common')

const fs = require('fs')
const n = 6,
    m = n
if (!fs.existsSync('data${n}.csv'))
    fs.appendFile(
        `data${n}.csv`,
        [
            'N',
            'M',
            't1',
            't2',
            'R1',
            'R2',
            'diff result',
            'Hamming disctance',
        ].join(';') + '\r\n',
        function (err) {
            if (err) throw err
            console.log('Saved!')
        }
    )
for (let i = 0; i < 1000; i++) {
    const [disciplines, teachers] = generateData(n, m)
    const [t1, [result1, p1]] = measureTime(
        solveGreedyAlgorithm.bind(null, teachers, disciplines)
    )
    const [t2, [result2, p2]] = measureTime(
        solveExhaustiveEnumeration.bind(null, teachers, disciplines)
    )
    console.info(result1, result2, result2 - result1)

    if (result1 > result2)
        throw new Error(
            'record greedyAlg must be better or equal exhaustive record'
        )
    if (!p1 || !p2) throw new Error('Some of algs return null')
    const row = [
        n,
        m,
        t1,
        t2,
        result1,
        result2,
        result1 != null ? result2 - result1 : '',
        hammingDistance(p1, p2),
    ]

    fs.appendFile(`data${n}.csv`, row.join(';') + '\r\n', function (err) {
        if (err) throw err
        console.log('Saved!')
    })
}
