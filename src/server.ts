import app from "./app";

const PORT = 3000;

/**
 * Handles graceful shutdown of the HTTP server when termination signals are received.
 *
 * This function ensures that the server stops accepting new requests
 * and closes all active connections before the process exits.  
 * It prevents abrupt termination, which could lead to lost requests or corrupted states.
 *
 * The shutdown process includes:
 * - Logging the received signal (e.g., SIGINT or SIGTERM);
 * - Setting a timeout to force shutdown if cleanup takes too long;
 * - Closing the HTTP server and refusing new connections;
 * - Clearing the timeout and exiting the process cleanly once done.
 *
 * @param signal - The termination signal received by the process (e.g., `'SIGINT'` or `'SIGTERM'`).
 * @returns A `Promise<void>` that resolves when shutdown is complete or rejects if a timeout occurs.
 *
 * @example
 * ```ts
 * process.on('SIGINT', () => gracefulShutdown('SIGINT'));
 * process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
 * ```
 */
const gracefulShutdown = async (signal: NodeJS.Signals)=> {

    console.log(`[LOG] Signal ${signal} received. Initiating graceful shutdown...`);
    const timeoutId = setTimeout(() => {
        console.error('[ERROR] Graceful shutdown timed out. Forcing exit.');
        process.exit(1);
      }, 10000);

      app.close(async (err) => {
        if (err) {
          console.error('[ERRO] Error closing HTTP server:', err);
          process.exit(1);
        }
        console.log('[LOG] HTTP server closed. New requests will be refused.');
        // More connections to close
        clearTimeout(timeoutId); 
        console.log('[LOG] API Server process terminated successfully.');
        process.exit(0);
    });
}

app.listen(PORT,()=>console.log("Server as up in http://localhost:" + PORT));

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));