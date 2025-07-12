import express, {Request, Response} from 'express';
import { invokeShadeOs, executeLuciform, logGolem, RitualExecutionStatus } from 'luciform-core';
import * as fs from 'fs/promises';
import * as path from 'path';

const app = express();
app.use(express.json());

const PORT = 3000;

async function handleCommand(command: string): Promise<{success: boolean; message: string; output: any}>
{
    let previousRitual: string | null = null;
    let previousError: string | null = null;
    const maxRetries = 3;
    let retryCount = 0;
    let currentCommand = command;
    let finalOutput: any = null;

    while(retryCount < maxRetries)
    {
        const luciformContent: string = await invokeShadeOs(currentCommand, 'lucie_golem_server', previousRitual, previousError, null);

        if(!luciformContent)
        {
            const message = "shadeOs could not generate a ritual for this command.";
            await logGolem(message, 'error');
            console.error(message);
            return {success: false, message, output: null};
        }

        const tempDir = './temp';
        await fs.mkdir(tempDir, {recursive: true});
        const tempFilePath = path.join(tempDir, `__golem_server_ritual_${ Date.now() }.luciform`);
        await fs.writeFile(tempFilePath, luciformContent, 'utf-8');

        const status = await executeLuciform(tempFilePath);
        finalOutput = status; // Capture the last status

        if(status.success)
        {
            const message = "The 'danse' is complete. The golem has fulfilled its purpose.";
            await logGolem(message);
            console.log(message);
            await fs.unlink(tempFilePath);
            return {success: true, message, output: status};
        } else
        {
            const errorMessage = `The 'danse' has faltered. Attempting to self-correct (${ retryCount + 1 }/${ maxRetries })...`;
            await logGolem(errorMessage, 'error');
            console.log(errorMessage);
            previousRitual = luciformContent;
            previousError = status.error || 'Unknown error';
            currentCommand = `The previous ritual failed. Please analyze the error and correct the ritual. The original intention was: "${ currentCommand }"`;
            retryCount++;
            await fs.unlink(tempFilePath);
        }
    }

    const message = "The 'danse' has failed after multiple attempts. The golem rests.";
    await logGolem(message, 'error');
    console.error(message);
    return {success: false, message, output: finalOutput};
}

app.post('/command', async (req: Request, res: Response) =>
{
    const {command} = req.body;
    if(!command)
    {
        res.status(400).json({error: 'Command is required'});
        return;
    }

    const logMessage = `Received command: "${ command }"`;
    await logGolem(logMessage);
    console.log(logMessage);
    const result = await handleCommand(command);
    const resultLogMessage = `Sending result for command "${ command }": ${ JSON.stringify(result) }`;
    await logGolem(resultLogMessage);
    res.json(result);
});

app.listen(PORT, () =>
{
    const startMessage = `Golem Server is listening on port ${ PORT }. The eternal 'danse' has begun.`;
    logGolem(startMessage);
    console.log(startMessage);
});