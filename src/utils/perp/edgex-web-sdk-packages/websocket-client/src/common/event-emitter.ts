type EventHandler = (...args: any[]) => void;

/**
 * A lightweight EventEmitter implementation for browser environments.
 * Decoupled from Node.js 'events' module to reduce bundle size.
 */
export class EventEmitter {
  private events: Map<string, EventHandler[]>;

  constructor() {
    this.events = new Map();
  }

  on(event: string, listener: EventHandler): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(listener);
  }

  off(event: string, listener: EventHandler): void {
    if (!this.events.has(event)) return;
    const listeners = this.events.get(event)!;
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  emit(event: string, ...args: any[]): void {
    if (!this.events.has(event)) return;
    // Clone the listeners array to avoid issues if listeners are removed during emission
    [...this.events.get(event)!].forEach((listener) => listener(...args));
  }

  removeAllListeners(event?: string): void {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }
}
