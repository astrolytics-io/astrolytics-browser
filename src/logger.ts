/* eslint-disable  no-console */

export default class Logger {
  private static config: { debug: boolean } | null = null;

  static setConfig(config: { debug: boolean }) {
    Logger.config = config;
  }

  static log(msg: string) {
    if (Logger.config?.debug) {
      console.log(`Astrolytics: ${msg}`);
    }
  }

  static warn(msg: string) {
    if (Logger.config?.debug) {
      console.warn(`Astrolytics warning: ${msg}`);
    }
  }

  static error(msg: string) {
    if (Logger.config?.debug) {
      console.error(`Astrolytics error: ${msg}`);
    }
  }
}
