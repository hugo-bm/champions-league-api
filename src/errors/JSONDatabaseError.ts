export default class JSONDatabaseError extends Error {
    constructor(description: string, operation: 'r' | 'w') {
        super(
            `[DatabaseError] Operation: ${operation === 'r' ? 'READ' : 'WRITE'} | Description: ${description}`,
        );
    }
}
