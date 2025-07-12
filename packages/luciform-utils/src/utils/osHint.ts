import { detectWindowsShell } from './shell_detector';
import * as os from 'os';

const isWindows = os.platform() === 'win32';
export const detectedShell = isWindows ? detectWindowsShell() : null;

export enum OSContext
{
    WindowsCmd = "(Contexte : Windows, shell: cmd)",
    WindowsPowershell = "(Contexte : Windows, shell: powershell)",
    Unix = "(Contexte : Linux ou Unix-like, shell: POSIX)"
}

export const osHint = isWindows
    ? (detectedShell === 'powershell' ? OSContext.WindowsPowershell : OSContext.WindowsCmd)
    : OSContext.Unix;