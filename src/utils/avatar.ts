const buildAvatar = (file: string) => new URL(`../assets/image/${file}`, import.meta.url).href

export const avatarList = [
  buildAvatar('avatar.png'),
  buildAvatar('mannoeye.png'),
  buildAvatar('maneye.png'),
  buildAvatar('womannoeye.png'),
  buildAvatar('womaneye.png'),
  buildAvatar('maneye.png'),
  buildAvatar('i.jpg'),
]