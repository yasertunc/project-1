export type Listener<T> = (event: T) => void;

export class EventBus<T> {
  private listeners = new Set<Listener<T>>();

  on(listener: Listener<T>) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(event: T) {
    for (const listener of [...this.listeners]) {
      listener(event);
    }
  }

  clear() {
    this.listeners.clear();
  }
}
