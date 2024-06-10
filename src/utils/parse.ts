/**
 * Removes Minecraft color codes and MiniMessage tags from a message.
 * @param {string} message - The message with possible codes and tags.
 * @returns {string} - The message without codes and tags.
 */
export function cleanMessage(message: string | null) {
    // List of regex patterns to detect various style codes and tags
    const patterns: any[] = [
        /[&§][0-9a-fk-or]/g,  // Minecraft color codes (& and §)
        /<\/?[\w:]+(?:['"][^'"]*['"])*>/g  // MiniMessage tags
    ];

    // Apply each pattern to remove matches from the message
    patterns.forEach(pattern => {
        if (!message) return;
        message = message.replace(pattern, '');
    });

    return message;
}
