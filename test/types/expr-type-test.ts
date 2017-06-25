import {expect} from "chai";
import {Expression} from '../../src/model/expression';
import {OperationType} from "../../src/model/operands/operand-types";

describe('expression ref operator types', () => {
    let namespace: { [name: string]: OperationType };

    beforeEach(() => {
        namespace = {
            's': {
                input: [],
                output: [0],
                types: {
                    0: {type: 'string'}
                }
            },
            'n': {
                input: [],
                output: [0],
                types: {
                    0: {type: 'number'}
                }
            },
            'add': {
                input: [0, 1],
                output: [2],
                types: {
                    0: {type: 'number'},
                    1: {type: 'number'},
                    2: {type: 'number'}
                }
            }
        };
    });

    describe('literal types', () => {
        it('should apply literal expr', () => {
            let e = new Expression('s');
            let type = e.getType(namespace);
            expect(type).to.deep.eq({
                input: [],
                output: [0],
                types: {
                    0: {type: 'string'}
                }
            });
        });

        it('should apply multiple expr', () => {
            let e = new Expression('s n');
            let type = e.getType(namespace);
            expect(type).to.deep.eq({
                input: [],
                output: [0, 1],
                types: {
                    0: {type: 'string'},
                    1: {type: 'number'}
                }
            });
        });

        it('should use expressions in arrays', () => {
            let e = new Expression('[s]');
            let type = e.getType(namespace);
            expect(type).to.deep.eq({
                input: [],
                output: [1],
                types: {
                    0: {type: 'string'},
                    1: {
                        type: 'array',
                        array: {input: [], output: [0]}
                    }
                }
            });
        });

        it('should use expressions in wraps', () => {
            let e = new Expression('{s n}');
            let type = e.getType(namespace);
            expect(type).to.deep.eq({
                input: [],
                output: [2],
                types: {
                    0: {type: 'string'},
                    1: {type: 'number'},
                    2: {
                        type: 'wrapped',
                        wrapped: {input: [], output: [0, 1]}
                    }
                }
            });
        });

        it('should use expressions in tuples', () => {
            let e = new Expression('(n, s, n)');
            let type = e.getType(namespace);
            expect(type).to.deep.eq({
                input: [],
                output: [3],
                types: {
                    0: {type: 'number'},
                    1: {type: 'string'},
                    2: {type: 'number'},
                    3: {
                        type: 'tuple',
                        tuple: [
                            {input: [], output: [0]},
                            {input: [], output: [1]},
                            {input: [], output: [2]}
                        ]
                    }
                }
            });
        });
    });

    describe('function types', () => {
        it('should apply function expr', () => {
            let e = new Expression('add');
            let type = e.getType(namespace);
            expect(type).to.deep.eq({
                input: [0, 1],
                output: [2],
                types: {
                    0: {type: 'number'},
                    1: {type: 'number'},
                    2: {type: 'number'}
                }
            });
        });

        it('should combine function expr', () => {
            let e = new Expression('add add');
            let type = e.getType(namespace);
            /* 2 == 4. both consumed */
            expect(type).to.deep.eq({
                input: [3, 0, 1],
                output: [5],
                types: {
                    0: {type: 'number'},
                    1: {type: 'number'},
                    3: {type: 'number'},
                    5: {type: 'number'}
                }
            });
        });
    });
});