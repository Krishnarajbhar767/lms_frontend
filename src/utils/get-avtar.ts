export function getAvatar(firstName: string, lastName?: string): string {
    return `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${firstName}${lastName ? `-${lastName}` : ""}`
}