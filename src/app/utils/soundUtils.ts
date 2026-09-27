/**
 * Utilitaires pour la gestion des notifications sonores
 * Utilisé principalement pour les notifications de nouvelles commandes
 */

// Types de sons disponibles
export type SoundType = 'order-received' | 'notification' | 'success' | 'error';

// Configuration des sons
const SOUND_CONFIG = {
  'order-received': {
    frequency: 800,
    duration: 200,
    type: 'sine' as OscillatorType,
    volume: 0.3
  },
  'notification': {
    frequency: 600,
    duration: 150,
    type: 'sine' as OscillatorType,
    volume: 0.2
  },
  'success': {
    frequency: 659,
    duration: 200,
    type: 'sine' as OscillatorType,
    volume: 0.25
  },
  'error': {
    frequency: 400,
    duration: 300,
    type: 'sine' as OscillatorType,
    volume: 0.3
  }
};

/**
 * Joue un son de notification
 * @param soundType - Type de son à jouer
 * @param enabled - Si les sons sont activés (par défaut true)
 */
export function playNotificationSound(soundType: SoundType = 'order-received', enabled: boolean = true): void {
  if (!enabled) return;

  // Vérifier si l'API Web Audio est disponible
  if (typeof window === 'undefined' || !window.AudioContext) {
    console.warn('Web Audio API not available');
    return;
  }

  try {
    const config = SOUND_CONFIG[soundType];
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Créer l'oscillateur
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Configurer l'oscillateur
    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.frequency, audioContext.currentTime);
    
    // Configurer le volume avec fade out
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(config.volume, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration / 1000);
    
    // Connecter les nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Jouer le son
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + config.duration / 1000);
    
  } catch (error) {
    console.warn('Erreur lors de la lecture du son de notification:', error);
  }
}

/**
 * Joue une séquence de bips pour les nouvelles commandes
 * @param enabled - Si les sons sont activés
 */
export function playNewOrderSound(enabled: boolean = true): void {
  if (!enabled) return;

  // Double bip caractéristique pour les nouvelles commandes
  playNotificationSound('order-received', enabled);
  
  setTimeout(() => {
    playNotificationSound('order-received', enabled);
  }, 300);
}

/**
 * Teste la lecture d'un son
 * @param soundType - Type de son à tester
 */
export function testSound(soundType: SoundType = 'notification'): void {
  console.log(`Test du son: ${soundType}`);
  playNotificationSound(soundType, true);
}

/**
 * Vérifie si les sons sont supportés par le navigateur
 */
export function isSoundSupported(): boolean {
  return typeof window !== 'undefined' && 
         (window.AudioContext !== undefined || (window as any).webkitAudioContext !== undefined);
}

// Instance globale pour gérer les bips persistants
let persistentNotificationInterval: NodeJS.Timeout | null = null;

/**
 * Démarre les bips persistants pour les nouvelles commandes
 * @param enabled - Si les sons sont activés
 */
export function startPersistentNotification(enabled: boolean = true): void {
  if (!enabled || persistentNotificationInterval) return;
  
  // Premier bip immédiat
  playNewOrderSound(enabled);
  
  // Puis bips répétés toutes les 2 secondes pour plus de visibilité
  persistentNotificationInterval = setInterval(() => {
    playNewOrderSound(enabled);
  }, 2000);
}

/**
 * Arrête les bips persistants
 */
export function stopPersistentNotification(): void {
  if (persistentNotificationInterval) {
    clearInterval(persistentNotificationInterval);
    persistentNotificationInterval = null;
  }
}

/**
 * Vérifie si des bips persistants sont en cours
 */
export function isPersistentNotificationActive(): boolean {
  return persistentNotificationInterval !== null;
}

/**
 * Gestion du localStorage pour les préférences sonores
 */
export const soundPreferences = {
  /**
   * Récupère l'état des notifications sonores depuis le localStorage
   */
  getSoundEnabled(): boolean {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem('chapfoody-sound-enabled');
    return stored !== null ? JSON.parse(stored) : true;
  },

  /**
   * Sauvegarde l'état des notifications sonores dans le localStorage
   */
  setSoundEnabled(enabled: boolean): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('chapfoody-sound-enabled', JSON.stringify(enabled));
  },

  /**
   * Bascule l'état des notifications sonores
   */
  toggleSound(): boolean {
    const newState = !this.getSoundEnabled();
    this.setSoundEnabled(newState);
    return newState;
  }
};