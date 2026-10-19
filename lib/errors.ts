export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

export class NotImplementedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotImplementedError";
  }
}

export class SimulatedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SimulatedError";
  }
}
