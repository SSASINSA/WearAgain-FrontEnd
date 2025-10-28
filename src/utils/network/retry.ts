export interface RetryOptions {
  retries?: number;
  delayMs?: number;
  backoffFactor?: number;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

export async function retry<T>(operation: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const {
    retries = 2,
    delayMs = 500,
    backoffFactor = 2,
    shouldRetry,
  } = options;

  let attempt = 0;
  let currentDelay = delayMs;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await operation();
    } catch (error) {
      const allowRetry = attempt < retries && (!shouldRetry || shouldRetry(error, attempt));
      if (!allowRetry) {
        throw error;
      }

      await wait(currentDelay);
      attempt += 1;
      currentDelay *= backoffFactor;
    }
  }
}

function wait(durationMs: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, durationMs);
  });
}
