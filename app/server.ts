import App from '@/app';
import { ExitStatus } from '@common/enum/Server';
import { logger } from '@utils/logger';
import { connection } from 'mongoose';

const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

process.on('unhandledRejection', (reason, promise) => {
    logger.error(`App exiting due to an unhandled promise: ${promise} and reason: ${reason}`);
    // Let the uncaughtException handler below handle it
    throw reason;
});

process.on('uncaughtException', (error) => {
    logger.error(`App exiting due to an uncaught exception: ${error}`);
    process.exit(ExitStatus.Failure);
});

(async (): Promise<void> => {
    try {
        const server = new App();
        await server.initialize();
        await server.start();

        // Graceful shutdown handlers
        for (const exitSignal of exitSignals) {
            process.on(exitSignal, async () => {
                logger.info(`Received ${exitSignal} signal. Starting graceful shutdown...`);
                
                try {
                    await connection.close();
                    logger.info('Database connection closed');
                    
                    await server.disconnect();
                    logger.info('Server closed successfully');
                    
                    logger.info('App exited with success');
                    process.exit(ExitStatus.Success);
                } catch (error) {
                    logger.error(`Error during graceful shutdown: ${error}`);
                    process.exit(ExitStatus.Failure);
                }
            });
        }
    } catch (error) {
        logger.error(`App exited with error: ${error}`);
        await connection.close();
        process.exit(ExitStatus.Failure);
    }
})();
