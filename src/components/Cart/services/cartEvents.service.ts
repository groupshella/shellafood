// Cart events service - manages cart update events

type CartEventListener = () => void;

class CartEventsService {
	private eventName = 'cartUpdated';
	private listeners: Set<CartEventListener> = new Set();

	/**
	 * Emit cart update event
	 */
	emit(): void {
		if (typeof window === 'undefined') return;

		// Dispatch window event
		window.dispatchEvent(new CustomEvent(this.eventName));

		// Call all listeners
		this.listeners.forEach((listener) => listener());
	}

	/**
	 * Subscribe to cart updates
	 */
	subscribe(listener: CartEventListener): void {
		this.listeners.add(listener);

		// Also listen to window event
		if (typeof window !== 'undefined') {
			window.addEventListener(this.eventName, listener);
		}
	}

	/**
	 * Unsubscribe from cart updates
	 */
	unsubscribe(listener: CartEventListener): void {
		this.listeners.delete(listener);

		// Remove window event listener
		if (typeof window !== 'undefined') {
			window.removeEventListener(this.eventName, listener);
		}
	}

	/**
	 * Clear all listeners
	 */
	clear(): void {
		this.listeners.clear();
	}
}

export const cartEventsService = new CartEventsService();

