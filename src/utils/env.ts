import Config from 'react-native-config';

type EnvMap = Record<string, string | undefined>;

const moduleEnv: EnvMap = sanitizeEntries(Config as EnvMap);

function sanitizeEntries(entries: EnvMap): EnvMap {
  const result: EnvMap = {};
  Object.entries(entries).forEach(([key, value]) => {
    const sanitized = sanitizeEnvValue(value);
    if (sanitized) {
      result[key] = sanitized;
    }
  });
  return result;
}

function sanitizeEnvValue(value: string | undefined): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  if (!trimmed || trimmed === 'undefined') {
    return undefined;
  }
  return trimmed;
}

interface WearAgainEnv {
  [key: string]: string | undefined;
}

function getGlobalEnv(): WearAgainEnv | undefined {
  if (typeof globalThis === 'undefined') {
    return undefined;
  }
  const maybeEnv = (globalThis as unknown as {__WEARAGAIN_ENV__?: WearAgainEnv | undefined}).__WEARAGAIN_ENV__;
  return maybeEnv;
}

export function getEnv(name: string): string | undefined {
  const moduleValue = moduleEnv[name];
  if (typeof moduleValue === 'string' && moduleValue.length > 0) {
    return moduleValue;
  }

  if (typeof process !== 'undefined' && process.env) {
    const value = process.env[name];
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }

  const runtimeEnv = getGlobalEnv();
  if (runtimeEnv) {
    const value = runtimeEnv[name];
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }

  return undefined;
}

export function getEnvOrThrow(name: string): string {
  const value = getEnv(name);
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}
