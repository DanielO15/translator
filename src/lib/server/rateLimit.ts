// Simple in-memory rate limiter
// NOTE: We store hashed identifiers (not raw IPs) for privacy/GDPR compliance
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Cleanup expired entries every 5 minutes to prevent memory leak
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

/**
 * Hash an identifier (like IP address) to protect user privacy.
 * Even if the Map is leaked, original IPs can't be recovered.
 * Uses a simple but effective hash function (FNV-1a).
 */
function hashIdentifier(identifier: string): string {
    let hash = 2166136261; // FNV offset basis
    for (let i = 0; i < identifier.length; i++) {
        hash ^= identifier.charCodeAt(i);
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return (hash >>> 0).toString(36); // Convert to base36 for shorter string
}

function cleanupExpiredEntries() {
    const now = Date.now();
    
    // Only run cleanup if enough time has passed
    if (now - lastCleanup < CLEANUP_INTERVAL) {
        return;
    }
    
    lastCleanup = now;
    
    // Remove expired entries
    for (const [identifier, data] of requestCounts.entries()) {
        if (now > data.resetTime) {
            requestCounts.delete(identifier);
        }
    }
    
    console.log(`[Rate Limiter] Cleaned up. Active entries: ${requestCounts.size}`);
}

export function checkRateLimit(identifier: string, maxRequests = 5, windowMs = 60000): boolean {
    const now = Date.now();
    
    // Hash the identifier for privacy (e.g., "192.168.1.1" → "a7f3b2c9...")
    const hashedId = hashIdentifier(identifier);
    
    // Periodically clean up expired entries
    cleanupExpiredEntries();
    
    const userLimit = requestCounts.get(hashedId);

    // If no record or window expired, create new
    if (!userLimit || now > userLimit.resetTime) {
        requestCounts.set(hashedId, {
            count: 1,
            resetTime: now + windowMs
        });
        return true;
    }

    // If under limit, increment and allow
    if (userLimit.count < maxRequests) {
        userLimit.count++;
        return true;
    }

    // Over limit
    return false;
}

export function getRemainingTime(identifier: string): number {
    const hashedId = hashIdentifier(identifier);
    const userLimit = requestCounts.get(hashedId);
    if (!userLimit) return 0;
    
    const remaining = userLimit.resetTime - Date.now();
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0; // Return seconds
}

